
var latitude = 0;
var longitude = 0;
const myData = {
  location: {
    address: [],
    latitude: [],
    longitude: []
  }
};
var WeatherData = {
  maxTemp: [],
  WindPhrase: [],
  WeatherPhrase: [],
  CloudCover: [],
  Humidity: [],
  UVRating: [],
  daypartName: [],
  NightOrDay: "",
  currentTime: ""
};
const date = new Date();


/*Search*/

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', search);
const searchResults = document.getElementById('search-results');

/* Run with local location*/
getLocationAtRuntime();


function getLocationAtRuntime() {
  //get current IP

  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      console.log(data.ip)
      // get current coordinates. 
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '',
          'X-RapidAPI-Host': 'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
        }
      };

      fetch('https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?ip=' + data.ip + '&apikey=873dbe322aea47f89dcf729dcc8f60e8', options)
        .then(response => response.json())
        .then(data2 => {

          console.log(data2);

          getWeatherForcastQuery(data2.latitude, data2.longitude, WeatherData);


        });

    });



}


function search() {
  const input = searchInput.value.toLowerCase();
  getLocationQuery(input, myData);
  let matches = myData.location.address;
  if (input === '') {
    matches = [];
  }
  showResults(matches);
}

function showResults(matches) {
  const html = matches.map(match => `<p>${match}</p>`).join('');
  searchResults.innerHTML = html;

  const pElements = searchResults.querySelectorAll('p');
  pElements.forEach((p, index) => {
    p.addEventListener('click', () => {
      SetPageWeatherAndLocation(matches[index], myData.location.longitude[index], myData.location.latitude[index]);
      hideResults();
    });
  });
}

function SetPageWeatherAndLocation(matchData, longitude, latitude) {
  console.log('Match data:', matchData);
  searchInput.value = matchData;
  console.log('Match data:', longitude);
  console.log('Match data:', latitude);
  getWeatherForcastQuery(latitude, longitude, WeatherData);
}






function hideResults() {
  searchResults.innerHTML = '';
}

const menu = document.getElementById('menu');
const menuButton = document.getElementById('menu-button');

document.addEventListener('click', function (event) {
  const isClickInside = searchResults.contains(event.target) || searchInput.contains(event.target);
  if (!isClickInside) {
    hideResults();
  }
  else {
    search();
  }
});

function getLocationQuery(query, data) {

  const options3 = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8120e0dd5bmsh53b8a1ccf9804a5p1786cbjsn529820935ef4',
      'X-RapidAPI-Host': 'weather338.p.rapidapi.com'
    }
  };

  fetch('https://weather338.p.rapidapi.com/locations/search?query=' + query + '&language=en-US', options3)
    .then(response => response.json())
    .then(data3 => {
      console.log("data3");
      console.log(data3);
      console.log("dataadresses");
      console.log(data3.location.address);

      data.location.address = data3.location.address;
      data.location.latitude = data3.location.latitude;
      data.location.longitude = data3.location.longitude;
    })
    .catch(error => console.log(error));

}



