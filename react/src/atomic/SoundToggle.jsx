import { useSyncExternalStore } from 'react';
import { SoundOffIcon, SoundOnIcon } from './Icons';
import { getSoundPreferences, setSoundPreferences, subscribeSoundPreferences } from '../utils/learningSounds';

export default function SoundToggle() {
  const { muted } = useSyncExternalStore(subscribeSoundPreferences, getSoundPreferences);
  return <button type="button" className="header-sound" aria-label={muted ? 'Zapnúť zvuk' : 'Vypnúť zvuk'} title={muted ? 'Zapnúť zvuk' : 'Vypnúť zvuk'} aria-pressed={!muted} onClick={() => setSoundPreferences({ muted: !muted })}>
    {muted ? <SoundOffIcon /> : <SoundOnIcon />}
  </button>;
}
