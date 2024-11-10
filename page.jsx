'use client';
import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export default function Content() {
  const [activeTab, setActiveTab] = useState('summarise');
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Spline Background */}
      <Spline
        scene="https://prod.spline.design/xqpS58I5HcBn3sqY/scene.splinecode"
        className="absolute w-full h-full -z-10"
      />

      <div className="flex flex-col h-screen relative z-10">
        {/* Centered Navigation Toggle */}
        <div className="w-full flex justify-center pt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('summarise')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === 'summarise'
                  ? 'bg-[#a3a0ff33] text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Summarise
            </button>
            <button
              onClick={() => setActiveTab('flashcard')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === 'flashcard'
                  ? 'bg-[#a3a0ff33] text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Flashcard
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto mt-8">
          {activeTab === 'summarise' ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="max-w-7xl w-full mx-auto p-6 bg-white/5 backdrop-blur-sm h-full">
                <h3 className="text-2xl font-medium text-white mb-4">Summarise</h3>
                <p className="text-gray-300">
                  Summarise content here...
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <div 
                className="perspective-1000 cursor-pointer w-[600px] h-[400px] mb-8"
                onClick={handleCardFlip}
              >
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}>
                  {/* Front of card */}
                  <div className="absolute w-full h-full backface-hidden bg-white/10 backdrop-blur-md rounded-2xl p-8 flex items-center justify-center border border-white/20">
                    <p className="text-2xl text-white font-medium">What is the capital of France?</p>
                  </div>
                  
                  {/* Back of card */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white/10 backdrop-blur-md rounded-2xl p-8 flex items-center justify-center border border-white/20">
                    <p className="text-2xl text-white font-medium">Paris</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 w-full p-6 bg-white/10 backdrop-blur-md border-t border-white/20">
                <div className="flex justify-center">
                  <div className="w-2/5 flex gap-2.5">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="flex-1 bg-white/10 border-none p-2.5 rounded text-white outline-none placeholder-white/50"
                    />
                    <button className="bg-[#a3a0ff33] hover:bg-[#a3a0ff4d] px-5 py-2.5 rounded text-white transition-colors duration-300">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add these styles to your global CSS file */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </main>
  );
}