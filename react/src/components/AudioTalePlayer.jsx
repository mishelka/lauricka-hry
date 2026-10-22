import { useEffect, useRef, useState } from 'react';
import { HeadphonesIcon, PauseIcon } from './Icons';

export default function AudioTalePlayer({
  taleUrl,
  className = 'btn-secondary',
  playLabel = null,
  pauseLabel = null,
  title = null
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
      <button
        type="button"
        className={className}
        onClick={togglePlayback}
        title={title ?? (isPlaying ? 'Pozastaviť rozprávku' : 'Prehrať rozprávku')}
      >
        {isPlaying ? (
          pauseLabel ?? (
            <>
              <PauseIcon />
              <span>Pozastaviť rozprávku</span>
            </>
          )
        ) : (
          playLabel ?? (
            <>
              <HeadphonesIcon />
              <span>Prehrať rozprávku</span>
            </>
          )
        )}
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
