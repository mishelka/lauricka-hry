const originalneUlohy = window.OBOJAKE_TASKS || [];
const GAME_UTILS = window.GAME_UTILS;
const PLAYER = window.PLAYER;

let poradie = [];
let index = 0;
let hit = 0;
let miss = 0;
let chybnePismena = new Set();
let blokovane = false;
let bestStars = PLAYER ? PLAYER.getBestStars('obojake') : 0;
let mistakesOnCurrent = 0;

function renderBestStars() {
    const best = document.getElementById('best-stars');
    if (!best) return;
    best.innerText = `Najviac hviezd: ${bestStars}/5 ★`;
}

function getAnswerButtons() {
    return document.querySelectorAll('#game-ui .button-container button');
}

function zamiesajSadu() {
    poradie = [...originalneUlohy].sort(() => Math.random() - 0.5);
    index = 0;
    hit = 0;
    miss = 0;
    chybnePismena.clear();
    document.getElementById('hit').innerText = '0';
    document.getElementById('miss').innerText = '0';
    document.getElementById('game-ui').style.display = 'block';
    document.getElementById('vysledok-box').style.display = 'none';
}

function novaUloha() {
    if (index >= poradie.length) {
        zobrazVysledky();
        return;
    }
    document.getElementById('pismeno').innerText = poradie[index].char;
    const buttons = getAnswerButtons();
    buttons.forEach(b => {
        b.disabled = false;
        b.innerHTML = b.getAttribute('data-text');
    });
    blokovane = false;
    mistakesOnCurrent = 0;
}

document.getElementById('btn-tvrde').setAttribute('data-text', 'Tvrdá Y');
document.getElementById('btn-makke').setAttribute('data-text', 'Mäkká I');
document.getElementById('btn-obojake').setAttribute('data-text', 'Obojaká');

function zobrazVysledky() {
    const stars = GAME_UTILS.showResults({ miss, wrongItems: chybnePismena });
    bestStars = PLAYER ? PLAYER.updateBestStars('obojake', stars) : Math.max(bestStars, stars);
    renderBestStars();
}

function check(typ) {
    if (blokovane) return;
    blokovane = true;
    const btn = document.getElementById('btn-' + typ);

    if (typ === poradie[index].type) {
        if (mistakesOnCurrent === 0) {
            hit++;
            document.getElementById('hit').innerText = hit;
        }
        btn.innerHTML += '<span class="icon">✅</span>';
        getAnswerButtons().forEach(b => b.disabled = true);
        GAME_UTILS.triggerFireworks();
        index++;
        setTimeout(novaUloha, 2500);
    } else {
        mistakesOnCurrent++;
        miss++;
        document.getElementById('miss').innerText = miss;
        chybnePismena.add(poradie[index].char);
        btn.innerHTML += '<span class="icon">❌</span>';
        btn.disabled = true;
        blokovane = false;
    }
}

function restart() { zamiesajSadu(); novaUloha(); }

renderBestStars();
zamiesajSadu();
novaUloha();
