const PLAYER = window.PLAYER;

function renderStars(starsCount) {
    let html = '';
    for (let i = 0; i < 5; i++) {
        html += `<span class="${i < starsCount ? 'star-gold' : 'star-grey'}">★</span>`;
    }
    return html;
}

function setBestStarsText(elementId, gameId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const stars = PLAYER ? PLAYER.getBestStars(gameId) : 0;
    el.innerHTML = renderStars(stars);
}

setBestStarsText('yi-best-stars', 'yi');
setBestStarsText('obojake-best-stars', 'obojake');
setBestStarsText('ratanie-best-stars', 'ratanie');

function setFinishedLevelsText(elementId, gameId, totalLevels) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const levels = PLAYER ? PLAYER.getLevelStars(gameId, totalLevels) : new Array(totalLevels).fill(0);
    const finished = levels.filter(stars => stars === 5).length;
    el.innerText = `${finished} z ${totalLevels}`;
}

setFinishedLevelsText('slova-finished-levels', 'slovaYi', 8);
