import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // to force image re-render

  // Compress image to reduce file size
  const compressImage = (file, targetSizeMB = 5, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 1200; // Increased for better quality
        let { width, height } = img;
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Check if file is extremely large (over 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image is too large (max 20MB). Please choose a smaller image.");
      return;
    }

    try {
      let processedFile = file;
      
      // If file is larger than 5MB, compress it
      if (file.size > 5 * 1024 * 1024) {
        toast.loading("Compressing large image...", { id: "compress" });
        
        // Use more aggressive compression for very large files
        const quality = file.size > 10 * 1024 * 1024 ? 0.6 : 0.7;
        processedFile = await compressImage(file, 5, quality);
        toast.dismiss("compress");
        
        // Final check after compression
        if (processedFile.size > 10 * 1024 * 1024) {
          toast.error("Image is still too large after compression. Please choose a smaller image.");
          return;
        }
        
        toast.success("Image compressed successfully!");
      } else if (file.size > 1 * 1024 * 1024) {
        // Compress files over 1MB due to base64 expansion and server limits
        toast.loading("Optimizing image for upload...", { id: "optimize" });
        processedFile = await compressImage(file, 2, 0.8);
        toast.dismiss("optimize");
        
        // Check final size after compression
        if (processedFile.size > 3 * 1024 * 1024) {
          toast.error("Image is still too large after compression. Please choose a smaller image.");
          return;
        }
      }

      const reader = new FileReader();

      reader.onload = async () => {
        const base64Image = reader.result;

        try {
          console.log("🔄 Uploading image...");
          toast.loading("Updating profile picture...", { id: "upload" });
          
          await updateProfile({ profilePic: base64Image });
          
          console.log("✅ Profile updated");
          toast.success("Profile picture updated successfully!", { id: "upload" });
          setImageKey(Date.now()); // Force re-render image
        } catch (error) {
          console.error("❌ Upload failed:", error);
          toast.dismiss("upload");

          // Handle different types of errors
          if (error?.message?.includes("413") || 
              error?.message?.includes("Payload Too Large") ||
              error?.message?.includes("PayloadTooLargeError") ||
              error?.message?.includes("request entity too large") ||
              error?.message?.includes("ERR_FAILED 413")) {
            toast.error("Image too large for server. Try using a smaller image or check server configuration.");
          } else if (error?.message?.includes("Network Error") || 
                     error?.message?.includes("ERR_NETWORK")) {
            toast.error("Network error. Please check your connection and try again.");
          } else if (error?.response?.status === 413) {
            toast.error("Server cannot handle this image size. Please try a smaller image.");
          } else if (error?.response?.status >= 500) {
            toast.error("Server error. Please try again later.");
          } else if (error?.response?.status === 400) {
            toast.error("Invalid image format. Please try a different image.");
          } else {
            toast.error(`Upload failed: ${error?.message || 'Unknown error'}. Please try again.`);
          }
        }
      };

      reader.onerror = () => {
        console.error("❌ FileReader failed");
        toast.error("Failed to read image file. Please try again.");
      };

      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error("❌ Image processing failed:", error);
      toast.error("Failed to process image. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-base-100 pt-20 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pt-20">
      <div className="container mx-auto max-w-4xl p-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-base-content mb-2">Profile</h1>
          <p className="text-base-content/70 text-lg">
            Manage your account information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up">
              <div className="card-body items-center text-center">
                <h2 className="card-title text-xl mb-4">Profile Picture</h2>

                <div
                  className="relative group"
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                >
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-300 hover:ring-secondary">
                      <img
                        key={imageKey}
                        src={authUser.profilePic || "/avatar.png"}
                        alt="Profile"
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/avatar.png";
                        }}
                      />
                    </div>
                  </div>

                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute -bottom-2 -right-2 
                      btn btn-circle btn-primary btn-sm
                      hover:btn-secondary transition-all duration-300
                      ${isUpdatingProfile ? "loading" : ""}
                      ${isHoveringAvatar ? "scale-110" : "scale-100"}
                      cursor-pointer
                    `}
                  >
                    {!isUpdatingProfile && <Camera className="w-4 h-4" />}
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>

                <p className="text-sm text-base-content/60 mt-4">
                  {isUpdatingProfile ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-xs"></span>
                      Uploading...
                    </span>
                  ) : (
                    "Click camera to update photo"
                  )}
                </p>
                
                {/* File size info */}
                <p className="text-xs text-base-content/40 mt-2">
                  Max file size: 20MB • Images over 5MB will be compressed
                </p>
              </div>
            </div>
          </div>

          {/* Main Info Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up animation-delay-100">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6 text-primary">
                  <User className="w-6 h-6" />
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Full Name
                      </span>
                    </label>
                    <div className="input input-bordered flex items-center bg-base-100 hover:bg-base-300/50">
                      <span className="text-base-content">{authUser.fullName || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address
                      </span>
                    </label>
                    <div className="input input-bordered flex items-center bg-base-100 hover:bg-base-300/50">
                      <span className="text-base-content">{authUser.email || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up animation-delay-200">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6 text-secondary">
                  <CheckCircle className="w-6 h-6" />
                  Account Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg hover:bg-base-300/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-info" />
                      <span className="font-medium">Member Since</span>
                    </div>
                    <span className="text-base-content/80 font-mono">
                      {formatDate(authUser.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg hover:bg-base-300/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-medium">Account Status</span>
                    </div>
                    <div className="badge badge-success gap-2">
                      <div className="w-2 h-2 bg-success-content rounded-full animate-pulse"></div>
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;