/*
Script Name : Script.js
Description : Logic to fetch api for weather forcast
*/

// Default Api key
var apiKey = "b28479e979d035f7ced7d5be7412cf38";

// moment JS date object
var now = moment().format("(L)");

// Selectors 
var weatherDay = document.querySelector("#showCurrentWeather")
var weatherInfo = document.querySelector("#weather-container")
var listado = document.querySelector("#list-city");
var title = document.querySelector("#title-five");
var cardEL = document.querySelector("#allday")

//Forecast
var day1 = document.querySelector("#eachday1")

//Elemets to display data
var listdata = document.createElement("div")
var tempS = document.createElement("p");
var humS = document.createElement("p");
var windS = document.createElement("p");
var UVS = document.createElement("p");

// Array to store list of cities
var list = []


/*
####################################################################
Function Name : DisplayLocallyStoredCities
Defination:
To display and get city name from local storage
####################################################################
*/

var DisplayLocallyStoredCities = function () {
  list = JSON.parse(localStorage.getItem("name"))
  if (!list) {
    list = []
  }
  listado.innerHTML = " ";
  for (var i = 0; i < list.length; i++) {
    getListCities(list[i])
  }

}


/*
####################################################################
Function Name : fetchWeatherForCurrentCity
Defination:
To display and  fetch current weather of city entered by user
####################################################################
*/

function fetchWeatherForCurrentCity(city) {
  console.log("searchcurr:", city)
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(function (response) {
      if (response.ok) {
        console.log(response)
        response.json().then(function (data) {

          if (list.indexOf(city) === -1) {
            list.push(city)
            localStorage.setItem("name", JSON.stringify(list));

            // Call diaplay function to show cities stored in local storage
            DisplayLocallyStoredCities();

          }

          //Show city name and current day
          var dateCity = document.createElement("div"); //add the icon
          var image = document.createElement("img")
          var imageUrl = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

          image.setAttribute("src", imageUrl)

          dateCity.innerHTML = city + " " + now;
          dateCity.appendChild(image)

          //Crealing Info ..
          weatherDay.innerHTML = "";
          //Added Style
          weatherDay.classList.add("currentStyle")
          weatherDay.appendChild(dateCity);


            //Crealing Info ..
          weatherInfo.innerHTML = "";
          listdata.innerHTML = "";

          //Calling UV for index api calls with coordinates
          fetchUVIndex(data.coord.lat, data.coord.lon);

          //Display on page the weather data

          tempS.textContent = " Temperature:" + " " + data.main.temp + " " + "ºF";
          humS.textContent = " Humidity:" + " " + data.main.humidity + " " + "%";
          windS.textContent = " Wind" + " " + "Speed:" + " " + data.wind.speed + " " + "MPH";

        //Added Style
          weatherInfo.classList = "card"

          listdata.appendChild(weatherDay)
          listdata.appendChild(tempS)
          listdata.appendChild(humS)
          listdata.appendChild(windS)
          weatherInfo.appendChild(listdata)
        })
      }
      else {
        alert("Error" + " " + response.statusText)
      }
    }).catch(function (error) {
      alert("Error" + " " + error.statusText)
    })
}


/*
####################################################################
Function Name : fetchUVIndex
Defination:
To display and  fetch UV Index making another call to api
####################################################################
*/


function fetchUVIndex(lat, lon) {


  fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`)
    .then(function (response) {

      if (response.ok) {
        response.json().then(function (data) {

                  
          // Creating button
          var buttonUVEL = document.createElement("button");
          buttonUVEL.classList.add("btn");

          //Getting UV data by passing values
          buttonUVEL.textContent = data.value;

          //Checks for green, red and blue for UV
          if (data.value < 3) {
            buttonUVEL.classList.add("btn-success");
          }
          else if (data.value < 7) {
            buttonUVEL.classList.add("btn-warning");
          }
          else {
            buttonUVEL.classList.add("btn-danger");
          }

          var UVel = document.createElement("div");
          UVel.innerText = "UV Index:" + " ";
          UVel.appendChild(buttonUVEL);

          //Display UV data on page
          listdata.appendChild(UVel)
          weatherInfo.appendChild(listdata)
        })
      }
      else {
        alert("Error UV " + " " + response.statusText)
      }

    }).catch(function (error) {
      alert("Error UV" + error.statusText)
    })
}



/*
####################################################################
Function Name : fetchFiveForecast
Defination:
To display and  fetch  five forecast for the day 
####################################################################
*/

function fetchFiveForecast(city) {
  console.log("serchforecast:", city)
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then(function (response) {
      if (response.ok) {

        response.json().then(function (data) {

          //create element for the title
          var titleforecast = document.createElement("h2")
          //clear the title
          title.textContent = "";

          // tittle for 5 days forecast
          titleforecast.textContent = "5-Day Forecast:"
          title.appendChild(titleforecast)


          for (var i = 6; i < 39; i += 8) {

            //create elements for show the info for each day
            var div = document.createElement("div")
            var firstDT = document.createElement("p")
            var firstDH = document.createElement("p")
            var imagen1 = document.createElement("img")
            var time1 = document.createElement("h4")

            time1.textContent = data.list[i].dt_txt.split(" ")[0];
            time1.classList="dateForecast";
            imagen1.setAttribute("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")
            imagen1.classList=" imgDisplay ";
            firstDT.textContent = " Temp:" + " " + data.list[i].main.temp + " " + "ºF";
            firstDH.textContent = " Humidity:" + " " + data.list[i].main.humidity + " " + "%";
            div.classList = 'col-md-2 style  forecast mr-3 ';

            div.appendChild(time1)
            div.appendChild(imagen1)
            div.appendChild(firstDT)
            div.appendChild(firstDH)
            cardEL.appendChild(div)

          }

        })
        //clear the info for the 5 day forescast
        cardEL.innerHTML = "";
      }
      else {
        alert("Error" + " " + response.statusText)
      }

    }).catch(function (error) {

      alert("Error" + " " + error.statusText)
    })
}

/*
####################################################################
Function Name : getListCities
Defination:
To get list of cities
####################################################################
*/

var getListCities = function (cityIn) {

  var firstC = document.createElement("button")
  firstC.classList = " list-group-item list-group-item-action";

  firstC.textContent = cityIn;
  listado.appendChild(firstC)

}

// On click listeners for clicking for city buttons

document.getElementById("list-city").addEventListener("click", function (event) {

  //call the fuction from the list button cities
  fetchWeatherForCurrentCity(event.target.textContent);
  fetchFiveForecast(event.target.textContent);
})

//On click listeners for search buttons

document.getElementById("searchC").addEventListener("click", function (event) {
  event.preventDefault();

  //The value  for seach
  var cityIn = document.getElementById("city").value;
  document.getElementById("city").value = "";
  //Change city name to upper case
  cityIn = cityIn.toUpperCase();


   // To check for null and empty checks

  if (cityIn) {
    //call for current weather day
    fetchWeatherForCurrentCity(cityIn);

    //call for 5 days forecast
    fetchFiveForecast(cityIn);


  }
  else {
    alert("You need in a City name")
  }

})

// Call to display city stored in local storage
DisplayLocallyStoredCities();