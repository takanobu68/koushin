window.addEventListener('DOMContentLoaded', () => {
  init();
  const isAccessed = checkStorage();
  isAccessed ? skipLoading() : checkPanningImgLoading();
});

function init() {
  createIEBuster();
  document.getElementById('hamburger').addEventListener('click', hamburger);
}

function skipLoading() {
  hideSpecificDOM();
  createSwiper();
}

function checkPanningImgLoading() {
  imagesLoaded(
    document.querySelector('.pan'),
    {
      background: true,
    },
    () => {
      checkSliderImgLoading();
    }
  );
}

function checkSliderImgLoading() {
  imagesLoaded(document.querySelector('.swiper-wrapper'), () => {
    startLoading();
  });
}

function startLoading() {
  stopScroll();

  const bar = startProgressBar();

  bar.animate(1.0, () => {
    loadingAnime();
  });
}

function loadingAnime() {
  const animeTl = anime.timeline({ duration: 100, easing: 'linear' });
  animeTl
    .add({
      targets: '#loading_text',
      opacity: 0,
    })
    .add(
      {
        targets: '.loader_cover-up',
        scaleY: 0,
        duration: 300,
      },
      1
    )
    .add(
      {
        targets: '.loader_cover-down',
        scaleY: 0,
        duration: 300,
      },
      1
    )
    .add({
      complete: function () {
        document.querySelector('#loading').style.display = 'none';
        startPanning();
      },
    });
}

function startPanning() {
  anime({
    targets: '.pan',
    opacity: 0,
    duration: 4000,
    delay: 1000,
    easing: 'linear',
    complete: function () {
      document.querySelector('.pan').style.display = 'none';
      workScroll();
      createSwiper();
    },
  });
}

function stopScroll() {
  document.addEventListener('touchmove', noScroll, { passive: false });
  document.addEventListener('mousewheel', noScroll, { passive: false });
}

function workScroll() {
  document.removeEventListener('touchmove', noScroll, { passive: false });
  document.removeEventListener('mousewheel', noScroll, { passive: false });
}

function noScroll(e) {
  e.preventDefault();
}

function startProgressBar() {
  const bar = new ProgressBar.Line(loading_text, {
    strokeWidth: 0.1,
    easing: 'easeInOut',
    duration: 2000,
    color: '#000',
    trailColor: '#eee',
    trailWidth: 0.1,
    text: {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        padding: '0',
        marginTop: '-30px',
        transform: 'translate(-50%,-50%)',
        'font-size': '3rem',
        color: '#000',
      },
      autoStyleContainer: false,
    },
    step: function (state, bar) {
      bar.setText(Math.round(bar.value() * 100) + ' %');
    },
  });
  return bar;
}

function createIEBuster() {
  ieBuster({
    mainText:
      'ご利用のインターネットブラウザは推奨環境ではありません。Webサイトの動作が保証できませんので、最新の Google Chrome をご利用ください。',
    linkText: 'ダウンロードページへ',
    linkUrl: 'https://www.google.com/chrome/',
  });
}

function createSwiper() {
  const swiper = new Swiper('.swiper-container', {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
    },
  });

  createObserver(swiper);
}

function hideSpecificDOM() {
  document.querySelector('#loading').style.display = 'none';
  document.querySelector('.pan').style.display = 'none';
}

function createObserver(swiper) {
  clickSliderControl(swiper);

  const options = {
    root: null,
    rootMargin: '0px 0px',
    threshold: 0.25,
  };

  const target = document.querySelector('.target');
  const observer = new IntersectionObserver(controlSlide);

  observer.observe(target);

  function controlSlide(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (
          !document
            .getElementById('header__nav')
            .classList.contains('op-hamburger')
        ) {
          swiper.autoplay.start();
        }
      } else {
        swiper.autoplay.stop();
      }
    });
  }
}

function hamburger() {
  document.getElementById('bar-top').classList.toggle('op-top');
  document.getElementById('bar-middle').classList.toggle('op-middle');
  document.getElementById('bar-bottom').classList.toggle('op-bottom');
  document.getElementById('header__nav').classList.toggle('op-menu');
  document.getElementById('hamburger').classList.toggle('op-hamburger');
}

function clickSliderControl(swiper) {
  document.getElementById('hamburger').addEventListener('click', function () {
    this.classList.contains('op-hamburger')
      ? swiper.autoplay.stop()
      : swiper.autoplay.start();
  });
}

function checkStorage() {
  if (sessionStorage.getItem('access')) {
    return true;
  } else {
    sessionStorage.setItem('access', 0);
    return false;
  }
}
