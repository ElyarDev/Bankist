'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn =>
  btn.addEventListener('click', openModal)
)

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLL

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // })

  section1.scrollIntoView({ behavior: 'smooth' });
})

// PAGE NAVIGATION

// first way
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);

//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
//   })
// })

// second way (BEST)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // checking
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})

// TABBED COMPONENT

tabsContainer.addEventListener('click', function (e) {
  // getting btn 
  const clicked = e.target.closest('.operations__tab');

  // guard clause
  if (!clicked) return;

  // active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  // activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
})

// MENU FADE ANIMATION

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // change opacity
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    })

    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// STICKY NAVIGATION

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   }
//   else {
//     nav.classList.remove('sticky');
//   }
// })

// STICKY NAVIGATION (intersection Observer)

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  }
  else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// REVEAL SECTIONS

const allSections = document.querySelectorAll('.section')

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');

    // observer.unobserv(entry.target);
  })
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

// LAZY LOADING iMAGES 

const imgTargets = document.querySelectorAll('img[data-src]');

const loadimg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace img
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserv(entry.target);
}

const imgObserver = new IntersectionObserver(loadimg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER COMPONENT

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  }

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot =>
      dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  }

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    }
    else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    }
    else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  }
  init()

  // event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // keyboard event
  document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = Number(e.target.dataset.slide);

      goToSlide(curSlide);
      activateDot(curSlide);
    }
  })
}
slider();

//////////////////////////////////
//////////////////////////////////
////LECTURES

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);

const btnCloseCookie = document.querySelector('.btn--close-cookie');
btnCloseCookie.addEventListener('click', function () {
  message.remove();
})

// *******************************************************************************************

message.style.backgroundColor = '#37383d';
message.style.width = '104.1%';

// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).color);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// *******************************************************************************************

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);

//   e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);
// });

// *******************************************************************************************

// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'black';

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// *******************************************************************************************

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }

// const obsOption = {
//   root: null,
//   threshold: 0.1
// }

// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1);