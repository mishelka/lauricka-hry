import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOPLNOVACKY_DTNL_GROUPS, DOPLNOVACKY_B_GROUPS } from '../data/tasks';
import { getLevelStars } from '../utils/player';
import WordFillGame from './WordFillGame';

export function DoplnovackyMenu() {
  const navigate = useNavigate();
  const [stars, setStars] = useState(() => ({
    dtnl: getLevelStars('doplnovacky_dtnl', DOPLNOVACKY_DTNL_GROUPS.length),
    b: getLevelStars('doplnovacky_b', DOPLNOVACKY_B_GROUPS.length)
  }));

  useEffect(() => {
    setStars({
      dtnl: getLevelStars('doplnovacky_dtnl', DOPLNOVACKY_DTNL_GROUPS.length),
      b: getLevelStars('doplnovacky_b', DOPLNOVACKY_B_GROUPS.length)
    });
  }, []);

  const dtnlFinished = stars.dtnl.filter(s => s === 5).length;
  const bFinished = stars.b.filter(s => s === 5).length;

  return (
    <div>
      <h1>Doplňovačky</h1>
      <p className="level-menu-help">Vyber si doplňovačku a precvič si správne dopĺňanie písmen po leveloch:</p>

      <div className="menu-container">
        <div className="menu-cards">
          <div className="menu-card">
            <button className="btn-menu-doplnovacky-dtnl menu-card-btn" onClick={() => navigate('/doplnovacky/dtnl')}>
              <span className="menu-title">Doplňovačky dtnl</span>
              <span className="menu-stars">{`${dtnlFinished} z ${DOPLNOVACKY_DTNL_GROUPS.length}`}</span>
            </button>
          </div>

          <div className="menu-card">
            <button className="btn-menu-doplnovacky-b menu-card-btn" onClick={() => navigate('/doplnovacky/b')}>
              <span className="menu-title">Doplňovačky B</span>
              <span className="menu-stars">{`${bFinished} z ${DOPLNOVACKY_B_GROUPS.length}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DoplnovackyDtnlGame() {
  return (
    <WordFillGame
      title="Doplňovačky dtnl"
      gameId="doplnovacky_dtnl"
      levelGroups={DOPLNOVACKY_DTNL_GROUPS}
    />
  );
}

export function DoplnovackyBGame() {
  return (
    <WordFillGame
      title="Doplňovačky B"
      gameId="doplnovacky_b"
      levelGroups={DOPLNOVACKY_B_GROUPS}
    />
  );
}

export default DoplnovackyMenu;