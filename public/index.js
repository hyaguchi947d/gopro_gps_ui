var gps_map = L.map('map').setView([35.75, 139.71], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(gps_map);

var polylines = {};

var btn_add = document.getElementById("add");
var btn_del = document.getElementById("del");
var selector = document.getElementById("gpsfile");

function loadList() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", location.href + "list", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var xhrres = JSON.parse(xhr.responseText || "null");
      xhrres.files.forEach(filename => {
        selector.add(new Option(filename, filename));
      });
    }
  };
  xhr.send(null);
}
loadList();

btn_add.addEventListener('click', function() {
  var filename = selector.options[selector.selectedIndex].value;
  console.log("ADD: " + filename);

  if (polylines[filename]) {
    console.log("already added.");
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("GET", location.href + "json/" + filename, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var gps = JSON.parse(xhr.responseText || "null");
      //console.log(gps);
    
      if (gps !== null) {
        if ("data" in gps) {
          // old format
          var lines = gps.data.map(function(pt) {
            return [pt.lat, pt.lon];
          });
          let pl = L.polyline(lines, {color:'blue'}).addTo(gps_map);
          polylines[filename] = pl;
        } else {
          // new format
          var lines = gps["1"]["streams"]["GPS5"]["samples"].filter(function(pt) {
            return pt["GPS (Lat.) [deg]"] !== null && pt["GPS (Long.) [deg]"] !== null;
          }).map(function(pt) {
            return [pt["GPS (Lat.) [deg]"], pt["GPS (Long.) [deg]"]];
          });
          let pl = L.polyline(lines, {color:'blue'}).addTo(gps_map);
          polylines[filename] = pl;
        }

      }
    }
  };
  xhr.send(null);
});

btn_del.addEventListener('click', function() {
  var filename = selector.options[selector.selectedIndex].value;
  console.log("DEL: " + filename);
  if (polylines[filename]) {
    polylines[filename].removeFrom(gps_map);
    delete polylines[filename];
  } else {
    console.log("missing layer.");
  }
});