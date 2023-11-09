const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const inputCity = document.querySelector("#location");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");

const fetchWeather = () => {
    
    const APIKey = '0472fbb1d12416518d0e4361e8da41f9';
    const city = inputCity.value; 
    

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        
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

        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = `${json.weather[0].description}`;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;
    })
    .catch(error => console.error('Error:', error));
};
    search.addEventListener('click', fetchWeather);
    inputCity.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});




