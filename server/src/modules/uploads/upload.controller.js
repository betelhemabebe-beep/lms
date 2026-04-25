export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  const fileUrl = `http://localhost:5000/${req.file.path.replace(/\\/g, "/")}`

  res.json({
    originalName: req.file.originalname,
    fileName: req.file.filename,
    fileUrl
  })
}