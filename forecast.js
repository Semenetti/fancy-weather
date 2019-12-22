import {
  latitude,
  longitude,
  tempSystem,
  currentLang,
  currentWeather,
  tempSystemValue,
  windSpeedSystem,
  futureWeatherFirstDay,
  tomorrow,
  afterTomorrow,
  afterAfterTomorrow,
  futureWeatherSecondDay,
  futureWeatherThirdDay
} from "./main.js";

async function getCurrentForecast() {
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=8814d3dc5ca2f1dc169d76bf256d3b23&units=${tempSystem}&lang=${currentLang}`;
    const response = await fetch(url);
    const myJson = await response.json();
    const currentForecast = myJson.weather[0].description;
    const currentForecastIcon = `http://openweathermap.org/img/wn/${myJson.weather[0].icon}@2x.png`;
    const currentTemp = Math.floor(myJson.main.temp);
    const currentHumidity = Math.floor(myJson.main.humidity);
    const currentWind = Math.floor(myJson.wind.speed);
    drawCurrentWeatherBox(
      currentForecastIcon,
      currentForecast,
      currentTemp,
      currentHumidity,
      currentWind
    );
  } catch (e) {
    console.log(e);
  }
}

function drawCurrentWeatherBox(icon, forecast, temp, humidity, wind) {
  currentWeather.innerHTML = "";
  const fragment = new DocumentFragment();
  const iconBox = document.createElement("img");
  iconBox.src = icon;
  fragment.append(iconBox);
  const forecastBox = document.createElement("div");
  forecastBox.innerHTML = forecast;
  fragment.append(forecastBox);
  const tempBox = document.createElement("div");
  tempBox.innerHTML = `${temp} ${tempSystemValue}`;
  fragment.append(tempBox);
  const windBox = document.createElement("div");
  const humidityBox = document.createElement("div");
  if (currentLang == "en") {
    humidityBox.innerHTML = `humidity: ${humidity} %;`;
    windBox.innerHTML = `wind: ${wind} ${windSpeedSystem}`;
  } else {
    humidityBox.innerHTML = `влажность: ${humidity} %`;
    windBox.innerHTML = `ветер: ${wind} ${windSpeedSystem}`;
  }
  fragment.append(humidityBox);
  fragment.append(windBox);
  currentWeather.append(fragment);
}

async function getFutureWeather(weatherBox, day, dayName) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=8814d3dc5ca2f1dc169d76bf256d3b23&units=${tempSystem}&lang=${currentLang}`;
    const response = await fetch(url);
    const myJson = await response.json();
    const forecastIcon = `http://openweathermap.org/img/wn/${myJson.list[day].weather[0].icon}@2x.png`;
    const temp = Math.floor(myJson.list[day].main.temp);
    addFutureWeather(weatherBox, forecastIcon, temp, dayName);
  } catch (e) {
    console.log(e);
  }
}

function addFutureWeather(weatherDayBox, icon, temp, dayName) {
  weatherDayBox.innerHTML = "";
  const fragment = new DocumentFragment();
  const dayBox = document.createElement("div");
  dayBox.innerHTML = dayName;
  fragment.append(dayBox);
  const iconBox = document.createElement("img");
  iconBox.src = icon;
  fragment.append(iconBox);
  const tempBox = document.createElement("div");
  tempBox.innerHTML = `${temp} ${tempSystemValue}`;
  fragment.append(tempBox);
  weatherDayBox.append(fragment);
}

let tommorowChunk = 8;
let afterTommorowChunk = 16;
let afterAfterTommorowChunk = 24;

function getWeatherBlock() {
  getCurrentForecast();
  getFutureWeather(futureWeatherFirstDay, tommorowChunk, tomorrow);
  getFutureWeather(futureWeatherSecondDay, afterTommorowChunk, afterTomorrow);
  getFutureWeather(
    futureWeatherThirdDay,
    afterAfterTommorowChunk,
    afterAfterTomorrow
  );
}

export { getCurrentForecast, getFutureWeather, getWeatherBlock };
