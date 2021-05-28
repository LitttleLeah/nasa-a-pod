const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 15;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showContent(page) {
  window.scrollTo({top: 0, behavior: 'instant'});
  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favouritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favouritesNav.classList.remove('hidden');    
  }
  loader.classList.add('hidden');
}

function createDOMNodes(page) {
  const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
  currentArray.forEach((result) => {
    //card container
    const card = document.createElement('div');
    card.classList.add('card');
    //link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    //image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    //card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    //card title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    //save text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.textContent = 'Add To Favourites';
      saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favourite';
      saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
    }
    //card text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;
    //Footer container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    //Date
    const date = document.createElement('strong');
    date.textContent = result.date;
    //copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;
    //Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDom(page) {
  //Get favourites from local storage
  if (localStorage.getItem('nasaFavourites')) {
    favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
  }
  imagesContainer.textContent = '';
createDOMNodes(page);
showContent(page);
}

// Get 15 images from NASA API
async function getNasaPictures() {
  //show loader
  loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDom('results');
    }   catch (error) {
      // Catch the Error Here
    }
}

//Add result to Favourites
function saveFavourite(itemUrl) {
  //Loop through results array to select favourite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
      favourites[itemUrl] = item; 
      // show dave confirmation for 2 secs
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      //set favourites in local storage
      localStorage.setItem('nasaFavourites',JSON.stringify(favourites));
    }
  })
}

//remove favourite function
function removeFavourite(itemUrl) {
  if (favourites[itemUrl]) {
    delete favourites[itemUrl];
    //set favourites in local storage
    localStorage.setItem('nasaFavourites',JSON.stringify(favourites));
    updateDom('favourites');
  }
}

//  On Load
getNasaPictures();