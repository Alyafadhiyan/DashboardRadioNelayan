  // Initialize and add the map
function initMap() {
  let jsondata = "";
  let url = '/location'
  async function getJson(url){
    let responese = await fetch(url);
    let data = await responese.json()
    return data;
  }
  setTimeout(getJson, 2000);
  main()
  async function main() {
    jsondata = await getJson(url)
    console.log(jsondata);
    const ship = { lat: jsondata.Latitude , lng: jsondata.Longitude };
    // The map, centered at location
    const map = new google.maps.Map(document.getElementById("maps"), {
      zoom: 8,
      center: ship,
    });
    // The marker
    const marker = new google.maps.Marker({
      position: ship,
      map: map,
    });

    var loader = setInterval(function () {
      if (document.readyState == "complete"){
        marker.addListener("click", () => {
          $('#weather-bar').css('display','none');
          $('#user-bar').css('transform','scale(1)');
        }); 
        $('#close').click(function(){
          $('#user-bar').css('transform','scale(0)');
          $('#weather-bar').css('display','inline-block');
        });
      };
    });
  }

  // window.onload = async() => {
  //   const response = await fetch(url)
  //   const data = await response.json()
  //   init(data)
  // }

  // function init({data}) {
  //   console.log(data)
  // }

  // fetch('/location')
  //   .then(response => response.json())
  //   .then(response => {
  //     lat = response.Latitude;
  //     long = response.Longitude;
  //   });

    //   locationData()
    //   var functOfResponese = 10;
    //   function locationData(){
    //     functOfResponese = 110;
    //   $.ajax({
    //     type: "GET",
    //     url: '/location',
    //     data: "json",
    //     success: responese
    //   })
    //   console.log(functOfResponese)
    // }
    //   function responese(data) {
    //     functOfResponese = data.Latitude;
    //     console.log(functOfResponese)
    //   }
    //   console.log(functOfResponese)

    // The location
    // const ship = { lat: -6.982153 , lng: 106.402766 };
    // // The map, centered at location
    // const map = new google.maps.Map(document.getElementById("maps"), {
    //   zoom: 4,
    //   center: ship,
    // });
    // // The marker
    // const marker = new google.maps.Marker({
    //   position: ship,
    //   map: map,
    // });


  }

  const API_KEY ='your API key';

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);   
      })    
    })
}

sensorData()
function sensorData(){
  console.log("aaaaa")
  $.ajax({
    type: "GET",
    url: '/sensor',
    data: "json",
    success: function(response){
        if (response.warning == "0"){
        $('#notif-warning-safe').css('display','inline-block');
        $('#notif-warning').css('display','none')
      }
        else {(response.warning == "1")
          $('#notif-warning-safe').css('display','none');
          $('#notif-warning').css('display','inline-block');
        };
      },
      error: function(error){
        console.log(error)
      }
  });
};

setInterval(sensorData, 1000);

activeDeviceNow()
function activeDeviceNow(){
  console.log("aaaaa")
  $.ajax({
    type: "GET",
    url: '/deviceactive',
    data: "json",
    success: function(response){
      activeDevice.innerHTML =  response;
      console.log(typeof response)
      },
      error: function(error){
        console.log(error)
      }
  });
};

function showWeatherData (data){

  timezone.innerHTML = data.timezone;
  degree = data.current.temp+"&#176;C";
  temp.innerHTML = degree;

  humidity.innerHTML = 'Humidity : ' + data.current.humidity;
  pressure.innerHTML = 'Pressure : ' + data.current.pressure;
  wind.innerHTML = 'Wind Speed : ' + data.current.wind_speed;

  data_sunrise = data.current.sunrise;
  var sunrise = new Date(data_sunrise*1000);
  var sunrise_hours = sunrise.getHours();
  var sunrise_minutes = "0" + sunrise.getMinutes();
  var sunrise_time = 'Sunrise Time : ' + sunrise_hours + ':' + sunrise_minutes.substr(-2);
  fixsunrise.innerHTML = sunrise_time;

  data_sunset = data.current.sunset;
  var sunset = new Date(data_sunset*1000);
  var sunset_hours = sunset.getHours();
  var sunset_minutes = "0" + sunrise.getMinutes();
  var sunset_time = 'Sunset Time : ' + sunset_hours + ':' + sunset_minutes.substr(-2);
  fixsunset.innerHTML = sunset_time;
}

function clockTick() {
  var today = new Date();
  montNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  days = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday'];
  day = days[today.getDay()];
  date = today.getDate()+' '+montNames[today.getMonth()]+' '+today.getFullYear();
  time = today.getHours() + ":" + ('0'+today.getMinutes()).slice(-2);
  document.getElementById("dateTime").innerHTML = time;
  document.getElementById("day").innerHTML = day;
  document.getElementById("date").innerHTML = date;
}

setInterval(clockTick, 1000);
