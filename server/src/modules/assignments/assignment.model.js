import mongoose from "mongoose"

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    instructionFile: {
      type: String,
      required: true
    },
    rubricFile: {
      type: String,
      required: true
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
)

assignmentSchema.index({ module: 1, title: 1 }, { unique: true })

export default mongoose.model("Assignment", assignmentSchema)