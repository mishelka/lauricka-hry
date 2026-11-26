import styles from './AnswerProgress.module.scss';

export default function AnswerProgress({ answered, total }) {
  return <span className={styles.container}> | Spolu: {Math.min(answered, total)} zo {total}</span>;
}
