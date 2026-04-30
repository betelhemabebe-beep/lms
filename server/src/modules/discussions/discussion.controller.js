import Discussion from "./discussion.model.js";

export const getCourseDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({ course: req.params.courseId })
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: "Failed to get discussions" });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.create({
      course: req.params.courseId,
      author: req.user._id,
      title: req.body.title,
      body: req.body.body,
    });

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Failed to create discussion" });
  }
};

export const getDiscussionThread = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.threadId)
      .populate("author", "name email role")
      .populate("replies.author", "name email role");

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Failed to get discussion thread" });
  }
};

export const addReply = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.threadId);

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    discussion.replies.push({
      author: req.user._id,
      body: req.body.body,
    });

    await discussion.save();

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Failed to add reply" });
  }
};