import { useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { GameToolbar } from './GameLayout';
import { COMPLETION_SOUNDS, INCORRECT_SOUNDS, getSoundPreferences, previewCorrect, previewFeedback, setSoundPreferences, subscribeSoundPreferences } from '../utils/learningSounds';
import './SoundPreview.css';

export default function SoundPreview() {
  const settings = useSyncExternalStore(subscribeSoundPreferences, getSoundPreferences);
  return <div className="sound-preview">
    <GameToolbar title="Výber zvukov" />
    <p>Ukážku si vypočuješ kliknutím na Prehrať. Výber sa uloží iba v tomto prehliadači. Ukážky možno prehrať aj pri vypnutom zvuku hier.</p>
    <section className="sound-preview-section">
      <h2>Správna odpoveď</h2>
      <p>Rovnaký zvuk ako úspešný výstup dlaždice v Block Out.</p>
      <button type="button" className="sound-preview-play" onClick={previewCorrect}>▶ Prehrať správnu odpoveď</button>
    </section>
    {[
      { category: 'incorrect', title: 'Nesprávna odpoveď', options: INCORRECT_SOUNDS },
      { category: 'complete', title: 'Dokončenie levelu', options: COMPLETION_SOUNDS }
    ].map(({ category, title, options }) => <section className="sound-preview-section" key={category}>
      <h2>{title}</h2>
      <div className="sound-preview-options">
        {options.map((option, index) => <article className="sound-preview-option" key={option.id}>
          <h3>{index + 1}. {option.name}</h3>
          <p>{option.description}</p>
          <button type="button" className="sound-preview-play" aria-label={`Prehrať: ${option.name}`} onClick={() => previewFeedback(category, option.id)}>▶ Prehrať</button>
          <button type="button" className="sound-preview-select" aria-pressed={settings[category] === option.id} onClick={() => setSoundPreferences({ [category]: option.id })}>{settings[category] === option.id ? '✓ Vybrané' : 'Použiť tento zvuk'}</button>
        </article>)}
      </div>
      <button type="button" className="sound-preview-clear" onClick={() => setSoundPreferences({ [category]: null })}>Zatiaľ bez zvuku</button>
    </section>)}
    <p>Všetky herné zvuky vypneš alebo zapneš tlačidlom reproduktora vedľa profilu hráča.</p>
    <Link to="/">Späť na hlavné menu</Link>
  </div>;
}
