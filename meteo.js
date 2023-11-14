// Sélection des éléments DOM 
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

// Fonction pour charger la configuration à partir du fichier conf.json
const loadConfig = () => {
    fetch('conf.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error loading configuration: ${response.status}`);
        }
        return response.json();
    })
    .then(config => {
        fetchWeather(config.city, config.APIKey);
    })
    .catch(error => {
        error404.style.display = 'block';
    });
};

// Fonction pour récupérer les données météo à partir de l'API 
    const fetchWeather = (city, APIKey) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        if (json.cod !== 200) {
            error404.classList.add('active');
            throw new Error('API returned non-200 status'); 
        }

        error404.classList.remove('active');
        error404.style.display = 'none'; 

        // Sélectionne l'élément pour le nom de la ville et mets à jour son contenu
        const cityName = document.querySelector(".city-name");
        cityName.textContent = city; // 

        // Affiche les détails météo
        const image = document.querySelector(".weather-box img");
        const temperature = document.querySelector(".weather-box .temperature");
        const description = document.querySelector(".weather-box .description");
        const humidity = document.querySelector(".weather-details .info-humidity span");
        const wind = document.querySelector(".weather-details .info-wind span");

       
        // Mets à jour les informations météo en fonction des données reçues
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

        temperature.innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
        description.textContent = json.weather[0].description;
        humidity.textContent = `${json.main.humidity}%`;
        wind.textContent = `${json.wind.speed} Km/h`;

        // Active les éléments pour les rendre visibles
        weatherBox.style.display = 'block';
        weatherDetails.style.display = 'flex';

        
    })
    .catch(error => {
        error404.style.display = 'block'; 
        weatherBox.style.display = 'none'; 
        weatherDetails.style.display = 'none';
    });
};



// Appelle loadConfig lors du chargement de la page pour afficher immédiatement les données météo
document.addEventListener('DOMContentLoaded', loadConfig);

// Mise à jour des données météo toutes les heures
setInterval(() => {
    loadConfig(); // Cette fonction recharge la configuration pour mettre à jour la météo
}, 3600000); // 3600000 ms correspondent à une heure
