import { useEffect, useRef, useState } from 'react';
import bgMusic from '../assets/background.mp3';

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Optional: autoplay on mount
  useEffect(() => {
    // audioRef.current?.play();
  }, []);

  return (
    <div className="mt-4 flex gap-2 items-center">
      <button
        onClick={toggleMusic}
        className="px-4 py-2 bg-[#8f7a66] text-white rounded-md font-semibold hover:bg-[#9f8a76] transition-colors"
      >
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </button>
      <audio ref={audioRef} loop src={bgMusic}></audio>
    </div>
  );
};

export default MusicPlayer;