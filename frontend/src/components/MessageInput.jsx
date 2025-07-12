import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Check if file is extremely large (over 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Image is too large (max 50MB). Please choose a smaller image.");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (file, targetSizeMB = 8, maxQuality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          const maxDimension = file.size > 10 * 1024 * 1024 ? 1200 : 1600;
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
          
          // Try different quality levels until we get acceptable size
          const tryCompress = (quality) => {
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }
              
              const sizeMB = blob.size / (1024 * 1024);
              
              if (sizeMB <= targetSizeMB || quality <= 0.1) {
                resolve(blob);
              } else {
                // Reduce quality and try again
                tryCompress(quality - 0.1);
              }
            }, 'image/jpeg', quality);
          };
          
          tryCompress(maxQuality);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image for compression"));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isProcessing) return;

    setIsProcessing(true);
    let toastId = null;

    try {
      let processedImage = imagePreview;
      
      // Process image if we have one
      if (selectedFile && imagePreview) {
        const fileSizeMB = selectedFile.size / (1024 * 1024);
        
        if (fileSizeMB > 8) {
          toastId = toast.loading(`Compressing large image (${fileSizeMB.toFixed(1)}MB)...`);
          
          try {
            const compressedBlob = await compressImage(selectedFile);
            processedImage = await convertBlobToBase64(compressedBlob);
            
            const newSizeMB = compressedBlob.size / (1024 * 1024);
            toast.success(`Image compressed from ${fileSizeMB.toFixed(1)}MB to ${newSizeMB.toFixed(1)}MB`, {
              id: toastId
            });
          } catch (compressionError) {
            console.warn("Compression failed, using original:", compressionError);
            toast.dismiss(toastId);
            toast.loading("Sending original image...");
            // Use original image if compression fails
          }
        }
      }

      await sendMessage({
        text: text.trim(),
        image: processedImage,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      if (toastId) toast.dismiss(toastId);

    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
      if (toastId) toast.dismiss(toastId);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center hover:bg-base-200 transition-colors"
              type="button"
              disabled={isProcessing}
            >
              <X className="size-3" />
            </button>
            {selectedFile && (
              <div className="absolute -bottom-6 left-0 text-xs text-zinc-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(1)}MB
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isProcessing}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isProcessing}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle transition-colors
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}
                     ${isProcessing ? "loading" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            {!isProcessing && <Image size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className={`btn btn-sm btn-circle ${isProcessing ? "loading" : ""}`}
          disabled={(!text.trim() && !imagePreview) || isProcessing}
        >
          {!isProcessing && <Send size={22} />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;