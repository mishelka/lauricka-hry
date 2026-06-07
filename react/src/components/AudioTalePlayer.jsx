import { useEffect, useRef, useState } from 'react';

export default function AudioTalePlayer({ taleUrl, className = 'btn-secondary' }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !taleUrl) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  }

  if (!taleUrl) return null;

  return (
    <>
      <button className={className} onClick={togglePlayback}>
        {isPlaying ? 'Pozastaviť rozprávku' : 'Prehrať rozprávku'}
      </button>
      <audio
        ref={audioRef}
        src={taleUrl}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </>
  );
}
