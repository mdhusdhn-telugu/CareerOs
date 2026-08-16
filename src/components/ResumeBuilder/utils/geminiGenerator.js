// src/components/ResumeBuilder/utils/geminiGenerator.js
import { GoogleGenAI } from "@google/genai";

const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.GEMINI_API_KEY || // optional fallback
  "";

let ai = null;

if (!API_KEY) {
  console.warn(
    "[Gemini] No API key found. Set VITE_GEMINI_API_KEY in your .env file."
  );
} else {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

const MODEL = "gemini-2.0-flash"; // matches Programming/api.js — one model, one SDK, everywhere

/**
 * type: 'summary' | 'experience' | 'project' | 'skills'
 * payload: values from the form
 */
export async function generateResumeContent(type, payload = {}) {
  if (!ai) {
    alert(
      "AI is not configured. Please set VITE_GEMINI_API_KEY in your .env and restart the dev server."
    );
    return "";
  }

  let prompt = "";

  if (type === "summary") {
    const { title, location } = payload;
    prompt = `
You are a professional resume writer.

Write a crisp, ATS-friendly resume summary (3–4 sentences) for the following target role:

Job Title: ${title || "Software Developer"}
Location: ${location || "N/A"}

Rules:
- Use first-person implied (no "I", no "me")
- Focus on impact, skills, and outcomes
- Suitable for a fresher or early-career candidate.
`.trim();
  } else if (type === "experience") {
    const { role, company } = payload;
    prompt = `
You are a professional resume writer.

Write 4–6 bullet points for a resume experience section.

Role: ${role}
Company: ${company}

Rules:
- Each bullet should start with a strong action verb
- Use measurable impact where possible
- Output as plain text lines, one bullet per line starting with "• ".
`.trim();
  } else if (type === "project") {
    const { name, skills } = payload;
    prompt = `
You are a professional resume writer.

Write a detailed project description (3–5 bullet-style lines) for:

Project Name: ${name}
Tech / Skills: ${skills || "Relevant technologies"}

Rules:
- Focus on what was built, how it was built, and impact
- Output as plain text lines, one bullet per line starting with "• ".
`.trim();
  } else if (type === "skills") {
    const { title } = payload;
    prompt = `
You are a professional resume writer.

Given this target role:

Job Title: ${title}

Return a comma-separated list of 10–16 relevant hard skills and a few soft skills
suitable for an ATS resume.

Output ONLY the comma-separated list, nothing else.
`.trim();
  } else {
    console.warn("[Gemini] Unknown generation type:", type);
    return "";
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    const text = typeof response.text === "function" ? response.text() : response.text;
    return (text || "").trim();
  } catch (err) {
    console.error("[Gemini] Error while generating resume content:", err);
    alert("AI generation failed. Check console for details.");
    return "";
  }
}