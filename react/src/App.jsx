import GameLayout, { GameLayoutContext } from './atomic/GameLayout';
import SoundPreview from './atomic/SoundPreview';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { DOPLNOVACKY_DTNL_GROUPS, DOPLNOVACKY_B_GROUPS } from './data/tasks';
import { VYBRANE_B_GROUPS } from './data/vybraneBSlova';
import { VYBRANE_M_GROUPS } from './data/vybraneMSlova';
import { VYBRANE_P_GROUPS } from './data/vybranePSlova';
import { VYBRANE_R_GROUPS } from './data/vybraneRSlova';
import { VYBRANE_S_GROUPS } from './data/vybraneSSlova';
import { VYBRANE_V_GROUPS } from './data/vybraneVSlova';
import { VYBRANE_Z_GROUPS } from './data/vybraneZSlova';
import { getBestStars, getLevelStars, unlockAllLevels } from './utils/player';
import MenuSection from './atomic/MenuSection';
import useDevUnlock from './utils/useDevUnlock';
import { YiGame, ObojakeGame, SlovaYiGame, CudzieGame, DoplnovackyMenu, DoplnovackyDtnlGame, DoplnovackyBGame } from './games/slovencina';
import { VybraneBGame, VybraneMGame, VybranePGame, VybraneRGame, VybraneSGame, VybraneVGame, VybraneZGame, VybraneOpakovanieGame } from './games/vybraneSlova';
import { RatanieGame, Nasobenie5Game, Delenie5Game, AdaptivneOpakovanieGame } from './games/matematika';
import { BlockOutGame, BLOCK_OUT_LEVELS } from './games/odmeny';
import { AudioTalePlayer, PlayIcon, PauseIcon, SmileyIcon } from './atomic';
import { AUDIO_TALES } from './data/audioTales';
import { useEffect, useMemo, useState } from "react";

