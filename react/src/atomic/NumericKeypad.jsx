import { useEffect } from 'react';
import styles from './NumericKeypad.module.scss';

const DIGITS = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

export default function NumericKeypad({ onDigit, onBackspace, onSubmit, disabled = false, canSubmit = true, canBackspace = true, keyboardEnabled = true }) {
  useEffect(() => {
    if (disabled || !keyboardEnabled) return;
    function handleKeyDown(event) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      if (event.target.closest('input, textarea, select, [contenteditable="true"], .main-game-header, .rules-panel')) return;
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        onDigit(event.key);
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        if (canBackspace) onBackspace();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (canSubmit) onSubmit();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDigit, onBackspace, onSubmit, disabled, canSubmit, canBackspace, keyboardEnabled]);

  return (
    <div className={styles.keypad} role="group" aria-label="Číselná klávesnica">
      {DIGITS.map(digit => <button key={digit} type="button" className={styles.key} onClick={() => onDigit(digit)} disabled={disabled}>{digit}</button>)}
      <button type="button" className={`${styles.key} ${styles.erase}`} onClick={onBackspace} disabled={disabled || !canBackspace} title="Zmazať číslicu" aria-label="Zmazať číslicu">⌫</button>
      <button type="button" className={styles.key} onClick={() => onDigit('0')} disabled={disabled}>0</button>
      <button type="button" className={`${styles.key} ${styles.confirm}`} onClick={onSubmit} disabled={disabled || !canSubmit} title="Potvrdiť odpoveď" aria-label="Potvrdiť odpoveď">OK</button>
    </div>
  );
}
