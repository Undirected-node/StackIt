import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      data-theme={theme}
      className="fixed top-0 z-50 w-full backdrop-blur-xl
                 bg-base-100/70 border-b border-base-200/50
                 transition-all duration-300"
    >
      <div className="container mx-auto h-16 px-6">
        <div className="flex h-full items-center justify-between">

          {/* Logo */}
          <Link to="/" className="transition-all duration-300">
            <span className="font-bold text-2xl text-primary">StackIt</span>
          </Link>

          {/* Right‑hand nav */}
          <nav className="flex items-center gap-2">

            {/* Settings (always) */}
            <Link
              to="/settings"
              className="group relative flex items-center gap-2.5 rounded-xl
                         px-4 py-2.5 text-base-content/80 hover:text-base-content
                         hover:bg-base-200/70 transition-all duration-200"
            >
              <Settings className="size-4 transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline text-sm font-medium">Settings</span>
              <div className="absolute inset-0 rounded-xl bg-base-200/50 opacity-0
                              transition-opacity duration-200 group-hover:opacity-100" />
            </Link>

            {/* Auth‑only items */}
            {authUser && (
              <div className="ml-1 flex items-center gap-2 animate-in slide-in-from-right-5 duration-300">

                <Link
                  to="/profile"
                  className="group relative flex items-center gap-2.5 rounded-xl
                             px-4 py-2.5 text-base-content/80 hover:text-primary
                             hover:bg-primary/10 transition-all duration-200"
                >
                  <User className="size-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="hidden sm:inline text-sm font-medium">Profile</span>
                  <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0
                                  transition-opacity duration-200 group-hover:opacity-100" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="group relative flex items-center gap-2.5 rounded-xl
                             px-4 py-2.5 text-base-content/70 hover:text-error
                             hover:bg-error/10 transition-all duration-200"
                >
                  <LogOut className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                  <div className="absolute inset-0 rounded-xl bg-error/10 opacity-0
                                  transition-opacity duration-200 group-hover:opacity-100" />
                </button>

              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;