export const TopActionsContext = GameLayoutContext;

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
    slovaLevels: getLevelStars('slovaYi', 8),
    vybraneOpakovanie: getBestStars('vybraneOpakovanie'),
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
      slovaLevels: getLevelStars('slovaYi', 8),
      vybraneOpakovanie: getBestStars('vybraneOpakovanie'),
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

  useDevUnlock({
    gameId: 'vybraneB',
    levelCount: VYBRANE_B_GROUPS.length,
    onUnlock: () => {
      unlockAllLevels('vybraneB', VYBRANE_B_GROUPS.length);
      unlockAllLevels('vybraneM', VYBRANE_M_GROUPS.length);
      unlockAllLevels('vybraneP', VYBRANE_P_GROUPS.length);
      unlockAllLevels('vybraneR', VYBRANE_R_GROUPS.length);
      unlockAllLevels('vybraneS', VYBRANE_S_GROUPS.length);
      unlockAllLevels('vybraneV', VYBRANE_V_GROUPS.length);
      unlockAllLevels('vybraneZ', VYBRANE_Z_GROUPS.length);
      refreshMenuStars();
    }
  });

  const yiStars = menuStars.yi;
  const obojakeStars = menuStars.obojake;
  const cudzieStars = menuStars.cudzie;
  const vybraneOpakovanieStars = menuStars.vybraneOpakovanie || 0;
  const ratanieFinished = useMemo(() => menuStars.ratanieLevels.filter(stars => stars === 5).length, [menuStars.ratanieLevels]);
  const slovaFinished = useMemo(() => menuStars.slovaLevels.filter(stars => stars === 5).length, [menuStars.slovaLevels]);
  const vybraneBFinished = useMemo(() => menuStars.vybraneBLevels.filter(stars => stars === 5).length, [menuStars.vybraneBLevels]);
  const vybraneMFinished = useMemo(() => menuStars.vybraneMLevels.filter(stars => stars === 5).length, [menuStars.vybraneMLevels]);
  const vybranePFinished = useMemo(() => menuStars.vybranePLevels.filter(stars => stars === 5).length, [menuStars.vybranePLevels]);
  const vybraneRFinished = useMemo(() => menuStars.vybraneRLevels.filter(stars => stars === 5).length, [menuStars.vybraneRLevels]);
  const vybraneSFinished = useMemo(() => menuStars.vybraneSLevels.filter(stars => stars === 5).length, [menuStars.vybraneSLevels]);
  const vybraneVFinished = useMemo(() => menuStars.vybraneVLevels.filter(stars => stars === 5).length, [menuStars.vybraneVLevels]);
  const vybraneZFinished = useMemo(() => menuStars.vybraneZLevels.filter(stars => stars === 5).length, [menuStars.vybraneZLevels]);

  const isBUnlocked = true;
  const isMUnlocked = vybraneBFinished === VYBRANE_B_GROUPS.length;
  const isPUnlocked = isMUnlocked && vybraneMFinished === VYBRANE_M_GROUPS.length;
  const isRUnlocked = isPUnlocked && vybranePFinished === VYBRANE_P_GROUPS.length;
  const isSUnlocked = isRUnlocked && vybraneRFinished === VYBRANE_R_GROUPS.length;
  const isVUnlocked = isSUnlocked && vybraneSFinished === VYBRANE_S_GROUPS.length;
  const isZUnlocked = isVUnlocked && vybraneVFinished === VYBRANE_V_GROUPS.length;

  const blockOutFinished = useMemo(() => menuStars.blockOutLevels.filter(stars => stars === 5).length, [menuStars.blockOutLevels]);
  const doplnovackyFinished = useMemo(
    () => menuStars.doplnovackyDtnlLevels.filter(stars => stars === 5).length + menuStars.doplnovackyBLevels.filter(stars => stars === 5).length,
    [menuStars.doplnovackyDtnlLevels, menuStars.doplnovackyBLevels]
  );
  const doplnovackyTotal = DOPLNOVACKY_DTNL_GROUPS.length + DOPLNOVACKY_B_GROUPS.length;

  return (
    <>
      <div className="menu-container">
        <MenuSection categoryId="matematika" title="Matematické hry">
            <div className="menu-card">
              <button className="btn-menu-ratanie menu-card-btn" onClick={() => navigate('/ratanie')}>
                <span className="menu-title">Rátanie + a -</span>
                <span className="menu-stars">{`${ratanieFinished} z 10`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-adaptivne menu-card-btn" onClick={() => navigate('/adaptivne-opakovanie')}>
                <span className="menu-title">Adaptívne násobenie/delenie</span>
                <span className="menu-stars" aria-label="Smajlíky">
                  <SmileyIcon size={20} stroke="currentColor" />
                </span>
              </button>
            </div>
        </MenuSection>

        <MenuSection categoryId="slovencina" title="Slovenčina">
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
        </MenuSection>

        <MenuSection categoryId="vybrane-slova" title="Vybrané slová">
            <div className="menu-card">
              <button
                className="btn-menu-vybrane-opakovanie menu-card-btn"
                onClick={() => navigate('/vybrane-opakovanie')}
              >
                <span className="menu-title">Opakovanie</span>
                <span className="menu-stars" aria-label="Smajlíky">
                  <SmileyIcon size={20} stroke="currentColor" />
                </span>
              </button>
            </div>

            <div className="menu-card">
              <button className="btn-menu-vybrane-b menu-card-btn" onClick={() => navigate('/vybrane-b')}>
                <span className="menu-title">B</span>
                <span className="menu-stars">{`${vybraneBFinished} z ${VYBRANE_B_GROUPS.length}`}</span>
              </button>
            </div>

            <div className="menu-card">
              <button
                className={`btn-menu-vybrane-m menu-card-btn${!isMUnlocked ? ' menu-card-locked' : ''}`}
                onClick={() => isMUnlocked && navigate('/vybrane-m')}
                disabled={!isMUnlocked}
                title={!isMUnlocked ? 'Najprv dokonči B' : undefined}
              >
                <span className="menu-title">M</span>
                <span className="menu-stars">
                  {isMUnlocked ? `${vybraneMFinished} z ${VYBRANE_M_GROUPS.length}` : 'Najprv dokonči B'}
                </span>
              </button>
            </div>

            <div className="menu-card">
              <button
                className={`btn-menu-vybrane-p menu-card-btn${!isPUnlocked ? ' menu-card-locked' : ''}`}
                onClick={() => isPUnlocked && navigate('/vybrane-p')}
                disabled={!isPUnlocked}
                title={!isPUnlocked ? 'Najprv dokonči M' : undefined}
              >
                <span className="menu-title">P</span>
                <span className="menu-stars">
                  {isPUnlocked ? `${vybranePFinished} z ${VYBRANE_P_GROUPS.length}` : 'Najprv dokonči M'}
                </span>
              </button>
            </div>

            <div className="menu-card">
              <button
                className={`btn-menu-vybrane-r menu-card-btn${!isRUnlocked ? ' menu-card-locked' : ''}`}
                onClick={() => isRUnlocked && navigate('/vybrane-r')}
                disabled={!isRUnlocked}
                title={!isRUnlocked ? 'Najprv dokonči P' : undefined}
              >
                <span className="menu-title">R</span>
                <span className="menu-stars">
                  {isRUnlocked ? `${vybraneRFinished} z ${VYBRANE_R_GROUPS.length}` : 'Najprv dokonči P'}
                </span>
              </button>
            </div>

            <div className="menu-card">
              <button
                className={`btn-menu-vybrane-s menu-card-btn${!isSUnlocked ? ' menu-card-locked' : ''}`}
                onClick={() => isSUnlocked && navigate('/vybrane-s')}
                disabled={!isSUnlocked}
                title={!isSUnlocked ? 'Najprv dokonči R' : undefined}
              >
                <span className="menu-title">S</span>
                <span className="menu-stars">
                  {isSUnlocked ? `${vybraneSFinished} z ${VYBRANE_S_GROUPS.length}` : 'Najprv dokonči R'}
                </span>
              </button>
            </div>

            <div className="menu-card">
              <button
                className={`btn-menu-vybrane-v menu-card-btn${!isVUnlocked ? ' menu-card-locked' : ''}`}
                onClick={() => isVUnlocked && navigate('/vybrane-v')}
                disabled={!isVUnlocked}
                title={!isVUnlocked ? 'Najprv dokonči S' : undefined}
              >
                <span className="menu-title">V</span>
                <span className="menu-stars">
                  {isVUnlocked ? `${vybraneVFinished} z ${VYBRANE_V_GROUPS.length}` : 'Najprv dokonči S'}
                </span>
              </button>
            </div>

            <div className="menu-card">
              <button
                className={`btn-menu-vybrane-z menu-card-btn${!isZUnlocked ? ' menu-card-locked' : ''}`}
                onClick={() => isZUnlocked && navigate('/vybrane-z')}
                disabled={!isZUnlocked}
                title={!isZUnlocked ? 'Najprv dokonči V' : undefined}
              >
                <span className="menu-title">Z</span>
                <span className="menu-stars">
                  {isZUnlocked ? `${vybraneZFinished} z ${VYBRANE_Z_GROUPS.length}` : 'Najprv dokonči V'}
                </span>
              </button>
            </div>
        </MenuSection>

        <MenuSection categoryId="odmeny" title="Hry za odmenu" hidden>
            <div className="menu-card">
              <button className="btn-menu-blockout menu-card-btn" onClick={() => navigate('/block-out')}>
                <span className="menu-title">Block Out!</span>
                <span className="menu-stars">{`${blockOutFinished} z ${BLOCK_OUT_LEVELS.length}`}</span>
              </button>
            </div>
        </MenuSection>
      </div>
    </>
  );
}

