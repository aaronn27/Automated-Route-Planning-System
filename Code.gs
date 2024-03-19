//JavaScript code

//Creating new HTML page from file 'index.html'
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

//This function takes data from the form and calls sortLocations() function to order locations based on the shortest distances between them
function calculateRoute(form){
  var startingLocation = form.location1;
  var locations = [];
  for (var i=2;i<=15;i++){
    var location = form['location' + i];
    if(location && location.trim().length > 0){
      locations.push(location);
    }
  }
  //For sorting upto 15 locations
  locations = locations.slice(0,14);
  
  var sortedLocations = sortLocations(locations,startingLocation);
  //constructing a Google maps URL that directs us to GOOGLE MAPS
  var url = "https://www.google.com/maps/dir/?api=1&origin=" + startingLocation;
  if (sortedLocations.length > 0){
    url += "&destination=" + sortedLocations[sortedLocations.length - 1];
    if (sortedLocations.length > 1){
      url += "&waypoints=" + sortedLocations.slice(0,-1).join("|");
    }
  }
  return url;
}

//This function takes multiple locations as input from the user and sorts them using getDistance() function in order of their shortest distance
function sortLocations(locations, startingLocation){
  var sortedLocations = [];

  sortedLocations.push(startingLocation);

  var otherLocations = locations.filter(location => location !== startingLocation);
  while (otherLocations.length > 0) {
    var distances = otherLocations.map(location => getDistance(startingLocation,location));
    var closestIndex = distances.indexOf(Math.min(...distances));
    var closestLocation = otherLocations.splice(closestIndex, 1)[0];
    sortedLocations.push(closestLocation);
    startingLocation = closestLocation;
  }
  return sortedLocations;
}

// Here the function calculates the distance between 2 locations using Maps API 
function getDistance(location1,location2){
  var response = Maps.newDirectionFinder()
    .setOrigin(location1)
    .setDestination(location2)

    //(for Driving)
    .setMode(Maps.DirectionFinder.Mode.DRIVING)

    //(for Walking)
    //.setMode(Maps.DirectionFinder.Mode.WALKING)

    //DirectionFinder returns Distance Between them in meters 
    .getDirections();
  var distance = response.routes[0].legs[0].distance.value;
  return distance;
}
