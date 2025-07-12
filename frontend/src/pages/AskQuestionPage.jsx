import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../lib/axios";

const AskQuestionPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post("/questions", {
        title,
        description,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-16 p-6 bg-base-100 rounded shadow">
        <h2 className="text-xl font-bold mb-6">Ask a New Question</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Question Title</label>
          <input
            className="input input-bordered w-full mb-4"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter your question title"
            required
            disabled={loading}
          />
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            className="textarea textarea-bordered w-full min-h-[120px] mb-4"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your question in detail..."
            required
            disabled={loading}
          />
          <label className="block mb-2 font-medium">Tags</label>
          <input
            className="input input-bordered w-full mb-6"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Add tags (comma separated)"
            disabled={loading}
          />
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionPage; 