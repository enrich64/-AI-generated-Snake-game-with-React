import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "CYBER_DIRGE_01.WAV",
    url: "https://actions.google.com/sounds/v1/science_fiction/cybernetic_rhythm.ogg"
  },
  {
    id: 2,
    title: "GLITCH_CORE_02.WAV",
    url: "https://actions.google.com/sounds/v1/science_fiction/pulsing_sci_fi_drone.ogg"
  },
  {
    id: 3,
    title: "VOID_ECHO_03.WAV",
    url: "https://actions.google.com/sounds/v1/science_fiction/space_engine_low.ogg"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md mx-auto terminal-box-magenta p-4 md:p-6 relative overflow-hidden">
      {/* Decorative glitch background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/10 blur-2xl rounded-full animate-pulse"></div>

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex justify-between items-center border-b-2 border-magenta pb-2">
          <span className="text-sm text-cyan tracking-widest font-bold">AUDIO_SYS_V2</span>
          <span className={`text-xs px-2 py-1 ${isPlaying ? 'bg-magenta text-void animate-pulse' : 'bg-cyan/20 text-cyan'}`}>
            {isPlaying ? 'TRANSMITTING' : 'STANDBY'}
          </span>
        </div>

        <div className="text-center my-2 bg-void p-4 border border-cyan/30">
          <h3 className="text-2xl text-cyan glitch-text truncate" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-sm text-magenta mt-2 tracking-widest">STREAM_ID: 0x0{currentTrack.id}A</p>
          
          {/* Fake Visualizer */}
          <div className="flex items-end justify-center gap-1 h-12 mt-4">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 ${isPlaying ? 'bg-cyan animate-pulse' : 'bg-cyan/20'}`} 
                style={{ 
                  height: isPlaying ? `${Math.random() * 100}%` : '10%', 
                  animationDuration: `${0.1 + Math.random() * 0.3}s` 
                }} 
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 my-2">
          <button onClick={prevTrack} className="text-cyan hover:text-magenta transition-colors cursor-pointer">
            <SkipBack size={32} />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-cyan text-void hover:bg-magenta transition-all shadow-[4px_4px_0px_#FF00FF] hover:shadow-[4px_4px_0px_#00FFFF] cursor-pointer"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </button>
          <button onClick={nextTrack} className="text-cyan hover:text-magenta transition-colors cursor-pointer">
            <SkipForward size={32} />
          </button>
        </div>

        <div className="flex items-center gap-4 mt-2 border-t border-magenta/30 pt-4">
          <Volume2 size={20} className="text-magenta" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-void border border-cyan appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-magenta"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
}
