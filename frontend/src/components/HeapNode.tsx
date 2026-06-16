import { Handle, Position } from '@xyflow/react';
import { useCompilerStore } from '../store/useCompilerStore';
import { motion } from 'framer-motion';

export default function HeapNode({ data }: { data: any }) {
  const isList = data.type === 'list' || data.type === 'tuple' || data.type === 'set';
  const isDict = data.type === 'dict';

  const traceResult = useCompilerStore((state) => state.traceResult);
  const currentStepIndex = useCompilerStore((state) => state.currentStepIndex);

  const prevHeap = currentStepIndex > 0 ? traceResult?.steps[currentStepIndex - 1]?.heap : null;
  const prevData = prevHeap ? prevHeap[data.id] : null;

  const isItemModified = (key: string | number, currentItem: any) => {
    if (!prevData) return true; // Newly created
    if (isList) {
      const prevItem = prevData.value[key as number];
      if (!prevItem) return true;
      return prevItem.value !== currentItem.value || prevItem.ref !== currentItem.ref;
    } else if (isDict) {
      const prevItem = prevData.value[key as string];
      if (!prevItem) return true;
      return prevItem.value !== currentItem.value || prevItem.ref !== currentItem.ref;
    }
    return prevData.value !== currentItem;
  };

  const isSelfModified = !isList && !isDict && (!prevData || prevData.value !== data.value);

  return (
    <motion.div 
      animate={isSelfModified ? { boxShadow: ["0px 0px 0px rgba(34,197,94,0)", "0px 0px 20px rgba(34,197,94,0.8)", "0px 0px 0px rgba(34,197,94,0)"] } : {}}
      transition={{ duration: 1.5, repeat: isSelfModified ? Infinity : 0 }}
      className={`bg-node-bg border ${isSelfModified ? 'border-green-400' : 'border-node-border'} rounded-xl p-3 shadow-2xl backdrop-blur-xl min-w-32 transition-colors`}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-primary border-none !left-[-5px]" />
      <div className="text-[10px] uppercase font-bold text-accent mb-2 opacity-80">
        {data.type} <span className="opacity-50">#{data.id.slice(-4)}</span>
      </div>
      
      {isList ? (
        <div className="flex bg-background/50 rounded-lg overflow-hidden border border-border">
          {data.value.map((item: any, i: number) => {
            const modified = isItemModified(i, item);
            return (
              <motion.div 
                key={i} 
                animate={modified ? { backgroundColor: ["rgba(0,0,0,0)", "rgba(34,197,94,0.3)", "rgba(0,0,0,0)"] } : { backgroundColor: "rgba(0,0,0,0)" }}
                transition={{ duration: 1.5, repeat: modified ? Infinity : 0 }}
                className={`relative px-3 py-2 border-r border-border last:border-r-0 text-xs font-mono text-foreground text-center min-w-10 ${modified ? 'shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10 border-green-400' : ''}`}
              >
                <div className="text-[9px] text-text-muted mb-1">{i}</div>
                {item.ref ? '●' : item.value}
                {item.ref && (
                  <Handle 
                    type="source" 
                    position={Position.Right} 
                    id={`list-${data.id}-${i}`}
                    className="w-2 h-2 bg-primary border-none !right-[-5px]" 
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      ) : isDict ? (
        <div className="flex flex-col bg-background/50 rounded-lg overflow-hidden border border-border">
          {Object.entries(data.value).map(([key, item]: [string, any], i: number) => {
            const modified = isItemModified(key, item);
            return (
              <motion.div 
                key={key} 
                animate={modified ? { backgroundColor: ["rgba(0,0,0,0)", "rgba(34,197,94,0.3)", "rgba(0,0,0,0)"] } : { backgroundColor: "rgba(0,0,0,0)" }}
                transition={{ duration: 1.5, repeat: modified ? Infinity : 0 }}
                className={`relative flex justify-between px-3 py-2 border-b border-border last:border-b-0 text-xs font-mono text-foreground ${modified ? 'shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10 border-green-400' : ''}`}
              >
                <span className="text-text-muted mr-4">{key}:</span>
                <span>{item.ref ? '●' : item.value}</span>
                {item.ref && (
                  <Handle 
                    type="source" 
                    position={Position.Right} 
                    id={`dict-${data.id}-${key}`}
                    className="w-2 h-2 bg-primary border-none !right-[-5px]" 
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm font-mono text-foreground text-center bg-background/50 px-4 py-2 rounded-lg border border-border">
          {data.value}
        </div>
      )}
    </motion.div>
  );
}
