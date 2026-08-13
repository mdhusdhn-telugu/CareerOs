// src/components/ResumeBuilder/utils/geminiGenerator.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.GEMINI_API_KEY || // optional fallback
  "";

let model = null;

if (!API_KEY) {
  console.warn(
    "[Gemini] No API key found. Set VITE_GEMINI_API_KEY in your .env file."
  );
} else {
 const genAI = new GoogleGenerativeAI(API_KEY);

model = genAI.getGenerativeModel({
  model: "gemini-pro",   // stable text model for v1beta
});

}

/**
 * type: 'summary' | 'experience' | 'project' | 'skills'
 * payload: values from the form
 */
export async function generateResumeContent(type, payload = {}) {
  if (!model) {
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text()?.trim() || "";

    return text;
  } catch (err) {
    console.error("[Gemini] Error while generating resume content:", err);
    alert("AI generation failed. Check console for details.");
    return "";
  }
}
