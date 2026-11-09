// плеер
const btnPlay = document.getElementById('btnPlay');
const soundsBG = document.getElementById('sounds-block');
const music = document.getElementById('bgMusic');

music.volume = 0.3;

// визуальное состояние кнопки / эквалайзера
function setPlayingUI(isPlaying) {
    soundsBG.classList.toggle('active', isPlaying);
    btnPlay.classList.toggle('active', isPlaying);
    btnPlay.classList.toggle('white', isPlaying);
}

btnPlay.addEventListener('click', () => {
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
});

// состояние берём из самого аудио
music.addEventListener('play', () => { setPlayingUI(true); startRaf(); });
music.addEventListener('pause', () => setPlayingUI(false));
music.addEventListener('ended', () => setPlayingUI(false));

const btnPrevPlayer = document.getElementById('btnPrevPlayer');
const btnNextPlayer = document.getElementById('btnNextPlayer');

function skip(seconds) {
    if (!isFinite(music.duration)) return;
    music.currentTime = Math.min(Math.max(music.currentTime + seconds, 0), music.duration);
    renderProgress();
}

btnPrevPlayer.addEventListener('click', () => skip(-15));
btnNextPlayer.addEventListener('click', () => skip(15));

// ползунок и таймер
const playerLine = document.getElementById('playerLine');
const whiteLine = playerLine.querySelector('.whiteline');
const dot = playerLine.querySelector('.dot');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');

let dragging = false;
let dragRatio = 0;

function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    sec = Math.floor(sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const ss = String(sec % 60).padStart(2, '0');
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

function renderProgress() {
    const duration = isFinite(music.duration) ? music.duration : 0;
    const ratio = dragging
        ? dragRatio
        : (duration ? music.currentTime / duration : 0);
    const pct = Math.min(Math.max(ratio, 0), 1) * 100;

    whiteLine.style.width = pct + '%';
    dot.style.left = `calc(${pct}% - 5.5px)`;
    timeCurrent.textContent = formatTime(ratio * duration);
    timeTotal.textContent = formatTime(duration);
}

// плавная перерисовка, пока играет (timeupdate срабатывает слишком редко)
let rafId = null;
function startRaf() {
    if (rafId) return;
    const loop = () => {
        renderProgress();
        rafId = music.paused ? null : requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
}

['loadedmetadata', 'durationchange', 'timeupdate', 'seeked', 'ended'].forEach(ev =>
    music.addEventListener(ev, renderProgress)
);

// клик и перетаскивание по линии. Считаем долю, а не пиксели, поэтому zoom не мешает
function ratioFromEvent(e) {
    const rect = playerLine.getBoundingClientRect();
    return Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
}

playerLine.addEventListener('pointerdown', (e) => {
    if (!isFinite(music.duration)) return;
    dragging = true;
    dragRatio = ratioFromEvent(e);
    playerLine.classList.add('dragging');
    playerLine.setPointerCapture(e.pointerId);
    renderProgress();
});

playerLine.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dragRatio = ratioFromEvent(e);
    renderProgress();
});

function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    playerLine.classList.remove('dragging');
    music.currentTime = dragRatio * music.duration;
    renderProgress();
}

playerLine.addEventListener('pointerup', endDrag);
playerLine.addEventListener('pointercancel', endDrag);

renderProgress();
// плеер конец

// анимация прокрутки начало
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const section = entry.target.firstElementChild;
        section.classList.toggle('visible', entry.isIntersecting);
    });
}, {
    threshold: 0.6                 
});

document.querySelectorAll('section.hidden').forEach(section => {
    const wrap = document.createElement('div');
    wrap.className = 'reveal-wrap';
    section.parentNode.insertBefore(wrap, section);
    wrap.appendChild(section);
    observer.observe(wrap);
});
// анимация прокрутки конец


// галерея начало
const slides = document.querySelectorAll('.galeryImg');
const dots = document.querySelectorAll('.galery-slider-btns label');

let index = 2;

function show() {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

// клик по карточке или по точке делает её активной
slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
        index = i;
        show();
    });
});

dots.forEach((dotEl, i) => {
    dotEl.addEventListener('click', () => {
        index = i;
        show();
    });
});

document.getElementById('galeryNext').onclick = () => {
    index = (index + 1) % slides.length;
    show();
};

document.getElementById('galeryPrev').onclick = () => {
    index = (index - 1 + slides.length) % slides.length;
    show();
};

// галерея конец

// звук при ховерах
const hoverSound = document.getElementById('hoverSound');

document.querySelectorAll('a, button, .galeryImg, .btnCircle, .btnGlass, .aboutBook-imgs, .luren360').forEach(el => {
    el.addEventListener('click', () => {
        hoverSound.currentTime = 0;
        hoverSound.play();
        hoverSound.volume = 0.1;

    });
});
// звук при ховерах конец

// направления
document.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => {
        const img = card.querySelector('.btnGlass');
        img.classList.toggle('hide');

        const btn = card.querySelector('.playImgCategoryBtn');
        btn.classList.toggle('active');
    });
});
// направления конец

// адаптивность под разные экраны
const DESIGN_WIDTH = 1920;

function applyScale() {
    const scale = window.innerWidth / DESIGN_WIDTH;
    document.querySelector('.page').style.zoom = scale;
}

applyScale();
window.addEventListener('resize', applyScale);
// адаптивность под разные экраны конец
