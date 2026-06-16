"use client";

import { useCompilerStore } from "../store/useCompilerStore";
import { Play, Square, StepForward, StepBack, Pause, PlayCircle } from "lucide-react";
import { useEffect } from "react";

export default function TimelineControls() {
  const { 
    isExecuting, 
    executeCode, 
    traceResult, 
    currentStepIndex, 
    nextStep, 
    prevStep,
    isPlaying,
    togglePlay,
    playbackSpeed,
    setPlaybackSpeed,
    setCurrentStepIndex,
    setTraceResult,
    language
  } = useCompilerStore();

  const totalSteps = traceResult?.steps.length || 0;

  const handleRun = async () => {
    if (language !== 'python') {
      setTraceResult({
        status: "error",
        error_message: `Visualizer Error: Tracing is currently only supported for Python. You can still use the editor to write ${language.toUpperCase()} code, but the visualizer engine requires Python.`,
        steps: []
      });
      setCurrentStepIndex(0);
      return;
    }

    await executeCode();
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= totalSteps - 1) {
      if (isPlaying) togglePlay();
      return;
    }
    const interval = setInterval(() => {
      nextStep();
    }, 1500 / playbackSpeed); 
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentStepIndex, totalSteps, nextStep, togglePlay]);

  return (
    <div className="w-full h-16 bg-header border-t border-border backdrop-blur-xl flex items-center justify-between px-6 z-50 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleRun}
          disabled={isExecuting}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/80 text-white disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(var(--primary),0.5)]"
          title="Compile & Run"
        >
          {isExecuting ? <Square size={16} fill="currentColor" /> : <PlayCircle size={18} />}
        </button>
        
        <div className="h-6 w-px bg-border mx-2 transition-colors duration-300" />
        
        <button 
          onClick={prevStep}
          disabled={!traceResult || currentStepIndex === 0}
          className="p-2 text-text-muted hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <StepBack size={18} />
        </button>

        <button 
          onClick={togglePlay}
          disabled={!traceResult || currentStepIndex >= totalSteps - 1}
          className="p-2 text-text-muted hover:text-foreground disabled:opacity-30 transition-colors"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        
        <button 
          onClick={nextStep}
          disabled={!traceResult || currentStepIndex >= totalSteps - 1}
          className="p-2 text-text-muted hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <StepForward size={18} />
        </button>

        <select 
          value={playbackSpeed} 
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          className="ml-2 bg-panel border border-border text-xs text-foreground rounded px-2 py-1 outline-none transition-colors duration-300"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={3}>3x</option>
        </select>
      </div>

      <div className="flex-1 px-8">
        <div className="w-full bg-border h-2 rounded-full relative overflow-hidden transition-colors duration-300">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: totalSteps > 0 ? `${(currentStepIndex / (totalSteps - 1)) * 100}%` : '0%' }}
          />
        </div>
      </div>

      <div className="text-xs font-mono text-text-muted transition-colors duration-300">
        Step {traceResult ? currentStepIndex + 1 : 0} / {totalSteps}
      </div>
    </div>
  );
}
