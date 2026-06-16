"use client";

import { useCompilerStore } from "../store/useCompilerStore";

export default function LanguageSelector() {
  const language = useCompilerStore((state) => state.language);
  const setLanguage = useCompilerStore((state) => state.setLanguage);

  return (
    <div className="flex items-center bg-panel border border-border rounded-md px-2 py-1.5 mr-4 transition-colors hover:bg-border/50">
      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent text-xs text-text-muted font-mono outline-none cursor-pointer appearance-none uppercase tracking-wider font-bold"
      >
        <option value="python" className="bg-background text-foreground">Python 3</option>
        <option value="c" className="bg-background text-foreground">C</option>
        <option value="cpp" className="bg-background text-foreground">C++</option>
        <option value="java" className="bg-background text-foreground">Java</option>
        <option value="javascript" className="bg-background text-foreground">JavaScript</option>
      </select>
      <div className="pointer-events-none ml-2 text-text-muted">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}
