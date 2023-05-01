// let googleMap;

// async function initMap() {
//   //@ts-ignore
//   const { Map } = await google.maps.importLibrary("maps");
  
//   googleMap = new Map(document.createElement('div'), {
//     center: { lat: 39.7392, lng: -104.9903 },
//     zoom: 10,
//   });
// }

// initMap();


//         google.maps.event.addDomListener(window, 'load', initialize);

//         function initialize() {

//           var input = document.getElementById('destination');
//           var input2 = document.getElementById('fromYourLocation');

//           var autocomplete = new google.maps.places.Autocomplete(input);
//           var autocomplete2 = new google.maps.places.Autocomplete(input2);
//           autocomplete.addListener('place_changed', function () {

//             var place = autocomplete.getPlace();

//             // place variable will have all the information you are looking for.

//             $('#lat').val(place.geometry['location'].lat());

//             $('#long').val(place.geometry['location'].lng());

//             autocomplete2.addListener('source_changed'), function () {

//               var place2 = autocomplete.getPlace();

//               // place variable will have all the information you are looking for.

//               $('#lat').val(place2.geometry['location'].lat());

//               $('#long').val(place2.geometry['location'].lng());


              
//             }

//           });

//         }


// // set map option

// var myLatLng = { lat: 39.7392, lng: -104.9903 };
// var mapOptions = {
//     center: myLatLng,
//     zoom: 10,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
// };

// // create Map

// var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

// // create a Directions service object to use the route method and get a result for our request

// var directionsService = new google.map.DirectionsService();

// // create a DirectionRenderer object which we will use to display

// var DirectionsDisplay = new google.maps.DirectionsRenderer();

// //bind the directionsRenderer to the map

// DirectionsDisplay.setMap(map);

// // function

// function calRoute() {
// //   //create request
//   var request = {
//       origin: document.getElementById("from").value,
//       destination: document.getElementById("to").value,
//       travelMode: google.maps.TravelMode.DRIVING, // WALKING, BYCYCLING, TRANSFORTATION
//       unitSystem: google.maps.UnitSystem.IMPERIAL
//   }

// //   //Pass the request to the route method
//   directionsService.route(request, (result, status) => {
//     if (status == google.maps.DirectionsStatus.Ok) {

//       //get distance and time
//       const output = document.querySelector('#output');
//       output.innerHTML = "<div class='alert-info'> From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ". <br /> Driving distance <i class='fa-solid fa-road'></i>:" + result.routes[0].legs[0].distance.text + ".<br />Duration "
//     }
//   })
// }