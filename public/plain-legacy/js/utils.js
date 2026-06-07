window.GAME_UTILS = {
    triggerFireworks,
    showResults
};

function triggerFireworks(overlayId = 'fireworks-overlay') {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;

    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
        p.style.left = '50%';
        p.style.top = '25%';
        overlay.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 400 + 100;

        p.animate(
            [
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`, opacity: 0 }
            ],
            { duration: 2500, easing: 'ease-out' }
        ).onfinish = () => p.remove();
    }
}

function showResults({ miss, wrongItems, gameUiId = 'game-ui', resultBoxId = 'vysledok-box', starsId = 'hviezdy', wrongTextId = 'chyby-text' }) {
    const gameUi = document.getElementById(gameUiId);
    const resultBox = document.getElementById(resultBoxId);
    const stars = document.getElementById(starsId);
    const wrongText = document.getElementById(wrongTextId);

    if (!gameUi || !resultBox || !stars || !wrongText) return;

    gameUi.style.display = 'none';
    resultBox.style.display = 'block';

    let pocetHviezd = 0;
    if (miss === 0) pocetHviezd = 5;
    else if (miss <= 2) pocetHviezd = 4;
    else if (miss <= 4) pocetHviezd = 3;
    else if (miss <= 6) pocetHviezd = 2;
    else pocetHviezd = 1;

    let htmlStars = '';
    for (let i = 0; i < 5; i++) {
        htmlStars += `<span class="${i < pocetHviezd ? 'star-gold' : 'star-grey'}">★</span>`;
    }
    stars.innerHTML = htmlStars;

    const wrongList = Array.from(wrongItems);
    wrongText.innerText = wrongList.length > 0
        ? 'Precvič si: ' + wrongList.join(', ')
        : 'Výborne, žiadne chyby!';

    return pocetHviezd;
}