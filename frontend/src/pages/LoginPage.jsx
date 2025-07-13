import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

// ILinkULogo Component
const ILinkULogo = ({ size = 'normal' }) => {
  const sizeClasses = {
    small: 'h-8',
    normal: 'h-10',
    large: 'h-12'
  };

  return (
    <div className="group">
      {/* Logo Icon */}
      <div className={`relative ${sizeClasses[size]} aspect-square rounded-2xl
                      bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
                      flex items-center justify-center shadow-lg
                      group-hover:shadow-xl group-hover:shadow-blue-500/25
                      transition-all duration-300`}>
        
        {/* Chain Link Icon with Chat Bubble Shape */}
        <div className="relative flex items-center justify-center">
          {/* Left Link (I) */}
          <div className="relative">
            <div className="w-3 h-4 border-2 border-white rounded-full 
                           bg-gradient-to-br from-white/20 to-transparent
                           transform -rotate-12 transition-transform duration-300
                           group-hover:rotate-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[6px] font-bold text-white">I</span>
              </div>
            </div>
          </div>
          
          {/* Connecting Element */}
          <div className="w-1 h-0.5 bg-white/80 mx-0.5 rounded-full
                         transition-all duration-300 group-hover:w-1.5"></div>
          
          {/* Right Link (U) */}
          <div className="relative">
            <div className="w-3 h-4 border-2 border-white rounded-full
                           bg-gradient-to-br from-white/20 to-transparent
                           transform rotate-12 transition-transform duration-300
                           group-hover:rotate-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[6px] font-bold text-white">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn, authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    // After login, always redirect to home
    if (useAuthStore.getState().authUser) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <Link to="/" className="transition-all duration-300">
                <span className="font-bold text-3xl text-primary">StackIt</span>
              </Link>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?
              <Link to="/signup" className="ml-2 btn btn-link btn-sm text-primary">
                Sign up instead
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"StackIt"}
        subtitle={"Ask. Share. Stack up wisdom — one question at a time."}
      />
    </div>
  );
};

export default LoginPage;