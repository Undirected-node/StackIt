import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const AnswerQuestionPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [upvotedAnswers, setUpvotedAnswers] = useState([]); // store answer ids upvoted by this user (UI only)

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/questions/${questionId}`);
        setQuestion(res.data);
      } catch (err) {
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId, success]); // refetch on new answer

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await axiosInstance.post("/answers", {
        questionId,
        content: answer,
      });
      setAnswer("");
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  // UI-only upvote logic
  const handleUpvote = async (answerId) => {
    if (!authUser) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }
    if (upvotedAnswers.includes(answerId)) {
      toast("You have already upvoted this answer.", { icon: "👍" });
      return;
    }
    try {
      await axiosInstance.patch(`/answers/${answerId}/upvote`);
      setUpvotedAnswers([...upvotedAnswers, answerId]);
      setSuccess(!success); // trigger refresh
      toast.success("Upvoted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upvote");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center">Loading question...</div>
      </div>
    );
  }
  if (error || !question) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center text-red-500">{error || "Question not found."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-16 p-6 bg-base-100 rounded shadow">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-base-content/60">
          <span className="text-base-content/80">Question</span>
          <span className="mx-2">&gt;</span>
          <span className="text-primary font-medium">{question.title.slice(0, 40)}{question.title.length > 40 ? "..." : ""}</span>
        </div>
        {/* Question */}
        <h2 className="text-xl font-bold mb-2">{question.title}</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {question.tags && question.tags.map(tag => (
            <span key={tag} className="badge badge-outline badge-sm">{tag}</span>
          ))}
        </div>
        <p className="mb-6 text-base-content/80 whitespace-pre-line">{question.description}</p>
        {/* Answers */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Answers</h3>
          {question.answers && question.answers.length > 0 ? (
            question.answers.map((ans, idx) => (
              <div key={ans._id} className="flex items-start gap-4 mb-4 p-3 rounded bg-base-200">
                {/* Upvote UI */}
                <div className="flex flex-col items-center mr-2">
                  <button
                    className={`btn btn-xs btn-ghost ${upvotedAnswers.includes(ans._id) ? "text-primary" : ""}`}
                    onClick={() => handleUpvote(ans._id)}
                    disabled={upvotedAnswers.includes(ans._id)}
                    title={upvotedAnswers.includes(ans._id) ? "You have upvoted" : "Upvote"}
                  >
                    ▲
                  </button>
                  <span className="font-bold">{(ans.upvotes ? ans.upvotes.length : 0) + (upvotedAnswers.includes(ans._id) && !(ans.upvotes || []).includes(authUser?._id) ? 1 : 0)}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Answer {idx + 1}</div>
                  <div className="mb-1 whitespace-pre-line">{ans.content}</div>
                  <div className="text-xs text-base-content/60">
                    {ans.user?.fullName ? `by ${ans.user.fullName}` : "by Anonymous"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-zinc-500">No answers yet.</div>
          )}
        </div>
        {/* Submit Answer */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Submit Your Answer</label>
          <textarea
            className="textarea textarea-bordered w-full min-h-[120px] mb-4"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            disabled={submitting}
          />
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">Answer submitted!</div>}
          <button type="submit" className="btn btn-primary" disabled={submitting || !answer.trim()}>
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnswerQuestionPage; 