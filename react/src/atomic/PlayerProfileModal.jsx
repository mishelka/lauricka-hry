import React, { useEffect, useMemo, useState } from 'react';
import { getPlayerName, getPlayerStats, getSmileyCollection, setPlayerName } from '../utils/player';
import { TrophyIcon, SmileyIcon, ChartIcon } from './Icons';

export default function PlayerProfileModal({ isOpen, onClose, onNameChange, initialTab = 'stats' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedSmiley, setSelectedSmiley] = useState(null);
  const [playerName, setPlayerNameState] = useState(() => getPlayerName());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPlayerNameState(getPlayerName());
      setIsEditingName(false);
      setSelectedSmiley(null);
    }
  }, [isOpen]);

  const smileys = useMemo(() => (isOpen ? getSmileyCollection() : []), [isOpen]);
  const stats = useMemo(() => (isOpen ? getPlayerStats() : null), [isOpen]);

  if (!isOpen) return null;

  const collectedCount = stats ? stats.collectedSmileysCount : 0;
  const totalSmileys = stats ? stats.totalSmileysCount : 36;
  const percentCollected = Math.round((collectedCount / totalSmileys) * 100);

  const handleStartEdit = () => {
    setNameInput(playerName);
    setIsEditingName(true);
  };

  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    setPlayerName(trimmed);
    setPlayerNameState(trimmed);
    setIsEditingName(false);
    if (onNameChange) {
      onNameChange(trimmed);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNameInput(playerName);
  };

  return (
    <div className="profile-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="profile-modal-card" onClick={e => e.stopPropagation()}>
        <div className="profile-modal-header">
          <div className="profile-modal-title">
            <span className="profile-header-avatar">👧</span>
            <div className="profile-title-text-wrap">
              {!isEditingName ? (
                <div className="profile-modal-name-row">
                  <h2>{playerName || 'Profil hráča'}</h2>
                  <button
                    type="button"
                    className="profile-name-edit-btn"
                    onClick={handleStartEdit}
                    title="Zmeniť meno"
                    aria-label="Zmeniť meno"
                  >
                    ✏️
                  </button>
                </div>
              ) : (
                <form className="profile-name-edit-form" onSubmit={handleSaveName}>
                  <input
                    type="text"
                    className="profile-name-input"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="Tvoje meno..."
                    maxLength={24}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="profile-name-save-btn"
                    title="Uložiť meno"
                    aria-label="Uložiť meno"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    className="profile-name-cancel-btn"
                    onClick={handleCancelEdit}
                    title="Zrušiť"
                    aria-label="Zrušiť"
                  >
                    ✕
                  </button>
                </form>
              )}
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
            onClick={() => {
              setActiveTab('stats');
              setSelectedSmiley(null);
            }}
            role="tab"
            aria-selected={activeTab === 'stats'}
          >
            <ChartIcon size={18} stroke="#000000" />
            <span>Štatistiky hrania</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn${activeTab === 'smileys' ? ' active' : ''}`}
            onClick={() => {
              setActiveTab('smileys');
              setSelectedSmiley(null);
            }}
            role="tab"
            aria-selected={activeTab === 'smileys'}
          >
            <SmileyIcon size={18} stroke="#000000" />
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

              <div className="smileys-grid">
                {smileys.map(smiley => (
                  <button
                    key={smiley.id}
                    type="button"
                    className={`smiley-card${smiley.unlocked ? ' unlocked' : ' locked'}${
                      selectedSmiley?.id === smiley.id ? ' selected' : ''
                    }`}
                    onClick={() => setSelectedSmiley(prev => (prev?.id === smiley.id ? null : smiley))}
                    title={smiley.unlocked ? `${smiley.name} (${smiley.category})` : 'Klikni pre info o odomknutí'}
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

        {selectedSmiley && (
          <div
            className="smiley-detail-backdrop"
            onClick={() => setSelectedSmiley(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Detail smajlíka"
          >
            <div
              className={`smiley-detail-card${selectedSmiley.unlocked ? '' : ' locked-detail'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="smiley-detail-avatar">
                <span className="smiley-detail-emoji">{selectedSmiley.unlocked ? selectedSmiley.emoji : '🔒'}</span>
              </div>
              <div className="smiley-detail-info">
                <span className="smiley-detail-tag">
                  {selectedSmiley.unlocked ? `✨ ${selectedSmiley.category}` : '🔒 Ešte neodomknutý'}
                </span>
                <h4>{selectedSmiley.unlocked ? selectedSmiley.name : 'Záhadný smajlík'}</h4>
                <p>
                  {selectedSmiley.unlocked
                    ? selectedSmiley.desc
                    : 'Tento smajlík čaká na odomknutie. Získaš ho úspešným dokončením kola v hre Opakovanie!'}
                </p>
                <span className="smiley-detail-count">
                  V zbierke máš už <strong>{collectedCount}</strong> z <strong>{totalSmileys}</strong> smajlíkov!
                </span>
              </div>
              <button
                type="button"
                className="smiley-detail-close"
                onClick={() => setSelectedSmiley(null)}
                title="Zavrieť detail"
                aria-label="Zavrieť detail"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
