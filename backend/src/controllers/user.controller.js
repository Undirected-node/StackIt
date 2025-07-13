import User from "../models/user.model.js";
import Answer from "../models/answer.model.js";

export const getTopUsers = async (req, res) => {
  try {
    // Find all users who have at least one answer
    const answers = await Answer.find().populate("user");
    const userStats = {};
    answers.forEach(ans => {
      if (!ans.user) return;
      const id = ans.user._id.toString();
      if (!userStats[id]) {
        userStats[id] = {
          user: ans.user,
          totalUpvotes: 0,
          answerCount: 0,
        };
      }
      userStats[id].totalUpvotes += ans.upvotes ? ans.upvotes.length : 0;
      userStats[id].answerCount += 1;
    });
    let users = Object.values(userStats);
    users.sort((a, b) => b.totalUpvotes - a.totalUpvotes);
    // Add badge for top answerer
    if (users.length > 0) users[0].badge = "Top Answerer";
    res.status(200).json(users.map(u => ({
      fullName: u.user.fullName,
      profilePic: u.user.profilePic || "",
      totalUpvotes: u.totalUpvotes,
      badge: u.badge || null,
    })));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top users", error: error.message });
  }
}; 