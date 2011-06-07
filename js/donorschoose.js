  var map;
  var apiKey = "DONORSCHOOSE";
  var image = 'images/EducationAndTraining.gif';
  var displayedMarkers = [];
  var debug = true;
  var projectImg = new Image();
  projectImg.src = "images/donorschoose_org.gif";
  var overlayOptions = { closeOnClick: false, load: false };
  
  function trackCursorLocation() {
	  $(document).mousemove(function(e){
          $("#X").html(((e.pageX / $(window).width())*100) + "%");
          $("#Y").html(((e.pageY / $(window).height())*100+3) + "%");
       });
  }
  
  function debugLog(logstr) {
	  if (debug) {
		  console.log(logstr);
	  }
  }
  
  function initMap() {
    var latlng = new google.maps.LatLng(39.81, -91.58);
    var myOptions = {
      zoom: 4,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  }
  
  function makeMarkerListener(education, show) {
	  return (function() {
		  debugLog(" mouseover: " + education.title);
		  
		  if (!education.x_percent) {
			  education.x_percent = $('#X').html();
			  education.y_percent = $('#Y').html();
		  }
		  showProjectSummary(education, show);
	  });
  }
  
  function updateMapMarkers(educationMarkers) {
	  for (var j=0; j<displayedMarkers.length; j++) {
		  displayedMarkers[j].setMap(null);
	  }
	  displayedMarkers = [];
	  for (var i=0; i<educationMarkers.length; i++) {
		  var education = educationMarkers[i];
		  var myLatlng = new google.maps.LatLng(educationMarkers[i].latitude,educationMarkers[i].longitude);
		  var m = new google.maps.Marker({
			  position: myLatlng,
		      icon: image,
		      animation: google.maps.Animation.DROP
		  });
		  google.maps.event.addListener(m, 'mouseover', makeMarkerListener(education, true));
		  google.maps.event.addListener(m, 'mouseout', makeMarkerListener(education, false));

		  m.setMap(map);
		  displayedMarkers.push(m);
	  }
  }
  
  // TODO: make sure a page reload clears the input
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
		        		  					 imageURL:data.imageURL,
		        		  					 title:data.title,
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
  
  // overlay control stuff
  // TODO: replace with jquery!
  // TODO: use jquery to dynamically generate an overlay <div> (and remove when mouseOut)
  function showProjectSummary(education, showIsTrue) {
	// select the overlay element - and "make it an overlay"
	$("#project_title").html(education.title);
	$("#api_img").attr("src", education.imageURL);
	
	if (showIsTrue) {
		var overlay = $("#overlay").overlay({ 
			closeOnClick: false, 
			load: false 
			});
		var conf = overlay.getConf();
		conf.top = education.y_percent;
		conf.left = education.x_percent;
		overlay.load();
	} else {
		$("#overlay").overlay().close();
	}
  }
  
  
$(document).ready(function() {
	trackCursorLocation();
	initMap();
	setupSearchInput();
});

