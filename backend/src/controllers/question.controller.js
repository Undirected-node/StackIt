import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";

export const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const user = req.user._id;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const question = new Question({
      user,
      title,
      description,
      tags: tags || [],
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to create question", error: error.message });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("user", "fullName profilePic")
      .populate({
        path: "answers",
        populate: { path: "user", select: "fullName profilePic" },
      })
      .sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id)
      .populate("user", "fullName profilePic")
      .populate({
        path: "answers",
        populate: { path: "user", select: "fullName profilePic" },
      });
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question", error: error.message });
  }
}; 