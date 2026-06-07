const skupinyUloh = (window.SLOVA_YI_GROUPS && window.SLOVA_YI_GROUPS.length > 0)
    ? window.SLOVA_YI_GROUPS
    : [window.SLOVA_YI_TASKS || []];
const GAME_UTILS = window.GAME_UTILS;
const PLAYER = window.PLAYER;
const GAME_STATE_KEY = 'slovaYiGameStateV1';
const MAX_STARS = 5;

let poradie = [];
let index = 0;
let hit = 0;
let miss = 0;
let chybneSlova = new Set();
let blokovane = false;
let selectedLevelIndex = null;
let levelStars = PLAYER ? PLAYER.getLevelStars('slovaYi', skupinyUloh.length) : getDefaultLevelStars();
let currentView = 'menu';
let mistakesOnCurrent = 0;

function getAnswerButtons() {
    return document.querySelectorAll('#game-ui .button-container button');
}

function getDefaultLevelStars() {
    return new Array(skupinyUloh.length).fill(0);
}

function sanitizeLevelStars(value) {
    const fallback = getDefaultLevelStars();
    if (!Array.isArray(value)) return fallback;

    return fallback.map((_, i) => {
        const current = Number(value[i]);
        if (!Number.isFinite(current)) return 0;
        return Math.max(0, Math.min(MAX_STARS, Math.floor(current)));
    });
}

function getDefaultState() {
    return {
        view: 'menu',
        selectedLevelIndex: null,
        poradie: [],
        index: 0,
        hit: 0,
        miss: 0,
        mistakesOnCurrent: 0,
        chybneSlova: []
    };
}

function loadGameState() {
    const fallback = getDefaultState();

    try {
        const raw = localStorage.getItem(GAME_STATE_KEY);
        if (!raw) return fallback;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return fallback;

        const selected = Number(parsed.selectedLevelIndex);
        const nextState = {
            ...fallback,
            view: parsed.view === 'game' || parsed.view === 'result' ? parsed.view : 'menu',
            selectedLevelIndex: Number.isInteger(selected) ? selected : null,
            poradie: Array.isArray(parsed.poradie) ? parsed.poradie : [],
            index: Number.isInteger(parsed.index) ? parsed.index : 0,
            hit: Number.isInteger(parsed.hit) ? parsed.hit : 0,
            miss: Number.isInteger(parsed.miss) ? parsed.miss : 0,
            mistakesOnCurrent: Number.isInteger(parsed.mistakesOnCurrent) ? parsed.mistakesOnCurrent : 0,
            chybneSlova: Array.isArray(parsed.chybneSlova) ? parsed.chybneSlova : []
        };

        return nextState;
    } catch (e) {
        return fallback;
    }
}

function saveGameState() {
    const state = {
        view: currentView,
        selectedLevelIndex,
        levelStars,
        poradie,
        index,
        hit,
        miss,
        mistakesOnCurrent,
        chybneSlova: Array.from(chybneSlova)
    };

    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    } catch (e) {
        // Ignore storage failures.
    }
}

function isValidLevelIndex(levelIndex) {
    return Number.isInteger(levelIndex) && levelIndex >= 0 && levelIndex < skupinyUloh.length;
}

function getHighestUnlockedLevel() {
    let highest = 0;
    for (let i = 0; i < skupinyUloh.length - 1; i++) {
        if (levelStars[i] === MAX_STARS) highest = i + 1;
        else break;
    }
    return highest;
}

function isLevelUnlocked(levelIndex) {
    return levelIndex <= getHighestUnlockedLevel();
}

function updateCurrentLevelLabel() {
    const label = document.getElementById('current-level');
    if (selectedLevelIndex === null) {
        label.innerText = '';
        return;
    }
    const best = levelStars[selectedLevelIndex] || 0;
    label.innerText = `Level ${selectedLevelIndex + 1} • Najlepšie: ${best}/5 ★`;
}

function renderLevelMenu() {
    const levelsGrid = document.getElementById('levels-grid');
    if (!levelsGrid) return;

    levelsGrid.innerHTML = '';

    for (let i = 0; i < skupinyUloh.length; i++) {
        const best = levelStars[i] || 0;
        const unlocked = isLevelUnlocked(i);
        const starsText = '★'.repeat(best) + '☆'.repeat(MAX_STARS - best);

        const button = document.createElement('button');
        button.className = 'level-btn';
        if (best === MAX_STARS) button.classList.add('completed');
        if (!unlocked) button.classList.add('locked');
        button.disabled = !unlocked;
        button.innerHTML = `Level ${i + 1}<small>${starsText}</small>`;

        if (!unlocked) {
            button.innerHTML += `<small>Najprv získaj 5★ v leveli ${i}</small>`;
        } else {
            button.addEventListener('click', () => startLevel(i));
        }

        levelsGrid.appendChild(button);
    }
}

function showLevelMenu() {
    currentView = 'menu';
    document.getElementById('level-menu').style.display = 'block';
    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('vysledok-box').style.display = 'none';
    renderLevelMenu();
    saveGameState();
}

function zamiesajSadu() {
    const aktivnaSkupina = skupinyUloh[selectedLevelIndex] || [];
    poradie = [...aktivnaSkupina].sort(() => Math.random() - 0.5);
    index = 0;
    hit = 0;
    miss = 0;
    chybneSlova.clear();
    currentView = 'game';
    document.getElementById('hit').innerText = '0';
    document.getElementById('miss').innerText = '0';
    document.getElementById('level-menu').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    document.getElementById('vysledok-box').style.display = 'none';
    document.getElementById('next-level-btn').style.display = 'none';
    document.getElementById('level-progress-message').innerText = '';
    updateCurrentLevelLabel();
    saveGameState();
}

