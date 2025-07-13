import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser, socket } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    const fetchTopUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/users/top-users");
        if (isMounted) setTopUsers(res.data);
      } catch (err) {
        if (isMounted) setError("Failed to load top users");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTopUsers();
    if (socket) {
      socket.on("profilePicUpdated", fetchTopUsers);
    }
    return () => {
      isMounted = false;
      if (socket) {
        socket.off("profilePicUpdated", fetchTopUsers);
      }
    };
  }, [socket]);

  if (loading) return <SidebarSkeleton />;

  // Helper for image fallback
  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = "/avatar.png";
  };

  return (
    <div className="w-full h-full">
      <div className="overflow-y-auto h-full w-full py-3">
        {error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : topUsers.length === 0 ? (
          <div className="text-center text-zinc-500 py-4">No top users found</div>
        ) : (
          <ul className="divide-y divide-base-300">
            {topUsers.map((user, idx) => (
              <li
                key={user.fullName + idx}
                className="flex items-center gap-3 px-2 py-2 bg-transparent hover:bg-base-200 transition-colors duration-150"
              >
                <img
                  src={user.profilePic && user.profilePic.trim() !== "" ? user.profilePic + `?t=${Date.now()}` : "/avatar.png"}
                  alt={user.fullName || "User"}
                  className="w-10 h-10 rounded-full object-cover border border-base-300 shadow"
                  loading="lazy"
                  onError={handleImgError}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-base-content">
                    {user.fullName}
                  </div>
                  <div className="text-xs text-base-content/70 mt-0.5">
                    Upvotes: <span className="font-semibold">{user.totalUpvotes}</span>
                  </div>
                </div>
                {user.badge && (
                  <span className="badge badge-success badge-xs ml-2 whitespace-nowrap">{user.badge}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
