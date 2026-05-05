'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

interface LogEntry {
  id: number;
  message: string;
}

const WORM_ICON = '<img src="/ascii/WORM.svg" style="width: 14px; height: 14px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;">';

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const logIdRef = useRef(0);

  const addLog = (message: string, progressPercent?: number) => {
    const id = logIdRef.current++;
    setLogs(prev => {
      const newLogs = [...prev, { id, message }];
      return newLogs.slice(-6); // Keep only last 6 logs
    });
    if (progressPercent !== undefined) {
      setProgress(progressPercent);
    }
  };

  useEffect(() => {
    // Simulate loading sequence
    const loadingSequence = async () => {
      addLog(`${WORM_ICON} Initializing OMNIVOID...`, 10);
      await sleep(400);
      
      addLog(`${WORM_ICON} Loading core systems...`, 20);
      await sleep(500);
      
      addLog(`${WORM_ICON} Initializing audio...`, 35);
      await sleep(400);
      
      addLog(`${WORM_ICON} Audio system ready...`, 45);
      await sleep(300);
      
      addLog(`${WORM_ICON} Loading conundrum content...`, 55);
      await sleep(500);
      
      addLog(`${WORM_ICON} Loading visual elements...`, 70);
      await sleep(400);
      
      addLog(`${WORM_ICON} Setting up responsive controls...`, 85);
      await sleep(300);
      
      addLog(`${WORM_ICON} Welcome to the OMNIVOID LABS Repository`, 100);
      await sleep(1000);
      
      // Fade out
      setIsVisible(false);
      await sleep(800);
      onComplete();
    };

    loadingSequence();
  }, [onComplete]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505]"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12 relative"
          >
            <img
              src="/logo.svg"
              alt="OMNIVOID"
              style={{
                maxWidth: '220px',
                width: '40vw',
                filter: 'brightness(1.5)',
              }}
            />
            <div className="absolute -bottom-4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#99ccff]/50 to-transparent" />
          </motion.div>

          {/* Log Container */}
          <div className="w-[320px] mb-8 font-mono bg-black/40 border border-white/5 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2">System Log</div>
            <div className="space-y-1.5 h-[140px] overflow-hidden flex flex-col justify-end">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#99ccff] text-[11px] leading-relaxed flex items-center"
                  dangerouslySetInnerHTML={{ __html: log.message }}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-[320px]">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] text-[#99ccff]/60 font-mono tracking-tighter">BOOT_SEQUENCE.SYS</span>
              <span className="text-[10px] text-[#99ccff] font-mono">{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#99ccff]/40 to-[#99ccff] rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}