import styles from './DoorArrow.module.scss';

export default function DoorArrow({ side, color, size, pulsing = false }) {
  const isLight = color === 'white' || color === 'yellow';
  const fill = isLight ? '#334155' : '#ffffff';
  const rotations = { top: -90, right: 0, bottom: 90, left: 180 };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`${styles.arrow} ${pulsing ? styles.pulsing : ''}`}
      style={{ transform: `rotate(${rotations[side] ?? 0}deg)`, display: 'block' }}
    >
      <path
        d="M8 5.5c0-.75.85-1.2 1.5-.8l9 6.5c.55.4.55 1.2 0 1.6l-9 6.5c-.65.4-1.5-.05-1.5-.8z"
        fill={fill}
      />
    </svg>
  );
}