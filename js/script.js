// плеер
const btnPlay = document.getElementById('btnPlay');
const soundsBG = document.getElementById('sounds-block');
const music = document.getElementById('bgMusic');

btnPlay.addEventListener('click', () => {
    if (btnPlay.classList.contains('active')) {
        soundsBG.classList.remove('active')
        btnPlay.classList.remove('active')
        btnPlay.classList.remove('white')

        music.pause();
    }
    else {
        soundsBG.classList.add('active')

        btnPlay.classList.add('active')
        btnPlay.classList.add('white')

        music.play();
        music.volume = 0.3;
    }
})

const btnPrevPlayer = document.getElementById('btnPrevPlayer');
const btnNextPlayer = document.getElementById('btnNextPlayer');

btnPrevPlayer.addEventListener('click', () => {
    if (!music.paused) {
        music.currentTime = music.currentTime - 15;
    }

})

btnNextPlayer.addEventListener('click', () => {
    if (!music.paused) {
        music.currentTime = music.currentTime + 15;
    }
})

music.addEventListener('ended', () => {
    soundsBG.classList.remove('active')
    btnPlay.classList.remove('active')
    btnPlay.classList.remove('white')
});
// плеер конец

// анимация прокрутки начало
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, {
    threshold: 0.7,
});

sections.forEach(section => observer.observe(section));
// анимация прокрутки конец


// галерея начало
const slides = document.querySelectorAll('.galeryImg');
const dots = document.querySelectorAll('.galery-slider-btns label');

let index = 2;

function show() {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

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
        img.classList.toggle('hide')

        const btn = card.querySelector('.playImgCategoryBtn');
        btn.classList.toggle('active')

            ;
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
