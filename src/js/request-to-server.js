const axios = require('axios');

export default class UserRequest{
    constructor(){
        this.searchQuery ='';
        this.page = 1;
    }

    async fetchImages(){
        const BASE_URL = 'https://pixabay.com/api/';
        const params = new URLSearchParams({
            key: '27181165-b46802ad165a0f6cfa045aac7',
            q: `${this.searchQuery}`,
            image_type: 'photo',
            orientation: "horizontal",
            safesearch: 'true',
            per_page: '40',
            page: `${this.page}`,
        })

        const response = await axios.get(`${BASE_URL}?${params}`);
        
        return response.data.hits;
    }

    get query(){
        return this.searchQuery;
    }

    set query(newQuery){
        this.searchQuery = newQuery;
    }

    incrementPage(){
        this.page += 1;
    }
    resetPage(){
        this.page = 1;
    }
}
