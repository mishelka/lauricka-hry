const originalneUlohy = [
    {vypis: "D_vadlo", odpoved: "makke", cele: "Divadlo"},
    {vypis: "T_žba", odpoved: "makke", cele: "Ťažba"},
    {vypis: "L_pka", odpoved: "makke", cele: "Lipka"},
    {vypis: "K_no", odpoved: "makke", cele: "Kino"},
    {vypis: "Č_ta", odpoved: "makke", cele: "Číta"},
    {vypis: "Š_pka", odpoved: "makke", cele: "Šípka"},
    {vypis: "D_m", odpoved: "tvrde", cele: "Dym"},
    {vypis: "T_k", odpoved: "tvrde", cele: "Tyk"},
    {vypis: "N_tka", odpoved: "tvrde", cele: "Nytka"},
    {vypis: "H_dra", odpoved: "tvrde", cele: "Hydra"},
    {vypis: "L_ko", odpoved: "tvrde", cele: "Lyko"},
    {vypis: "K_tka", odpoved: "tvrde", cele: "Kytka"}
];

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
    document.getElementById('chyby-text').innerText = chybneSlova.size > 0
        ? 'Precvič si: ' + Array.from(chybneSlova).join(', ')
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

    if (typ === poradie[index].odpoved) {
        hit++;
        document.getElementById('hit').innerText = hit;
        btn.innerHTML += '<span class="icon">✅</span>';
        document.querySelectorAll('button').forEach(b => b.disabled = true);
        setTimeout(() => { document.getElementById('slovo').innerText = poradie[index].cele; }, 500);
        triggerFireworks();
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
