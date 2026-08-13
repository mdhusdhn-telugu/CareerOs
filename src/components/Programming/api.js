// src/components/Programming/api.js
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

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

// --- 1. FREE COMPILER ---
export const runFreeCode = async (code, language, input = "") => {
  const model = "gemini-2.0-flash";
  const prompt = `
    Act as a secure, high-performance code runner.
    Language: ${language}
    Input (stdin): ${input}
    Code:
    \`\`\`${language}
    ${code}
    \`\`\`
    Execute this code accurately. Return ONLY the standard output (stdout) or error message (stderr).
  `;

  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    const output = typeof response.text === 'function' ? response.text() : response.text;
    return output.replace(/```/g, '').trim();
  } catch (e) {
    return "System Error: Execution failed via AI bridge.";
  }
};

// --- 2. QUESTION GENERATOR (FIXED SKELETONS) ---
export const generateQuestion = async (topic, difficulty) => {
  const model = "gemini-2.0-flash"; 

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      meaning: { type: Type.STRING },
      constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      examples: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { input: { type: Type.STRING }, output: { type: Type.STRING } }
        }
      },
      hiddenTestCases: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { input: { type: Type.STRING }, output: { type: Type.STRING } }
        }
      },
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
    required: ["title", "description", "examples", "skeletons"],
  };

  // --- UPDATED PROMPT TO ENFORCE EMPTY SKELETONS ---
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
    throw new Error("Failed to generate question.");
  }
};

// --- 3. JUDGE ---
export const judgeCode = async (question, userCode, language) => {
  const model = "gemini-2.0-flash";
  const allCases = [...question.examples, ...question.hiddenTestCases];

  const prompt = `
    You are an automated code judge.
    Problem: ${question.title}
    Language: ${language}
    
    User Submission:
    \`\`\`${language}
    ${userCode}
    \`\`\`
    
    Test Cases:
    ${JSON.stringify(allCases.map(c => ({ input: c.input, expected: c.output })))}
    
    Task: Validate if the code logic is correct.
    Return JSON with status "Passed", "Failed", or "Error".
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      status: { type: Type.STRING, enum: ["Passed", "Failed", "Error"] },
      output: { type: Type.STRING },
      passedTestCases: { type: Type.INTEGER },
      totalTestCases: { type: Type.INTEGER },
      failedCase: {
         type: Type.OBJECT,
         properties: { input: { type: Type.STRING }, expected: { type: Type.STRING }, actual: { type: Type.STRING } },
         nullable: true 
      },
    }
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: schema },
    });
    return parseGeminiResponse(response);
  } catch (error) {
    return { status: 'Error', output: 'Judge Error', passedTestCases: 0, totalTestCases: 0 };
  }
};

// --- 4. HINTS & ANALYSIS ---
export const getHint = async (question) => { 
    const model = "gemini-2.0-flash";
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Problem: ${question.title}. Give a small hint < 30 words.`
        });
        return typeof response.text === 'function' ? response.text() : response.text;
    } catch (e) { return "Break the problem down."; }
};

export const getAnalysis = async (question, language) => {
   const model = "gemini-2.0-flash";
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