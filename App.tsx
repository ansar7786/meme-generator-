import React, { useState } from 'react';
import { SendHorizontal, Sparkles, AlertCircle, Bot, RefreshCw } from 'lucide-react';
import { generateMemeText, generateMemeImage } from './services/geminiService';
import { GeneratedMeme, LoadingStage } from './types';
import { LoadingState } from './components/LoadingState';
import { MemeCard } from './components/MemeCard';

export default function App() {
  const [input, setInput] = useState('');
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(LoadingStage.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [currentMeme, setCurrentMeme] = useState<GeneratedMeme | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(null);
    setCurrentMeme(null);
    setLoadingStage(LoadingStage.GENERATING_JOKE);

    try {
      // 1. Generate Text
      const textData = await generateMemeText(input);
      
      setLoadingStage(LoadingStage.GENERATING_IMAGE);
      
      // 2. Generate Image
      const imageBase64 = await generateMemeImage(textData.imagePrompt);

      // 3. Complete
      const newMeme: GeneratedMeme = {
        id: Date.now().toString(),
        content: textData,
        imageUrl: imageBase64,
        timestamp: Date.now()
      };

      setCurrentMeme(newMeme);
      setLoadingStage(LoadingStage.COMPLETE);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Even I'm confused.");
      setLoadingStage(LoadingStage.ERROR);
    }
  };

  const handleReset = () => {
    setCurrentMeme(null);
    setInput('');
    setLoadingStage(LoadingStage.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Meme<span className="text-indigo-500">Lord</span> AI</h1>
          </div>
          <a 
            href="#"
            className="text-xs font-medium px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full hover:bg-zinc-800 transition-colors"
          >
            Powered by Gemini
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center min-h-[calc(100vh-4rem)]">
        
        {/* Intro Section (Hidden if we have a meme) */}
        {!currentMeme && loadingStage === LoadingStage.IDLE && (
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 pb-2">
              Roast Your Reality
            </h2>
            <p className="text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed">
              Tell me what happened today, and I'll turn your pain into a meme. 
              The more tragic, the better.
            </p>
          </div>
        )}

        {/* Input Form */}
        {!currentMeme && loadingStage !== LoadingStage.GENERATING_JOKE && loadingStage !== LoadingStage.GENERATING_IMAGE && (
          <form onSubmit={handleSubmit} className="w-full max-w-xl relative group z-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <div className="relative flex items-center bg-zinc-900 rounded-xl p-2 shadow-2xl border border-zinc-800 focus-within:border-indigo-500/50 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Tried to fix a bug, created 10 more..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 px-4 py-3 text-lg"
                disabled={loadingStage === LoadingStage.GENERATING_JOKE || loadingStage === LoadingStage.GENERATING_IMAGE}
              />
              <button
                type="submit"
                disabled={!input.trim() || loadingStage !== LoadingStage.IDLE && loadingStage !== LoadingStage.ERROR}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {loadingStage === LoadingStage.ERROR ? <RefreshCw className="w-5 h-5"/> : <Sparkles className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Monday Morning', 'Javascript', 'My Bank Account', 'Dating Apps'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-full hover:border-indigo-500/50 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </form>
        )}

        {/* Error Message */}
        {error && loadingStage === LoadingStage.ERROR && (
          <div className="mt-8 p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-red-200 flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {(loadingStage === LoadingStage.GENERATING_JOKE || loadingStage === LoadingStage.GENERATING_IMAGE) && (
          <div className="mt-12">
            <LoadingState stage={loadingStage} />
          </div>
        )}

        {/* Result */}
        {currentMeme && loadingStage === LoadingStage.COMPLETE && (
          <div className="mt-8 w-full flex flex-col items-center">
            <MemeCard meme={currentMeme} onReset={handleReset} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-sm">
        <p>© {new Date().getFullYear()} MemeLord AI. Not responsible for hurt feelings.</p>
      </footer>
    </div>
  );
}