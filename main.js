import { getWeatherBlock } from "./forecast.js";

const wrapper = document.createElement("div");
const container = document.createElement("div");
const searchBox = document.createElement("div");
const langBox = document.createElement("div");
const langRU = document.createElement("button");
const langEN = document.createElement("button");
const tempConverterBox = document.createElement("div");
const convertToC = document.createElement("button");
const convertToF = document.createElement("button");
const main = document.createElement("div");
const findTownInput = document.createElement("input");
const findTownBtn = document.createElement("button");
const currentTownBox = document.createElement("div");
const currentTown = document.createElement("div");
const currentTime = document.createElement("div");
const currentPosition = document.createElement("div");
const currentWeather = document.createElement("div");
const futureWeatherBox = document.createElement("div");
const futureWeatherFirstDay = document.createElement("div");
const futureWeatherSecondDay = document.createElement("div");
const futureWeatherThirdDay = document.createElement("div");
const currentMapBox = document.createElement("div");
const mapBox = document.createElement("div");
const currentСoordinates = document.createElement("div");

let backgroundImg = new Image();
let imageURL;

let date = new Date();
let currentHour;
let currentMinute;
let currentDay;
let tomorrow;
let afterTomorrow;
let afterAfterTomorrow;
let currentDayNumber;
let currentMonth;

let latitude;
let longitude;
let userIp;
let defaultTown;
let currentLang = "ru";
let tempSystem = "metric";
let tempSystemValue = "&#8451";
let windSpeedSystem = "м/сек";

getCurrentTime(date);
navigator.geolocation.getCurrentPosition(position => {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  getDefaultTown(`${latitude},${longitude}`);
  if (latitude == null || longitude == null) {
    getCurrentIp();
    getDefaultTown(`${latitude},${longitude}`);
  }
  drawMap(longitude, latitude);
  getWeatherBlock();
});

function getCurrentIp() {
  try {
    const url = "http://ip-api.com/json/";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        userIp = data.query;
        latitude = data.lat;
        longitude = data.lon;
        console.log(`Town: ${data.city}\nUser ip: ${userIp}`);
      });
  } catch (error) {
    console.log(error);
  }
}

document.body.prepend(wrapper);
wrapper.className = "wrapper";

wrapper.append(container);
container.className = "container";

container.append(searchBox);
searchBox.className = "searchBox";

searchBox.append(findTownInput);
findTownInput.className = "findTownInput";
searchBox.append(findTownBtn);
findTownBtn.className = "findTownBtn";
findTownBtn.innerHTML = "Найти";
findTownBtn.onclick = findTown;
searchBox.prepend(langBox);
langBox.className = "langBox";
langBox.append(langEN);
langEN.innerHTML = "ENG";
langRU.innerHTML = "РУС";
langRU.className = "activeLang";
langBox.append(langRU);
searchBox.prepend(tempConverterBox);
tempConverterBox.className = "tempConverterBox";
tempConverterBox.append(convertToC);
convertToC.innerHTML = "&#8451";
convertToC.className = "activeTemp";
tempConverterBox.append(convertToF);
convertToF.innerHTML = "&#8457";

langRU.addEventListener("click", () => {
  langEN.classList.remove("activeLang");
  langRU.className = "activeLang";
  currentLang = "ru";
  getCurrentTime();
  convertToC.className == "activeTemp"
    ? (windSpeedSystem = "м/сек")
    : (windSpeedSystem = "миль/ч");
  getWeatherBlock();
  getDefaultTown(defaultTown);
  findTownBtn.innerHTML = "Найти";
});

langEN.addEventListener("click", () => {
  langRU.classList.remove("activeLang");
  langEN.className = "activeLang";
  currentLang = "en";
  convertToC.className == "activeTemp"
  ? (windSpeedSystem = "meter/sec")
  : (windSpeedSystem = "miles/hour");
  getCurrentTime();
  getWeatherBlock();
  getDefaultTown(defaultTown);
  findTownBtn.innerHTML = "Search";
});

convertToC.addEventListener("click", () => {
  convertToF.classList.remove("activeTemp");
  convertToC.className = "activeTemp";
  tempSystem = "metric";
  tempSystemValue = "&#8451";
  currentLang == "en"
    ? (windSpeedSystem = "meter/sec")
    : (windSpeedSystem = "м/сек");
  getWeatherBlock();  
});
convertToF.addEventListener("click", () => {
  convertToC.classList.remove("activeTemp");
  convertToF.className = "activeTemp";
  tempSystem = "imperial";
  tempSystemValue = "&#8457";
  currentLang == "en"
    ? (windSpeedSystem = "miles/hour")
    : (windSpeedSystem = "миль/ч");
  getWeatherBlock();  
});

function findTown() {
  try {
    if (findTownInput.value != false) {
      getDefaultTown(findTownInput.value);
      backgroundImg = new Image();
      backgroundImg.crossOrigin = "Anonymous";
      getNewMap(findTownInput.value);
      currentPosition.innerHTML = defaultTown;
      // localStorage.setItem(canvas, canvas.toDataURL());
    } else {
      alert("add town please");
    }
  } catch (error) {
    console.log(error);
  }
}

