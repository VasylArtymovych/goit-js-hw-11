import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

import templateFunction from './templates/pxbayImgs.hbs';
import UserRequest from './js/request-to-server';
import LoadBtn from './js/loadMoreImgs';
import {onScroll, onScrollBtnClick} from "./js/scroll";

const userRequest = new UserRequest();
const loadBtn = new LoadBtn({
    selector: '[data-action="load"]',
    hidden: true,
});
let lightbox = new SimpleLightbox('.gallery a', {captionsData: 'alt', captionDelay: 500});

const refs = {
    form: document.querySelector('#search-form'),
    searchBtn: document.querySelector('.search-btn'),
    gallery: document.querySelector('.gallery')
};

refs.form.addEventListener('submit', onSearch);
loadBtn.refs.loadBtn.addEventListener('click', onLoadBtnClick);
refs.gallery.addEventListener('click', onImgClick);

function onSearch(evt){
    evt.preventDefault();

    const searchData = (evt.target.elements.searchQuery.value).trim();
    userRequest.query = searchData;

    if(searchData === '') {
        Notify.failure("Sorry, type the name on search field!");
        return;
    }
    
    clearGalleryContainer();
    userRequest.resetPage();
    fetchAndRenderImages().then(data => {
        const totalImgsFound = Number(data.totalHits)
        Notify.success(`Hooray! We found ${totalImgsFound} images.`);
    })

    evt.target.reset();
};



function onImgClick(evt){
    if (evt.target.nodeName !== "IMG") return;
}

async function fetchAndRenderImages(){
    try {
        loadBtn.show();
        loadBtn.disable();
        const fetchData = await userRequest.fetchImages();
        const images = fetchData.hits;
        const totalImgsFound = fetchData.totalHits;
        
    if (totalImgsFound === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        loadBtn.hide()
        return
    }
    if (totalImgsFound < 40) {
        loadBtn.hide()
    }
        renderImages(images);
        userRequest.incrementPage();
        lightbox.refresh();
        loadBtn.able();

        return fetchData;
        
    } catch (error) {
        Notify.failure(`${error.message}`);
    }
}

function onLoadBtnClick(){
    fetchAndRenderImages()
    .then(data => {
        const currentPage = userRequest.page;
        const totalPages = Math.ceil(Number(data.totalHits)/40);
        if (currentPage > totalPages) {
            Notify.warning("We're sorry, but you've reached the end of search results.")
            loadBtn.hide();
        }
    });
    
    lightbox.refresh()
}



function renderImages(images){
    const murkup = templateFunction(images);
    refs.gallery.insertAdjacentHTML('beforeend', murkup);
}

function clearGalleryContainer(){
    refs.gallery.innerHTML = '';
}


