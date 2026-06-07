const GAME_UTILS = window.GAME_UTILS;
const PLAYER = window.PLAYER;
const TOTAL_EXAMPLES = 10;

let examples = [];
let index = 0;
let hit = 0;
let miss = 0;
let wrongExamples = new Set();
let inputValue = '';
let mistakesOnCurrent = 0;
let locked = false;
let bestStars = PLAYER ? PLAYER.getBestStars('ratanie') : 0;

function randomInt(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
}

function isOneDigit(n) {
    return n >= 0 && n <= 9;
}

function createExample() {
    while (true) {
        const op = Math.random() < 0.5 ? '+' : '-';
        let a = randomInt(100);
        let b = randomInt(100);

        if (isOneDigit(a) && isOneDigit(b)) continue;

        if (op === '+') {
            const result = a + b;
            if (result > 99) continue;
            return { a, b, op, result, text: `${a} + ${b}` };
        }

        if (a < b) {
            const tmp = a;
            a = b;
            b = tmp;
        }

        const result = a - b;
        return { a, b, op, result, text: `${a} - ${b}` };
    }
}

function generateExamples() {
    examples = [];
    while (examples.length < TOTAL_EXAMPLES) {
        examples.push(createExample());
    }
}

function renderBestStars() {
    const best = document.getElementById('best-stars');
    if (!best) return;
    best.innerText = `Najviac hviezd: ${bestStars}/5 ★`;
}

function setKeyboardDisabled(disabled) {
    document.querySelectorAll('#game-ui .keyboard button').forEach(button => {
        button.disabled = disabled;
    });
}

function renderInput() {
    const display = document.getElementById('answer-display');
    display.innerText = inputValue === '' ? '?' : inputValue;
}

function renderCurrentExample() {
    if (index >= examples.length) {
        showResults();
        return;
    }

    const ex = examples[index];
    document.getElementById('progress').innerText = `Príklad ${index + 1}/${TOTAL_EXAMPLES}`;
    document.getElementById('example').innerText = `${ex.text} = ?`;
    document.getElementById('status-line').innerText = '';
    inputValue = '';
    mistakesOnCurrent = 0;
    locked = false;
    setKeyboardDisabled(false);
    renderInput();
}

function pressDigit(digit) {
    if (locked) return;
    if (inputValue.length >= 3) return;
    if (inputValue === '0') inputValue = digit;
    else inputValue += digit;
    renderInput();
}

function backspace() {
    if (locked) return;
    inputValue = inputValue.slice(0, -1);
    renderInput();
}

function showStatus(text, ok) {
    const status = document.getElementById('status-line');
    status.innerText = text;
    status.style.color = ok ? '#28a745' : '#d9534f';
}

function submitAnswer() {
    if (locked) return;
    if (inputValue === '') return;

    const ex = examples[index];
    const answer = Number(inputValue);

    if (answer === ex.result) {
        locked = true;
        if (mistakesOnCurrent === 0) {
            hit++;
            document.getElementById('hit').innerText = hit;
        }
        showStatus('✅ Správne', true);
        GAME_UTILS.triggerFireworks();
        setKeyboardDisabled(true);
        index++;
        setTimeout(renderCurrentExample, 1200);
        return;
    }

    mistakesOnCurrent++;
    miss++;
    document.getElementById('miss').innerText = miss;
    wrongExamples.add(`${ex.text} = ${ex.result}`);
    showStatus('❌ Skús znova', false);
    inputValue = '';
    renderInput();
}

function showResults() {
    const stars = GAME_UTILS.showResults({ miss, wrongItems: wrongExamples });
    bestStars = PLAYER ? PLAYER.updateBestStars('ratanie', stars) : Math.max(bestStars, stars);
    renderBestStars();
}

function restart() {
    generateExamples();
    index = 0;
    hit = 0;
    miss = 0;
    wrongExamples.clear();
    inputValue = '';
    mistakesOnCurrent = 0;
    locked = false;
    document.getElementById('hit').innerText = '0';
    document.getElementById('miss').innerText = '0';
    document.getElementById('game-ui').style.display = 'block';
    document.getElementById('vysledok-box').style.display = 'none';
    renderCurrentExample();
}

window.pressDigit = pressDigit;
window.backspace = backspace;
window.submitAnswer = submitAnswer;
window.restart = restart;

renderBestStars();
restart();
