import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getBestStars, getLevelStars } from './utils/player';
import { useEffect, useMemo, useState } from 'react';
import YiGame from './components/YiGame';
import ObojakeGame from './components/ObojakeGame';
import SlovaYiGame from './components/SlovaYiGame';
import RatanieGame from './components/RatanieGame';
import AudioTalePlayer from './components/AudioTalePlayer';
import { AUDIO_TALES } from './data/audioTales';

function renderStars(starsCount) {
  return Array.from({ length: 5 }).map((_, i) => (
    <span key={i} className={i < starsCount ? 'star-gold' : 'star-grey'}>★</span>
  ));
}

function MenuPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuStars, setMenuStars] = useState(() => ({
    yi: getBestStars('yi'),
    obojake: getBestStars('obojake'),
    ratanie: getBestStars('ratanie'),
    slovaLevels: getLevelStars('slovaYi', 8)
  }));

  function refreshMenuStars() {
    setMenuStars({
      yi: getBestStars('yi'),
      obojake: getBestStars('obojake'),
      ratanie: getBestStars('ratanie'),
      slovaLevels: getLevelStars('slovaYi', 8)
    });
  }

  useEffect(() => {
    refreshMenuStars();
  }, [location.pathname]);

  useEffect(() => {
    function onFocus() {
      refreshMenuStars();
    }

    function onStorage() {
      refreshMenuStars();
    }

    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const yiStars = menuStars.yi;
  const obojakeStars = menuStars.obojake;
  const ratanieStars = menuStars.ratanie;
  const slovaFinished = useMemo(() => menuStars.slovaLevels.filter(stars => stars === 5).length, [menuStars.slovaLevels]);
  const firstCompletedSlovaLevel = useMemo(
    () => menuStars.slovaLevels.findIndex(stars => stars === 5),
    [menuStars.slovaLevels]
  );
  const slovaTaleUrl =
    firstCompletedSlovaLevel >= 0
      ? (AUDIO_TALES.slovaYiLevels[firstCompletedSlovaLevel] || AUDIO_TALES.slovaYiLevels[0])
      : null;

  return (
    <>
      <h1>Vyber si hru:</h1>
      <div className="menu-container">
        <div className="menu-row">
          <button className="btn-menu-yi" onClick={() => navigate('/yi')}>
            <span className="menu-title">Mäkké a Tvrdé</span>
            <span className="menu-stars">{renderStars(yiStars)}</span>
          </button>
          <br/> {yiStars} - {yiStars >= 5} <br/>
          {yiStars >= 5 && (
            <AudioTalePlayer
              taleUrl={AUDIO_TALES.yi}
              className="menu-play-btn"
              playLabel="▶"
              pauseLabel="⏸"
            />
          )}
        </div>

        <div className="menu-row">
          <button className="btn-menu-obojake" onClick={() => navigate('/obojake')}>
            <span className="menu-title">Obojaké</span>
            <span className="menu-stars">{renderStars(obojakeStars)}</span>
          </button>
          {obojakeStars >= 5 && (
            <AudioTalePlayer
              taleUrl={AUDIO_TALES.obojake}
              className="menu-play-btn"
              playLabel="▶"
              pauseLabel="⏸"
            />
          )}
        </div>

        <div className="menu-row">
          <button className="btn-menu-slova" onClick={() => navigate('/slova')}>
            <span className="menu-title">Slová</span>
            <span className="menu-stars">{`${slovaFinished} z 8`}</span>
          </button>
          {slovaFinished > 0 && (
            <AudioTalePlayer
              taleUrl={slovaTaleUrl}
              className="menu-play-btn"
              playLabel="▶"
              pauseLabel="⏸"
            />
          )}
        </div>

        <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
          <span>Matematické hry</span>
        </div>

        <div className="menu-row">
          <button className="btn-menu-ratanie" onClick={() => navigate('/ratanie')}>
            <span className="menu-title">Rátanie</span>
            <span className="menu-stars">{renderStars(ratanieStars)}</span>
          </button>
          {ratanieStars >= 5 && (
            <AudioTalePlayer
              taleUrl={AUDIO_TALES.ratanie}
              className="menu-play-btn"
              playLabel="▶"
              pauseLabel="⏸"
            />
          )}
        </div>
      </div>
    </>
  );
}

function GamePage({ children }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="top-actions">
        <button className="btn-back" onClick={() => navigate('/')}>Späť do menu</button>
      </div>
      {children}
    </>
  );
}

export default function App() {

  return (
    <div className="app-shell">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/yi" element={<GamePage><YiGame /></GamePage>} />
          <Route path="/obojake" element={<GamePage><ObojakeGame /></GamePage>} />
          <Route path="/slova" element={<GamePage><SlovaYiGame /></GamePage>} />
          <Route path="/ratanie" element={<GamePage><RatanieGame /></GamePage>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
