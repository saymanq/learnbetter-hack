'use client';
import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { NavBar } from '../components';
import { UserAuth } from '../context/AuthContext';

export default function Page() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  useEffect(() => {
    if (!loading && user) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Transparent Navbar */}
      <nav className="absolute top-5 left-1/2 -translate-x-1/2 flex justify-between items-center w-[90%] bg-transparent">
        <NavBar />
      </nav>

      {/* Spline Background */}
      <Spline
        scene="https://prod.spline.design/xqpS58I5HcBn3sqY/scene.splinecode"
        className="absolute w-full h-full -z-10"
      />

      {/* Authentication Check and Input Area */}
      {!loading && user && (
        <>
          {showWelcome && (
            <div className="absolute w-full h-full flex justify-center items-center animate-fadeInOut">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h1 className="text-black text-lg">Welcome back, {user.displayName}!</h1>
                <p className="text-gray-600">You're now logged in and can access your content.</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center px-5">
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2.5">
              <div className="flex gap-2.5">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-white/10 border-none p-2.5 rounded text-white outline-none placeholder-white/50"
                />
                <button className="bg-[#a3a0ff33] hover:bg-[#a3a0ff4d] w-10 h-10 rounded flex items-center justify-center text-white transition-colors duration-300 text-2xl font-bold">
                  +
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Animated Text in Bottom Left - Only shown when not logged in */}
      {!user && (
        <div className="absolute bottom-[30px] left-[30px] text-white text-4xl animate-fadeIn">
          <h1>Welcome to QuickAce.<br />Clutch your exams at the last minute.</h1>
          <div className="flex gap-2.5 mt-4">
            <button className="px-5 py-2.5 rounded-full text-base border-2 border-white text-white bg-transparent hover:bg-white/10 transition-colors duration-300 cursor-pointer">
              Sign up for free
            </button>
          </div>
        </div>
      )}
    </div>
  );
}