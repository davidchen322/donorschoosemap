  var map;
  var apiKey = "DONORSCHOOSE";
  var image = 'images/EducationAndTraining.gif';
  var displayedMarkers = [];
  
  function initMap() {
    var latlng = new google.maps.LatLng(39.81, -91.58);
    var myOptions = {
      zoom: 4,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  }
  
  function updateMapMarkers(educationMarkers) {
	  for (var j=0; j<displayedMarkers.length; j++) {
		  displayedMarkers[j].setMap(null);
	  }
	  displayedMarkers = [];
	  for (var i=0; i<educationMarkers.length; i++) {
		  var myLatlng = new google.maps.LatLng(educationMarkers[i].latitude,educationMarkers[i].longitude);
		  var m = new google.maps.Marker({
			  position: myLatlng,
		      icon: image,
		      animation: google.maps.Animation.DROP
		  });
		  m.setMap(map);
		  displayedMarkers.push(m);
	  }
  }
  
  function searchSchools(search_input) {
	  var keyword= encodeURIComponent(search_input);
	  
	  // todo: make sure search_input has more than 3 characters
	  if (keyword.length < 3) {
		  return;
	  }
	  
	  // donorschoose Search API 
	  var api_url = 'http://api.donorschoose.org/common/json_feed.html?&keywords=' + search_input +'&APIKey=' + apiKey;

	  // todo: handle the failure case too	
	  $.ajax({ type: "GET", 
		  url: api_url, 
		  dataType:"jsonp",
		  success: function(response) {
			  var educationMarkers = [];
			  if(response.proposals) {
		          $.each(response.proposals, function(i,data) {
		        	  educationMarkers.push({latitude: data.latitude, 
		        		  					 longitude: data.longitude, 
		        		  					 id:data.id, 
		        		  					 url:data.proposalURL});
		          });
		          updateMapMarkers(educationMarkers);
		      }
		  }
	  });
  }
  
  
  function setupSearchInput() {
	  $(".search_input").keyup(function() {
		  var search_input = $(this).val();
		  searchSchools(search_input);
	  });
  }
  
$(document).ready(function() {
	initMap();
	setupSearchInput();
});

