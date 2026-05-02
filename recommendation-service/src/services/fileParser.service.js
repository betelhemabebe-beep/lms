import axios from "axios"
import mammoth from "mammoth"
import { PDFParse } from "pdf-parse"

export const parseFileFromUrl = async (fileUrl) => {
  if (!fileUrl) return ""

  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer"
  })

  const buffer = Buffer.from(response.data)
  const lowerUrl = fileUrl.toLowerCase()

  if (lowerUrl.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    return result.text
  }

  if (lowerUrl.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  if (
    lowerUrl.endsWith(".txt") ||
    lowerUrl.endsWith(".md") ||
    lowerUrl.endsWith(".csv")
  ) {
    return buffer.toString("utf-8")
  }

  return ""
}