import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { createRequire } from "module";
import mammoth from "mammoth";
import Submission from "../submissions/submission.model.js";
import Assignment from "../assignments/assignment.model.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function getLocalFilePath(fileUrl) {
  if (!fileUrl) return "";

  let cleanPath = fileUrl;

  if (cleanPath.startsWith("http://localhost:5000/")) {
    cleanPath = cleanPath.replace("http://localhost:5000/", "");
  }

  cleanPath = cleanPath.replace(/^\/+/, "");

  return path.resolve(process.cwd(), cleanPath);
}

async function readUploadedFile(fileUrl) {
  const fullPath = getLocalFilePath(fileUrl);

  if (!fullPath || !fs.existsSync(fullPath)) {
    return "";
  }

  const extension = path.extname(fullPath).toLowerCase();

  try {
    if (extension === ".txt" || extension === ".md" || extension === ".csv") {
      return fs.readFileSync(fullPath, "utf-8");
    }

    if (extension === ".pdf") {
      const buffer = fs.readFileSync(fullPath);
      const data = await pdfParse(buffer);
      return data.text || "";
    }

    if (extension === ".docx") {
      const result = await mammoth.extractRawText({ path: fullPath });
      return result.value || "";
    }

    return "";
  } catch (error) {
    return "";
  }
}

function limitText(text, maxLength = 8000) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function parseAIResponse(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      aiGrade: String(parsed.aiGrade ?? ""),
      aiFeedback: parsed.aiFeedback ?? "",
      aiStatus: "Ready"
    };
  } catch (error) {
    return {
      aiGrade: "",
      aiFeedback: text || "AI grading completed, but the response could not be parsed.",
      aiStatus: "Ready"
    };
  }
}

async function runOpenAIGrader({ assignment, instructionText, rubricText, submissionText }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing.");
  }

  if (!submissionText || submissionText.trim().length < 20) {
    return {
      aiGrade: "0",
      aiFeedback:
        "The AI grader could not read enough text from the student submission. The instructor should review the uploaded file manually.",
      aiStatus: "Ready"
    };
  }

  const prompt = `
You are an AI grading assistant for an LMS.

Your job is to review a student submission using the assignment instructions and rubric.

Important rules:
- Return only valid JSON.
- Do not include markdown.
- Give a suggested grade from 0 to 100.
- Give clear feedback for the student.
- The teacher still controls the final grade.
- Do not be too harsh if the rubric is short or incomplete.
- If the submission does not follow the assignment, explain why.

Return this JSON format exactly:
{
  "aiGrade": "number from 0 to 100",
  "aiFeedback": "clear feedback explaining the grade"
}

Assignment title:
${assignment?.title || "Untitled Assignment"}

Assignment instructions:
${limitText(instructionText)}

Rubric:
${limitText(rubricText)}

Student submission:
${limitText(submissionText)}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a careful grading assistant. You provide suggested grades and feedback, but the instructor makes the final decision."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  });

  const text = response.choices[0]?.message?.content || "";

  return parseAIResponse(text);
}

export async function gradeSubmissionWithAI(submissionId) {
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }

  submission.aiStatus = "Processing";
  await submission.save();

  try {
    const assignment = await Assignment.findById(submission.assignment);

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const instructionText = await readUploadedFile(assignment.instructionFile);
    const rubricText = await readUploadedFile(assignment.rubricFile);
    const submissionText = await readUploadedFile(submission.file);

    const result = await runOpenAIGrader({
      assignment,
      instructionText,
      rubricText,
      submissionText
    });

    submission.aiGrade = result.aiGrade;
    submission.aiFeedback = result.aiFeedback;
    submission.aiStatus = result.aiStatus;

    await submission.save();

    return submission;
  } catch (error) {
    submission.aiStatus = "Failed";
    submission.aiFeedback = error.message || "AI grading failed.";
    await submission.save();
    throw error;
  }
}

export async function getAIGradeForSubmission(submissionId) {
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }

  return {
    submissionId: submission._id,
    aiGrade: submission.aiGrade,
    aiFeedback: submission.aiFeedback,
    aiStatus: submission.aiStatus
  };
}