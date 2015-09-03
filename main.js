'use strict'

$(document).ready(init);

function init(){
  var $city = $('#city');
  var $state = $('#state');
  var $error = $('#error');
  var $locationDisplay= $('#location');
  var $currentTempDisplay = $('#currentTemp');
  var $highPoint = $('#highPoint');
  var $lowPoint = $('#lowPoint');
  var $tomorrow = $('#tomorrow');
  var $dayAfter = $('#dayAfter');
  var $dayAfterThat = $('#dayAferThat');
  $('#homeLocale').click(getLocalData);
  $('#go').click(goClicked);

  function goClicked(e){
    var city =$city.val();
    var state = $state.val();
    getPromises(city, state);
    clearDisplays()
  }

  function getLocalData(e){
    promiseMeYouWillNeverLetGo()
  }

  function clearDisplays(){
    $('.display').text('');
    $('#forecastContainer').addClass('hidden')
    $('.sky').empty();
  }

  function getPromises(city, state){
    var promise1 = $.get("http://api.wunderground.com/api/ce578d12f15f207a/conditions/q/"+state+"/"+city+".json", {
    });
    promise1.success(function(data){
      changeDisplay1(data)
      console.log(data);
    })
    promise1.fail(function(error) {
      console.log('error:', error);
    })
    var promise2 = $.get("http://api.wunderground.com/api/ce578d12f15f207a/forecast/q/"+state+"/"+city+".json", {
    });
    promise2.success(function(data){
      changeDisplay2(data)
      console.log(data);
    })
    promise2.fail(function(error) {
      console.log('error:', error);
    })
  }
  function promiseMeYouWillNeverLetGo(){
    var promise1 = $.get("http://api.wunderground.com/api/ce578d12f15f207a/geolookup/q/autoip.json", {
    });
    promise1.success(function(data){
      getCityAndState(data)
      console.log(data);

    })
    promise1.fail(function(error) {
      console.log('error:', error);
    })
  }

  function getCityAndState(obj){
    var city = obj.location.city;
    var state = obj.location.state;
    getPromises(city, state);
  }

  function changeDisplay1(obj){
    if(obj.current_observation){
      $('.displayContainer').removeClass('hidden');
      $locationDisplay.text(obj.current_observation.display_location.full);
      $currentTempDisplay.text('Current Temperature: '+ obj.current_observation.temp_f + "\xB0 F (" + obj.current_observation.temp_c + '\xB0 C)');
      determineSky(obj.current_observation.weather);
    }
    else {
      $('#currentObservationsContainer').removeClass('hidden')
      throwError()
    }
  }

  function changeDisplay2(obj){
    if(obj.forecast){
      var arr = obj.forecast.simpleforecast.forecastday;
      $highPoint.text('High:  ' + arr[0].high.fahrenheit+ "\xB0 F");
      $lowPoint.text('Low:  ' + arr[0].low.fahrenheit+ "\xB0 F");
      for (var i =1; i <arr.length; i++){
        changeDisplay3(arr[i], i);
      }
    }
    else{
      throwError()
    }
  }

  function changeDisplay3(obj, i){
    var location;
    if (i===1){
      location = $tomorrow
    } else if (i===2){
      location = $dayAfter
    }
    else{
      location = $dayAfterThat
    }

    var low = 'Low: '+ obj.low.fahrenheit+ '\xB0F';
    var high = 'High: '+ obj.high.fahrenheit+ "\xB0F"
    var date = obj.date.weekday_short + " "+ obj.date.day + '/' + obj.date.month
    var sky = obj.icon_url

    location.find('.low').text(low);
    location.find('.date').text(date);
    location.find('.high').text(high);
    location.find('.sky').prepend('<img src="'+sky+'"></img>')
  }
  function determineSky(weather){
    switch (weather) {
      case 'Clear':
      $('body').css('background-image', 'url(SunnySky.jpg)')
      break;
      case 'Partly Cloudy' || 'Mostly Cloudy':
      $('body').css('background-image', 'url(PartlyCloudy.jpg)')
      break;
      default:
      $('body').css('background-image', 'url(cloudy.jpg)')
      break;
    }
  }

  function throwError(){
    $('#error').text('Location not found. Please check your entry and try again.')
  }
}
