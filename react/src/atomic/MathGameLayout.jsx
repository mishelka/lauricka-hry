import './MathGameLayout.css';

export default function MathGameLayout({ variant = 'math', children }) {
  return <div className="math-game-layout" data-variant={variant}>{children}</div>;
}