async function getLinkToImage(input) {
  try {
    const url = `https://api.unsplash.com/photos/random?query=town,${input}&client_id=6a74b9195f899df1dba3547a56c138cdac831481edfeeae373e07e7add0e21cf`;
    const response = await fetch(url);
    const myJson = await response.json();
    imageURL = myJson.urls.regular;
    main.style.background = `url('${imageURL}') center no-repeat`;
  } catch (error) {
    console.log(error);
    main.style.background = 'url("./defailt-bg-image.jpg") center no-repeat';
  }
}

container.append(main);
main.className = "main";
main.append(currentTownBox);
currentTownBox.className = "currentTownBox";
main.append(currentMapBox);
currentMapBox.className = "currentMapBox";

currentTownBox.append(currentTown);
currentTown.className = "currentTown";
currentTown.append(currentTime);
currentTime.className = "currentTime";
currentTime.innerHTML = `${currentDay} ${currentDayNumber} ${currentMonth} ${currentHour}:${currentMinute}`;
currentTown.append(currentPosition);
currentPosition.className = "currentPosition";
currentTownBox.append(currentWeather);
currentWeather.className = "currentWeather";
currentTownBox.append(futureWeatherBox);
futureWeatherBox.className = "futureWeatherBox";
futureWeatherBox.append(futureWeatherFirstDay);
futureWeatherFirstDay.className = "futureWeatherFirstDay";
futureWeatherBox.append(futureWeatherSecondDay);
futureWeatherSecondDay.className = "futureWeatherSecondDay";
futureWeatherBox.append(futureWeatherThirdDay);
futureWeatherThirdDay.className = "futureWeatherThirdDay";

currentMapBox.append(mapBox);
mapBox.className = "mapBox";
currentMapBox.append(currentСoordinates);
currentСoordinates.className = "currentСoordinates";

let mapImg;
function drawMap(lon, lat) {
  mapImg = new Image();
  mapImg.onload = mapBox.style.background = `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lon},${lat},7,20/600x600?access_token=pk.eyJ1Ijoic2VtZW5ldHRpIiwiYSI6ImNrM2ttbGwweDBrbTQzY250d3Z2NHpjbzkifQ.O56fWHvhU5IWcOG2KrV0Ng') center no-repeat`;
  currentСoordinates.innerHTML = `lon: ${lon} lat: ${lat}`;
}

async function getNewMap(input) {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=2bd77245f0734cf08cd24a33c1816c72`;
    const response = await fetch(url);
    const myJson = await response.json();
    latitude = myJson.results[0].geometry.lat;
    longitude = myJson.results[0].geometry.lng;
    drawMap(longitude, latitude);
    getWeatherBlock();
  } catch (error) {
    console.log(error);
  }
}

function getCurrentTime() {
  date = new Date();
  const days = [
    ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  ];
  const fullDays = [
    [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
      "Понедельник",
      "Вторник"
    ],
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday"
    ]
  ];
  const month = [
    [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря"
    ],
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  ];
  if (currentLang == "ru") {
    currentDay = days[0][date.getDay()];
    tomorrow = fullDays[0][date.getDay() + 1];
    afterTomorrow = fullDays[0][date.getDay() + 2];
    afterAfterTomorrow = fullDays[0][date.getDay() + 3];
    currentMonth = month[0][date.getMonth()];
    currentHour = date.getHours();
    currentDayNumber = date.getDate();
    date.getMinutes() < 10
      ? (currentMinute = `0${date.getMinutes()}`)
      : (currentMinute = date.getMinutes());
    currentTime.innerHTML = `${currentDay} ${currentDayNumber} ${currentMonth} ${currentHour}:${currentMinute}`;
  } else {
    currentDay = days[1][date.getDay()];
    tomorrow = fullDays[1][date.getDay() + 1];
    afterTomorrow = fullDays[1][date.getDay() + 2];
    afterAfterTomorrow = fullDays[1][date.getDay() + 3];
    currentMonth = month[1][date.getMonth()];
    currentHour = date.getHours();
    currentDayNumber = date.getDate();
    date.getMinutes() < 10
      ? (currentMinute = `0${date.getMinutes()}`)
      : (currentMinute = date.getMinutes());
    currentTime.innerHTML = `${currentDay} ${currentDayNumber} ${currentMonth} ${currentHour}:${currentMinute}`;
  }
}

let timeRefresh = setTimeout(function tick() {
  getCurrentTime();
  timeRefresh = setTimeout(tick, 60000);
});

async function getDefaultTown(input) {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=2bd77245f0734cf08cd24a33c1816c72&language=${currentLang}&pretty=1`;
    const response = await fetch(url);
    const myJson = await response.json();
    if (myJson.results[0].components.city == undefined) {
      defaultTown = myJson.results[0].formatted;
    } else {
      defaultTown = `${myJson.results[0].components.city}, ${myJson.results[0].components.country}`;
    }
    currentPosition.innerHTML = defaultTown;
    backgroundImg.onload = getLinkToImage(findTownInput.value);
  } catch (error) {
    console.log(error);
    alert("We can't find town you entered");
    main.style.background = 'url("./defailt-bg-image.jpg") center no-repeat';
  }
}

export {
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
};