function getWeatherForcastQuery(latitude, longitude, WeatherData) {


  const localDate = getFullDateAsInt(date);

  const options4 = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '',
      'X-RapidAPI-Host': 'weather338.p.rapidapi.com'
    }
  };

  fetch('https://weather338.p.rapidapi.com/weather/forecast?date=' + localDate + '&latitude=' + latitude + '&longitude=' + longitude + '&language=en-US&units=m', options4)
    .then(response => response.json())
    .then(data3 => {

      console.log("OutputtedForcastData");
      console.log(data3);

      //WeatherData = data3;

      console.log("OutputtedForcastData2");
      WeatherData.maxTemp = data3["v3-wx-forecast-daily-15day"]["calendarDayTemperatureMax"];
      WeatherData.WindPhrase = data3["v3-wx-forecast-daily-15day"]["daypart"][0]["windPhrase"];
      WeatherData.WeatherPhrase = data3["v3-wx-forecast-daily-15day"]["daypart"][0]["wxPhraseLong"];
      WeatherData.CloudCover = data3["v3-wx-forecast-daily-15day"]["daypart"][0]["cloudCover"];
      WeatherData.Humidity = data3["v3-wx-forecast-daily-15day"]["daypart"][0]["relativeHumidity"];
      WeatherData.UVRating = data3["v3-wx-forecast-hourly-10day"]["uvIndex"];
      WeatherData.daypartName = data3["v3-wx-forecast-daily-15day"]["daypart"][0]["daypartName"];
      WeatherData.NightOrDay = data3["v3-wx-observations-current"]["dayOrNight"];
      WeatherData.currentTime = data3["v3-wx-forecast-daily-15day"]["validTimeLocal"];



      console.log("Maxtemp");
      console.log(WeatherData.maxTemp);
      console.log("WindDirection");
      console.log(WeatherData.WeatherPhrase);
      console.log("currentTime");
      console.log(WeatherData.currentTime);
      setWeatherContainer(WeatherData);
      setBackgroundfromTime(WeatherData.NightOrDay);

    })
    .catch(error => console.log(error));

}


function getFullDateAsInt(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Adding 1 because getMonth() returns a zero-based index
  const year = date.getFullYear();
  return parseInt(`${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`);
}

/*carousel*/
const carousel = document.querySelector('.weatherContainer');

