import { create } from 'zustand';

export interface VariableModel {
  name: string;
  type: string;
  value: string;
  ref_id?: string;
}

export interface FrameModel {
  name: string;
  line: number;
  locals: VariableModel[];
}

export interface HeapObjectModel {
  id: string;
  type: string;
  value: any;
}

export interface TraceStepModel {
  step_num: number;
  line: number;
  event: string;
  stdout: string;
  frames: FrameModel[];
  heap: Record<string, HeapObjectModel>;
}

export interface TraceResultModel {
  status: string;
  error_message?: string;
  steps: TraceStepModel[];
}

interface CompilerState {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  
  isExecuting: boolean;
  traceResult: TraceResultModel | null;
  setTraceResult: (result: TraceResultModel | null) => void;
  executeCode: () => Promise<void>;
  
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  explanations: Record<number, string>;
  isExplaining: boolean;
  explainCurrentStep: () => Promise<void>;

  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const useCompilerStore = create<CompilerState>((set, get) => ({
  code: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\narr = [64, 34, 25, 12, 22, 11, 90]\nbubble_sort(arr)',
  setCode: (code) => set({ code }),
  language: 'python',
  setLanguage: (language) => set({ language }),
  
  isExecuting: false,
  traceResult: null,
  setTraceResult: (traceResult) => set({ traceResult }),
  currentStepIndex: 0,
  
  explanations: {},
  isExplaining: false,
  
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  playbackSpeed: 1,

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  executeCode: async () => {
    set({ isExecuting: true, traceResult: null, currentStepIndex: 0, explanations: {}, isPlaying: false });
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: get().code }),
      });
      
      const data = await response.json();
      set({ traceResult: data, isExecuting: false });
      get().explainCurrentStep();
    } catch (error) {
      console.error("Execution failed", error);
      set({ isExecuting: false });
    }
  },
  
  explainCurrentStep: async () => {
    const { code, traceResult, currentStepIndex, explanations } = get();
    if (!traceResult || !traceResult.steps[currentStepIndex]) return;
    
    // Don't refetch if we already have it
    if (explanations[currentStepIndex]) return;

    set({ isExplaining: true });
    try {
      const stepData = traceResult.steps[currentStepIndex];
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, step_data: stepData }),
      });
      const data = await response.json();
      set((state) => ({
        explanations: { ...state.explanations, [currentStepIndex]: data.explanation },
        isExplaining: false
      }));
    } catch (error) {
      console.error("Explanation failed", error);
      set({ isExplaining: false });
    }
  },

  setCurrentStepIndex: (index) => {
    set({ currentStepIndex: index });
    get().explainCurrentStep();
  },
  
  nextStep: () => {
    const { currentStepIndex, traceResult } = get();
    if (traceResult && currentStepIndex < traceResult.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
      get().explainCurrentStep();
    }
  },
  
  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
      get().explainCurrentStep();
    }
  }
}));
