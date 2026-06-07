const originalneUlohy = window.YI_TASKS || [];
const GAME_UTILS = window.GAME_UTILS;

let poradie = [], index = 0, hit = 0, miss = 0, chybnePismena = new Set();
let blokovane = false;

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
}

function zobrazVysledky() {
    GAME_UTILS.showResults({ miss, wrongItems: chybnePismena });
}

function check(typ) {
    if (blokovane) return;
    blokovane = true;
    const bTvrde = document.getElementById('btn-tvrde');
    const bMakke = document.getElementById('btn-makke');
    const btn = (typ === 'tvrde') ? bTvrde : bMakke;

    if (typ === poradie[index].type) {
        hit++;
        document.getElementById('hit').innerText = hit;
        btn.innerHTML += '<span class="icon">✅</span>';
        bTvrde.disabled = bMakke.disabled = true;
        GAME_UTILS.triggerFireworks();
        index++;
        setTimeout(novaUloha, 2500);
    } else {
        miss++;
        document.getElementById('miss').innerText = miss;
        chybnePismena.add(poradie[index].char);
        btn.innerHTML += '<span class="icon">❌</span>';
        setTimeout(() => { blokovane = false; novaUloha(); }, 1000);
    }
}

function restart() { zamiesajSadu(); novaUloha(); }

zamiesajSadu();
novaUloha();