function setWeatherContainer(weatherDataInput) {
  clearWeatherContainers();
  for (let i = 1; i < 5; i++) {

 

    // create container div
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container");

    // create weather div
    const weatherDiv = document.createElement("div");
    weatherDiv.classList.add("weather");

    // create h1 element
    var formattedDate = formatReadableDate(weatherDataInput.currentTime[i]);
    const h1Element = document.createElement("h1");
    h1Element.textContent = `${formattedDate}`;

    // create cols div
    const colsDiv = document.createElement("div");
    colsDiv.classList.add("cols");

    // create weather icon container div
    const weatherIconContainerDiv = document.createElement("div");
    weatherIconContainerDiv.classList.add("weatherIconContainer");

    // create icon container div
    const iconContainerDiv = document.createElement("div");
    iconContainerDiv.classList.add("iconContainer");

    // create img element for weather image
    const imgElement = document.createElement("img");
    
    
    /*set icon based on weather*/
    if (weatherDataInput.WeatherPhrase[i].includes("Rain")) {
      imgElement.src = "clouddrizzle.svg";
      

    }else if(weatherDataInput.WeatherPhrase[i].includes("Cloud")){
      //imgElement.src = "cloudsunny.svg";
      imgElement.src = "cloud.svg";
      
    }else if(weatherDataInput.WeatherPhrase[i].includes("Snow")){
      imgElement.src = "cloudsnow.svg";
      
    }
    else if(weatherDataInput.NightOrDay != 'D'){
      imgElement.src = "moon.svg";
      
    }
    else {
      imgElement.src = "sun1.svg";
    }


    imgElement.alt = "Cloudy with sunshine";

    // append img element to icon container div
    iconContainerDiv.appendChild(imgElement);

    // create temperature container div
    const temperatureContainerDiv = document.createElement("div");
    temperatureContainerDiv.classList.add("temperatureContainer");

    // create p element for temperature
    const temperatureElement = document.createElement("p");
    temperatureElement.textContent = `${weatherDataInput.maxTemp[i]} °C`;

    // append temperature p element to temperature container div
    temperatureContainerDiv.appendChild(temperatureElement);

    // append icon container div and temperature container div to weather icon container div
    weatherIconContainerDiv.appendChild(iconContainerDiv);
    weatherIconContainerDiv.appendChild(temperatureContainerDiv);

    // create weather info container div
    const weatherInfoContainerDiv = document.createElement("div");
    weatherInfoContainerDiv.classList.add("weatherInfoContainer");

    // create p elements for wind speed, winds, cloud cover, humidity, and UV index

    const windsElement = document.createElement("p");
    windsElement.textContent = `${weatherDataInput.WeatherPhrase[i]}, ${weatherDataInput.WindPhrase[i]}`;

    //const windSpeedElement = document.createElement("p");
    //windSpeedElement.textContent = `Wind Speed: `;


    /* Cloud Cover*/
    const cloudCoverElement = document.createElement("p");
    cloudCoverElement.textContent = "Cloud Cover: ";

    // create span element for percentage
    const percentSpanElement = document.createElement("span");
    percentSpanElement.textContent = `${weatherDataInput.CloudCover[i]}%`;
    percentSpanElement.style.fontWeight = "bold";

    // append span element to cloud cover p element
    cloudCoverElement.appendChild(percentSpanElement);

    /*Humidity*/
    const HumidityCoverElement = document.createElement("p");
    HumidityCoverElement.textContent = "Humidity: ";

    // create span element for percentage
    const HumiditypercentSpanElement = document.createElement("span");
    HumiditypercentSpanElement.textContent = `${weatherDataInput.Humidity[i]}%`;
    HumiditypercentSpanElement.style.fontWeight = "bold";

    // append span element to cloud cover p element
    HumidityCoverElement.appendChild(HumiditypercentSpanElement);

    /*uv*/
    const uvCoverElement = document.createElement("p");
    uvCoverElement.textContent = "UV Index: ";

    // create span element for percentage
    const uvpercentSpanElement = document.createElement("span");
    var uvHourlytoDailyNum = i + 10;
    uvpercentSpanElement.textContent = ` ${weatherDataInput.UVRating[uvHourlytoDailyNum]}`;
    uvpercentSpanElement.style.fontWeight = "bold";

    // append span element to cloud cover p element
    uvCoverElement.appendChild(uvpercentSpanElement);

    // append p elements to weather info container div
    weatherInfoContainerDiv.appendChild(windsElement);
    //weatherInfoContainerDiv.appendChild(windSpeedElement);
    weatherInfoContainerDiv.appendChild(cloudCoverElement);
    weatherInfoContainerDiv.appendChild(HumidityCoverElement);
    //weatherInfoContainerDiv.appendChild(uvCoverElement);

    // append weather icon container div and weather info container div to cols div
    colsDiv.appendChild(weatherIconContainerDiv);
    colsDiv.appendChild(weatherInfoContainerDiv);

    // append h1 element and cols div to weather div
    weatherDiv.appendChild(h1Element);
    weatherDiv.appendChild(colsDiv);

    // append weather div to container div
    containerDiv.appendChild(weatherDiv);

    // append container div to the body
    document.body.appendChild(containerDiv);

    console.log("container")
    console.log(containerDiv);
  }

}
// Initialize the carousel using jQuery


/* Add effects for night and day background*/

const body = document.querySelector('body');

function setBackgroundfromTime(NightOrDay) {


  if (NightOrDay == 'D') {
    body.style.backgroundImage = 'url("Pawl_mountains_material_design_blue_green_material_design_wallp_a49c9e00-67ef-44a5-8680-f1b45f35a933.png")';
  } else {
    body.style.backgroundImage = 'url("Pawl_night_mountains_material_design_blue_green_material_design_95fb5cca-cd46-4e1a-b789-940562efe2c9.png")';
  }


}


function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

function formatReadableDate(dateString) {

  console.log("dateString");
  console.log(dateString);
  const date = new Date(dateString);
  console.log("date");
  console.log(date);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  console.log("formattedDate");
  console.log(formattedDate);
  return formattedDate;
}

function clearWeatherContainers() {
  const containers = document.querySelectorAll('.container');
  containers.forEach(container => {
    container.remove();
  });
}
