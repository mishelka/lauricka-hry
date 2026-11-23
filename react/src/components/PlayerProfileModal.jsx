import React, { useMemo, useState } from 'react';
import { getPlayerStats, getSmileyCollection } from '../utils/player';
import { TrophyIcon, SmileyIcon, ChartIcon } from './Icons';

export default function PlayerProfileModal({ isOpen, onClose, initialTab = 'stats' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedSmiley, setSelectedSmiley] = useState(null);

  const smileys = useMemo(() => (isOpen ? getSmileyCollection() : []), [isOpen]);
  const stats = useMemo(() => (isOpen ? getPlayerStats() : null), [isOpen]);

  if (!isOpen) return null;

  const collectedCount = stats ? stats.collectedSmileysCount : 0;
  const totalSmileys = stats ? stats.totalSmileysCount : 36;
  const percentCollected = Math.round((collectedCount / totalSmileys) * 100);

  return (
    <div className="profile-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
        <div className="profile-modal-header">
          <div className="profile-modal-title">
            <span className="profile-header-avatar">👧</span>
            <div>
              <h2>Profil hráča</h2>
              <p className="profile-subtitle">Tvoja zbierka smajlíkov a herné štatistiky</p>
            </div>
          </div>
          <button type="button" className="profile-modal-close" onClick={onClose} aria-label="Zavrieť">
            ✕
          </button>
        </div>

        <div className="profile-tabs" role="tablist">
          <button
            type="button"
            className={`profile-tab-btn${activeTab === 'stats' ? ' active' : ''}`}
            onClick={() => setActiveTab('stats')}
            role="tab"
            aria-selected={activeTab === 'stats'}
          >
            <ChartIcon size={18} />
            <span>Štatistiky hrania</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn${activeTab === 'smileys' ? ' active' : ''}`}
            onClick={() => setActiveTab('smileys')}
            role="tab"
            aria-selected={activeTab === 'smileys'}
          >
            <SmileyIcon size={18} />
            <span>Zbierka smajlíkov ({collectedCount}/{totalSmileys})</span>
          </button>
        </div>

        <div className="profile-modal-content">
          {activeTab === 'stats' && stats && (
            <div className="profile-stats-view">
              <div className="stats-cards-grid">
                <div className="stat-card stat-card-stars">
                  <span className="stat-card-icon">⭐</span>
                  <div className="stat-card-value">{stats.totalStars}</div>
                  <div className="stat-card-label">Získaných hviezdičiek</div>
                </div>

                <div className="stat-card stat-card-completed">
                  <span className="stat-card-icon">🏆</span>
                  <div className="stat-card-value">{stats.completed5StarLevels}</div>
                  <div className="stat-card-label">Dokončených 5★ úrovní</div>
                </div>

                <div className="stat-card stat-card-smileys">
                  <span className="stat-card-icon">😊</span>
                  <div className="stat-card-value">{stats.collectedSmileysCount} / {stats.totalSmileysCount}</div>
                  <div className="stat-card-label">Smajlíkov v zbierke</div>
                </div>

                <div className="stat-card stat-card-opakovanie">
                  <span className="stat-card-icon">🔄</span>
                  <div className="stat-card-value">{stats.opakovaniePlays}</div>
                  <div className="stat-card-label">Odohraných opakovaní</div>
                </div>
              </div>

              <div className="stats-categories-list">
                <h3>Prehľad podľa kategórií:</h3>
                
                <div className="stats-category-item">
                  <div className="stats-category-header">
                    <span>🔤 Vybrané slová (B, M, P, R, S, V, Z)</span>
                  </div>
                  <p className="stats-category-desc">
                    Trénuj pravopis po jednotlivých písmenách a odomykaj ďalšie úrovne.
                  </p>
                </div>

                <div className="stats-category-item">
                  <div className="stats-category-header">
                    <span>📚 Slovenčina (Mäkké/Tvrdé, Obojaké, Slová, Cudzie, Doplňovačky)</span>
                  </div>
                  <p className="stats-category-desc">
                    Precvičovanie základných pravopisných pravidiel a dopĺňania písmen.
                  </p>
                </div>

                <div className="stats-category-item">
                  <div className="stats-category-header">
                    <span>🔢 Matematika (Rátanie, Násobenie, Delenie)</span>
                  </div>
                  <p className="stats-category-desc">
                    Hravé precvičovanie počítania a matematických operácií.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'smileys' && (
            <div className="profile-smileys-view">
              <div className="smileys-progress-banner">
                <div className="smileys-progress-info">
                  <span className="smileys-progress-text">
                    Odomknutých <strong>{collectedCount}</strong> z <strong>{totalSmileys}</strong> smajlíkov
                  </span>
                  <span className="smileys-progress-percent">{percentCollected}%</span>
                </div>
                <div className="smileys-progress-bar-bg">
                  <div className="smileys-progress-bar-fill" style={{ width: `${percentCollected}%` }} />
                </div>
                <p className="smileys-hint">
                  💡 Hraj hru <strong>Opakovanie</strong> pred vybranými slovami a získaj za každé úspešné kolo nového smajlíka do zbierky!
                </p>
              </div>

              {selectedSmiley && (
                <div className="smiley-detail-card">
                  <span className="smiley-detail-emoji">{selectedSmiley.emoji}</span>
                  <div className="smiley-detail-info">
                    <h4>{selectedSmiley.name}</h4>
                    <span className="smiley-category-tag">{selectedSmiley.category}</span>
                    <p>{selectedSmiley.desc}</p>
                  </div>
                  <button
                    type="button"
                    className="smiley-detail-close"
                    onClick={() => setSelectedSmiley(null)}
                    title="Zavrieť detail"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="smileys-grid">
                {smileys.map(smiley => (
                  <button
                    key={smiley.id}
                    type="button"
                    className={`smiley-card${smiley.unlocked ? ' unlocked' : ' locked'}${
                      selectedSmiley?.id === smiley.id ? ' selected' : ''
                    }`}
                    onClick={() => smiley.unlocked && setSelectedSmiley(smiley)}
                    title={smiley.unlocked ? `${smiley.name} (${smiley.category})` : 'Ešte neodomknutý smajlík'}
                  >
                    <span className="smiley-emoji">{smiley.unlocked ? smiley.emoji : '🔒'}</span>
                    <span className="smiley-name">{smiley.unlocked ? smiley.name : '???'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-modal-footer">
          <button type="button" className="btn-profile-close" onClick={onClose}>
            Zavrieť
          </button>
        </div>
      </div>
    </div>
  );
}
