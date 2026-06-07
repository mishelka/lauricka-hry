import { useEffect, useRef, useState } from 'react';

export default function AudioTalePlayer({
  taleUrl,
  className = 'btn-secondary',
  playLabel = 'Prehrať rozprávku',
  pauseLabel = 'Pozastaviť rozprávku'
}) {
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
        {isPlaying ? pauseLabel : playLabel}
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
