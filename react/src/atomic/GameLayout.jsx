import { createContext, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackIcon, HomeIcon, UserIcon, RestartIcon } from './Icons';
import PlayerProfileModal from './PlayerProfileModal';
import { getPlayerName } from '../utils/player';
import './GameLayout.css';

export const GameLayoutContext = createContext({ setRightAction: () => {} });

const TITLES = {
  '/': 'Vyber si hru', '/yi': 'Mäkké a tvrdé', '/obojake': 'Obojaké',
  '/slova': 'Slová', '/cudzie': 'Cudzie slová', '/doplnovacky': 'Doplňovačky',
  '/doplnovacky/dtnl': 'Doplňovačky dtnl', '/doplnovacky/b': 'Doplňovačky B',
  '/ratanie': 'Rátanie', '/nasobenie-5': 'Násobenie do 5', '/delenie-5': 'Delenie do 5',
  '/adaptivne-opakovanie': 'Adaptívne rátanie', '/vybrane-opakovanie': 'Opakovanie vybraných slov',
  '/block-out': 'Block Out!'
};

export default function GameLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [titleSlot, setTitleSlot] = useState(null);
  const [backSlot, setBackSlot] = useState(null);
  const [actionSlot, setActionSlot] = useState(null);
  const [statusSlot, setStatusSlot] = useState(null);
  const [rightAction, setRightAction] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef(null);
  const chromeRef = useRef(null);
  const spacerRef = useRef(null);
  const title = TITLES[pathname] || (pathname.startsWith('/vybrane-') ? `Vybrané slová po ${pathname.slice(-1).toUpperCase()}` : 'Lauričkine hry');
  const parentPath = pathname.startsWith('/doplnovacky/') ? '/doplnovacky' : null;
  const context = useMemo(() => ({ titleSlot, backSlot, actionSlot, statusSlot, setRightAction }), [titleSlot, backSlot, actionSlot, statusSlot]);

  useLayoutEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = event => {
      if (!event.target.closest('.header-action-slot')) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    const close = () => { setMenuOpen(false); menuButtonRef.current?.focus(); };
    const onKeyDown = event => { if (event.key === 'Escape') close(); };
    // Toolbar content is portaled: native listeners follow its DOM placement.
    document.addEventListener('keydown', onKeyDown);
    actionSlot?.addEventListener('click', close);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', onKeyDown);
      actionSlot?.removeEventListener('click', close);
    };
  }, [menuOpen, actionSlot]);

  useLayoutEffect(() => {
    function measure() {
      const height = chromeRef.current.getBoundingClientRect().height;
      spacerRef.current.style.height = `${height}px`;
      document.documentElement.style.setProperty('--game-chrome-height', `${height}px`);
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(chromeRef.current);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--game-chrome-height');
    };
  }, []);

  return (
    <GameLayoutContext.Provider value={context}>
      <div className="game-chrome" ref={chromeRef}>
        <header className="main-game-header" aria-label="Hlavné menu">
          <nav className="header-navigation" aria-label="Navigácia">
            {pathname !== '/' && <button type="button" className="header-icon-button header-home" onClick={() => navigate('/')} title="Domov" aria-label="Domov"><HomeIcon /></button>}
            <div className="header-back-slot" ref={setBackSlot}>
              {parentPath && <button type="button" className="header-icon-button header-back" onClick={() => navigate(parentPath)} title="Späť na výber doplňovačiek" aria-label="Späť"><BackIcon /></button>}
            </div>
          </nav>
          <div className="header-title-slot" ref={setTitleSlot}>
            <h1 className="header-default-title">{title}</h1>
          </div>
          <div className="header-action-slot">
            <button type="button" className="header-menu-toggle" ref={menuButtonRef} aria-label="Menu hry" aria-expanded={menuOpen} aria-controls={menuId} onClick={() => {
              setMenuOpen(!menuOpen);
              if (!menuOpen) requestAnimationFrame(() => actionSlot?.querySelector('button:not(:disabled)')?.focus());
            }}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
            </button>
            <div className="header-menu-content" ref={setActionSlot} id={menuId} data-open={menuOpen}>
              <div className="header-default-actions">{rightAction}</div>
            </div>
          </div>
          <button type="button" className="header-icon-button header-profile" onClick={() => setProfileOpen(true)} title={getPlayerName() || 'Profil hráča'} aria-label="Profil hráča"><UserIcon /></button>
        </header>
        <div className="game-status-slot" ref={setStatusSlot} />
      </div>
      <div ref={spacerRef} aria-hidden="true" />
      {children}
      <PlayerProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </GameLayoutContext.Provider>
  );
}

// Portals keep game controls in their owning React tree while sharing one header.
export function GameToolbar({ title, onBack, backTitle = 'Späť na výber úrovní', actions, onRestart }) {
  const { titleSlot, backSlot, actionSlot } = useContext(GameLayoutContext);
  return <>
    {titleSlot && title && createPortal(<h1 title={title}>{title}</h1>, titleSlot)}
    {backSlot && onBack && createPortal(<button type="button" className="header-icon-button header-back" onClick={onBack} title={backTitle} aria-label="Späť"><BackIcon /></button>, backSlot)}
    {actionSlot && (actions || onRestart) && createPortal(<div className="header-game-actions">{onRestart && <button type="button" onClick={onRestart} title="Reštartovať level" aria-label="Reštartovať level"><RestartIcon /></button>}{actions}</div>, actionSlot)}
  </>;
}

export function GameStatus({ children, variant = 'quiz', inline = false }) {
  const { statusSlot } = useContext(GameLayoutContext);
  const panel = <section className={`game-status game-status-${variant}`} aria-label="Stav hry">{children}</section>;
  return inline ? panel : statusSlot ? createPortal(panel, statusSlot) : null;
}