function novaUloha() {
    if (index >= poradie.length) {
        zobrazVysledky();
        return;
    }
    const uloha = poradie[index];
    document.getElementById('slovo').innerText = uloha.vypis;
    const buttons = getAnswerButtons();
    buttons.forEach(b => {
        b.disabled = false;
        b.innerHTML = b.getAttribute('data-text');
    });
    blokovane = false;
    mistakesOnCurrent = 0;
    saveGameState();
}

document.getElementById('btn-tvrde').setAttribute('data-text', 'Y');
document.getElementById('btn-tvrde-dlhe').setAttribute('data-text', 'Ý');
document.getElementById('btn-makke').setAttribute('data-text', 'I');
document.getElementById('btn-makke-dlhe').setAttribute('data-text', 'Í');

function zobrazVysledky() {
    currentView = 'result';
    const stars = GAME_UTILS.showResults({ miss, wrongItems: chybneSlova });
    const previousBest = levelStars[selectedLevelIndex] || 0;
    const currentBest = Math.max(previousBest, stars);
    levelStars = PLAYER
        ? PLAYER.updateLevelBestStars('slovaYi', selectedLevelIndex, currentBest, skupinyUloh.length)
        : (() => {
            const fallback = [...levelStars];
            fallback[selectedLevelIndex] = currentBest;
            return fallback;
        })();

    const progressMessage = document.getElementById('level-progress-message');
    const nextLevelButton = document.getElementById('next-level-btn');
    const isCurrentLevelCompleted = currentBest === MAX_STARS;
    const hasNextLevel = selectedLevelIndex < skupinyUloh.length - 1;

    if (isCurrentLevelCompleted) {
        progressMessage.innerText = hasNextLevel
            ? 'Level splnený na 5★. Môžeš pokračovať ďalej.'
            : 'Výborne, dokončil(a) si všetky levely!';
        nextLevelButton.style.display = hasNextLevel ? 'block' : 'none';
    } else {
        progressMessage.innerText = `Získal(a) si ${stars}/5 ★. Pre ďalší level potrebuješ 5/5 ★.`;
        nextLevelButton.style.display = 'none';
    }

    renderLevelMenu();
    saveGameState();
}

function check(typ) {
    if (blokovane) return;
    blokovane = true;
    const aktualnaUloha = poradie[index];
    const btn = document.getElementById('btn-' + typ);
    const typSkupina = typ.startsWith('tvrde') ? 'tvrde' : 'makke';

    if (typSkupina === aktualnaUloha.odpoved) {
        if (mistakesOnCurrent === 0) {
            hit++;
            document.getElementById('hit').innerText = hit;
        }
        btn.innerHTML += '<span class="icon">✅</span>';
        getAnswerButtons().forEach(b => b.disabled = true);
        setTimeout(() => { document.getElementById('slovo').innerText = aktualnaUloha.cele; }, 500);
        GAME_UTILS.triggerFireworks();
        index++;
        saveGameState();
        setTimeout(novaUloha, 2500);
    } else {
        mistakesOnCurrent++;
        miss++;
        document.getElementById('miss').innerText = miss;
        chybneSlova.add(aktualnaUloha.cele);
        btn.innerHTML += '<span class="icon">❌</span>';
        btn.disabled = true;
        saveGameState();
        blokovane = false;
    }
}

function startLevel(levelIndex) {
    if (!isLevelUnlocked(levelIndex)) return;
    selectedLevelIndex = levelIndex;
    zamiesajSadu();
    novaUloha();
}

function restart() {
    if (selectedLevelIndex === null) return;
    zamiesajSadu();
    novaUloha();
}

function nextLevel() {
    if (selectedLevelIndex === null) return;
    const candidate = selectedLevelIndex + 1;
    if (candidate >= skupinyUloh.length) return;
    if (!isLevelUnlocked(candidate)) return;
    startLevel(candidate);
}

function backToLevelMenu() {
    showLevelMenu();
}

function restoreFromSavedState() {
    const saved = loadGameState();
    levelStars = PLAYER ? PLAYER.getLevelStars('slovaYi', skupinyUloh.length) : getDefaultLevelStars();

    if (isValidLevelIndex(saved.selectedLevelIndex) && isLevelUnlocked(saved.selectedLevelIndex)) {
        selectedLevelIndex = saved.selectedLevelIndex;
    } else {
        selectedLevelIndex = null;
    }

    poradie = Array.isArray(saved.poradie) ? saved.poradie : [];
    index = Number.isInteger(saved.index) ? saved.index : 0;
    hit = Number.isInteger(saved.hit) ? saved.hit : 0;
    miss = Number.isInteger(saved.miss) ? saved.miss : 0;
    mistakesOnCurrent = Number.isInteger(saved.mistakesOnCurrent) ? Math.max(0, saved.mistakesOnCurrent) : 0;
    chybneSlova = new Set(Array.isArray(saved.chybneSlova) ? saved.chybneSlova : []);

    document.getElementById('hit').innerText = hit;
    document.getElementById('miss').innerText = miss;

    if (saved.view === 'result' && selectedLevelIndex !== null) {
        zobrazVysledky();
        return;
    }

    if (saved.view === 'game' && selectedLevelIndex !== null && poradie.length > 0) {
        document.getElementById('level-menu').style.display = 'none';
        document.getElementById('game-ui').style.display = 'block';
        document.getElementById('vysledok-box').style.display = 'none';
        currentView = 'game';
        updateCurrentLevelLabel();
        novaUloha();
        return;
    }

    showLevelMenu();
}

restoreFromSavedState();
