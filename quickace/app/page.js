'use client';
import { useState, useEffect } from 'react'
import { NavBar, FileUpload } from '../components';
import { UserAuth } from '../context/AuthContext';
import Spline from '@splinetool/react-spline';

export default function Home() {
  const { user } = UserAuth()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    setLoading(false);
    };
    checkAuthentication();
  }, [user])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 0,}}>
        <Spline
        scene="https://prod.spline.design/xqpS58I5HcBn3sqY/scene.splinecode"
        className="absolute w-full h-full -z-10"
      />
      <NavBar />
      
      {loading ? null : !user ? (
        <div className="absolute bottom-[30px] left-[30px] text-white text-4xl animate-slideUp animate-fadeIn">
          <h1>Welcome to QuickAce.<br />Clutch your exams at the last minute.</h1>
          <div className="flex gap-2.5 mt-4">
            <button className="px-5 py-2.5 rounded-full text-base border-2 border-white text-white bg-transparent hover:bg-white/10 transition-colors duration-300 cursor-pointer">
              Sign up for free
            </button>
          </div>
       </div>
        ) : (
        <div>
          <FileUpload />
        </div>
        )}
    </div>
  )
    }