import styles from './StatusBar.module.scss';

export default function StatusBar({ moves }) {
  return <div className={styles.statusBar}><span className={styles.movesBadge}>Ťahy: {moves}</span></div>;
}