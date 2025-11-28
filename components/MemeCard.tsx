import React, { useRef } from 'react';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { GeneratedMeme } from '../types';

interface MemeCardProps {
  meme: GeneratedMeme;
  onReset: () => void;
}

export const MemeCard: React.FC<MemeCardProps> = ({ meme, onReset }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // Simple download logic for the image component
    // Note: To download the *combined* text and image as a single file, 
    // one would typically use html2canvas. For simplicity/reliability in this environment, 
    // we'll download the generated image and user can screenshot, 
    // or just let them enjoy the view.
    // However, since we are overlaying text with HTML/CSS, the user sees the final meme.
    // A true download feature requires canvas composition which can be complex.
    // We will just provide a link to the image source for now.
    
    const link = document.createElement('a');
    link.href = meme.imageUrl;
    link.download = `meme-${meme.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in-up">
      <div 
        ref={containerRef}
        className="relative group bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800"
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full">
            <img 
              src={meme.imageUrl} 
              alt={meme.content.imagePrompt}
              className="w-full h-full object-cover"
            />
            
            {/* Dark gradient at bottom to ensure text readability if needed, 
                though meme text usually has heavy stroke */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>

            {/* Meme Text Overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                {/* Top Text (Optional or if the joke is split) */}
                <div className="w-full text-center">
                   {/* Sometimes memes are just bottom text, but let's put the main caption at the bottom or top depending on length. 
                       For this implementation, we will place the caption at the bottom or split it.
                       We will put the whole caption at the bottom for consistency with modern image gen memes, 
                       or top/bottom if it contains a colon.
                   */}
                </div>

                {/* Main Caption */}
                <div className="w-full text-center">
                   <h2 className="text-3xl sm:text-4xl md:text-5xl font-meme text-white uppercase leading-tight break-words">
                    {meme.content.caption}
                   </h2>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
            <div className="text-sm text-zinc-400 italic">
                {meme.content.humorExplanation && `AI: "${meme.content.humorExplanation}"`}
            </div>
            <div className="flex gap-2">
                <button 
                  onClick={onReset}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-300 hover:text-white"
                  title="Make another"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleDownload}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-300 hover:text-white"
                  title="Download Image"
                >
                    <Download className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};