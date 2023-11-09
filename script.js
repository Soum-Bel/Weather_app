// Sélection des éléments DOM 
const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const inputCity = document.querySelector("#location");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

// Fonction pour cacher les éléments de l'interface utilisateur affichant les résultats météo et les messages d'erreur.
const resetDisplay = () => {
    // Retire la classe 'active' pour rendre les éléments invisibles 
    weatherBox.classList.remove('active');
    weatherDetails.classList.remove('active');
    error404.classList.remove('active');
    container.style.height = '400px';
};

// Fonction pour récuperer les données météo à partir de l'API 
    const fetchWeather = () => {
    
    resetDisplay();

    
    const APIKey = '0472fbb1d12416518d0e4361e8da41f9';
    // Récupère la valeur saisie par l'utilisateur.
    const city = inputCity.value;
    
    // Si aucune ville n'est entrée, la fonction se termine et enregistre un message dans la console.
    if (city === '') {
        console.log("No city entered.");
        return;
    }

    // Envoie une requête à l'API OpenWeatherMap avec la ville entrée par l'utilisateur.
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => {
        // Vérifie le succès de la réponse HTTP.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Convertit la réponse en JSON.
        return response.json();
    })
    .then(json => {
        // Vérifie si la réponse JSON indique que la ville n'a pas été trouvée.
        if (json.cod !== 200) {
            container.style.height ='400px';
            error404.classList.add('active');
            return;
        }

        // Ajuste l'interface utilisateur pour afficher les résultats météo.
        container.style.height ='555px';
        weatherBox.classList.add('active');
        weatherDetails.classList.add('active');
        error404.classList.remove('active');

        //  Afficher les détails météo
        const image = document.querySelector(".weather-box img");
        const temperature = document.querySelector(".weather-box .temperature");
        const description = document.querySelector(".weather-box .description");
        const humidity = document.querySelector(".weather-details .info-humidity span");
        const wind = document.querySelector(".weather-details .info-wind span");

        // Mise à jour des informations météo
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

        // Insère les données météo dans les éléments HTML sélectionnés.
        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = json.weather[0].description;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;
    })
    .catch(error => {
        // Attrape et traite les erreurs de la requête fetch.
        console.error('Fetch error:', error);
        // Affiche un message d'erreur 
        error404.classList.add('active');
    });
};

// Ajoute un écouteur d'événements pour déclencher la recherche météo lors d'un clic sur le bouton.
search.addEventListener('click', fetchWeather);

// Ajoute un écouteur d'événements pour déclencher la recherche météo lorsque l'utilisateur appuie sur 'Entrée'
inputCity.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});
