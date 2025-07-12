import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Palette, Eye, Sparkles } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
  { id: 3, content: "That sounds exciting! What kind of features?", isSent: false },
  { id: 4, content: "UI improvements and theme customization ✨", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-300">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-base-300 pt-11">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Palette size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Theme Settings
            </h1>
          </div>
          <p className="text-base-content/70 text-lg">
            Customize your chat experience with beautiful themes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Theme Selection Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Choose Your Theme</h2>
                <p className="text-base-content/70">Pick a theme that matches your style</p>
              </div>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`
                    group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 hover:scale-105
                    ${theme === t 
                      ? "bg-primary/20 ring-2 ring-primary shadow-lg shadow-primary/25" 
                      : "bg-base-200 hover:bg-base-300 hover:shadow-md"
                    }
                  `}
                  onClick={() => setTheme(t)}
                >
                  {/* Theme color preview */}
                  <div className="relative h-12 w-full rounded-lg overflow-hidden shadow-sm" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[1px] p-1">
                      <div className="rounded-sm bg-primary"></div>
                      <div className="rounded-sm bg-secondary"></div>
                      <div className="rounded-sm bg-accent"></div>
                      <div className="rounded-sm bg-neutral"></div>
                    </div>
                    {/* Selection indicator */}
                    {theme === t && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center">
                          <Sparkles size={12} />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <span className={`
                    text-xs font-medium truncate w-full text-center transition-colors
                    ${theme === t ? "text-primary font-semibold" : "text-base-content/80"}
                  `}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}
            </div>

            {/* Current theme info */}
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Eye className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Current Theme</h3>
                  <p className="text-sm text-base-content/70">
                    <span className="capitalize font-medium text-primary">{theme}</span> theme is active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <Eye size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Live Preview</h2>
                <p className="text-base-content/70">See how your theme looks in action</p>
              </div>
            </div>

            {/* Enhanced Preview */}
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300 shadow-xl">
              <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden border border-base-300">
                {/* Chat Header */}
                <div className="px-4 py-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-base-300">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content font-semibold text-sm shadow-lg">
                        JD
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">John Doe</h3>
                      <p className="text-xs text-success flex items-center gap-1">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-3 h-64 overflow-y-auto bg-gradient-to-b from-base-100 to-base-50">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-2xl p-3 shadow-sm border transition-all duration-200 hover:shadow-md
                          ${message.isSent 
                            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-content border-primary/20" 
                            : "bg-base-200 border-base-300 hover:bg-base-300"
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-2 flex justify-end
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/50"}
                          `}
                        >
                          {message.id === 1 && "12:00 PM"}
                          {message.id === 2 && "12:01 PM"}
                          {message.id === 3 && "12:02 PM"}
                          {message.id === 4 && "12:03 PM"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-base-100 border-t border-base-300">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        className="input input-bordered w-full text-sm bg-base-200 border-base-300 focus:border-primary focus:outline-none pr-12"
                        placeholder="Type your message..."
                        value="This is a live preview! ✨"
                        readOnly
                      />
                    </div>
                    <button className="btn btn-primary btn-circle shadow-lg hover:shadow-xl transition-shadow">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Info Card */}
            <div className="bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl p-4 border border-base-300">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                Theme Features
              </h4>
              <ul className="space-y-1 text-sm text-base-content/70">
                <li>• Adaptive color scheme</li>
                <li>• Smooth transitions</li>
                <li>• Consistent design language</li>
                <li>• Optimized for readability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;