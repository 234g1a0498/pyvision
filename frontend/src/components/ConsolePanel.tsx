"use client";

import { useCompilerStore } from "../store/useCompilerStore";
import { Terminal } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ConsolePanel() {
  const traceResult = useCompilerStore((state) => state.traceResult);
  const currentStepIndex = useCompilerStore((state) => state.currentStepIndex);

  const currentStep = traceResult?.steps[currentStepIndex];
  const output = currentStep ? currentStep.stdout : "";

  return (
    <div className="w-full h-full flex flex-col bg-panel border border-border rounded-xl overflow-hidden transition-colors duration-300">
      <div className="h-10 bg-header border-b border-border flex items-center px-4 backdrop-blur-md transition-colors duration-300">
        <Terminal size={14} className="text-text-muted mr-2" />
        <span className="text-xs font-mono text-text-muted font-bold tracking-wider">OUTPUT</span>
      </div>
      <div className="flex-1 p-4 font-mono text-sm text-foreground overflow-y-auto whitespace-pre-wrap transition-colors duration-300">
        {output || <span className="text-text-muted/50 italic">No output yet...</span>}
      </div>
    </div>
  );
}
