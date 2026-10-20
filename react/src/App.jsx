import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getBestStars, getLevelStars } from './utils/player';
import { useEffect, useMemo, useState } from 'react';
import YiGame from './components/YiGame';
import ObojakeGame from './components/ObojakeGame';
import SlovaYiGame from './components/SlovaYiGame';
import VybraneBGame from './components/VybraneBGame';
import RatanieGame from './components/RatanieGame';
import AudioTalePlayer from './components/AudioTalePlayer';
import DoplnovackyMenu, { DoplnovackyDtnlGame, DoplnovackyBGame } from './components/DoplnovackyGame';
import CudzieGame from './components/CudzieGame';
import BlockOutGame from './rewards/BlockOutGame';
import { BLOCK_OUT_LEVELS } from './rewards/blockOutLevels';
import { AUDIO_TALES } from './data/audioTales';
import { BackIcon, PlayIcon, PauseIcon } from './components/Icons';

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
    doplnovackyDtnl: getBestStars('doplnovacky_dtnl'),
    doplnovackyB: getBestStars('doplnovacky_b'),
    cudzie: getBestStars('cudzie'),
    ratanieLevels: getLevelStars('ratanie', 10),
    slovaLevels: getLevelStars('slovaYi', 8),
    vybraneBLevels: getLevelStars('vybraneB', 6),
    blockOutLevels: getLevelStars('blockOut', BLOCK_OUT_LEVELS.length)
  }));

  function refreshMenuStars() {
    setMenuStars({
      yi: getBestStars('yi'),
      obojake: getBestStars('obojake'),
      doplnovackyDtnl: getBestStars('doplnovacky_dtnl'),
      doplnovackyB: getBestStars('doplnovacky_b'),
      cudzie: getBestStars('cudzie'),
      ratanieLevels: getLevelStars('ratanie', 10),
      slovaLevels: getLevelStars('slovaYi', 8),
      vybraneBLevels: getLevelStars('vybraneB', 6),
      blockOutLevels: getLevelStars('blockOut', BLOCK_OUT_LEVELS.length)
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
  const cudzieStars = menuStars.cudzie;
  const ratanieFinished = useMemo(() => menuStars.ratanieLevels.filter(stars => stars === 5).length, [menuStars.ratanieLevels]);
  const slovaFinished = useMemo(() => menuStars.slovaLevels.filter(stars => stars === 5).length, [menuStars.slovaLevels]);
  const vybraneBFinished = useMemo(() => menuStars.vybraneBLevels.filter(stars => stars === 5).length, [menuStars.vybraneBLevels]);
  const blockOutFinished = useMemo(() => menuStars.blockOutLevels.filter(stars => stars === 5).length, [menuStars.blockOutLevels]);
  const doplnovackyFinished = useMemo(
    () => (menuStars.doplnovackyDtnl === 5 ? 1 : 0) + (menuStars.doplnovackyB === 5 ? 1 : 0),
    [menuStars.doplnovackyDtnl, menuStars.doplnovackyB]
  );

  return (
    <>
      <h1>Vyber si hru:</h1>
      <div className="menu-container">
        <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
          <span>Matematické hry</span>
        </div>

        <div className="menu-row">
          <button className="btn-menu-ratanie" onClick={() => navigate('/ratanie')}>
            <span className="menu-title">Rátanie</span>
            <span className="menu-stars">{`${ratanieFinished} z 10`}</span>
          </button>
        </div>
        
        <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
          <span>Slovenčina</span>
        </div>
        
        <div className="menu-row">
          <button className="btn-menu-yi" onClick={() => navigate('/yi')}>
            <span className="menu-title">Mäkké a Tvrdé</span>
            <span className="menu-stars">{renderStars(yiStars)}</span>
          </button>
          {yiStars >= 5 && (
            <AudioTalePlayer
              taleUrl={AUDIO_TALES.yi}
              className="menu-play-btn"
              playLabel={<PlayIcon size={22} />}
              pauseLabel={<PauseIcon size={22} />}
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
              playLabel={<PlayIcon size={22} />}
              pauseLabel={<PauseIcon size={22} />}
            />
          )}
        </div>

        <div className="menu-row">
          <button className="btn-menu-slova" onClick={() => navigate('/slova')}>
            <span className="menu-title">Slová</span>
            <span className="menu-stars">{`${slovaFinished} z 8`}</span>
          </button>
        </div>

        <div className="menu-row">
          <button className="btn-menu-doplnovacky" onClick={() => navigate('/doplnovacky')}>
            <span className="menu-title">Doplňovačky</span>
            <span className="menu-stars">{`${doplnovackyFinished} z 2`}</span>
          </button>
        </div>

        <div className="menu-row">
          <button className="btn-menu-cudzie" onClick={() => navigate('/cudzie')}>
            <span className="menu-title">Cudzie</span>
            <span className="menu-stars">{renderStars(cudzieStars)}</span>
          </button>
        </div>

        <div className="menu-row">
          <button className="btn-menu-vybrane-b" onClick={() => navigate('/vybrane-b')}>
            <span className="menu-title">Vybrané po B</span>
            <span className="menu-stars">{`${vybraneBFinished} z 6`}</span>
          </button>
        </div>

        <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
          <span>Hry za odmenu</span>
        </div>

        <div className="menu-row">
          <button className="btn-menu-blockout" onClick={() => navigate('/block-out')}>
            <span className="menu-title">Block Out!</span>
            <span className="menu-stars">{`${blockOutFinished} z ${BLOCK_OUT_LEVELS.length}`}</span>
          </button>
        </div>
      </div>
    </>
  );
}

function GamePage({ children, backTo = '/' }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="top-actions">
        <button className="btn-back" onClick={() => navigate(backTo)}>
          <BackIcon />
          <span>Späť do menu</span>
        </button>
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
          <Route path="/doplnovacky" element={<GamePage><DoplnovackyMenu /></GamePage>} />
          <Route path="/doplnovacky/dtnl" element={<GamePage backTo="/doplnovacky"><DoplnovackyDtnlGame /></GamePage>} />
          <Route path="/doplnovacky/b" element={<GamePage backTo="/doplnovacky"><DoplnovackyBGame /></GamePage>} />
          <Route path="/cudzie" element={<GamePage><CudzieGame /></GamePage>} />
          <Route path="/vybrane-b" element={<GamePage><VybraneBGame /></GamePage>} />
          <Route path="/ratanie" element={<GamePage><RatanieGame /></GamePage>} />
          <Route path="/block-out" element={<GamePage><BlockOutGame /></GamePage>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
