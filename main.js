
var imgBG = {};
var imgClouds = {}; 
var weatherName;
var weatherTemp; 
var tempF;
var tempC;
var weatherClouds;
var timeOfDay;
var skyIcon;
var backgroundImg;
var unix_timestamp = (Date.now()) - 18000;
var theDate = new Date(unix_timestamp); 
var getHours = theDate.getHours(); 
  
if (getHours >= 0 && getHours < 7 || getHours > 21 && getHours <= 24){
  timeOfDay = "Atlanta_Background_Night";
}

if (getHours >= 7 && getHours <= 18){
  timeOfDay = "Atlanta_Background_Day";
}

if (getHours >= 18 && getHours <= 21){
  timeOfDay = "Atlanta_Background_Evening";
}
 
var weatherJSON = "http://api.openweathermap.org/data/2.5/weather?q=washington_dc,us&appid=c3801216ef0be7a651300768985808ef";

var flickrClouds = "https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id=72157665270698541&+description+&api_key=814796ef7eee08b0534ae009b71b62aa&jsoncallback=?";

var flickrBG = "https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id=72157665271419401&+description+&api_key=814796ef7eee08b0534ae009b71b62aa&jsoncallback=?";
 
function setBG(){
  backgroundImg = imgBG[timeOfDay];
  console.log("Background = " + backgroundImg);
  $('#mainContainer').css({
    "background-image" : "url(" + backgroundImg + ")",
    "background-repeat" : "no-repeat",
    "background-size" : "100%"
  });
}
  
function setDay(){
  if (timeOfDay === "Atlanta_Background_Night"){
    return "Sky_Night_";
  }
  if (timeOfDay === "Atlanta_Background_Day"){
    return "Sky_Day_";
  }
  if (timeOfDay === "Atlanta_Background_Evening"){
    return "Sky_Evening_";
  }
}

function setIcon(){
  var condition;
  var iconKey; 
  if (weatherClouds === 800){ 
    condition = "Clear"; 
    iconKey = setDay() + condition; 
    skyIcon = imgClouds[iconKey]; 
  }

  if (801 <= weatherClouds >= 803  ){
    condition = "P_Cloudy"; 
    $('#mainIcon').css({
      "width" : "180px",
      "height" : "180px"
    });
    iconKey = setDay() + condition; 
    skyIcon = imgClouds[iconKey]; 
  }
  
   if (weatherClouds >= 701 && weatherClouds <= 781){
    condition = "Cloudy"; 
    $('#mainIcon').css({
      "width" : "180px",
      "height" : "180px"
    });
    iconKey = setDay() + condition; 
    skyIcon = imgClouds[iconKey];  
  }

  if (weatherClouds === 804){
    condition = "Cloudy"; 
    $('#mainIcon').css({
      "width" : "180px",
      "height" : "180px"
    });
    iconKey = setDay() + condition; 
    skyIcon = imgClouds[iconKey]; 
  }

  if (600 <= weatherClouds >= 622){
    condition = "Snowy"; 
    $('#mainIcon').css({
      "width" : "180px",
      "height" : "180px"
    });
    iconKey = setDay() + condition; 
    skyIcon = imgClouds[iconKey]; 
  }

  if (200 <= weatherClouds >= 531){
    condition = "Rainy"; 
    $('#mainIcon').css({
      "width" : "180px",
      "height" : "180px"
    });
    iconKey = setDay() + condition; 
    skyIcon = imgClouds[iconKey]; 
  }
  console.log("Icon = " + skyIcon);
  $('#mainHeader').text(weatherName); 
  $('#mainIcon').attr("src", skyIcon); 
  $('#mainTemp').text(tempF);
  $('#celcius').click(function(){
    $('#mainTemp').empty();
    $('#mainTemp').text(tempC);
    $('#mainC').css({"color" : "white"});
    $('#mainF').css({"color" : "grey"});
  });
   $('#fahrenheit').click(function(){ 
    $('#mainTemp').empty();
    $('#mainTemp').text(tempF);
    $('#mainF').css({"color" : "white"});
    $('#mainC').css({"color" : "grey"});
  });
}

function getJSON(){
  $.getJSON(weatherJSON, function(data){    
   weatherName = data.name;
   weatherTemp = data.main.temp;
   weatherClouds = data.weather[0].id;
   tempF = Math.ceil(1.8*(weatherTemp - 273) + 32);
   tempC = Math.ceil((tempF - 32) / 1.8);
});
  
$.getJSON(flickrClouds, function(data){  
   var length = 0;
   $.each(data.photoset.photo, function(index, photo){ 
     var o_secret;
     var getPhotoInfo = "https://api.flickr.com/services/rest/?format=json&method=flickr.photos.getInfo&photo_id=" + photo.id + "&api_key=814796ef7eee08b0534ae009b71b62aa&jsoncallback=?";
     $.getJSON(getPhotoInfo, function(info){ 
       o_secret = info.photo.originalsecret;
     }).then(function(){
       imgClouds[photo.title] = "https://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + o_secret + "_" + "o.gif"; 
     length++;
     if(length === data.photoset.photo.length){ 
       setIcon();
     }  
     }); 
   }); 
}); 

$.getJSON(flickrBG, function(data){   
   var length = 0;
   $.each(data.photoset.photo, function(index, photo){  
     var o_secret;
     var getPhotoInfo = "https://api.flickr.com/services/rest/?format=json&method=flickr.photos.getInfo&photo_id=" + photo.id + "&api_key=814796ef7eee08b0534ae009b71b62aa&jsoncallback=?";
     $.getJSON(getPhotoInfo, function(info){ 
       o_secret = info.photo.originalsecret;
     }).then(function(){
     imgBG[photo.title] = "https://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + o_secret + "_" + "o.jpg";
     length++;
     if(length === data.photoset.photo.length){
       setBG();
     }
     });
   }); 
  if(skyIcon === undefined){
    setIcon();
  }
}); 
   
}

getJSON(); 