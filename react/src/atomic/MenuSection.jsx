import { useId, useState } from 'react';

export default function MenuSection({ categoryId, title, hidden = false, children }) {
  const id = useId();
  const storageKey = `laurickaMenuCollapsed:${categoryId}`;
  const [expanded, setExpanded] = useState(() => {
    try {
      return localStorage.getItem(storageKey) !== 'true';
    } catch {
      return true;
    }
  });

  function toggle() {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);
    try {
      localStorage.setItem(storageKey, String(!nextExpanded));
    } catch {
      // Collapsing still works when browser storage is unavailable.
    }
  }

  return (
    <section className="menu-section" hidden={hidden} aria-labelledby={`${id}-heading`}>
      <h2 className="menu-section-heading">
        <button
          type="button"
          className="menu-divider menu-category-toggle"
          id={`${id}-heading`}
          aria-expanded={expanded}
          aria-controls={`${id}-cards`}
          onClick={toggle}
        >
          <span className="menu-category-label">
            {title}
            <svg className="menu-category-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={expanded ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
            </svg>
          </span>
        </button>
      </h2>
      <div className="menu-cards" id={`${id}-cards`} hidden={!expanded}>
        {children}
      </div>
    </section>
  );
}
