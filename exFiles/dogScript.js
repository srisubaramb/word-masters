const displayDogs = document.querySelector('.display-dogs');

async function fetchDogs() {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    const image = document.createElement('img');
    image.src = data.message;
    image.alt = 'Random Dog';
    displayDogs.appendChild(image);
}

document.querySelector('.get-dogs').addEventListener('click', fetchDogs);