import {
    gradeSubmissionWithAI,
    getAIGradeForSubmission
  } from "./aiGrader.service.js";
  
  export async function runAIGrader(req, res, next) {
    try {
      const { submissionId } = req.params;
  
      const result = await gradeSubmissionWithAI(submissionId);
  
      res.status(200).json({
        message: "AI grading completed",
        submission: result
      });
    } catch (error) {
      next(error);
    }
  }
  
  export async function getAIGraderResult(req, res, next) {
    try {
      const { submissionId } = req.params;
  
      const result = await getAIGradeForSubmission(submissionId);
  
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }