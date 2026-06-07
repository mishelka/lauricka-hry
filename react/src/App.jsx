import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { getBestStars, getLevelStars } from './utils/player';
import { useMemo } from 'react';
import YiGame from './components/YiGame';
import ObojakeGame from './components/ObojakeGame';
import SlovaYiGame from './components/SlovaYiGame';
import RatanieGame from './components/RatanieGame';

function renderStars(starsCount) {
  return Array.from({ length: 5 }).map((_, i) => (
    <span key={i} className={i < starsCount ? 'star-gold' : 'star-grey'}>★</span>
  ));
}

function MenuPage() {
  const navigate = useNavigate();
  const yiStars = useMemo(() => getBestStars('yi'), []);
  const obojakeStars = useMemo(() => getBestStars('obojake'), []);
  const ratanieStars = useMemo(() => getBestStars('ratanie'), []);
  const slovaFinished = useMemo(() => getLevelStars('slovaYi', 8).filter(stars => stars === 5).length, []);

  return (
    <>
      <h1>Vyber si hru:</h1>
      <div className="menu-container">
        <button className="btn-menu-yi" onClick={() => navigate('/yi')}>
          <span className="menu-title">Mäkké a Tvrdé</span>
          <span className="menu-stars">{renderStars(yiStars)}</span>
        </button>
        <button className="btn-menu-obojake" onClick={() => navigate('/obojake')}>
          <span className="menu-title">Obojaké</span>
          <span className="menu-stars">{renderStars(obojakeStars)}</span>
        </button>
        <button className="btn-menu-slova" onClick={() => navigate('/slova')}>
          <span className="menu-title">Slová</span>
          <span className="menu-stars">{`${slovaFinished} z 8`}</span>
        </button>

        <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
          <span>Matematické hry</span>
        </div>

        <button className="btn-menu-ratanie" onClick={() => navigate('/ratanie')}>
          <span className="menu-title">Rátanie</span>
          <span className="menu-stars">{renderStars(ratanieStars)}</span>
        </button>
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
