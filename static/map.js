$(document).ready(function(){
  //Init map
  var map = L.map('mapid', {
    crs: L.CRS.Simple,
  });

  //Init the current point
  var current_loc = {};

  //Set bound of map image and set the view to lower left corner
  var bounds = [[-10,-51], [338-10,600-51]];
  var image = L.imageOverlay('/static/Outline2.jpg', bounds).addTo(map);
  map.fitBounds(bounds);

  //Connect to websocket
  var socket = io.connect();

  //First connection event
  socket.on('connect', function() {
      socket.send('Map now connected!');
// 4 corners of the map
//    var sol = L.latLng([ 0,0 ]);
//      L.circleMarker(sol,{radius: 5}).addTo(map);
//      var sol = L.latLng([ 0,495 ]);
//      var sol = L.latLng([ 318,0 ]);
//      var sol = L.latLng([ 318,495 ]);
  });

  //Receive new data to render event
  socket.on('render_page', function(msg) {
      socket.send('map connected')
      //Get message and decode image
      $('#ItemPreview').attr('src', 'data:image/jpg;base64,' + msg.imgbyte);
      //Get message and set new point
      var id = msg.id;
      var x = msg.x*(495/2.8);
      var y = msg.y*(318/1.8);
      var z = msg.z;
      var sol = L.latLng([ y,x ]);
      //Remove old location
      if(current_loc != undefined)
      {
        map.removeLayer(current_loc);
      }
      //Add new location
      current_loc = L.circleMarker(sol,{radius: 5, fillColor: "blue",fillOpacity: 1}).bindTooltip("X: "+msg.x+", Y: "+msg.y,
      {sticky: true}).addTo(map).openTooltip();
  });

});
