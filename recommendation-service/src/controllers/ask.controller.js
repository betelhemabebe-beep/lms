import { askAI } from "../services/ai.service.js"
import { parseFileFromUrl } from "../services/fileParser.service.js"

export const askQuestion = async (req, res) => {
  try {
    const { question, context } = req.body

    if (!question || !context) {
      return res.status(400).json({
        message: "question and context are required"
      })
    }

    let extractedText = ""

    if (context.pageType === "file" && context.file?.fileUrl) {
      extractedText += await parseFileFromUrl(context.file.fileUrl)
    }

    if (context.pageType === "assignment") {
      if (context.assignment?.instructionFile) {
        extractedText += "\n\nAssignment Instructions:\n"
        extractedText += await parseFileFromUrl(context.assignment.instructionFile)
      }

      if (context.assignment?.rubricFile) {
        extractedText += "\n\nRubric:\n"
        extractedText += await parseFileFromUrl(context.assignment.rubricFile)
      }
    }

    if (context.pageType === "module" && context.files?.length > 0) {
      for (const file of context.files) {
        if (file.fileUrl) {
          extractedText += `\n\nFile: ${file.title}\n`
          extractedText += await parseFileFromUrl(file.fileUrl)
        }
      }
    }

    const answer = await askAI({
      question,
      context,
      extractedText
    })

    res.json({ answer })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to answer question",
      error: error.message
    })
  }
}