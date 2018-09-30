//staggers the results

function staggerFade() {
	setTimeout(function() {
		$('.fadein-stagger > *').each(function() {
			$(this).addClass('js-animated');
		})
	}, 30);
}

//weather reporter

function weatherReport(latitude, longitude) {
//builds api request url with key
	var apiKey       = '45efa1613b4013201b5cc24a7fc166db',
			url          = 'https://api.darksky.net/forecast/',
			lati         = latitude,
			longi        = longitude,
			api_call     = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

	// This will store 24 hour forecast results.
	var sunday = [],monday = [],tuesday = [],wednesday = [],thursday = [],friday = [],saturday = [];

	function hourlyReport(day, selector) {
		for(var i = 0, l = day.length; i < l; i++) {
			$("." + selector + " " + "ul").append('<li>' + Math.round(day[i]) + '</li>');
		}
	}

	// DS returns JSON, so have to use getJSON method and forecast will hold results
	$.getJSON(api_call, function(forecast) {

		// Loop thru hourly forecasts
		for(var j = 0, k = forecast.hourly.data.length; j < k; j++) {
			var hourly_date    = new Date(forecast.hourly.data[j].time * 1000),
				hourly_day     = days[hourly_date.getDay()],
				hourly_temp    = forecast.hourly.data[j].temperature;

			switch(hourly_day) {
				case 'Sunday':
					sunday.push(hourly_temp);
					break;
				case 'Monday':
					monday.push(hourly_temp);
					break;
				case 'Tuesday':
					tuesday.push(hourly_temp);
					break;
				case 'Wednesday':
					wednesday.push(hourly_temp);
					break;
				case 'Thursday':
					thursday.push(hourly_temp);
					break;
				case 'Friday':
					friday.push(hourly_temp);
					break;
				case 'Saturday':
					saturday.push(hourly_temp);
					break;
				default: console.log(hourly_date.toLocaleTimeString());
					break;
			}
		}

		// Loop thru daily forecasts
		for(var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {

			var date     = new Date(forecast.daily.data[i].time * 1000),
				day      = days[date.getDay()],
				time     = forecast.daily.data[i].time,
				humidity = forecast.daily.data[i].humidity,
				summary  = forecast.daily.data[i].summary,
				temp     = Math.round(forecast.hourly.data[i].temperature),
				tempMax  = Math.round(forecast.daily.data[i].temperatureMax);

			// Build results page
			$("#forecast").append(
				    "<div><b>--------------------------------------------------------------------------------------------------------------------------------</b></div>"+
					"<div><b>Day</b>: " + date.toLocaleDateString() + "</div>" +
					"<div><b>Temperature</b>: " + temp + "</div>" +
					"<div><b>Max Temp</b>: " + tempMax + "</div>" +
					"<div><b>Humidity</b>: " + humidity + "</div>" +
					'<p class="summary">' + summary + '</p>' +
					'<div class="hourly' + ' ' + day + '"><b>24hr Forecast</b><ul class="list-reset"></ul></div>'
			);

			// 24 hour report for each day
			switch(day) {
				case 'Sunday':
					hourlyReport(sunday, days[0]);
					break;
				case 'Monday':
					hourlyReport(monday, days[1]);
					break;
				case 'Tuesday':
					hourlyReport(tuesday, days[2]);
					break;
				case 'Wednesday':
					hourlyReport(wednesday, days[3]);
					break;
				case 'Thursday':
					hourlyReport(thursday, days[4]);
					break;
				case 'Friday':
					hourlyReport(friday, days[5]);
					break;
				case 'Saturday':
					hourlyReport(saturday, days[6]);
					break;
			}
		}
		staggerFade(); // fade in results
	});
}

//onclick function
$('button').on('click', function(e) {
	var lat = $('#latitude').val(),long = $('#longitude').val(), city_name = $('#city-search').val();

	if(lat && long !== '') {
		e.preventDefault();

		$('.form').fadeOut(100, function() {
			weatherReport(lat, long);
			$('.screen').append('<ul class="list-reset fadein-stagger" id="forecast"></ul>');
		});
	}
});

//makes call to google maps' api
function insertGoogleScript() {
	var google_api = document.createElement('script'), api_key = 'AIzaSyBmGU1r-MaCf2pIllNVSa9cSjuULBt1pyA';

	google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
	document.body.appendChild(google_api);
}


//auto completes the dropdowns using API libraries place + geometry
function initGoogleAPI() {
	var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search"));

	autocomplete.addListener('places_changed', function() {
		var place = autocomplete.getPlaces()[0];
		document.querySelector("#latitude").value = place.geometry.location.lat();
		document.querySelector("#longitude").value = place.geometry.location.lng();
	});
}

insertGoogleScript();
