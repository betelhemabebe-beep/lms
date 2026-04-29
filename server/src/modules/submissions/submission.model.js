import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    file: {
      type: String,
      required: true
    },
    submittedAt: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["Not Submitted", "Submitted", "Graded", "Closed"],
      default: "Submitted"
    },
    grade: {
      type: String,
      default: ""
    },
    feedback: {
      type: String,
      default: ""
    },
    aiGrade: {
      type: String,
      default: ""
    },
    aiFeedback: {
      type: String,
      default: ""
    },
    aiStatus: {
      type: String,
      enum: ["Not Started", "Processing", "Ready", "Failed"],
      default: "Not Started"
    }
  },
  { timestamps: true }
)

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true })

export default mongoose.model("Submission", submissionSchema)