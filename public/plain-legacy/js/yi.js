const originalneUlohy = window.YI_TASKS || [];
const GAME_UTILS = window.GAME_UTILS;
const PLAYER = window.PLAYER;

let poradie = [], index = 0, hit = 0, miss = 0, chybnePismena = new Set();
let blokovane = false;
let bestStars = PLAYER ? PLAYER.getBestStars('yi') : 0;
let mistakesOnCurrent = 0;

function renderBestStars() {
    const best = document.getElementById('best-stars');
    if (!best) return;
    best.innerText = `Najviac hviezd: ${bestStars}/5 ★`;
}

function zamiesajSadu() {
    poradie = [...originalneUlohy].sort(() => Math.random() - 0.5);
    index = 0; hit = 0; miss = 0; chybnePismena.clear();
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
    const bTvrde = document.getElementById('btn-tvrde');
    const bMakke = document.getElementById('btn-makke');
    bTvrde.disabled = bMakke.disabled = false;
    bTvrde.innerHTML = 'Tvrdá Y';
    bMakke.innerHTML = 'Mäkká I';
    blokovane = false;
    mistakesOnCurrent = 0;
}

function zobrazVysledky() {
    const stars = GAME_UTILS.showResults({ miss, wrongItems: chybnePismena });
    bestStars = PLAYER ? PLAYER.updateBestStars('yi', stars) : Math.max(bestStars, stars);
    renderBestStars();
}

function check(typ) {
    if (blokovane) return;
    blokovane = true;
    const bTvrde = document.getElementById('btn-tvrde');
    const bMakke = document.getElementById('btn-makke');
    const btn = (typ === 'tvrde') ? bTvrde : bMakke;

    if (typ === poradie[index].type) {
        if (mistakesOnCurrent === 0) {
            hit++;
            document.getElementById('hit').innerText = hit;
        }
        btn.innerHTML += '<span class="icon">✅</span>';
        bTvrde.disabled = bMakke.disabled = true;
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
