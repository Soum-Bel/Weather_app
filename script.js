const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const inputCity = document.querySelector("#location");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");


const resetDisplay = () => {
    // Cette fonction masque les sections qui ne devraient être visibles qu'après une recherche réussie ou en cas d'erreur.
    weatherBox.classList.remove('active');
    weatherDetails.classList.remove('active');
    error404.classList.remove('active');
    container.style.height = '400px'; // Hauteur par défaut ou hauteur pour l'état d'erreur
};

const fetchWeather = () => {
    resetDisplay();
    console.log("Fetch weather called."); // Pour tester le déclenchement de la fonction
    const APIKey = '0472fbb1d12416518d0e4361e8da41f9';
    const city = inputCity.value;
    console.log(`City entered: ${city}`); // Pour voir la ville saisie par l'utilisateur

    if (city === '') {
        console.log("No city entered.");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => {
        console.log(`Response received. Status code: ${response.status}`); // Pour voir le code de statut de la réponse
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        console.log("JSON response received:", json); // Pour inspecter la réponse JSON
        
        // Vérifiez le code de réponse contenu dans le JSON, pas le code de statut de la réponse HTTP
        if (json.cod !== 200) {
            console.log("City not found."); // Si la ville n'est pas trouvée
            container.style.height ='400px';
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
            error404.classList.add('active');
            return;
        }

        console.log("City found, updating weather details."); // Si la ville est trouvée et que les détails météo sont mis à jour
        container.style.height ='555px';
        weatherBox.classList.add('active');
        weatherDetails.classList.add('active');
        error404.classList.remove('active');

        // Mise à jour des détails météorologiques
        const image = document.querySelector(".weather-box img");
        const temperature = document.querySelector(".weather-box .temperature");
        const description = document.querySelector(".weather-box .description");
        const humidity = document.querySelector(".weather-details .info-humidity span");
        const wind = document.querySelector(".weather-details .info-wind span");

        switch (json.weather[0].main) {
            case 'Clear':
                image.src = '/images/clear.png';
                break;
            case 'Rain':
                image.src = '/images/rain.png';
                break;
            case 'Snow':
                image.src = '/images/snow.png';
                break;
            case 'Clouds':
                image.src = '/images/cloud.png';
                break;
            case 'Mist':
            case 'Haze': 
                image.src = '/images/mist.png';
                break;
            default:
                image.src = '/images/cloud.png';
        }

        console.log(`Weather condition: ${json.weather[0].main}`); // Pour voir la condition météorologique

        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = json.weather[0].description;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;

        console.log(`Updated temperature: ${json.main.temp}°C`); // Pour voir la température mise à jour
        console.log(`Updated description: ${json.weather[0].description}`); // Pour voir la description mise à jour
        console.log(`Updated humidity: ${json.main.humidity}%`); // Pour voir l'humidité mise à jour
        console.log(`Updated wind speed: ${json.wind.speed} Km/h`); // Pour voir la vitesse du vent mise à jour
    })
    .catch(error => {
        console.error('Fetch error:', error); // Pour attraper les erreurs lors de l'appel fetch
        // Affichez un message d'erreur si l'erreur est due à un problème de réseau ou de serveur
        error404.classList.add('active');
    });
};

search.addEventListener('click', fetchWeather);
inputCity.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        console.log("Enter key pressed."); // Pour vérifier si la touche Enter a été pressée
        fetchWeather();
    }
});