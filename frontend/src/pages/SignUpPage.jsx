import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

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

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      await signup(formData);
      if (useAuthStore.getState().authUser) {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-20 relative z-10">
        <div className="w-full max-w-md space-y-8 pt-6">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <Link to="/" className="transition-all duration-300">
                <span className="font-bold text-3xl text-primary">StackIt</span>
              </Link>
              <div className="mt-4 space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Create Account
                </h1>
                <p className="text-base-content/70 text-sm font-medium">
                  Get started with your free account
                </p>
                <div className="flex items-center justify-center gap-1 opacity-60">
                  <div className="w-1 h-1 bg-primary rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-secondary rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-1 bg-accent rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container with Glass Effect */}
          <div className="backdrop-blur-sm bg-base-100/80 rounded-3xl p-8 shadow-2xl border border-base-300/50 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="form-control group">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/80 group-focus-within:text-primary transition-colors duration-300">
                    Full Name
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-12 pr-4 h-12 rounded-xl border-2 
                             focus:border-primary focus:ring-2 focus:ring-primary/20 
                             transition-all duration-300 hover:border-primary/50
                             bg-base-100/50 backdrop-blur-sm"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control group">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/80 group-focus-within:text-primary transition-colors duration-300">
                    Email
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 p-0 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-12 pr-4 h-12 rounded-xl border-2 
                             focus:border-primary focus:ring-2 focus:ring-primary/20 
                             transition-all duration-300 hover:border-primary/50
                             bg-base-100/50 backdrop-blur-sm"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control group">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/80 group-focus-within:text-primary transition-colors duration-300">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-12 pr-12 h-12 rounded-xl border-2 
                             focus:border-primary focus:ring-2 focus:ring-primary/20 
                             transition-all duration-300 hover:border-primary/50
                             bg-base-100/50 backdrop-blur-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40 hover:text-primary transition-colors duration-200" />
                    ) : (
                      <Eye className="size-5 text-base-content/40 hover:text-primary transition-colors duration-200" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full h-12 rounded-xl text-base font-semibold
                         shadow-lg hover:shadow-xl hover:shadow-primary/25 
                         transform hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 disabled:transform-none
                         bg-gradient-to-r from-primary to-primary/90 border-0
                         relative overflow-hidden group"
                disabled={isSigningUp}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center space-y-4">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-semibold hover:link-secondary transition-colors duration-300">
                Sign in
              </Link>
            </p>
            
            {/* Made by Mani */}
            <div className="mt-8 pt-4 border-t border-base-300/50">
              <p className="text-xs text-base-content/40 flex items-center justify-center gap-2 font-medium">
                Made with 
                <span className="text-red-500 animate-pulse">❤️</span> 
                by 
                <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  team 4230
                </span>
                <span className="animate-bounce">✨</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
      
      {/* Custom CSS for slow spin animation */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;