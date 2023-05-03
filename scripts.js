
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



function search() {
  const input = searchInput.value.toLowerCase();
  getLocationQuery(input, myData);
  //let matches = addresses.filter(address => address.toLowerCase().includes(input));
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



/*function searchLocation() {
  var location = document.getElementById("search-bar").value;
  alert("Searching for " + location);

}*/


/*API Calls*/




function getLocationQuery(query, data) {

  const options3 = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8cbd3a1197mshd38b28f38b92abdp1182c2jsn9dc19b670992',
      'X-RapidAPI-Host': 'weather338.p.rapidapi.com'
    }
  };

  fetch('https://weather338.p.rapidapi.com/locations/search?query=' + query + '&language=en-US', options3)
    .then(response => response.json())
    .then(data3 => {
      // Retrieve weather information from API response
      //const location = data.current.location;
      //const latitude = data.current.latitude;
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
      'X-RapidAPI-Key': '8cbd3a1197mshd38b28f38b92abdp1182c2jsn9dc19b670992',
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
      WeatherData.UVRating = data3["v3-wx-forecast-daily-15day"]["daypart"][0]["uvIndex"];
      WeatherData.daypartName = data3["v3-wx-forecast-daily-15day"]["daypart"][0]["daypartName"];
      WeatherData.NightOrDay = data3["v3-wx-forecast-hourly-10day"]["dayOrNight"];
      WeatherData.currentTime = data3["v3-wx-observations-current"]["validTimeLocal"];



      console.log("Maxtemp");
      console.log(WeatherData.maxTemp);
      console.log("WindDirection");
      console.log(WeatherData.WeatherPhrase);
      console.log("WindPhrase");
      console.log(WeatherData.WindPhrase);
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
  for (let i = 0; i < 2; i++) {
    //const data = weatherData;
    const container = document.createElement('div');
    container.classList.add('container');
    const weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather');
    /*const location = document.createElement('h1');
    location.textContent = data.location[i];*/
    const TimeDate = document.createElement('p');
    var formattedDate = formatReadableDate(weatherDataInput.currentTime)
    TimeDate.textContent = `${formattedDate}`;
    const temperature = document.createElement('p');
    temperature.textContent = `${weatherDataInput.maxTemp[i]}&deg;F`;
    const windPhrase = document.createElement('p');
    windPhrase.textContent = `${weatherDataInput.WindPhrase[i]}`;
    const WeatherPhrase = document.createElement('p');
    WeatherPhrase.textContent = `Wind Speed: ${weatherDataInput.WeatherPhrase[i]}`;
    const cloudCover = document.createElement('p');
    cloudCover.textContent = `Cloud Cover: ${weatherDataInput.CloudCover[i]}%`;
    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${weatherDataInput.Humidity[i]}%`;

    // Append all the elements to the weather div
    //weatherDiv.appendChild(location);
    weatherDiv.appendChild(temperature);
    weatherDiv.appendChild(TimeDate);
    weatherDiv.appendChild(windPhrase);
    weatherDiv.appendChild(cloudCover);
    weatherDiv.appendChild(humidity)

    // Append the weather div to the container div
    container.appendChild(weatherDiv);

    // Append the container div to the carousel
    carousel.appendChild(container);
  }

  // Initialize the carousel using jQuery
$(document).ready(function() {
  $(".weatherContainer").slick({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  });
});
}


/* Add effects for night and day background*/

const body = document.querySelector('body');

function setBackgroundfromTime(NightOrDay){
  
  
    if (NightOrDay == 'D') {
      
    } else {
      body.style.backgroundImage = 'url("Pawl_mountains_material_design_blue_green_material_design_wallp_a49c9e00-67ef-44a5-8680-f1b45f35a933.png")';
    }
  
  
}


function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
  
  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();
  
  newDate.setHours(hours - offset);
  
  return newDate;
}

function formatReadableDate(utcDate) {
  var localDate = convertUTCDateToLocalDate(new Date(utcDate));
  
  var year = localDate.getFullYear();
  var month = (localDate.getMonth() + 1).toString().padStart(2, '0');
  var day = localDate.getDate().toString().padStart(2, '0');
  var hours = localDate.getHours().toString().padStart(2, '0');
  var minutes = localDate.getMinutes().toString().padStart(2, '0');
  var seconds = localDate.getSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/*fetch('https://ipapi.co/json/')
  .then(response => response.json())
  .then(data2 => {
    // Log the location data to the console
    const location = data2.city;
    const state = data2.region;
    latitude = data2.latitude;
    longatude = data2.longitude;
    console.log(data2);

    setLocationInfo(location, state)

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '8cbd3a1197mshd38b28f38b92abdp1182c2jsn9dc19b670992',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    };
    
    // Retrieve current weather data from WeatherAPI.com
    fetch('https://weatherapi-com.p.rapidapi.com/current.json?q=%20'+ data2.latitude + '%2C' + data2.longitude, options)
      .then(response => response.json())
      .then(data => {
        // Retrieve weather information from API response
        //const location = data.current.location;
        //const latitude = data.current.latitude;
        console.log(data);
        const temperature = data.current.temp_f;
        const wind_direction = data.current.wind_dir;
        const wind_speed = data.current.wind_kph;
        const cloud_cover = data.current.cloud;
        const humidity = data.current.humidity;

        setWeatherInfo(temperature, wind_direction, wind_speed, cloud_cover, humidity);
      })
      .catch(error => console.log(error));
  })
  .catch(error => {
    // Log any errors to the console
    console.error(error);
  });

  function setWeatherInfo(temperature, wind_direction, wind_speed, cloud_cover, humidity,elementNumber) {
    document.getElementById("temperature").innerHTML = `${temperature} &deg;F`;
    document.getElementById("wind-speed").innerHTML = `Wind: ${wind_direction}, ${wind_speed} km/h`;
    document.getElementById("cloud-cover").innerHTML = `Cloud Cover: ${cloud_cover}%`;
    document.getElementById("humidity").innerHTML = `Humidity: ${humidity}%`;
  }

  function setLocationInfo(location, state){
    document.getElementById("location").innerHTML = `${location}, ${state}`;
  }*/