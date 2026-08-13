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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
