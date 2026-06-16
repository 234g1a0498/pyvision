"use client";

import { useCompilerStore } from "../store/useCompilerStore";
import { Cpu, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIExplanationPanel() {
  const { currentStepIndex, explanations, isExplaining, traceResult } = useCompilerStore();

  const explanation = explanations[currentStepIndex];
  const step = traceResult?.steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col bg-panel border border-border rounded-xl overflow-hidden transition-colors duration-300">
      <div className="h-10 bg-header border-b border-border flex items-center px-4 backdrop-blur-md transition-colors duration-300">
        <Cpu size={14} className="text-primary mr-2 animate-pulse" />
        <span className="text-xs font-mono text-primary font-bold tracking-wider">AI INSIGHT</span>
      </div>
      
      <div className="flex-1 p-4 font-sans text-sm text-foreground overflow-y-auto leading-relaxed transition-colors duration-300">
        {!step ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <Info size={24} className="mb-2 opacity-50" />
            <p className="text-xs text-center px-4">Execute code to see AI explanations for each step.</p>
          </div>
        ) : isExplaining ? (
          <div className="flex items-center space-x-2 text-text-muted">
            <Loader2 size={14} className="animate-spin text-primary" />
            <span className="italic">Generating explanation...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-gray-300 text-sm leading-relaxed"
            >
              <div className="font-mono text-xs text-blue-300 mb-3 pb-2 border-b border-white/10">
                Line {step.line} | Event: {step.event}
              </div>
              <p className="whitespace-pre-wrap">{explanation || "No explanation available."}</p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