function isVybraneLetterUnlocked(letter) {
  if (letter === 'b') return true;
  const bDone = getLevelStars('vybraneB', VYBRANE_B_GROUPS.length).filter(s => s === 5).length === VYBRANE_B_GROUPS.length;
  if (letter === 'm') return bDone;
  const mDone = bDone && getLevelStars('vybraneM', VYBRANE_M_GROUPS.length).filter(s => s === 5).length === VYBRANE_M_GROUPS.length;
  if (letter === 'p') return mDone;
  const pDone = mDone && getLevelStars('vybraneP', VYBRANE_P_GROUPS.length).filter(s => s === 5).length === VYBRANE_P_GROUPS.length;
  if (letter === 'r') return pDone;
  const rDone = pDone && getLevelStars('vybraneR', VYBRANE_R_GROUPS.length).filter(s => s === 5).length === VYBRANE_R_GROUPS.length;
  if (letter === 's') return rDone;
  const sDone = rDone && getLevelStars('vybraneS', VYBRANE_S_GROUPS.length).filter(s => s === 5).length === VYBRANE_S_GROUPS.length;
  if (letter === 'v') return sDone;
  const vDone = sDone && getLevelStars('vybraneV', VYBRANE_V_GROUPS.length).filter(s => s === 5).length === VYBRANE_V_GROUPS.length;
  if (letter === 'z') return vDone;
  return false;
}

