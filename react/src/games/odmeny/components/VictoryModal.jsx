import { BackIcon, LevelsMenuIcon, NextLevelIcon, RestartIcon } from '../../../atomic/Icons';
import styles from './VictoryModal.module.scss';

export default function VictoryModal({ moves, canReplay, onReplay, onExit, exitLabel, onNextLevel, canNextLevel }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalCard}>
        <div style={{ fontSize: 48 }}>🎉</div>
        <h3 className={styles.winTitle}>Výborne!</h3>
        <div className={styles.winStars}>★★★★★</div>
        <p style={{ margin: 0, color: '#475569', fontSize: 16 }}>
          Všetky kocky úspešne vyradené na {moves} {moves === 1 ? 'ťah' : (moves < 5 ? 'ťahy' : 'ťahov')}!
        </p>
        <div className="result-actions" style={{ width: '100%', marginTop: 8 }}>
          <div className="result-actions-icons">
            {canReplay && <button type="button" className="btn-icon-action btn-icon-restart" onClick={onReplay} title="Hrať znova"><RestartIcon size={26} /></button>}
          </div>
          <div className="result-actions-nav">
            <button className="btn-secondary btn-levels-menu" onClick={onExit}>
              {exitLabel === 'Späť' ? <BackIcon size={20} /> : <LevelsMenuIcon size={20} />}
              <span>{exitLabel}</span>
            </button>
            {canNextLevel && <button className="btn-next-level" onClick={onNextLevel}><NextLevelIcon size={20} /><span>Ďalší level</span></button>}
          </div>
        </div>
      </div>
    </div>
  );
}