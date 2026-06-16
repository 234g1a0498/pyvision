"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompilerStore } from "../store/useCompilerStore";

export default function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { code, setCode, language } = useCompilerStore();

  const handleNewFile = () => {
    setCode("");
    setActiveMenu(null);
  };

  const handleSaveFile = () => {
    const extension = language === 'python' ? 'py' : language === 'javascript' ? 'js' : language;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `main.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActiveMenu(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setActiveMenu(null);
    alert("Code copied to clipboard!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(code);
    setActiveMenu(null);
    
    // Simulate share dialog popup
    const popup = document.createElement("div");
    popup.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
        <div style="background: #111; padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); max-width: 400px; text-align: center; color: white; font-family: monospace;">
          <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #60A5FA;">Link Ready to Share!</h2>
          <p style="color: #9CA3AF; margin-bottom: 1.5rem;">Your code has been copied to your clipboard. You can now share it anywhere.</p>
          <button id="close-share-btn" style="background: #3B82F6; color: white; padding: 0.5rem 2rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: bold;">Awesome</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
    document.getElementById("close-share-btn")?.addEventListener("click", () => {
      document.body.removeChild(popup);
    });
  };

  const menuItems = [
    {
      title: "File",
      options: [
        { label: "New File", onClick: handleNewFile },
        { label: "Save", onClick: handleSaveFile },
        { label: "Download Code", onClick: handleSaveFile },
      ]
    },
    {
      title: "Edit",
      options: [
        { label: "Copy Code", onClick: handleCopy },
        { label: "Clear All", onClick: handleNewFile },
      ]
    },
    {
      title: "Share",
      options: [
        { label: "Share with Friends", onClick: handleShare },
      ]
    }
  ];

  return (
    <div className="flex items-center space-x-1 mr-4" onMouseLeave={() => setActiveMenu(null)}>
      {menuItems.map((menu) => (
        <div key={menu.title} className="relative">
          <button
            onMouseEnter={() => setActiveMenu(menu.title)}
            onClick={() => setActiveMenu(activeMenu === menu.title ? null : menu.title)}
            className={`px-3 py-1.5 text-sm font-mono rounded-md transition-colors ${
              activeMenu === menu.title ? "bg-border text-foreground" : "text-text-muted hover:text-foreground hover:bg-border/50"
            }`}
          >
            {menu.title}
          </button>

          <AnimatePresence>
            {activeMenu === menu.title && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, type: "spring", bounce: 0.5 }}
                className="absolute top-full left-0 mt-1 w-48 bg-panel border border-border rounded-lg shadow-2xl py-1 z-50 backdrop-blur-xl"
              >
                {menu.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={option.onClick}
                    className="w-full text-left px-4 py-2 text-sm font-mono text-text-muted hover:text-foreground hover:bg-primary/20 hover:pl-5 transition-all"
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
