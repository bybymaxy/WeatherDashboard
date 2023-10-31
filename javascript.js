function updateWeatherForecast(weatherElements, currentWeather) {
    document.getElementById('weatherForecast').innerHTML = weatherElements;
    document.getElementById('currentWeather').innerHTML = currentWeather;
}

var APIKey = '8ecaf7d81f9ac1a1dcfcbe05f439ded2'
var city = 'copenhagen';
var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
var searchedCities = [];




document.getElementById('searchButton').addEventListener('click', function() {
    var cityInput = document.getElementById('citySearch');
    city = citySearch.value;
    fetchWeatherData();

})

function fetchWeatherData() {
var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
fetch(apiUrl) 
.then(response => response.json())
.then(data => {
    var weatherData = parseWeatherData(data);
    var currentWeather = generateCurrentWeather(weatherData[0]);
    var weatherElements = generateWeatherElements(weatherData.slice(1), weatherData);
    updateWeatherForecast(weatherElements, currentWeather); 
    addCityToList(city);
    console.log(data)
})
.catch(error => {
    console.error('Error:', error);

})
}

function generateCurrentWeather(currentWeatherData) {
    var temperatureFahrenheit = ((currentWeatherData.temperature - 273.15) * 9/5 + 32).toFixed(2);
    var currentWeatherHTML = `
      <div class="current-weather-card">
        <h3>Current Weather</h3>
        <p>Date: ${currentWeatherData.date}</p>
        <p>Temperature: ${temperatureFahrenheit}°F</p>
        <p>Conditions: ${currentWeatherData.weatherConditions}</p>
      </div>
    `;
    return currentWeatherHTML;
  }

function addCityToList(city) {
    searchedCities.push(city);
    var cityList = document.getElementById('cityList');
    cityList.innerHTML = '';
    searchedCities.forEach(city => {
        var listItem = document.createElement('li');
        listItem.textContent = city;
        cityList.appendChild(listItem)
    });
    localStorage.setItem('searchedCities', JSON.stringify(searchedCities))
    console.log('Searched Cities:', searchedCities);
}

window.addEventListener('load', function() {
    var savedCities = this.localStorage.getItem('searchedCities');
    if (savedCities) {
        searchedCities = JSON.parse(savedCities)
        addCityToList();
    }
})



function parseWeatherData(data) {
    var weatherList = data.list;
    var weatherData = [];
  
    if (weatherList) {
      for (let i = 0; i < weatherList.length; i += 8) {
        var dayWeather = weatherList[i];
        var date = new Date(dayWeather.dt * 1000).toLocaleDateString();
        var temperature = dayWeather.main.temp;
        var weatherConditions = dayWeather.weather[0].description;
  
        var dayData = {
          date,
          temperature,
          weatherConditions
        };
  
        weatherData.push(dayData);
      }
    }
  
    return weatherData;
  }

function generateWeatherElements(weatherData, currentWeatherData) {
    var forecastHTML = '';
    weatherData.forEach(day => {
      var temperatureFahrenheit = ((day.temperature - 273.15) * 9/5 + 32).toFixed(2);
      forecastHTML += `
        <div class="weather-card">
          <h3>${day.date}</h3>
          <p>Temperature: ${temperatureFahrenheit}°F</p>
          <p>Conditions: ${day.weatherConditions}</p>
        </div>
      `;
    });
    return forecastHTML;
  }