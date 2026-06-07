const originalneUlohy = window.SLOVA_YI_TASKS || [];
const GAME_UTILS = window.GAME_UTILS;

let poradie = [];
let index = 0;
let hit = 0;
let miss = 0;
let chybneSlova = new Set();
let blokovane = false;

function zamiesajSadu() {
    poradie = [...originalneUlohy].sort(() => Math.random() - 0.5);
    index = 0;
    hit = 0;
    miss = 0;
    chybneSlova.clear();
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
    const uloha = poradie[index];
    document.getElementById('slovo').innerText = uloha.vypis;
    const buttons = document.querySelectorAll('button');
    buttons.forEach(b => {
        b.disabled = false;
        b.innerHTML = b.getAttribute('data-text');
    });
    blokovane = false;
}

document.getElementById('btn-tvrde').setAttribute('data-text', 'Tvrdé Y');
document.getElementById('btn-makke').setAttribute('data-text', 'Mäkké I');

function zobrazVysledky() {
    GAME_UTILS.showResults({ miss, wrongItems: chybneSlova });
}

function check(typ) {
    if (blokovane) return;
    blokovane = true;
    const btn = document.getElementById('btn-' + typ);

    if (typ === poradie[index].odpoved) {
        hit++;
        document.getElementById('hit').innerText = hit;
        btn.innerHTML += '<span class="icon">✅</span>';
        document.querySelectorAll('button').forEach(b => b.disabled = true);
        setTimeout(() => { document.getElementById('slovo').innerText = poradie[index].cele; }, 500);
        GAME_UTILS.triggerFireworks();
        index++;
        setTimeout(novaUloha, 2500);
    } else {
        miss++;
        document.getElementById('miss').innerText = miss;
        chybneSlova.add(poradie[index].cele);
        btn.innerHTML += '<span class="icon">❌</span>';
        setTimeout(() => { blokovane = false; novaUloha(); }, 1000);
    }
}

function restart() { zamiesajSadu(); novaUloha(); }

zamiesajSadu();
novaUloha();
