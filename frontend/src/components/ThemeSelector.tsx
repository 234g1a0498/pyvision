"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-24 h-8 bg-panel animate-pulse rounded-md mr-4"></div>;
  }

  return (
    <div className="flex items-center bg-panel border border-border rounded-md px-2 py-1.5 mr-4 transition-colors hover:bg-border/50">
      <select 
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-transparent text-xs text-text-muted font-mono outline-none cursor-pointer appearance-none uppercase tracking-wider font-bold"
      >
        <option value="dark" className="bg-background text-foreground">Dark</option>
        <option value="light" className="bg-background text-foreground">Light</option>
        <option value="cyberpunk" className="bg-background text-foreground">Cyberpunk</option>
        <option value="ocean" className="bg-background text-foreground">Ocean Glass</option>
        <option value="synthwave" className="bg-background text-foreground">Synthwave</option>
        <option value="matrix" className="bg-background text-foreground">Matrix</option>
      </select>
      <div className="pointer-events-none ml-2 text-text-muted">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}
