// src/components/Programming/api.js
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Centralized model name — gemini-2.0-flash was deprecated by Google
// (returns 404 "no longer available" as of writing). Update ONLY this
// constant if the model changes again — every call site below reads from
// here instead of hardcoding the model string in 3+ places.
// NOTE: verify this is still current — check Google AI Studio's model list
// or GET https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY
// if this also 404s in the future.
const GEMINI_MODEL = "gemini-2.5-flash";

const parseGeminiResponse = (response) => {
  try {
    let text = typeof response.text === 'function' ? response.text() : response.text;
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini JSON Parse Error:", error);
    throw new Error("Invalid JSON from AI");
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// ============================================================
// REAL CODE EXECUTION — runs entirely in the browser.
// Piston's public API went whitelist-only (Feb 2026), so instead of
// relying on any external execution service, Python runs on Pyodide
// (real CPython compiled to WebAssembly) and JavaScript runs in a
// sandboxed Web Worker (real V8). Java/C/C++ have no practical
// in-browser runtime, so they're not faked — see runFreeCode/judgeCode.
// ============================================================

// UTF-8-safe base64 helpers (avoids all quoting/escaping hazards when
// embedding arbitrary JSON strings into generated Python/JS driver code)
function toBase64Utf8(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// --- Lazy Pyodide loader (only downloads the ~10MB runtime if/when Python is used) ---
let pyodideReadyPromise = null;

function loadPyodideRuntime() {
  if (pyodideReadyPromise) return pyodideReadyPromise;

  pyodideReadyPromise = new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      window.loadPyodide().then(resolve).catch(reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js";
    script.onload = () => {
      window.loadPyodide().then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error("Failed to load Python runtime."));
    document.head.appendChild(script);
  });

  return pyodideReadyPromise;
}

async function runPython(code) {
  const pyodide = await loadPyodideRuntime();
  let output = "";
  pyodide.setStdout({ batched: (s) => { output += s + "\n"; } });
  pyodide.setStderr({ batched: (s) => { output += s + "\n"; } });
  try {
    await pyodide.runPythonAsync(code);
    return { ok: true, output: output.trim() };
  } catch (err) {
    return { ok: false, output: String(err) };
  }
}

// --- Sandboxed JS execution via Web Worker (real V8, isolated, with timeout) ---
function runJavaScript(code, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const workerSrc = `
      self.onmessage = function(e) {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.map(String).join(' '));
        try {
          eval(e.data);
          self.postMessage({ ok: true, output: logs.join('\\n') });
        } catch (err) {
          self.postMessage({ ok: false, output: (err && err.message) || String(err) });
        }
      };
    `;
    const blob = new Blob([workerSrc], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));

    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ ok: false, output: "Execution timed out (possible infinite loop)." });
    }, timeoutMs);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, output: e.message || "Worker error." });
    };

    worker.postMessage(code);
  });
}

const SUPPORTED_LANGUAGES = ["python", "javascript"];
const JUDGE0_LANGUAGES = ["java", "cpp", "c", "sql"]; // real execution via backend, Playground only for now

// Calls our own backend's /api/judge0-execute (see server.js), which talks
// to Judge0's hosted API server-side. Keeps the RapidAPI key off the client
// entirely — same reasoning as why VITE_-prefixed keys get bundled into the
// browser and shouldn't be used for anything meant to stay secret.
async function executeViaJudge0(language, code, stdin = "") {
  const res = await fetch("/api/judge0-execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code, stdin }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `Execution service error: ${res.status}`);
  }

  return res.json();
}

// --- 1. FREE COMPILER (Playground) — real execution, no LLM guessing ---
export const runFreeCode = async (code, language, input = "") => {
  if (JUDGE0_LANGUAGES.includes(language)) {
    try {
      const { stdout, stderr, compileOutput, status } = await executeViaJudge0(language, code, input);
      if (compileOutput) return `Compilation error:\n${compileOutput}`;
      if (stderr) return `Error:\n${stderr}`;
      return stdout || `(no output — status: ${status})`;
    } catch (e) {
      console.error(e);
      return `System Error: ${e.message || "Execution failed. Please try again."}`;
    }
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return `Real execution isn't available for ${language} yet.`;
  }

  try {
    const { ok, output } = language === "python" ? await runPython(code) : await runJavaScript(code);
    return ok ? (output || "(no output)") : `Error:\n${output}`;
  } catch (e) {
    console.error(e);
    return "System Error: Execution failed. Please try again.";
  }
};

