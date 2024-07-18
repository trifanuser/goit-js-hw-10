import axios from 'axios';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] = 'live_QT08vof6Z0YRNrilN5w44GGDmM9ia5wm32nDFeedz7XpHM4yCfOxWAEanPsiLZ3c'; 


const fetchBreeds = () => {
  return axios.get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching breeds:', error);
      throw error;
    });
};

const fetchCatByBreed = (breedId) => {
  return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0])
    .catch(error => {
      console.error('Error fetching cat by breed:', error);
      throw error;
    });
};

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

const populateBreedSelect = () => {
  fetchBreeds().then(breeds => {
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    new SlimSelect('.breed-select', { showSearch: false });
    breedSelect.style.display = 'block';
    loader.style.display = 'none';
  }).catch(err => {
    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
    loader.style.display = 'none';
  });
};

const displayCatInfo = (breedId) => {
  loader.style.display = 'block';
  catInfo.style.display = 'none';
  fetchCatByBreed(breedId).then(cat => {
    const { name, description, temperament } = cat.breeds[0];
    catInfo.innerHTML = `
      <div>
        <img src="${cat.url}" alt="${name}"/>
      </div>
      <div>
        <h2>${name}</h2>
        <p>${description}</p>
        <p><strong>Temperament:</strong> ${temperament}</p>
      </div>
    `;
    loader.style.display = 'none';
    catInfo.style.display = 'flex'; // Afisam cat-info ca flex container
  }).catch(err => {
    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
    loader.style.display = 'none';
  });
};

breedSelect.addEventListener('change', (event) => {
  const breedId = event.target.value;
  if (breedId) {
    displayCatInfo(breedId);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loader.style.display = 'block';
  breedSelect.style.display = 'none';
  error.style.display = 'none';
  catInfo.style.display = 'none';
  populateBreedSelect();

 
  breedSelect.addEventListener('selectOpen', () => {
    breedSelect.classList.add('opened');
  });

  breedSelect.addEventListener('selectClose', () => {
    breedSelect.classList.remove('opened');
  });
});