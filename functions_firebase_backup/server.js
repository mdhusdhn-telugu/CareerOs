import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(express.json());

// 1. Resume upload & parsing
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  const { path, mimetype } = req.file;
  let text = '';
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(fs.readFileSync(path));
      text = data.text;
    } else if (mimetype.includes('word')) {
      const result = await mammoth.extractRawText({ path });
      text = result.value;
    } else if (mimetype.includes('text')) {
      text = fs.readFileSync(path, 'utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    fs.unlinkSync(path);
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: 'Parsing failed' });
  }
});

// 2. Question generation (Hugging Face free-tier example)
app.post('/api/generate-questions', async (req, res) => {
  const { text } = req.body;
  const hfUrl = 'https://api-inference.huggingface.co/models/bigscience/bloom';
  try {
    const response = await fetch(hfUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: `Generate 5 interview questions about this resume:\n${text}` })
    });
    const [output] = await response.json();
    const questions = output.generated_text
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Question generation failed' });
  }
});

// 3. Real code execution (proxies to Piston server-side, avoids browser CORS)
app.post('/api/execute', async (req, res) => {
  const { language, code, stdin } = req.body;

  const PISTON_LANGUAGE_MAP = {
    python: 'python',
    javascript: 'javascript',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
  };

  const pistonLang = PISTON_LANGUAGE_MAP[language];
  if (!pistonLang) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: pistonLang,
        version: '*',
        files: [{ content: code }],
        stdin: stdin || '',
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Piston execution error:', err);
    res.status(500).json({ error: 'Execution service unavailable.' });
  }
});

// 3. Real code execution for languages the browser can't run locally
// (Java/C/C++/SQL — Python and JavaScript already run for free client-side
// via Pyodide/Web Worker, see Programming/api.js, so they don't hit this).
//
// Uses Judge0's OFFICIAL hosted API via RapidAPI — a real, maintained
// service (not a public unauthenticated instance that can vanish, like the
// earlier Piston attempt did). The RAPIDAPI key stays server-side here and
// is never bundled into the browser, unlike a VITE_-prefixed env var would be.
//
// Judge0 language IDs below are Judge0 CE's commonly documented defaults —
// if execution fails with an "invalid language_id" style error, verify the
// current IDs for your RapidAPI subscription via:
//   GET https://judge0-ce.p.rapidapi.com/languages
const JUDGE0_LANGUAGE_IDS = {
  java: 62,   // Java (OpenJDK 13)
  cpp: 54,    // C++ (GCC 9.2.0)
  c: 50,      // C (GCC 9.2.0)
  sql: 82,    // SQL (SQLite 3.27.2)
};

app.post('/api/judge0-execute', async (req, res) => {
  const { language, code, stdin } = req.body;
  const languageId = JUDGE0_LANGUAGE_IDS[language];

  if (!languageId) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  const rapidApiKey = process.env.RAPIDAPI_JUDGE0_KEY;
  if (!rapidApiKey) {
    return res.status(500).json({ error: 'Judge0 API key not configured on the server.' });
  }

  try {
    const response = await fetch(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: Buffer.from(code || '').toString('base64'),
          stdin: Buffer.from(stdin || '').toString('base64'),
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Judge0 request failed:', response.status, errText);
      return res.status(502).json({ error: 'Judge0 request failed.' });
    }

    const result = await response.json();

    const decode = (b64) => (b64 ? Buffer.from(b64, 'base64').toString('utf-8') : '');

    res.json({
      stdout: decode(result.stdout),
      stderr: decode(result.stderr),
      compileOutput: decode(result.compile_output),
      status: result.status?.description || 'Unknown',
    });
  } catch (err) {
    console.error('Judge0 execution error:', err);
    res.status(500).json({ error: 'Execution service unavailable.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));