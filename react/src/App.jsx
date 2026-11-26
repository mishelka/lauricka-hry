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
import Menu, { MenuSection, MenuItem} from './atomic/Menu.jsx';
import useDevUnlock from './utils/useDevUnlock';
import { YiGame, ObojakeGame, SlovaYiGame, CudzieGame, DoplnovackyMenu, DoplnovackyDtnlGame, DoplnovackyBGame } from './games/slovencina';
import { VybraneBGame, VybraneMGame, VybranePGame, VybraneRGame, VybraneSGame, VybraneVGame, VybraneZGame, VybraneOpakovanieGame } from './games/vybraneSlova';
import { RatanieGame, Nasobenie5Game, Delenie5Game, AdaptivneOpakovanieGame } from './games/matematika';
import { BlockOutGame, BLOCK_OUT_LEVELS } from './games/odmeny';
import { AudioTalePlayer, PlayIcon, PauseIcon, SmileyIcon } from './atomic';
import { AUDIO_TALES } from './data/audioTales';
import { useEffect, useMemo, useState } from "react";
import { renderStars } from './utils/renderUtils.jsx';

export const TopActionsContext = GameLayoutContext;
const VYBRANE_LETTERS = ['b', 'm', 'p', 'r', 's', 'v', 'z'];

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
  const ratanieFinished = useMemo(() => menuStars.ratanieLevels.filter(stars => stars === 5).length, [menuStars.ratanieLevels]);
  const slovaFinished = useMemo(() => menuStars.slovaLevels.filter(stars => stars === 5).length, [menuStars.slovaLevels]);

  const VYBRANE = {
    'b': {
      groups: VYBRANE_B_GROUPS,
      prev: null,
      finished: useMemo(() => menuStars.vybraneBLevels.filter(stars => stars === 5).length, [menuStars.vybraneBLevels])
    },
    'm': {
      groups: VYBRANE_M_GROUPS,
      prev: 'b',
      finished: useMemo(() => menuStars.vybraneMLevels.filter(stars => stars === 5).length, [menuStars.vybraneMLevels])
    },
    'p': {
      groups: VYBRANE_P_GROUPS,
      prev: 'm',
      finished: useMemo(() => menuStars.vybranePLevels.filter(stars => stars === 5).length, [menuStars.vybranePLevels])
    },
    'r': {
      groups: VYBRANE_R_GROUPS,
      prev: 'p',
      finished: useMemo(() => menuStars.vybraneRLevels.filter(stars => stars === 5).length, [menuStars.vybraneRLevels])
    },
    's': {
      groups: VYBRANE_S_GROUPS,
      prev: 'r',
      finished: useMemo(() => menuStars.vybraneSLevels.filter(stars => stars === 5).length, [menuStars.vybraneSLevels])
    },
    'v': {
      groups: VYBRANE_V_GROUPS,
      prev: 's',
      finished: useMemo(() => menuStars.vybraneVLevels.filter(stars => stars === 5).length, [menuStars.vybraneVLevels])
    },
    'z': {
      groups: VYBRANE_Z_GROUPS,
      prev: 'v',
      finished: useMemo(() => menuStars.vybraneZLevels.filter(stars => stars === 5).length, [menuStars.vybraneZLevels])
    },
  };

  function isUnlocked(letter) {
    let finished = false;
    switch(letter) {
      case 'b': finished = true; break;
      default: finished = VYBRANE[letter].finished === VYBRANE[letter].groups.length; break;
    }
    return finished;
  }

  const doplnovackyFinished = useMemo(
    () => menuStars.doplnovackyDtnlLevels.filter(stars => stars === 5).length + menuStars.doplnovackyBLevels.filter(stars => stars === 5).length,
    [menuStars.doplnovackyDtnlLevels, menuStars.doplnovackyBLevels]
  );
  const doplnovackyTotal = DOPLNOVACKY_DTNL_GROUPS.length + DOPLNOVACKY_B_GROUPS.length;

  return (
    <>
      <Menu>
        <MenuSection categoryId="matematika" title="Matematické hry">
          <MenuItem title="Plus a Mínus"
                    url="/ratanie"
                    type="text"
                    data={`${ratanieFinished} z 10`}
                    className="btn-menu-ratanie"
          />
          <MenuItem title="Krát a Deleno"
                    url="/adaptivne-opakovanie"
                    type="smiley"
                    className="btn-menu-adaptivne"
          />
        </MenuSection>

        <MenuSection categoryId="slovencina" title="Slovenčina">
          <MenuItem
            title="Mäkké a Tvrdé"
            url="/yi"
            type="stars"
            data={yiStars}
            className="btn-menu-yi"
          >{yiStars >= 5 && (
            <AudioTalePlayer
              taleUrl={AUDIO_TALES.yi}
              className="menu-play-btn"
              playLabel={<PlayIcon size={22} />}
              pauseLabel={<PauseIcon size={22} />}
            />
          )}
          </MenuItem>

          <MenuItem
            title="Obojaké"
            url="/obojake"
            type="stars"
            data={obojakeStars}
            className="btn-menu-obojake"
          >{obojakeStars >= 5 && (
            <AudioTalePlayer
              taleUrl={AUDIO_TALES.obojake}
              className="menu-play-btn"
              playLabel={<PlayIcon size={22} />}
              pauseLabel={<PauseIcon size={22} />}
            />
          )}
          </MenuItem>

          <MenuItem title="Slová"
                    url="/slova"
                    type="text"
                    data={`${slovaFinished} z 8`}
                    className="btn-menu-slova"
          />

          <MenuItem title="Cudzie"
                    url="/cudzie"
                    type="stars"
                    data={cudzieStars}
                    className="btn-menu-cudzie"
          />

          <MenuItem title="Doplňovačky"
                    url="/doplnovacky"
                    type="text"
                    data={`${doplnovackyFinished} z ${doplnovackyTotal}`}
                    className="btn-menu-doplnovacky"
          />
        </MenuSection>

        <MenuSection categoryId="vybrane-slova" title="Vybrané slová">
          <MenuItem title="Opakovanie"
                    url="/vybrane-opakovanie"
                    type="smiley"
                    className="btn-menu-vybrane-opakovanie"
          />
          {Object.keys(VYBRANE).map((c) =>
            <div key={c}>
              <MenuItem key={c} title={c.toUpperCase()}
                        url={isUnlocked(c) ? `/vybrane-${c}` : null}
                        type="text"
                        data={isUnlocked(c) ? `${VYBRANE[c].finished} z ${VYBRANE[c].groups.length}` : `Najprv dokonči ${VYBRANE[c].prev.toUpperCase()}`}
                        locked={!isUnlocked(c)}
                        className={`btn-menu-vybrane-${c}`}
            />
            </div>)}
        </MenuSection>
      </Menu>
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
