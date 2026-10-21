import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { DOPLNOVACKY_DTNL_GROUPS, DOPLNOVACKY_B_GROUPS } from './data/tasks';
import { NASOBENIE_3_GROUPS } from './data/nasobenie3Data';
import { DELENIE_3_GROUPS } from './data/delenie3Data';
import { VYBRANE_B_GROUPS } from './data/vybraneBSlova';
import { VYBRANE_M_GROUPS } from './data/vybraneMSlova';
import { VYBRANE_P_GROUPS } from './data/vybranePSlova';
import { VYBRANE_R_GROUPS } from './data/vybraneRSlova';
import { VYBRANE_S_GROUPS } from './data/vybraneSSlova';
import { VYBRANE_V_GROUPS } from './data/vybraneVSlova';
import { VYBRANE_Z_GROUPS } from './data/vybraneZSlova';
import { getBestStars, getLevelStars } from './utils/player';
import YiGame from './components/YiGame';
import ObojakeGame from './components/ObojakeGame';
import SlovaYiGame from './components/SlovaYiGame';
import VybraneBGame from './components/VybraneBGame';
import VybraneMGame from './components/VybraneMGame';
import VybranePGame from './components/VybranePGame';
import VybraneRGame from './components/VybraneRGame';
import VybraneSGame from './components/VybraneSGame';
import VybraneVGame from './components/VybraneVGame';
import VybraneZGame from './components/VybraneZGame';
import RatanieGame from './components/RatanieGame';
import Nasobenie3Game from './components/Nasobenie3Game';
import Delenie3Game from './components/Delenie3Game';
import AudioTalePlayer from './components/AudioTalePlayer';
import DoplnovackyMenu, { DoplnovackyDtnlGame, DoplnovackyBGame } from './components/DoplnovackyGame';
import CudzieGame from './components/CudzieGame';
import BlockOutGame from './rewards/BlockOutGame';
import { BLOCK_OUT_LEVELS } from './rewards/blockOutLevels';
import { AUDIO_TALES } from './data/audioTales';
import { BackIcon, PlayIcon, PauseIcon } from './components/Icons';
import {useEffect, useMemo, useState} from "react";

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
    doplnovackyDtnlLevels: getLevelStars('doplnovacky_dtnl', DOPLNOVACKY_DTNL_GROUPS.length),
    doplnovackyBLevels: getLevelStars('doplnovacky_b', DOPLNOVACKY_B_GROUPS.length),
    cudzie: getBestStars('cudzie'),
    ratanieLevels: getLevelStars('ratanie', 10),
    nasobenie3Levels: getLevelStars('nasobenie3', NASOBENIE_3_GROUPS.length),
    delenie3Levels: getLevelStars('delenie3', DELENIE_3_GROUPS.length),
    slovaLevels: getLevelStars('slovaYi', 8),
    vybraneBLevels: getLevelStars('vybraneB', VYBRANE_B_GROUPS.length),
    vybraneMLevels: getLevelStars('vybraneM', VYBRANE_M_GROUPS.length),
    vybranePLevels: getLevelStars('vybraneP', VYBRANE_P_GROUPS.length),
    vybraneRLevels: getLevelStars('vybraneR', VYBRANE_R_GROUPS.length),
    vybraneSLevels: getLevelStars('vybraneS', VYBRANE_S_GROUPS.length),
    vybraneVLevels: getLevelStars('vybraneV', VYBRANE_V_GROUPS.length),
    vybraneZLevels: getLevelStars('vybraneZ', VYBRANE_Z_GROUPS.length),
    blockOutLevels: getLevelStars('blockOut', BLOCK_OUT_LEVELS.length)
  }));

  function refreshMenuStars() {
    setMenuStars({
      yi: getBestStars('yi'),
      obojake: getBestStars('obojake'),
      doplnovackyDtnlLevels: getLevelStars('doplnovacky_dtnl', DOPLNOVACKY_DTNL_GROUPS.length),
      doplnovackyBLevels: getLevelStars('doplnovacky_b', DOPLNOVACKY_B_GROUPS.length),
      cudzie: getBestStars('cudzie'),
      ratanieLevels: getLevelStars('ratanie', 10),
      nasobenie3Levels: getLevelStars('nasobenie3', NASOBENIE_3_GROUPS.length),
      delenie3Levels: getLevelStars('delenie3', DELENIE_3_GROUPS.length),
      slovaLevels: getLevelStars('slovaYi', 8),
      vybraneBLevels: getLevelStars('vybraneB', VYBRANE_B_GROUPS.length),
      vybraneMLevels: getLevelStars('vybraneM', VYBRANE_M_GROUPS.length),
      vybranePLevels: getLevelStars('vybraneP', VYBRANE_P_GROUPS.length),
      vybraneRLevels: getLevelStars('vybraneR', VYBRANE_R_GROUPS.length),
      vybraneSLevels: getLevelStars('vybraneS', VYBRANE_S_GROUPS.length),
      vybraneVLevels: getLevelStars('vybraneV', VYBRANE_V_GROUPS.length),
      vybraneZLevels: getLevelStars('vybraneZ', VYBRANE_Z_GROUPS.length),
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
  const nasobenieFinished = useMemo(() => menuStars.nasobenie3Levels.filter(stars => stars === 5).length, [menuStars.nasobenie3Levels]);
  const delenieFinished = useMemo(() => menuStars.delenie3Levels.filter(stars => stars === 5).length, [menuStars.delenie3Levels]);
  const slovaFinished = useMemo(() => menuStars.slovaLevels.filter(stars => stars === 5).length, [menuStars.slovaLevels]);
  const vybraneBFinished = useMemo(() => menuStars.vybraneBLevels.filter(stars => stars === 5).length, [menuStars.vybraneBLevels]);
  const vybraneMFinished = useMemo(() => menuStars.vybraneMLevels.filter(stars => stars === 5).length, [menuStars.vybraneMLevels]);
  const vybranePFinished = useMemo(() => menuStars.vybranePLevels.filter(stars => stars === 5).length, [menuStars.vybranePLevels]);
  const vybraneRFinished = useMemo(() => menuStars.vybraneRLevels.filter(stars => stars === 5).length, [menuStars.vybraneRLevels]);
  const vybraneSFinished = useMemo(() => menuStars.vybraneSLevels.filter(stars => stars === 5).length, [menuStars.vybraneSLevels]);
  const vybraneVFinished = useMemo(() => menuStars.vybraneVLevels.filter(stars => stars === 5).length, [menuStars.vybraneVLevels]);
  const vybraneZFinished = useMemo(() => menuStars.vybraneZLevels.filter(stars => stars === 5).length, [menuStars.vybraneZLevels]);
  const blockOutFinished = useMemo(() => menuStars.blockOutLevels.filter(stars => stars === 5).length, [menuStars.blockOutLevels]);
  const doplnovackyFinished = useMemo(
    () => menuStars.doplnovackyDtnlLevels.filter(stars => stars === 5).length + menuStars.doplnovackyBLevels.filter(stars => stars === 5).length,
    [menuStars.doplnovackyDtnlLevels, menuStars.doplnovackyBLevels]
  );
  const doplnovackyTotal = DOPLNOVACKY_DTNL_GROUPS.length + DOPLNOVACKY_B_GROUPS.length;

  return (
    <>
      <h1>Vyber si hru:</h1>
      <div className="menu-container">
        <div className="menu-section">
          <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
            <span>Matematické hry</span>
          </div>

          <div className="menu-cards">
            <div className="menu-card">
              <button className="btn-menu-ratanie menu-card-btn" onClick={() => navigate('/ratanie')}>
                <span className="menu-title">Rátanie</span>
                <span className="menu-stars">{`${ratanieFinished} z 10`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-nasobenie menu-card-btn" onClick={() => navigate('/nasobenie-3')}>
                <span className="menu-title">Násobenie do 3</span>
                <span className="menu-stars">{`${nasobenieFinished} z ${NASOBENIE_3_GROUPS.length}`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-delenie menu-card-btn" onClick={() => navigate('/delenie-3')}>
                <span className="menu-title">Delenie do 3</span>
                <span className="menu-stars">{`${delenieFinished} z ${DELENIE_3_GROUPS.length}`}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
            <span>Slovenčina</span>
          </div>

          <div className="menu-cards">
            <div className="menu-card">
              <button className="btn-menu-yi menu-card-btn" onClick={() => navigate('/yi')}>
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

            <div className="menu-card">
              <button className="btn-menu-obojake menu-card-btn" onClick={() => navigate('/obojake')}>
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

            <div className="menu-card">
              <button className="btn-menu-slova menu-card-btn" onClick={() => navigate('/slova')}>
                <span className="menu-title">Slová</span>
                <span className="menu-stars">{`${slovaFinished} z 8`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-cudzie menu-card-btn" onClick={() => navigate('/cudzie')}>
                <span className="menu-title">Cudzie</span>
                <span className="menu-stars">{renderStars(cudzieStars)}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-doplnovacky menu-card-btn" onClick={() => navigate('/doplnovacky')}>
                <span className="menu-title">Doplňovačky</span>
                <span className="menu-stars">{`${doplnovackyFinished} z ${doplnovackyTotal}`}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
            <span>Vybrané slová</span>
          </div>

          <div className="menu-cards">
            <div className="menu-card">
              <button className="btn-menu-vybrane-b menu-card-btn" onClick={() => navigate('/vybrane-b')}>
                <span className="menu-title">Vybrané po B</span>
                <span className="menu-stars">{`${vybraneBFinished} z ${VYBRANE_B_GROUPS.length}`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-vybrane-m menu-card-btn" onClick={() => navigate('/vybrane-m')}>
                <span className="menu-title">Vybrané po M</span>
                <span className="menu-stars">{`${vybraneMFinished} z ${VYBRANE_M_GROUPS.length}`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-vybrane-p menu-card-btn" onClick={() => navigate('/vybrane-p')}>
                <span className="menu-title">Vybrané po P</span>
                <span className="menu-stars">{`${vybranePFinished} z ${VYBRANE_P_GROUPS.length}`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-vybrane-r menu-card-btn" onClick={() => navigate('/vybrane-r')}>
                <span className="menu-title">Vybrané po R</span>
                <span className="menu-stars">{`${vybraneRFinished} z ${VYBRANE_R_GROUPS.length}`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-vybrane-s menu-card-btn" onClick={() => navigate('/vybrane-s')}>
                <span className="menu-title">Vybrané po S</span>
                <span className="menu-stars">{`${vybraneSFinished} z ${VYBRANE_S_GROUPS.length}`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-vybrane-v menu-card-btn" onClick={() => navigate('/vybrane-v')}>
                <span className="menu-title">Vybrané po V</span>
                <span className="menu-stars">{`${vybraneVFinished} z ${VYBRANE_V_GROUPS.length}`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-vybrane-z menu-card-btn" onClick={() => navigate('/vybrane-z')}>
                <span className="menu-title">Vybrané po Z</span>
                <span className="menu-stars">{`${vybraneZFinished} z ${VYBRANE_Z_GROUPS.length}`}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="menu-section" style={{ display: 'none' }}>
          <div className="menu-divider" role="separator" aria-label="Oddelovač kategórií">
            <span>Hry za odmenu</span>
          </div>

          <div className="menu-cards">
            <div className="menu-card">
              <button className="btn-menu-blockout menu-card-btn" onClick={() => navigate('/block-out')}>
                <span className="menu-title">Block Out!</span>
                <span className="menu-stars">{`${blockOutFinished} z ${BLOCK_OUT_LEVELS.length}`}</span>
              </button>
            </div>
          </div>
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
          <Route path="/vybrane-m" element={<GamePage><VybraneMGame /></GamePage>} />
          <Route path="/vybrane-p" element={<GamePage><VybranePGame /></GamePage>} />
          <Route path="/vybrane-r" element={<GamePage><VybraneRGame /></GamePage>} />
          <Route path="/vybrane-s" element={<GamePage><VybraneSGame /></GamePage>} />
          <Route path="/vybrane-v" element={<GamePage><VybraneVGame /></GamePage>} />
          <Route path="/vybrane-z" element={<GamePage><VybraneZGame /></GamePage>} />
          <Route path="/ratanie" element={<GamePage><RatanieGame /></GamePage>} />
          <Route path="/nasobenie-3" element={<GamePage><Nasobenie3Game /></GamePage>} />
          <Route path="/delenie-3" element={<GamePage><Delenie3Game /></GamePage>} />
          <Route path="/block-out" element={<GamePage><BlockOutGame /></GamePage>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
