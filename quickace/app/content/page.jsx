'use client';
import axios from 'axios';
import Spline from '@splinetool/react-spline';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { UserAuth } from '../../context/AuthContext';


export default function Content() {
  const [activeTab, setActiveTab] = useState('summarise');
  const [isFlipped, setIsFlipped] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const { user } = UserAuth()

  useEffect(() => {
    // Retrieve the data from sessionStorage
    const storedData = sessionStorage.getItem('uploadedFileData');
    
    if (storedData) {
        setFileData(JSON.parse(storedData).outline);
        // Optional: Clear the data from storage
        // sessionStorage.removeItem('uploadedFileData');
        if (activeTab === 'flashcard') {
          axios.post('https://learnbetter-hack.onrender.com/api/generate', {
            text: JSON.parse(storedData).fullText
          })
          .then(response => {
            console.log(JSON.parse(response.data));
            setFlashcards(JSON.parse(response.data).flashcards);
            console.log(flashcards.flashcards);
          })
          .catch(error => {
            console.error('Error fetching flashcards:', error);
          });
        }
    } else {
        // If no data is found, redirect back to home
        router.push('/');
    }
  }, [activeTab]);
  

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = async () => {
    const userAnswer = document.querySelector('input[placeholder="Enter your answer"]').value;
    const currentQuestion = flashcards[currentCardIndex].front;

    try {
      const response = await fetch('https://learnbetter-hack.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer: userAnswer,
          user_id: user.uid,
        })
      });

      const feedback = await response.json();
      // Display feedback in UI (you'll need to add a feedback display element)
      setFeedback(feedback.message);
    } catch (error) {
      console.error('Error getting feedback:', error);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setFeedback('');
      document.querySelector('input[placeholder="Enter your answer"]').value = '';
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setFeedback('');
      document.querySelector('input[placeholder="Enter your answer"]').value = '';
    }
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
        <div className="flex-1 overflow-y-auto mt-8 mx-7">
          {activeTab === 'summarise' ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="max-w-7xl w-full mx-auto p-6 bg-white/5 backdrop-blur-sm h-full">
                <div className="text-gray-300 w-full overflow-x-auto mt-3">
                <div className="">
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children, node }) => {
                          // Check if parent is already a p tag
                          if (node?.parent?.tagName === 'p') {
                            return <>{children}</>;
                          }
                          return <p className="mb-4">{children}</p>;
                        },
                        // Style headers
                        h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
                        
                        // Style code blocks
                        code: ({ node, inline, children }) => 
                          inline ? (
                            <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>
                          ) : (
                            <div className="bg-transparent rounded p-4 overflow-x-auto">
                              <code>{children}</code>
                            </div>
                          ),
                        
                        // Style lists
                        ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                        
                        // Style links
                        a: ({ href, children }) => (
                          <a href={href} className="text-blue-600 hover:underline">
                            {children}
                          </a>
                        ),
                        
                        // Style paragraphs
                        p: ({ children }) => <p className="mb-4">{children}</p>,
                      }}
                    >
                      {Array.isArray(fileData) ? fileData[0]: typeof fileData === 'string'? fileData: fileData?.content || ''}
                    </ReactMarkdown>
                  </div>
                </div>
                </div>
              </div>
            </div>
          ) : (
            flashcards?.length > 0 && (
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
                      <p className="text-2xl text-white font-medium">
                        {flashcards[currentCardIndex].front}
                      </p>
                    </div>
                    
                    {/* Back of card */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white/10 backdrop-blur-md rounded-2xl p-8 flex items-center justify-center border border-white/20">
                      <p className="text-2xl text-white font-medium">
                        {flashcards[currentCardIndex].back}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2  w-[800px]">
                  <input 
                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl text-white outline-none placeholder-white/50"
                    placeholder="Enter your answer"
                  />
                  <button 
                    className="bg-[#a3a0ff33] hover:bg-[#a3a0ff4d] px-5 py-2.5 rounded-2xl text-white transition-colors duration-300"
                    onClick={() => handleAnswer()}
                  >
                    Submit
                  </button>
                  {feedback && (
                    <div className="mt-2 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white">
                      {feedback}
                    </div>
                  )}
                </div>
                
                {/* Add navigation buttons */}
                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={prevCard}
                    disabled={currentCardIndex === 0}
                    className="bg-[#a3a0ff33] hover:bg-[#a3a0ff4d] px-5 py-2.5 rounded text-white transition-colors duration-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-white">
                    {currentCardIndex + 1} / {flashcards.length}
                  </span>
                  <button 
                    onClick={nextCard}
                    disabled={currentCardIndex === flashcards.length - 1}
                    className="bg-[#a3a0ff33] hover:bg-[#a3a0ff4d] px-5 py-2.5 rounded text-white transition-colors duration-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )
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