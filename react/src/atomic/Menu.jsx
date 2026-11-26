import {useId, useState} from 'react';
import { SmileyIcon } from "./Icons.jsx";
import { useNavigate } from "react-router-dom";
import { renderStars } from "../utils/renderUtils.jsx";
import useAnimatedHeight from './hooks/useAnimatedHeight';
import styles from './Menu.module.scss';

export default function Menu({children}) {

  return <div className={styles.container}>
    {children}
  </div>
}

export function MenuSection({ categoryId, title, children }) {
  const id = useId();

  const storageKey = `laurickaMenuCollapsed:${categoryId}`;
  const [expanded, setExpanded] = useState(() => {
    try {
      return localStorage.getItem(storageKey) !== 'true';
    } catch {
      return true;
    }
  });
  const { wrapperRef, contentRef } = useAnimatedHeight(expanded);


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
    <section className={styles.section} aria-labelledby={`${id}-heading`}>
      <h2 className={styles.heading}>
        <button
          type="button"
          className={styles.divider}
          id={`${id}-heading`}
          aria-expanded={expanded}
          aria-controls={`${id}-cards`}
          onClick={toggle}
        >
          <span className={styles.label}>
            {title}
            <svg className={`${styles.categoryChevron} ${expanded ? styles.rotated : null}`}
                 viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path d='m6 15 6-6 6 6'/>
            </svg>
          </span>
        </button>
      </h2>
      <div ref={wrapperRef} className={styles.menuCardsWrapper}>
        <div ref={contentRef}
             className={`${styles.menuCards} ${expanded ? styles.isOpen : styles.isClosed}`}
             id={`${id}-cards`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export function MenuItem({ title, url, type, data, locked = false, className, children }) {
  const navigate = useNavigate();

  return <div className={styles.menuItem}>
    <button className={`${styles.btn} ${locked === true ? styles.menuCardLocked : null} ${className}`}
            onClick={() => navigate(url)}>
      <span className={styles.title}>{title}</span>
        {menuContent(type, data, locked)}
        {children}
    </button>
  </div>

  function menuContent(type, data, locked) {
    switch(type) {
      case 'smiley': return <span className={styles.stars} aria-label="Smajlíky"><SmileyIcon size={20} stroke="currentColor"/></span>
      case 'stars': return <span className={styles.stars}>{locked ? renderStars(data) : data}</span>;
      case 'text': return <span className={styles.stars}>{data}</span>;
    }
  }
}