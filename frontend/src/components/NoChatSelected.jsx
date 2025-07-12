// ILinkULogo Component
const ILinkULogo = ({ size = 'normal' }) => {
  const sizeClasses = {
    small: 'h-8',
    normal: 'h-10',
    large: 'h-12',
    xlarge: 'h-16'
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
            <div className="w-4 h-5 border-2 border-white rounded-full 
                           bg-gradient-to-br from-white/20 to-transparent
                           transform -rotate-12 transition-transform duration-300
                           group-hover:rotate-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">I</span>
              </div>
            </div>
          </div>
          
          {/* Connecting Element */}
          <div className="w-1.5 h-0.5 bg-white/80 mx-0.5 rounded-full
                         transition-all duration-300 group-hover:w-2"></div>
          
          {/* Right Link (U) */}
          <div className="relative">
            <div className="w-4 h-5 border-2 border-white rounded-full
                           bg-gradient-to-br from-white/20 to-transparent
                           transform rotate-12 transition-transform duration-300
                           group-hover:rotate-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 
                    bg-gradient-to-br from-base-100 via-base-100/80 to-base-200/50
                    relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md text-center space-y-8 relative z-10">
        {/* Enhanced Welcome Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Welcome to StackIt!</h2>
          <div className="space-y-2">
            <p className="text-base-content/70 text-lg font-medium">
              Ready to connect and chat?
            </p>
            <p className="text-base-content/50 text-sm">
              Select a conversation from the sidebar to start chatting
            </p>
          </div>
        </div>

        {/* Additional Visual Elements */}
        <div className="flex justify-center gap-2 mt-8 opacity-60">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary/60 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-accent/60 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Subtle hint text */}
      </div>
    </div>
  );
};

export default NoChatSelected;