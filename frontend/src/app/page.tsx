import Editor from "@/components/Editor";
import VisualizationCanvas from "@/components/VisualizationCanvas";
import ExecutionDetails from "@/components/ExecutionDetails";
import AIExplanationPanel from "@/components/AIExplanationPanel";
import TimelineControls from "@/components/TimelineControls";
import ConsolePanel from "@/components/ConsolePanel";
import SplashScreen from "@/components/SplashScreen";
import LanguageSelector from "@/components/LanguageSelector";
import MenuBar from "@/components/MenuBar";
import ThemeSelector from "@/components/ThemeSelector";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main className="flex h-screen flex-col bg-background text-foreground overflow-hidden selection:bg-primary/30 transition-colors duration-300">
      <header className="h-14 border-b border-border bg-header backdrop-blur-md flex items-center px-6 z-50 transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>
        <div className="ml-4 font-mono text-sm tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          PYVISION <span className="opacity-50 font-normal">COMPILER</span>
        </div>
        
        <div className="ml-8 border-l border-border pl-6 h-8 flex items-center">
          <MenuBar />
        </div>

        <div className="ml-auto flex items-center">
          <ThemeSelector />
          <LanguageSelector />
        </div>
      </header>

      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* Editor & Console Panel */}
        <div className="w-[30%] h-full flex flex-col gap-4">
          <div className="h-[70%]">
            <Editor />
          </div>
          <div className="h-[30%]">
            <ConsolePanel />
          </div>
        </div>
        
        {/* Canvas Panel */}
        <div className="w-[45%] h-full">
          <VisualizationCanvas />
        </div>

        {/* Details & AI Panel */}
        <div className="w-[25%] h-full flex flex-col gap-4">
          <div className="h-1/2">
            <ExecutionDetails />
          </div>
          <div className="h-1/2">
            <AIExplanationPanel />
          </div>
        </div>
      </div>

      <TimelineControls />
    </main>
    </>
  );
}
