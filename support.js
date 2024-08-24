// "Ctrl" + "D"
// "Ctrl" + "X" || "Delete"
//-> type what you want to replace with

//ONLY WEATHER API:


//ALL APIs:
const input = document.getElementById('input-search');


const apiKey = '';

const clientId = '';

const clientSecret = '';


const ulElement = document.querySelector('.playlist-box');

const liElement = ulElement.querySelectorAll('li');

//const videoURLs = [
//    './',
//    './',
//];

//function showVideoRandomly(array){
//    const randomIndex = Math.floor(Math.random() * array.length);
//    return array[randomIndex];
//}

//function uploadVideoScreen(){
//    const videoElement = document.querySelector('.video');
//    const videoSource = document.getElementById('video-source');
//    const randomVideoURL = showVideoRandomly(videoURLs);

//    if(videoElement && videoSource) {
//        videoSource.src = randomVideoURL;

//        videoElement.load();
//    }
//}


function buttonSearch(){

    const inputValue = input.value;

    movementInput(inputValue)
}

function closeInput(){

    input.style.visibility = 'hidden';

    input.style.width = '40px';

    input.style.padding = '0.5rem 0.5rem 0.5rem 2.6rem';

    input.style.transition = 'all 0.5s ease-in-out 0s';

    input.value = "";

}

function openInput(){

    input.style.visibility = 'visible';

    input.style.width = '300px';

    input.style.padding = '0.5rem 0.5rem 0.5rem 3.1rem';

    input.style.transition = 'all 0.5s ease-in-out 0s';

    input.value = "";

}

function showContent(){

    document.querySelector('.content').style.visibility = 'visible';

    document.querySelector('.box').style.alignItems = 'end';

    document.querySelector('.search').style.position = 'initial';

}

function movementInput(inputValue){

    const visibility = input.style.visibility;

    //if (visibility === 'hidden') {
        //openInput()
    //} else {
        //closeInput()
    //}

    inputValue && searchCity(inputValue);

    visibility === 'hidden' ? openInput() : closeInput();

}

input.addEventListener('keyup', function(event) {

    if(event.keyCode === 13){

        const inputValue = input.value;
        movementInput(inputValue)

    }
})

document.addEventListener('DOMContentLoaded', () => {

    closeInput();
    //uploadVideoScreen();

})

async function searchCity(city) {

    try {

    const datas = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`)

    if(datas.status === 200){

        const results = await datas.json();

        getPlaylistCountry(results.sys.country);

        showWeather(results);

        showContent();

        //uploadVideoScreen();

    } else{
        throw new Error
    }
    
    } catch{
        alert('City could not be found!');

    }  
}

function showWeather(results) {

    document.querySelector('.icon-weather').src = `./assets/${results.weather[0].icon}.png`

    document.querySelector('.city-name').innerHTML = `${results.name}`;

    document.querySelector('.temperature').innerHTML = `${results.main.temp.toFixed(0)}<sup>°C</sup>`;

    document.querySelector('.maxtemp').innerHTML = `Max: ${results.main.temp_max.toFixed(0)}<sup>°C</sup>`;

    document.querySelector('.mintemp').innerHTML = `Min: ${results.main.temp_min.toFixed(0)}<sup>°C</sup>`;

}

async function getAcessToken() {

    const credentials = `${clientId}:${clientSecret}`;

    const encodedCredentials = btoa(credentials);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json()
    return data.access_token;

}

//https://api.spotify.com/vl/browse/featured-playlists?country=BR&timestamp=2023-08-09T09%3A00%?A00&limit=3

//https://api.spotify.com/v1/browse/featured-playlists?locale=br&limit=3

function getCurrentDate() {

    const currentDate = new Date();

    const year = currentDate.getFullYear();

    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    const day = currentDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`
}

async function getPlaylistCountry(country) {

    try {

        const accessToken = await getAcessToken();

        const currentDate = getCurrentDate();

        //const url = `https://api.spotify.com/vl/browse/featured-playlists?country=${country}&timestamp=${currentDate}T09%3A00%?A00&limit=3`

        const url = `https://api.spotify.com/v1/browse/featured-playlists?locale=${country}&limit=3`

        const results = await fetch(`${url}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if(results.status === 200){

            const data = await results.json()

            const result = data.playlists.items.map(item => ({
            name: item.name,
            image: item.images[0].url
            }))

            showMusic(result);

        } else{
            throw new Error
        }

    } catch{
        alert("The music's search had an error!")
    }
    
}

//const ulElement = document.querySelector('.playlist-box');
//const liElement = ulElement.querySelectorAll('li');

function showMusic(data) {

    liElement.forEach((liElement, index) => {

        const imgElement = liElement.querySelector('img');

        const pElement = liElement.querySelector('p');

        imgElement.src = data[index].image;
        pElement.textContent = data[index].name;

    })

    document.querySelector('.playlist-box').style.visibility = 'visible';

}


