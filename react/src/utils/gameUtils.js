export function shuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function getStarCount(miss) {
  if (miss === 0) return 5;
  if (miss <= 2) return 4;
  if (miss <= 4) return 3;
  if (miss <= 6) return 2;
  return 1;
}

export function getVybraneOptionId(task) {
  if (!task) return null;
  if (['tvrde', 'tvrde-dlhe', 'makke', 'makke-dlhe'].includes(task.odpoved)) {
    return task.odpoved;
  }
  if (task.vypis && task.cele) {
    const blankIdx = task.vypis.indexOf('_');
    if (blankIdx !== -1 && blankIdx < task.cele.length) {
      const ch = task.cele[blankIdx].toLowerCase();
      if (ch === 'i') return 'makke';
      if (ch === 'í') return 'makke-dlhe';
      if (ch === 'y') return 'tvrde';
      if (ch === 'ý') return 'tvrde-dlhe';
    }
  }
  return task.odpoved || null;
}

export function triggerFireworks(overlay) {
  if (!overlay) return;

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
    particle.style.left = '50%';
    particle.style.top = '50%';
    overlay.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 400 + 100;

    particle
      .animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
            opacity: 0
          }
        ],
        { duration: 2500, easing: 'ease-out' }
      )
      .onfinish = () => particle.remove();
  }
}
