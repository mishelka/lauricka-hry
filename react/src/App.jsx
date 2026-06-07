import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import YiGame from './components/YiGame';
import ObojakeGame from './components/ObojakeGame';
import SlovaYiGame from './components/SlovaYiGame';

const MENU_ITEMS = [
  { route: '/yi', label: 'Mäkké / Tvrdé (I / Y)', className: 'btn-menu-yi' },
  { route: '/obojake', label: 'Obojaké', className: 'btn-menu-obojake' },
  { route: '/slova', label: 'Slová', className: 'btn-menu-slova' }
];

function MenuPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Vyber si hru:</h1>
      <div className="menu-container">
        {MENU_ITEMS.map(item => (
          <button
            key={item.route}
            className={item.className}
            onClick={() => navigate(item.route)}
          >
            {item.label}
          </button>
        ))}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
