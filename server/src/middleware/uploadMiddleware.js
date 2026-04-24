import multer from "multer"
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || "module-file"

    let folder = "uploads/module-files"

    if (type === "course-image") folder = "uploads/course-images"
    if (type === "module-image") folder = "uploads/module-images"
    if (type === "module-file") folder = "uploads/module-files"
    if (type === "assignment-file") folder = "uploads/assignment-files"
    if (type === "submission-file") folder = "uploads/submission-files"

    fs.mkdirSync(folder, { recursive: true })

    cb(null, folder)
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-")
    cb(null, `${Date.now()}-${cleanName}`)
  }
})

const upload = multer({ storage })

export default upload