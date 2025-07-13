import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";

export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const user = req.user._id;
    if (!questionId || !content) {
      return res.status(400).json({ message: "Question and content are required" });
    }
    const answer = new Answer({ user, question: questionId, content });
    await answer.save();
    await Question.findByIdAndUpdate(questionId, { $push: { answers: answer._id } });
    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: "Failed to create answer", error: error.message });
  }
};

export const upvoteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const answer = await Answer.findById(id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    if (answer.upvotes.includes(userId)) {
      // Remove upvote (toggle off)
      answer.upvotes = answer.upvotes.filter(uid => uid.toString() !== userId.toString());
    } else {
      // Add upvote
      answer.upvotes.push(userId);
    }
    await answer.save();
    res.status(200).json({ upvotes: answer.upvotes.length, upvotesArray: answer.upvotes });
  } catch (error) {
    res.status(500).json({ message: "Failed to upvote answer", error: error.message });
  }
}; 