import mongoose from "mongoose"

const moduleContentSchema = new mongoose.Schema(
  {
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
    itemType: {
      type: String,
      enum: ["file", "assignment"],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      default: ""
    },
    fileUrl: {
      type: String,
      default: ""
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      default: null
    },
    order: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model("ModuleContent", moduleContentSchema)