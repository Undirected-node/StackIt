import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const filters = [
  { label: "Newest", value: "newest" },
  { label: "Unanswered", value: "unanswered" },
  { label: "Most Answered", value: "most_answered" },
  { label: "All", value: "all" },
];

const HomePage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/questions");
        setQuestions(res.data);
      } catch (err) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Filter and search logic
  let filteredQuestions = questions;
  if (filter === "unanswered") filteredQuestions = filteredQuestions.filter(q => q.answers.length === 0);
  if (filter === "most_answered") filteredQuestions = [...filteredQuestions].sort((a, b) => b.answers.length - a.answers.length);
  if (search) filteredQuestions = filteredQuestions.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / pageSize);
  const paginatedQuestions = filteredQuestions.slice((page - 1) * pageSize, page * pageSize);

  const handleAsk = () => {
    if (!authUser) {
      localStorage.setItem("redirectAfterLogin", "/ask");
      navigate("/login");
    } else {
      navigate("/ask");
    }
  };

  const handleReply = (id) => {
    if (!authUser) {
      localStorage.setItem("redirectAfterLogin", `/answer/${id}`);
      navigate("/login");
    } else {
      navigate(`/answer/${id}`);
    }
  };

  return (
    <div className="h-screen w-screen bg-base-200 mt-12">
      <div className="flex h-screen w-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 p-6 border-b border-base-300 bg-base-100">
            <button className="btn btn-primary" onClick={handleAsk}>
              Ask New Question
            </button>
            <select
              className="select select-bordered w-44"
              value={filter}
              onChange={e => { setFilter(e.target.value); setPage(1); }}
            >
              {filters.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <div className="flex-1 flex justify-end">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Search questions..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              </div>
            </div>
          </div>

          {/* Questions list */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="text-center text-zinc-500 py-12">Loading questions...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : paginatedQuestions.length === 0 ? (
              <div className="text-center text-zinc-500 py-12">No questions found.</div>
            ) : (
              <div className="space-y-6">
                {paginatedQuestions.map((q) => (
                  <div key={q._id} className="border rounded-lg p-5 bg-base-100 flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold text-primary-content truncate">{q.title}</span>
                        {q.tags && q.tags.map(tag => (
                          <span key={tag} className="badge badge-outline badge-sm ml-1">{tag}</span>
                        ))}
                      </div>
                      <div className="text-base-content/80 mb-1 line-clamp-2">{q.description}</div>
                      <div className="text-xs text-base-content/60">Asked by {q.user?.fullName || "Anonymous"}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2 mt-4 md:mt-0 md:ml-6">
                      <span className="badge badge-lg bg-primary text-primary-content">{q.answers.length} Answers</span>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleReply(q._id)}>
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  className="btn btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
