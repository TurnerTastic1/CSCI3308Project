

// set map option

var myLatLng = { lat: 39.7392, lng: -104.9903 };
var mapOptions = {
    center: myLatLng,
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

// create Map

var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

// create a Directions service object to use the route method and get a result for our request

var directionsService = new google.map.DirectionsService();

// create a DirectionRenderer object which we will use to display

var DirectionsDisplay = new google.maps.DirectionsRenderer();

//bind the directionsRenderer to the map

DirectionsDisplay.setMap(map);

// function

function calRoute() {
//   //create request
  var request = {
      origin: document.getElementById("from").value,
      destination: document.getElementById("to").value,
      travelMode: google.maps.TravelMode.DRIVING, // WALKING, BYCYCLING, TRANSFORTATION
      unitSystem: google.maps.UnitSystem.IMPERIAL
  }

//   //Pass the request to the route method
  directionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.Ok) {

      //get distance and time
      const output = document.querySelector('#output');
      output.innerHTML = "<div class='alert-info'> From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ". <br /> Driving distance <i class='fa-solid fa-road'></i>: " + result.routes[0].legs[0].distance.text + ". </div>";

      //display route
      directionsDisplay.setDirection(result); 
    } else {
      //delete route from map
      directionsDisplay.setDirection({ routes: []});

      //center map in boulder
      map.setCenter(myLatLng);

      //show error message.
      output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance. </div>"

    }
  });
}

// create autocomplete object

var options = {
  types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options)

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2. options)