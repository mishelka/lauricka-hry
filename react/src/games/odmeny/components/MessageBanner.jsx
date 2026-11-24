import styles from './MessageBanner.module.scss';

export default function MessageBanner({ message }) {
  return <div className={`${styles.banner} ${message ? styles.visible : ''}`} aria-live="polite">{message || ' '}</div>;
}