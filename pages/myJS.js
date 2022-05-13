var osmUrl = 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png';
var osmAttrib ='<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a>| Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var osm = L.tileLayer(osmUrl, {
maxZoom: 18,
attribution: osmAttrib,
noWrap: true,
});

var map = L.map('map', {
layers: [osm],
center: new L.LatLng(35.2673, -106.5969),
zoom: 10,
maxBounds: [
[90, -180],
[-90, 180],
],
});

// this is just used to show the currently-displayed earthquakes
// in the little sidebar. meant as an example of a use for the 'change'
// event
function updateList(timeline) {
var displayed = timeline.getLayers();
var list = document.getElementById("displayed-list");
list.innerHTML = "";
displayed.forEach(function (veg) {
var li = document.createElement("li");
// The title property below is what is displayed on the sidebar.
li.innerHTML = veg.feature.properties.year;
list.appendChild(li);
});
};
// on the geojson it begins with eqfeed_callback({}) and the geojson data is inside.
// eqfeed_callback is called once the earthquake geojsonp file below loads
function goodveg_totals(data) {
var getInterval = function (veg) {
// earthquake data only has a time, so we'll use that as a "start"
// and the "end" will be that + some value based on magnitude
// 18000000 = 30 minutes, so a quake of magnitude 5 would show on the
// map for 150 minutes or 2.5 hours
return {
start: veg.properties.year,
end: veg.properties.year + 1,
// end: quake.properties.time + quake.properties.mag * 1800000,
};
};
var timelineControl = L.timelineSliderControl({
formatOutput: function (date) {
return new Date(date).toString();
},
});
var timeline = L.timeline(data, {
getInterval: getInterval,
pointToLayer: function (data, latlng) {
var hue_min = 120;
var hue_max = 0;
// This var hue could be how we add precipitation to the polygons.
var hue =
(data.properties.mag / 10) * (hue_max - hue_min) + hue_min;
return L.circleMarker(latlng, {
// radius is how we will represent that amount of veg. So this is veg cover
// vegTotal value from geojson *
radius: data.properties.vegTotal * .1,
color: "hsl(" + hue + ", 100%, 50%)",
fillColor: "hsl(" + hue + ", 100%, 50%)",
}).bindPopup(
'<a href="' + data.properties.url + '">click for more info</a>'
);
},
});
timelineControl.addTo(map);
timelineControl.addTimelines(timeline);
timeline.addTo(map);
timeline.on("change", function (e) {
updateList(e.target);
});
updateList(timeline);
}