// var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
// 	maxZoom: 19,
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
// });

var osmHUrl = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
var osmHAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';
var osmH = L.tileLayer(osmHUrl, {
  maxZoom: 18,
  attribution: osmHAttrib,
  noWrap: true,
});

var map = L.map('map', {
  layers: [osmH], 
  center: new L.LatLng(35.1324, -106.6952),
  zoom: 12,
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
// Attempting to call in the precip values from greatveg_totals.geojson. parse the values and only have 3 decimal places. 
// function greatveg_totals(dataP) {
// return Number.parseFloat(data.properties.precip).toFixed(3);
// }

function greatveg_totals(data) {
  var getInterval = function (veg) {
    // earthquake data only has a time, so we'll use that as a "start"
    // and the "end" will be that + some value based on magnitude
    // 18000000 = 30 minutes, so a quake of magnitude 5 would show on the
    // map for 150 minutes or 2.5 hours
    return {
      start: veg?.properties?.year,
      end: veg?.properties?.year ,
      // end: quake.properties.time + quake.properties.mag * 1800000,
    };
  };
  var timelineControl = L.timelineSliderControl({
    formatOutput: function(year) {
      return new Number(year);
    },
  });

  var timeline = L.timeline(data, {
    getInterval: getInterval,
    pointToLayer: function (data, latlng) {
      // Change Precip color using a hue
       var hue_min=190;
       var hue_max=220;
      // var hue_min = 175;
      // var hue_max = 265;
      // This var hue could be how we add precipitation to the polygons.
      // multiple precip by 1 to make it a number and thus can add to the hue_min
      var hue =
        (data.properties.precip * 1) + hue_min;
      
      return L.circleMarker(latlng, {
        // radius is how we will represent that amount of veg. So this is veg cover
        // vegTotal value from geojson *
        radius: data.properties.vegTotal * .1,
        color: "hsl("+ hue + ", 100%,  50%)",
        fillColor: "hsl("+ hue + ", 100%,  50%)",
        //bindPopup, uses list tags and is calling in data from the geojson to create the popup's content
      }).bindPopup( "<h5>Site: " + data.properties.siteName + ", Year: " + data.properties.year + "</h5>"
   +"<ul><li>Total Vegetation: " + data.properties.vegTotal + " cm</li>"
  // line 181 parseFloat and toFixed used to import only 3 digits afer the decimal
  + "<li>Total Precipitation: " +  Number.parseFloat(data.properties.precip).toFixed(3) + " mm</li>"
  +"<li>Cottonwood Sum Intercept: " + data.properties.cottonwoodSum + " cm</li>"
  + "<li>Russian Olive Sum Intercept: " + data.properties.rusOliveSum + " cm</li>"
  + "<li>NM Olive Sum Intercept: " + data.properties.nmOliveSum + " cm</li>"
  + "<li>Saltcedar Sum Intercept: " + data.properties.saltcedarSum + " cm </li></ul>");
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
// using percipitation value in geojson/csv from BEMP data
// min: 0, median:14.7025, max:29.358
// To use round numbers the legend will use 0, 5, 15, 30, the popUp will state the exact value per site
const legend = L.control.Legend({
  title:  "Yearly Precipitation",
  position: "topright",
  collapsed: false,
  symbolWidth: 30,
  opacity: 1,
  column: 1,
  legends: [{
    label: "No data",
                type: "circle",
                radius: 10,
                color: "hsl(" +237+ ", 3%, 70%)",
                fillColor: "hsl(" +237+ ", 3%, 70%)",
                weight: 2,
  },
  {
    label: "5 mm",
    type: "circle",
    radius: 10,
    color: "hsl(" + 195 + ", 100%, 50%)",
    fillColor: "hsl(" + 195 + ", 100%, 50%)",
    weight: 2,
  },
  {
    label: "15 mm",
                type: "circle",
                radius: 10,
                color: "hsl(" + 205 + ", 100%, 50%)",
                fillColor: "hsl(" + 205 + ", 100%, 50%)",
                weight: 2,
  },
{
  label: "30 mm",
  type: "circle",
  radius: 10,
  color: "hsl(" + 220 + ", 100%, 50%)",
  fillColor: "hsl(" + 220 + ", 100%, 50%)",
  weight: 2,
}]
}).addTo(map);
//  var popContent = function popContent(data) {
   
//      }
