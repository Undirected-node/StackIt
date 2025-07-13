import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Palette, Eye, Sparkles } from "lucide-react";
import { useState } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
  { id: 3, content: "That sounds exciting! What kind of features?", isSent: false },
  { id: 4, content: "UI improvements and theme customization ✨", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  // State for live preview
  const [previewTitle, setPreviewTitle] = useState("How do I implement a live preview in React?");
  const [previewDescription, setPreviewDescription] = useState("I'm trying to create a live preview feature for my form, but I'm not sure how to keep the preview in sync with the input fields. Any tips or best practices?");
  const [previewTags, setPreviewTags] = useState(["react", "preview", "state"]);

  // Tag input for demo (comma separated)
  const [tagInput, setTagInput] = useState(previewTags.join(", "));

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
                <p className="text-base-content/70">See how your question will look</p>
              </div>
            </div>

            {/* Question Card Preview */}
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300 shadow-xl">
              <div className="border rounded-lg p-5 bg-base-100 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold text-primary-content truncate">{previewTitle || "Your question title..."}</span>
                    {previewTags && previewTags.filter(Boolean).map(tag => (
                      <span key={tag} className="badge badge-outline badge-sm ml-1">{tag}</span>
                    ))}
                  </div>
                  <div className="text-base-content/80 mb-1 line-clamp-2">{previewDescription || "Your question description..."}</div>
                  <div className="text-xs text-base-content/60">Asked by You</div>
                </div>
                <div className="flex flex-col items-end gap-2 mt-4 md:mt-0 md:ml-6">
                  <span className="badge badge-lg bg-primary text-primary-content">0 Answers</span>
                  <button className="btn btn-sm btn-secondary" disabled>Reply</button>
                </div>
              </div>
                </div>

            {/* Live input controls for preview */}
            <div className="bg-base-200 rounded-xl p-4 border border-base-300 space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                      <input
                  className="input input-bordered w-full"
                  value={previewTitle}
                  onChange={e => setPreviewTitle(e.target.value)}
                  placeholder="Enter your question title"
                      />
                    </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full min-h-[80px]"
                  value={previewDescription}
                  onChange={e => setPreviewDescription(e.target.value)}
                  placeholder="Describe your question..."
                />
                  </div>
              <div>
                <label className="block mb-1 font-medium">Tags (comma separated)</label>
                <input
                  className="input input-bordered w-full"
                  value={tagInput}
                  onChange={e => {
                    setTagInput(e.target.value);
                    setPreviewTags(e.target.value.split(",").map(t => t.trim()).filter(Boolean));
                  }}
                  placeholder="e.g. react, preview, state"
                />
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