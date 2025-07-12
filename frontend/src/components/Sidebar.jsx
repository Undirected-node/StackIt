import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/users/top-users");
        setTopUsers(res.data);
      } catch (err) {
        setError("Failed to load top users");
      } finally {
        setLoading(false);
      }
    };
    fetchTopUsers();
  }, []);

  if (loading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Top Users</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : topUsers.length === 0 ? (
          <div className="text-center text-zinc-500 py-4">No top users found</div>
        ) : (
          <ul className="space-y-3">
            {topUsers.map((user, idx) => (
              <li key={user.fullName + idx} className="flex items-center gap-3 p-2 rounded hover:bg-base-300">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user.fullName}</div>
                  <div className="text-xs text-primary font-bold">Upvotes: {user.totalUpvotes}</div>
                </div>
                {user.badge && (
                  <span className="badge badge-success badge-sm ml-2">{user.badge}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
