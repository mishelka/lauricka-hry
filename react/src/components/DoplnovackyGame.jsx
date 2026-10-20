import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOPLNOVACKY_DTNL, DOPLNOVACKY_B } from '../data/tasks';
import { getBestStars } from '../utils/player';
import WordFillGame from './WordFillGame';

function renderStars(starsCount) {
  return Array.from({ length: 5 }).map((_, i) => (
    <span key={i} className={i < starsCount ? 'star-gold' : 'star-grey'}>★</span>
  ));
}

export function DoplnovackyMenu() {
  const navigate = useNavigate();
  const [stars, setStars] = useState(() => ({
    dtnl: getBestStars('doplnovacky_dtnl'),
    b: getBestStars('doplnovacky_b')
  }));

  useEffect(() => {
    setStars({
      dtnl: getBestStars('doplnovacky_dtnl'),
      b: getBestStars('doplnovacky_b')
    });
  }, []);

  return (
    <div>
      <h1>Doplňovačky</h1>
      <p className="level-menu-help">Vyber si doplňovačku a doplň správne i/í alebo y/ý:</p>

      <div className="menu-container">
        <div className="menu-row">
          <button className="btn-menu-doplnovacky-dtnl" onClick={() => navigate('/doplnovacky/dtnl')}>
            <span className="menu-title">Doplňovačky dtnl</span>
            <span className="menu-stars">{renderStars(stars.dtnl)}</span>
          </button>
        </div>

        <div className="menu-row">
          <button className="btn-menu-doplnovacky-b" onClick={() => navigate('/doplnovacky/b')}>
            <span className="menu-title">Doplňovačky B</span>
            <span className="menu-stars">{renderStars(stars.b)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function DoplnovackyDtnlGame() {
  return <WordFillGame title="Doplňovačky dtnl" gameId="doplnovacky_dtnl" sourceWords={DOPLNOVACKY_DTNL} />;
}

export function DoplnovackyBGame() {
  return <WordFillGame title="Doplňovačky B" gameId="doplnovacky_b" sourceWords={DOPLNOVACKY_B} />;
}

export default DoplnovackyMenu;