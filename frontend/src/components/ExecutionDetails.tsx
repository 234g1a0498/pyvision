"use client";

import { useCompilerStore } from "../store/useCompilerStore";
import { motion, AnimatePresence } from "framer-motion";

export default function ExecutionDetails() {
  const traceResult = useCompilerStore((state) => state.traceResult);
  const currentStepIndex = useCompilerStore((state) => state.currentStepIndex);

  const step = traceResult?.steps[currentStepIndex];

  return (
    <div className="w-full h-full border border-border rounded-xl overflow-hidden bg-panel flex flex-col transition-colors duration-300">
      <div className="w-full h-10 bg-header border-b border-border flex items-center px-4 backdrop-blur-md transition-colors duration-300">
        <span className="text-xs font-mono text-text-muted font-bold tracking-wider">CALL STACK</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {!step && <div className="text-text-muted text-xs italic">No active execution.</div>}
        
        <AnimatePresence>
          {step?.frames.map((frame, i) => (
            <motion.div 
              key={frame.name + i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-6"
            >
              <h3 className="text-xs font-semibold text-primary mb-2 font-mono">
                Frame: {frame.name} <span className="text-text-muted">(Line: {frame.line})</span>
              </h3>
              <div className="bg-background/50 rounded-lg border border-border p-3 transition-colors duration-300">
                {frame.locals.length === 0 ? (
                  <span className="text-text-muted text-xs italic">No locals</span>
                ) : (
                  <ul className="space-y-2">
                    {frame.locals.map((v) => (
                      <li key={v.name} className="flex justify-between items-center text-xs font-mono">
                        <span className="text-accent">{v.name}</span>
                        <span className="text-foreground break-all ml-4">{v.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
