import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const WITTY_LOADING_MESSAGES = [
  "Consulting the council of memes...",
  "Trying to be funny (it's hard)...",
  "Stealing jokes from the internet...",
  "Teaching the AI what 'sarcasm' is...",
  "Rendering pixels with pure sass...",
  "Loading... unlike your motivation.",
  "Calculating the optimal cringe factor...",
];

interface LoadingStateProps {
  stage: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ stage }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % WITTY_LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center animate-pulse">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
        <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">
          {stage === 'GENERATING_JOKE' ? "Cooking up a roast..." : "Painting the masterpiece..."}
        </h3>
        <p className="text-zinc-400 italic max-w-md mx-auto h-6 transition-all duration-300">
          "{WITTY_LOADING_MESSAGES[messageIndex]}"
        </p>
      </div>
    </div>
  );
};