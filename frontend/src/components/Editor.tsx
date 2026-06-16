"use client";

import MonacoEditor from "@monaco-editor/react";
import { useCompilerStore } from "../store/useCompilerStore";
import { useRef, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Editor() {
  const code = useCompilerStore((state) => state.code);
  const setCode = useCompilerStore((state) => state.setCode);
  const language = useCompilerStore((state) => state.language);
  const traceResult = useCompilerStore((state) => state.traceResult);
  const currentStepIndex = useCompilerStore((state) => state.currentStepIndex);
  
  const { theme } = useTheme();

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const currentStep = traceResult?.steps[currentStepIndex];
  const currentLine = currentStep ? currentStep.line : null;
  const prevLine = currentStepIndex > 0 ? traceResult?.steps[currentStepIndex - 1]?.line : null;
  const nextLine = currentStepIndex < (traceResult?.steps.length || 0) - 1 ? traceResult?.steps[currentStepIndex + 1]?.line : null;

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !traceResult) return;
    
    const monaco = monacoRef.current;
    const newDecorations: any[] = [];
    
    if (currentLine && currentLine > 0) {
      newDecorations.push({
        range: new monaco.Range(currentLine, 1, currentLine, 1),
        options: {
          isWholeLine: true,
          className: 'bg-green-500/20 border-y border-green-500/50',
          glyphMarginClassName: 'margin-arrow-current',
        }
      });
    }

    if (prevLine && prevLine > 0 && prevLine !== currentLine) {
      newDecorations.push({
        range: new monaco.Range(prevLine, 1, prevLine, 1),
        options: {
          glyphMarginClassName: 'margin-arrow-prev',
        }
      });
    }

    if (nextLine && nextLine > 0 && nextLine !== currentLine && nextLine !== prevLine) {
      newDecorations.push({
        range: new monaco.Range(nextLine, 1, nextLine, 1),
        options: {
          glyphMarginClassName: 'margin-arrow-next',
        }
      });
    }

    decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, newDecorations);
  }, [currentLine, prevLine, nextLine, traceResult]);

  return (
    <div className="w-full h-full relative border border-border rounded-xl overflow-hidden bg-panel transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-10 bg-header border-b border-border flex items-center px-4 backdrop-blur-md z-10 transition-colors duration-300">
        <span className="text-xs font-mono text-text-muted">main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}</span>
      </div>
      <div className="pt-10 w-full h-full">
        <MonacoEditor
          language={language}
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          value={code}
          onChange={(val) => setCode(val || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: { top: 16 },
            lineHeight: 24,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            glyphMargin: true,
          }}
        />
      </div>
    </div>
  );
}
