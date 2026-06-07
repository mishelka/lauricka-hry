const originalneUlohy = window.OBOJAKE_TASKS || [];

let poradie = [];
let index = 0;
let hit = 0;
let miss = 0;
let chybnePismena = new Set();
let blokovane = false;

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
    const buttons = document.querySelectorAll('button');
    buttons.forEach(b => {
        b.disabled = false;
        b.innerHTML = b.getAttribute('data-text');
    });
    blokovane = false;
}

document.getElementById('btn-tvrde').setAttribute('data-text', 'Tvrdá Y');
document.getElementById('btn-makke').setAttribute('data-text', 'Mäkká I');
document.getElementById('btn-obojake').setAttribute('data-text', 'Obojaká');

function zobrazVysledky() {
    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('vysledok-box').style.display = 'block';

    let pocetHviezd = 0;
    if (miss === 0) pocetHviezd = 5;
    else if (miss <= 2) pocetHviezd = 4;
    else if (miss <= 4) pocetHviezd = 3;
    else if (miss <= 6) pocetHviezd = 2;
    else pocetHviezd = 1;

    let htmlStars = "";
    for (let i = 0; i < 5; i++) {
        htmlStars += `<span class="${i < pocetHviezd ? 'star-gold' : 'star-grey'}">★</span>`;
    }
    document.getElementById('hviezdy').innerHTML = htmlStars;
    document.getElementById('chyby-text').innerText = chybnePismena.size > 0
        ? 'Precvič si: ' + Array.from(chybnePismena).join(', ')
        : 'Výborne, žiadne chyby!';
}

function triggerFireworks() {
    const overlay = document.getElementById('fireworks-overlay');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.backgroundColor = `hsl(${Math.random()*360}, 80%, 60%)`;
        p.style.left = '50%'; p.style.top = '50%';
        overlay.appendChild(p);
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 400 + 100;
        p.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0)`, opacity: 0 }], { duration: 2500, easing: 'ease-out' }).onfinish = () => p.remove();
    }
}

function check(typ) {
    if (blokovane) return;
    blokovane = true;
    const btn = document.getElementById('btn-' + typ);

    if (typ === poradie[index].type) {
        hit++;
        document.getElementById('hit').innerText = hit;
        btn.innerHTML += '<span class="icon">✅</span>';
        document.querySelectorAll('button').forEach(b => b.disabled = true);
        triggerFireworks();
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
