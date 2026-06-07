const PLAYER = window.PLAYER;

const AUDIO_TALES = {
    yi: 'https://dse097yy69ach.cloudfront.net/file_uploads/Janko_hrasko.mp3',
    obojake: 'https://dse097yy69ach.cloudfront.net/file_uploads/Ada_kralovna_cisel.mp3',
    ratanie: 'https://dse097yy69ach.cloudfront.net/file_uploads/Dlhy_Siroky_Bystrozraky.mp3',
    slovaYiLevels: [
        'https://dse097yy69ach.cloudfront.net/file_uploads/Hrncek_var.mp3',
        'https://dse097yy69ach.cloudfront.net/file_uploads/Dlhe_meno.mp3',
        'https://dse097yy69ach.cloudfront.net/file_uploads/Ako_isiel_Jack_hladat_svoje_stastie.mp3',
        'https://dse097yy69ach.cloudfront.net/file_uploads/Ako_uspat_zvieratka_na_farme.mp3',
        'https://dse097yy69ach.cloudfront.net/file_uploads/Cisarove_nove_saty.mp3',
        'https://dse097yy69ach.cloudfront.net/file_uploads/Dlhy_Siroky_Bystrozraky.mp3',
        'https://dse097yy69ach.cloudfront.net/file_uploads/Hlada_sa_zenich_pre_slecnu_Krtkovu.mp3',
        'https://dse097yy69ach.cloudfront.net/file_uploads/Hrncek_var.mp3'
    ]
};

let activeAudio = null;
let activeControl = null;

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

function attachStoryControl(buttonSelector, taleUrl) {
    if (!taleUrl) return;

    const button = document.querySelector(buttonSelector);
    if (!button) return;
    if (button.querySelector('.menu-play-btn')) return;

    const control = document.createElement('span');
    control.className = 'menu-play-btn';
    control.setAttribute('role', 'button');
    control.setAttribute('tabindex', '0');
    control.setAttribute('aria-label', 'Prehrať rozprávku');
    control.textContent = '▶';

    const audio = new Audio(taleUrl);
    audio.preload = 'none';

    function stopCurrentPlayback() {
        if (activeAudio && activeAudio !== audio) {
            activeAudio.pause();
            activeAudio.currentTime = 0;
            if (activeControl) activeControl.textContent = '▶';
        }
    }

    function togglePlayback(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!audio.paused) {
            audio.pause();
            control.textContent = '▶';
            return;
        }

        stopCurrentPlayback();
        audio.play().then(() => {
            activeAudio = audio;
            activeControl = control;
            control.textContent = '⏸';
        }).catch(() => {
            control.textContent = '▶';
        });
    }

    audio.addEventListener('ended', () => {
        control.textContent = '▶';
        if (activeAudio === audio) {
            activeAudio = null;
            activeControl = null;
        }
    });

    audio.addEventListener('pause', () => {
        if (audio.currentTime > 0 && !audio.ended) {
            control.textContent = '▶';
        }
    });

    control.addEventListener('click', togglePlayback);
    control.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            togglePlayback(event);
        }
    });

    button.appendChild(control);
}

const yiStars = PLAYER ? PLAYER.getBestStars('yi') : 0;
const obojakeStars = PLAYER ? PLAYER.getBestStars('obojake') : 0;
const ratanieStars = PLAYER ? PLAYER.getBestStars('ratanie') : 0;
const slovaLevels = PLAYER ? PLAYER.getLevelStars('slovaYi', 8) : new Array(8).fill(0);
const firstCompletedSlovaLevel = slovaLevels.findIndex(stars => stars === 5);

if (yiStars >= 5) attachStoryControl('.btn-makke', AUDIO_TALES.yi);
if (obojakeStars >= 5) attachStoryControl('.btn-obojake', AUDIO_TALES.obojake);
if (ratanieStars >= 5) attachStoryControl('.btn-ratanie', AUDIO_TALES.ratanie);
if (firstCompletedSlovaLevel >= 0) {
    attachStoryControl(
        '.btn-slova',
        AUDIO_TALES.slovaYiLevels[firstCompletedSlovaLevel] || AUDIO_TALES.slovaYiLevels[0]
    );
}
