import mongoose from "mongoose"

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model("Module", moduleSchema)