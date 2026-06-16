"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState<{left: number, top: number, delay: number, duration: number}[]>([]);

  useEffect(() => {
    setParticles([...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2
    })));

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500); 
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3.5, duration: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black opacity-60" />
      
      <motion.div
        initial={{ scale: 0.5, rotateX: 60, opacity: 0 }}
        animate={{ scale: 1, rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
        className="relative z-10"
        style={{ perspective: "1000px" }}
      >
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-200 to-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.8)] pb-4 text-center">
          Welcome to my<br/>PyVisualizer
        </h1>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-16 z-10"
      >
        <p className="text-lg md:text-xl font-mono text-blue-300/80 tracking-[0.2em] uppercase text-center">
          Created by <br className="md:hidden" /><span className="text-white font-bold text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] ml-2">Sai_Balaji_23</span>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full blur-[1px]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              boxShadow: "0 0 20px 8px rgba(59, 130, 246, 0.9), 0 0 40px 15px rgba(147, 197, 253, 0.6)"
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