// --- 2. QUESTION GENERATOR ---
// Every skeleton's entry function is always named "solve", and every test
// case carries machine-readable argsJson/expectedJson so the Judge can grade
// deterministically instead of asking an LLM to guess.
export const generateQuestion = async (topic, difficulty) => {
  const model = GEMINI_MODEL;

  const testCaseSchema = {
    type: Type.OBJECT,
    properties: {
      input: { type: Type.STRING },
      output: { type: Type.STRING },
      argsJson: { type: Type.STRING },
      expectedJson: { type: Type.STRING },
    },
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      meaning: { type: Type.STRING },
      constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      functionName: { type: Type.STRING },
      examples: { type: Type.ARRAY, items: testCaseSchema },
      hiddenTestCases: { type: Type.ARRAY, items: testCaseSchema },
      skeletons: {
        type: Type.OBJECT,
        properties: {
          javascript: { type: Type.STRING },
          python: { type: Type.STRING },
          java: { type: Type.STRING },
          cpp: { type: Type.STRING },
          c: { type: Type.STRING },
          csharp: { type: Type.STRING },
          go: { type: Type.STRING },
          rust: { type: Type.STRING },
          sql: { type: Type.STRING },
        }
      }
    },
    required: ["title", "description", "examples", "skeletons", "functionName"],
  };

  const prompt = `
    Generate a ${difficulty} coding interview question about "${topic}".

    CRITICAL REQUIREMENTS:
    1. Title: Professional, LeetCode style.
    2. Description: Clear problem statement. Use Markdown.
    3. Examples: 2-3 distinct examples.
    4. Skeletons: Provide **EMPTY FUNCTION SIGNATURES ONLY**.
       - DO NOT IMPLEMENT THE LOGIC.
       - Inside the function body, simply write 'pass' (Python) or 'return 0;' (C++/Java) or equivalent.
       - Include necessary imports (e.g., #include <vector>, import java.util.*).
       - For Python, use type hints (e.g., def solve(nums: List[int]) -> int:).
    5. Hidden Test Cases: Provide 3-5 complex cases.
    6. Function name: EVERY language's skeleton must name the entry function/method
       exactly "solve" (Python: def solve(...), JavaScript: function solve(...),
       Java: static ... solve(...), etc.). Set "functionName" to "solve".
    7. For EVERY item in "examples" AND "hiddenTestCases", in addition to the
       human-readable "input"/"output" strings, also provide:
       - "argsJson": a JSON-encoded array of the actual arguments to pass to
         solve(), in the exact order of the skeleton's parameters.
         Example: for solve(nums, target) with nums=[2,7,11,15], target=9,
         argsJson = "[[2,7,11,15],9]"
       - "expectedJson": a JSON-encoded value of the exact real return value,
         e.g. "[0,1]"
       These two fields MUST be valid, parseable JSON (via JSON.parse) with no
       comments, trailing commas, or extra text — they will be executed
       programmatically, not read by a human.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.7 },
    });

    const data = parseGeminiResponse(response);
    return { id: generateId(), difficulty, topic, ...data };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error(`Failed to generate question: ${error.message || "Unknown error"}`);
  }
};

// ============================================================
// 3. JUDGE — real, deterministic grading (no LLM verdict)
// ============================================================

function buildDriver(language, userCode, base64Args) {
  if (language === "python") {
    return `
${userCode}

import json, base64
_args = json.loads(base64.b64decode("${base64Args}").decode("utf-8"))
_result = solve(*_args)
print(json.dumps(_result))
`.trim();
  }

  if (language === "javascript") {
    return `
${userCode}

function _b64ToUtf8(b64) { return decodeURIComponent(escape(atob(b64))); }
const _args = JSON.parse(_b64ToUtf8("${base64Args}"));
const _result = solve(..._args);
console.log(JSON.stringify(_result));
`.trim();
  }

  return null;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a && b && typeof a === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

export const judgeCode = async (question, userCode, language) => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return {
      status: "Unsupported",
      output: `Automated pass/fail grading isn't available yet for ${language} (it needs typed argument parsing per language — a separate piece of work from real execution, which the Playground already supports for this language). Try Python or JavaScript for real grading, or use "Unlock Solution" to compare your approach manually.`,
      passedTestCases: 0,
      totalTestCases: 0,
      failedCase: null,
    };
  }

  const allCases = [...(question.examples || []), ...(question.hiddenTestCases || [])];
  let passedCount = 0;
  let firstFailure = null;

  for (const testCase of allCases) {
    let expected;
    try {
      expected = JSON.parse(testCase.expectedJson);
    } catch (e) {
      continue;
    }

    const base64Args = toBase64Utf8(testCase.argsJson);
    const driver = buildDriver(language, userCode, base64Args);

    let actual;
    let runError = null;
    try {
      const { ok, output } = language === "python" ? await runPython(driver) : await runJavaScript(driver);
      if (!ok) {
        runError = output;
      } else {
        actual = JSON.parse(output.trim());
      }
    } catch (e) {
      runError = e.message;
    }

    const isMatch = !runError && deepEqual(actual, expected);

    if (isMatch) {
      passedCount++;
    } else if (!firstFailure) {
      firstFailure = {
        input: testCase.input,
        expected: testCase.output,
        actual: runError ? `Runtime error: ${runError}` : JSON.stringify(actual),
      };
    }
  }

  return {
    status: passedCount === allCases.length ? "Passed" : "Failed",
    output: passedCount === allCases.length
      ? "All test cases passed."
      : `${passedCount}/${allCases.length} test cases passed.`,
    passedTestCases: passedCount,
    totalTestCases: allCases.length,
    failedCase: firstFailure,
  };
};

// --- 4. HINTS & ANALYSIS (unchanged — legitimate LLM use cases) ---
export const getHint = async (question) => {
    const model = GEMINI_MODEL;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Problem: ${question.title}. Give a small hint < 30 words.`
        });
        return typeof response.text === 'function' ? response.text() : response.text;
    } catch (e) { return "Break the problem down."; }
};

export const getAnalysis = async (question, language) => {
   const model = GEMINI_MODEL;
   const schema = {
     type: Type.OBJECT,
     properties: {
       approach: { type: Type.STRING },
       complexity: {
         type: Type.OBJECT,
         properties: { time: { type: Type.STRING }, space: { type: Type.STRING } }
       },
       reasoning: { type: Type.STRING },
       solutionCode: { type: Type.STRING }
     }
   };

   try {
     const response = await ai.models.generateContent({
       model,
       contents: `Analyze "${question.title}".
       1. Time & Space Complexity.
       2. Optimal Solution Code in ${language}.
       3. Step-by-step logic.`,
       config: { responseMimeType: "application/json", responseSchema: schema }
     });
     return parseGeminiResponse(response);
   } catch (error) {
     return { approach: "Error", complexity: {time:"?", space:"?"}, reasoning: "Error", solutionCode: "" };
   }
};