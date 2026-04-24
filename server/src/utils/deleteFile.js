import fs from "fs"

const deleteFile = (filePath) => {
  if (!filePath) return

  const cleanedPath = filePath.replace("http://localhost:5000/", "")

  fs.unlink(cleanedPath, (err) => {
    if (err) {
      console.log("File delete error:", err.message)
    }
  })
}

export default deleteFile