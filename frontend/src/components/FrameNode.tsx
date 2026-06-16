import { Handle, Position } from '@xyflow/react';
import { useCompilerStore } from '../store/useCompilerStore';
import { motion } from 'framer-motion';

export default function FrameNode({ data }: { data: any }) {
  const traceResult = useCompilerStore((state) => state.traceResult);
  const currentStepIndex = useCompilerStore((state) => state.currentStepIndex);

  const prevFrames = currentStepIndex > 0 ? traceResult?.steps[currentStepIndex - 1]?.frames : null;
  const prevData = prevFrames?.find((f) => f.name === data.name);

  const isLocModified = (loc: any) => {
    if (!prevData) return true;
    const prevLoc = prevData.locals.find((l: any) => l.name === loc.name);
    if (!prevLoc) return true;
    return prevLoc.value !== loc.value || prevLoc.ref_id !== loc.ref_id;
  };

  return (
    <div className="bg-node-bg border border-node-border rounded-xl p-4 shadow-2xl backdrop-blur-xl min-w-48 transition-colors">
      <div className="text-xs uppercase font-bold text-accent mb-4 border-b border-border pb-2">
        {data.name} <span className="opacity-50 font-normal">Frame</span>
      </div>
      
      <div className="flex flex-col space-y-2">
        {data.locals.map((loc: any, i: number) => {
          const modified = isLocModified(loc);
          return (
            <motion.div 
              key={i} 
              animate={modified ? { backgroundColor: ["rgba(0,0,0,0)", "rgba(34,197,94,0.3)", "rgba(0,0,0,0)"] } : { backgroundColor: "rgba(0,0,0,0)" }}
              transition={{ duration: 1.5, repeat: modified ? Infinity : 0 }}
              className={`relative flex justify-between items-center px-3 py-2 rounded-md border border-border bg-background/30 ${modified ? 'shadow-[0_0_15px_rgba(34,197,94,0.3)] border-green-400/50' : ''}`}
            >
              <span className="text-text-muted font-mono text-xs">{loc.name}</span>
              <span className="text-foreground font-mono text-xs ml-4">
                {loc.ref_id ? '●' : loc.value}
              </span>
              
              {loc.ref_id && (
                <Handle 
                  type="source" 
                  position={Position.Right} 
                  id={loc.name}
                  className="w-2 h-2 bg-accent border-none !right-[-12px]" 
                />
              )}
            </motion.div>
          );
        })}
        {data.locals.length === 0 && (
          <div className="text-text-muted text-xs text-center italic">No local variables</div>
        )}
      </div>
    </div>
  );
}
