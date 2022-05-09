var throttle = require('lodash.throttle');

const scrollBtn = document.querySelector('.scroll-btn');

window.addEventListener('scroll', throttle(onScroll, 300));
scrollBtn.addEventListener('click', onScrollBtnClick);

function onScroll(){

    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.clientHeight;
    
    if (scrollY > docHeight){
        scrollBtn.classList.add('is-visible');
    }else {
        scrollBtn.classList.remove('is-visible');
    }
}

function onScrollBtnClick(evt){
    evt.preventDefault();
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    })
}

export {onScroll, onScrollBtnClick}; 