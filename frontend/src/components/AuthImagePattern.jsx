import { useEffect, useState } from 'react';

const AuthImagePattern = ({ title, subtitle }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.currentTarget?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = document.getElementById('auth-pattern-container');
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const patterns = [
    // Floating orbs pattern
    {
      type: 'orb',
      delay: 0,
      duration: 4,
      size: 'w-4 h-4',
      position: 'top-10 left-10',
      color: 'bg-primary/20',
    },
    {
      type: 'orb',
      delay: 0.5,
      duration: 3.5,
      size: 'w-6 h-6',
      position: 'top-20 right-16',
      color: 'bg-secondary/25',
    },
    {
      type: 'orb',
      delay: 1,
      duration: 5,
      size: 'w-3 h-3',
      position: 'top-32 left-20',
      color: 'bg-accent/30',
    },
    // Geometric shapes
    {
      type: 'square',
      delay: 0.2,
      duration: 6,
      size: 'w-8 h-8',
      position: 'bottom-32 right-12',
      color: 'bg-primary/15',
    },
    {
      type: 'triangle',
      delay: 0.8,
      duration: 4.5,
      size: 'w-6 h-6',
      position: 'bottom-48 left-16',
      color: 'bg-secondary/20',
    },
    {
      type: 'diamond',
      delay: 1.5,
      duration: 5.5,
      size: 'w-5 h-5',
      position: 'top-40 right-20',
      color: 'bg-accent/25',
    },
  ];

  return (
    <div 
      id="auth-pattern-container"
      className="hidden lg:flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-base-200 via-base-100 to-base-200 transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-50 transition-all duration-1000"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            hsl(var(--p) / 0.1) 0%, 
            hsl(var(--s) / 0.05) 25%, 
            hsl(var(--a) / 0.08) 50%, 
            transparent 70%)
          `,
        }}
      />

      {/* Floating pattern elements */}
      {patterns.map((pattern, index) => (
        <div
          key={index}
          className={`
            absolute ${pattern.position} ${pattern.size} ${pattern.color}
            transition-all duration-300 cursor-pointer
            ${pattern.type === 'orb' ? 'rounded-full' : ''}
            ${pattern.type === 'square' ? 'rounded-lg rotate-12' : ''}
            ${pattern.type === 'triangle' ? 'rounded-sm' : ''}
            ${pattern.type === 'diamond' ? 'rounded-lg rotate-45' : ''}
            ${isHovered ? 'scale-110 opacity-80' : 'opacity-60'}
          `}
          style={{
            animationDelay: `${pattern.delay}s`,
            animationDuration: `${pattern.duration}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            animationName: `float-${pattern.type}`,
            transform: isHovered 
              ? `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px) scale(1.1)` 
              : 'none',
          }}
        />
      ))}

      {/* Central content area */}
      <div className="relative z-10 max-w-md text-center p-8">
        {/* Main grid pattern */}
        <div className="relative mb-12">
          {/* Outer decorative ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border border-secondary/30 animate-pulse"></div>
          
          {/* Central grid */}
          <div className="relative bg-base-100/50 backdrop-blur-sm rounded-3xl p-8 border border-base-300/50 shadow-2xl">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    aspect-square rounded-xl relative overflow-hidden group cursor-pointer
                    transition-all duration-500 hover:scale-105
                    ${i === 4 ? 'bg-gradient-to-br from-primary to-secondary shadow-lg' : 'bg-base-200/80'}
                    ${i % 2 === 0 ? 'animate-pulse-slow' : ''}
                    ${i % 3 === 0 ? 'hover:rotate-6' : i % 3 === 1 ? 'hover:-rotate-6' : 'hover:rotate-3'}
                  `}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Special center piece */}
                  {i === 4 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary-content/80 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Corner decorations */}
                  {[0, 2, 6, 8].includes(i) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-accent/40 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Connection lines */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Horizontal lines */}
              <div className="absolute top-1/3 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              <div className="absolute bottom-1/3 left-4 right-4 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
              
              {/* Vertical lines */}
              <div className="absolute left-1/3 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent"></div>
              <div className="absolute right-1/3 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Text content with enhanced styling */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
            {title}
          </h2>
          <p className="text-base-content/70 text-lg leading-relaxed">
            {subtitle}
          </p>
          
          {/* Decorative dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-accent'
                } animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-1 h-1 bg-primary/30 rounded-full
              animate-float-particle
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
        
        @keyframes float-square {
          0%, 100% { transform: translateY(0px) rotate(12deg) scale(1); }
          33% { transform: translateY(-15px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(-10px) rotate(240deg) scale(0.9); }
        }
        
        @keyframes float-triangle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(360deg); }
        }
        
        @keyframes float-diamond {
          0%, 100% { transform: translateY(0px) rotate(45deg) scale(1); }
          25% { transform: translateY(-10px) rotate(135deg) scale(1.2); }
          75% { transform: translateY(-5px) rotate(315deg) scale(0.8); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { transform: translateY(-100px) translateX(50px) scale(1.5); opacity: 0.8; }
        }
        
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-float-particle { animation: float-particle 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AuthImagePattern;