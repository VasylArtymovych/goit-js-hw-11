import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import './css/styles.css';
import templateFunction from './templates/pxbayImgs.hbs';
import userRequest from './js/request-to-server';
import LoadBtn from './js/loadMoreImgs';

const request = new userRequest();
const loadBtn = new LoadBtn({
    selector: '[data-action="load"]',
    hidden: true,
});

const refs = {
    form: document.querySelector('#search-form'),
    searchBtn: document.querySelector('.search-btn'),
    gallery: document.querySelector('.gallery')
};

refs.form.addEventListener('submit', onSearchClick);
loadBtn.refs.loadBtn.addEventListener('click', onLoadBtnClick);
refs.gallery.addEventListener('click', onImgClick);

function onSearchClick(evt){
    evt.preventDefault();

    const searchData = evt.target.elements.searchQuery.value;
    request.query = searchData;

    if(searchData === '') return;

    clearGalleryContainer();
    request.resetPage();
    fetchAndRenderImages();
    

    evt.target.reset();
};

function onLoadBtnClick(){
    fetchAndRenderImages();
}

function onImgClick(evt){
    if (evt.target.nodeName !== "IMG") return;
    let gallery = new SimpleLightbox('.gallery .photo-card a')
    gallery.open()
}

async function fetchAndRenderImages(){
    try {
        loadBtn.show();
        loadBtn.disable();
        const images = await request.fetchImages();
        console.log(images);
        if (images.length === 0) {return}
        renderImages(images);
        request.incrementPage();
        loadBtn.able();

    } catch (error) {
        console.log(error.message);
    }
    
}

function renderImages(images){
    const murkup = templateFunction(images);
    console.log();
    refs.gallery.insertAdjacentHTML('beforeend', murkup);
}

function clearGalleryContainer(){
    refs.gallery.innerHTML = '';
}