/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  useEffect(() => {
    const logs = [
      "INIT_SYS_BOOT...",
      "LOADING KERNEL 0x00F4A2...",
      "MOUNTING VIRTUAL_DRIVES...",
      "BYPASSING SECURITY PROTOCOLS...",
      "ESTABLISHING NEURAL LINK...",
      "WARNING: UNAUTHORIZED ACCESS DETECTED",
      "OVERRIDING...",
      "WELCOME, USER_9948."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setBootLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 800);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen bg-void text-cyan font-mono p-8 flex flex-col justify-end relative">
        <div className="scanlines"></div>
        <div className="crt-flicker"></div>
        <div className="bg-noise"></div>
        <div className="z-10 flex flex-col gap-2 text-xl md:text-2xl">
          {bootLogs.map((log, idx) => (
            <div key={idx} className={idx === bootLogs.length - 1 ? "text-magenta glitch-text" : "text-cyan"}>
              &gt; {log}
            </div>
          ))}
          <div className="animate-pulse">&gt; _</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-cyan font-mono p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Global CRT Effects */}
      <div className="scanlines"></div>
      <div className="crt-flicker"></div>
      <div className="bg-noise"></div>

      <header className="mb-8 text-center z-10 w-full flex justify-between items-start border-b-4 border-magenta pb-4">
        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-bold glitch-text tracking-tighter" data-text="NEURO_SNAKE">
            NEURO_SNAKE
          </h1>
          <p className="text-magenta mt-1 tracking-widest text-xs md:text-sm">
            v.2.0.26 // CYBERNETIC_ENTERTAINMENT_MODULE
          </p>
        </div>
        <div className="text-right text-xs md:text-sm text-cyan/70 hidden md:block">
          <p>SYS_TIME: {new Date().toISOString()}</p>
          <p>MEM_ALLOC: 0x4F2A</p>
          <p className="text-magenta animate-pulse">STATUS: UNSTABLE</p>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-start">
        <div className="lg:col-span-8 flex justify-center w-full">
          <SnakeGame />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-8 h-full w-full">
          <MusicPlayer />
          
          <div className="terminal-box p-4 text-xs md:text-sm text-cyan/80 hidden lg:block">
            <p className="mb-2 text-magenta font-bold border-b border-magenta pb-1">&gt; ACTIVE_PROCESSES:</p>
            <div className="flex justify-between"><span>PID_001</span><span>[SNAKE.EXE]</span><span className="text-magenta">RUNNING</span></div>
            <div className="flex justify-between"><span>PID_002</span><span>[AUDIO_SYS]</span><span className="text-cyan">ACTIVE</span></div>
            <div className="flex justify-between"><span>PID_003</span><span>[NEURAL_NET]</span><span className="animate-pulse text-magenta">SYNCING...</span></div>
            
            <div className="mt-4 pt-4 border-t border-cyan/30">
              <p className="text-magenta">&gt; WARNING: GLITCH DETECTED IN SECTOR 7</p>
              <p className="text-cyan">&gt; ATTEMPTING CONTAINMENT...</p>
              <p className="text-magenta animate-pulse">&gt; CONTAINMENT FAILED.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
