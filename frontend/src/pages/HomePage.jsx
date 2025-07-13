import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
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
  const pageSize = 4;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvotedAnswers, setUpvotedAnswers] = useState([]);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  // Load upvotedAnswers from localStorage on mount and when authUser changes
  useEffect(() => {
    if (authUser) {
      const stored = localStorage.getItem(`upvotedAnswers_${authUser._id}`);
      if (stored) {
        setUpvotedAnswers(JSON.parse(stored));
      }
    }
  }, [authUser]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/questions");
        setQuestions(res.data);
        // Initialize upvotedAnswers for the current user
        if (authUser) {
          const upvoted = [];
          res.data.forEach(q => {
            q.answers?.forEach(ans => {
              if (ans.upvotes && ans.upvotes.includes(authUser._id)) {
                upvoted.push(ans._id);
              }
            });
          });
          setUpvotedAnswers(upvoted);
          localStorage.setItem(`upvotedAnswers_${authUser._id}`, JSON.stringify(upvoted));
        }
      } catch (err) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
    // eslint-disable-next-line
  }, [authUser]);

  // Filter and search logic
  let filteredQuestions = questions;
  if (filter === "unanswered") filteredQuestions = filteredQuestions.filter(q => q.answers.length === 0);
  if (filter === "most_answered") filteredQuestions = [...filteredQuestions].sort((a, b) => b.answers.length - a.answers.length);
  if (search) filteredQuestions = filteredQuestions.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line
  }, [filter, search, totalPages]);
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

  // Upvote handler for answers (toggle)
  const handleUpvote = async (answerId) => {
    if (!authUser) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }
    const hasUpvoted = upvotedAnswers.includes(answerId);
    const newUpvoted = hasUpvoted
      ? upvotedAnswers.filter(id => id !== answerId)
      : [...upvotedAnswers, answerId];
    setUpvotedAnswers(newUpvoted);
    localStorage.setItem(`upvotedAnswers_${authUser._id}`, JSON.stringify(newUpvoted));
    try {
      await axiosInstance.patch(`/answers/${answerId}/upvote`);
      // Refetch questions to get the latest upvote counts from backend
      const res = await axiosInstance.get("/questions");
      setQuestions(res.data);
      // Recalculate upvotedAnswers
      if (authUser) {
        const upvoted = [];
        res.data.forEach(q => {
          q.answers?.forEach(ans => {
            if (ans.upvotes && ans.upvotes.includes(authUser._id)) {
              upvoted.push(ans._id);
            }
          });
        });
        setUpvotedAnswers(upvoted);
        localStorage.setItem(`upvotedAnswers_${authUser._id}`, JSON.stringify(upvoted));
      }
    } catch (err) {
      // Revert UI on error
      setUpvotedAnswers(upvotedAnswers);
      localStorage.setItem(`upvotedAnswers_${authUser._id}`, JSON.stringify(upvotedAnswers));
    }
  };

  // Toggle expanded state for an answer
  const toggleExpand = (answerId) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [answerId]: !prev[answerId]
    }));
  };

  return (
    <div className="min-h-screen w-screen bg-base-200">
      {/* Full-width header */}
      <header className="w-full border-b border-base-300 bg-base-100 px-8 py-4 flex items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Stack It</h1>
      </header>
      {/* Main content: two columns */}
      <div className="flex w-full h-[calc(100vh-80px)]">
        {/* Left: Top Users */}
        <section className="hidden md:flex flex-col min-w-[260px] max-w-[320px] h-full border-r border-base-300 bg-base-100">
          {/* Top Users heading (no border here) */}
          <div className="flex items-center px-6 pt-6 pb-4">
            <span className="text-2xl font-bold">Top Users</span>
          </div>
          <div className="flex-1 overflow-y-auto h-[calc(100vh-200px)]">
            <Sidebar />
          </div>
        </section>
        {/* Right: Questions */}
        <section className="flex-1 flex flex-col min-w-0 h-full bg-base-100">
          {/* Unified border for headings */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 px-6 pt-6 pb-4 border-b border-base-300" style={{marginLeft: '-1px'}}>
            <div className="flex flex-1 items-center gap-4 min-w-0">
              <h2 className="text-2xl font-bold whitespace-nowrap mr-4">Questions</h2>
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
            </div>
            <div className="flex-1 flex justify-end min-w-0">
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
          {/* Questions list with independent scroll */}
          <div className="flex-1 overflow-y-auto h-[calc(100vh-200px)] p-6">
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
                      {/* Answers Section */}
                      {q.answers && q.answers.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {q.answers.map((ans, idx) => {
                            const isExpanded = expandedAnswers[ans._id];
                            const shouldTruncate = ans.content.length > 200;
                            const displayContent = isExpanded || !shouldTruncate
                              ? ans.content
                              : ans.content.slice(0, 200) + "...";
                            return (
                              <div key={ans._id} className="flex items-start gap-3 p-3 rounded bg-base-200">
                                <button
                                  className={`btn btn-xs btn-ghost flex flex-col items-center mr-2 ${upvotedAnswers.includes(ans._id) ? "text-primary" : ""}`}
                                  onClick={() => handleUpvote(ans._id)}
                                  title={upvotedAnswers.includes(ans._id) ? "You have upvoted" : "Upvote"}
                                >
                                  <ArrowUp size={16} />
                                  <span className="font-bold">{ans.upvotes ? ans.upvotes.length : 0}</span>
                                </button>
                                <div className="flex-1">
                                  <div className="font-medium">Answer {idx + 1}</div>
                                  <div className="mb-1 whitespace-pre-line">
                                    {displayContent}
                                    {shouldTruncate && (
                                      <span
                                        className="ml-2 text-primary cursor-pointer underline text-xs"
                                        onClick={() => toggleExpand(ans._id)}
                                      >
                                        {isExpanded ? "Show less" : "Read more"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-base-content/60">
                                    {ans.user?.fullName ? `by ${ans.user.fullName}` : "by Anonymous"}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
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
          </div>
          {/* Pagination bar at the bottom of Questions section only */}
          {totalPages > 1 && (
            <div className="w-full bg-base-100 border-t border-base-300 py-4 flex justify-center items-center gap-2 z-20">
              <button
                className="w-9 h-9 rounded-lg border text-base font-semibold flex items-center justify-center transition-colors duration-200 bg-base-100 text-base-content border-base-300 hover:bg-base-200"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`w-9 h-9 rounded-lg border text-base font-semibold transition-colors duration-200
                    ${page === i + 1 ? "bg-primary text-white border-primary" : "bg-base-100 text-base-content border-base-300 hover:bg-base-200"}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="w-9 h-9 rounded-lg border text-base font-semibold flex items-center justify-center transition-colors duration-200 bg-base-100 text-base-content border-base-300 hover:bg-base-200"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
        </div>
          )}
        </section>
      </div>
    </div>
  );
};
export default HomePage;