export default function App() {
  return (
    <GameLayout>
      <div className="app-shell">
        <div className="app-container">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/zvuky" element={<SoundPreview />} />
            <Route path="/yi" element={<YiGame />} />
            <Route path="/obojake" element={<ObojakeGame />} />
            <Route path="/slova" element={<SlovaYiGame />} />
            <Route path="/doplnovacky" element={<DoplnovackyMenu />} />
            <Route path="/doplnovacky/dtnl" element={<DoplnovackyDtnlGame />} />
            <Route path="/doplnovacky/b" element={<DoplnovackyBGame />} />
            <Route path="/cudzie" element={<CudzieGame />} />
            <Route path="/vybrane-opakovanie" element={<VybraneOpakovanieGame />} />
            <Route path="/vybrane-b" element={<VybraneBGame />} />
            <Route path="/vybrane-m" element={isVybraneLetterUnlocked('m') ? <VybraneMGame /> : <Navigate to="/vybrane-b" replace />} />
            <Route path="/vybrane-p" element={isVybraneLetterUnlocked('p') ? <VybranePGame /> : <Navigate to="/vybrane-b" replace />} />
            <Route path="/vybrane-r" element={isVybraneLetterUnlocked('r') ? <VybraneRGame /> : <Navigate to="/vybrane-b" replace />} />
            <Route path="/vybrane-s" element={isVybraneLetterUnlocked('s') ? <VybraneSGame /> : <Navigate to="/vybrane-b" replace />} />
            <Route path="/vybrane-v" element={isVybraneLetterUnlocked('v') ? <VybraneVGame /> : <Navigate to="/vybrane-b" replace />} />
            <Route path="/vybrane-z" element={isVybraneLetterUnlocked('z') ? <VybraneZGame /> : <Navigate to="/vybrane-b" replace />} />
            <Route path="/ratanie" element={<RatanieGame />} />
            <Route path="/nasobenie-5" element={<Nasobenie5Game />} />
            <Route path="/delenie-5" element={<Delenie5Game />} />
            <Route path="/adaptivne-opakovanie" element={<AdaptivneOpakovanieGame />} />
            <Route path="/nasobenie-3" element={<Navigate to="/nasobenie-5" replace />} />
            <Route path="/delenie-3" element={<Navigate to="/delenie-5" replace />} />
            <Route path="/block-out" element={<BlockOutGame />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </GameLayout>
  );
}
