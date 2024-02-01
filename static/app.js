let map, popup, Popup;

// Initialise default map values
let markerList = [];
let circleList = [];
let markerToggle = "available_bikes";

// Initialise default chart values
let selectChart = false;
let hourlyChart = true;
let dailyChart = false;
let predictionChart = false;

// function to display the circles as different colours depending on how many bikes are currently
// available in that station.
changeCircleColour = (available, total) => {
  percentage = (available / total) * 100;
  //  console.log(available, total, percentage);
  if (percentage <= 10) {
    return "#8b1a00";
  }
  if (percentage <= 20) {
    return "#d25c00";
  }
  if (percentage <= 30) {
    return "#F5BB00";
  } else {
    return "#0877ff";
  }
};

// function to close the popup window that is currently open.
// activated by clicking the 'x' in the top-left-hand corner of the popup
function closePop() {
  document.getElementById("content").style.display = "none";
}

// function
// prettier-ignore
function initCharts() {
  google.charts.load('current', { 'packages': ['corechart'] });
  google.charts.setOnLoadCallback(initMap);
}
let activeStation = null;

// Contains the marker function which displays a popup window with live info for the clicked station --
// either clicked on the map or slected from the dropdown menu.
// Contains a constructor for the Popup class
function initMap() {
  // when called, this function takes its list argument
  // splits the list into variables
  // plugs the variables into the innerHTML for the id='content' div in the index.html file.
  // it makes the 'content' div display the innerHTML as a block
  // creates a new instance of the popup class
  // assigns the html put in the 'content' div to the popup instance
  // and displays that popup on the map.
  // The function also takes the part of its list referring to the station_number and
  // depending on the whether darkMode or lightMode is selected, sends the station_number to the
  // drawOccupancyWeekly function in the charts.js file.
  function marker(markerList) {
    console.log("marker called with", markerList);

    var name = markerList[0];
    var available_bikes = markerList[1];
    var available_stands = markerList[2];
    var lat = markerList[3];
    var lng = markerList[4];
    var number = markerList[5];

    // Exit popup button
    document.getElementById(
      "content"
    ).innerHTML = `<button onclick="closePop()" class="closePopupButton">X</button>`;

    // Popup content
    document.getElementById(
      "content"
    ).innerHTML += `<div class="contentText"> <h1 class="popupHead">${name}<h1>
        <svg id="Layer_1" height="10%" viewBox="0 0 512 512" width="10%" xmlns="http://www.w3.org/2000/svg">
         <path d="m416.667 224.936c-7.701 0-15.189.924-22.365 2.656l-37.915-90.996 32.891-10.963c7.859-2.62 12.106-11.115 9.486-18.974-2.62-7.858-11.11-12.109-18.974-9.486l-49.225 16.451c-7.647 3.187-11.263 11.968-8.077 19.615l9.425 22.619-131.473 34.182-13.504-31.504h20.864c8.284 0 15-6.716 15-15s-6.716-15-15-15h-64.267c-8.284 0-15 6.716-15 15s6.716 15 15 15h10.763l19.972 46.594-29.072 33.918c-14.516-8.944-31.596-14.112-49.862-14.112-52.567 0-95.334 42.766-95.334 95.333s42.767 95.333 95.333 95.333c47.464 0 86.933-34.868 94.149-80.333h50.45c4.792 0 9.296-2.29 12.12-6.163l96.756-132.695 17.812 42.75c-27.158 16.818-45.289 46.883-45.289 81.107 0 52.567 42.766 95.333 95.333 95.333s95.336-42.765 95.336-95.332-42.767-95.333-95.333-95.333zm-321.334 160.667c-36.024 0-65.333-29.309-65.333-65.334s29.309-65.333 65.333-65.333c10.802 0 20.991 2.651 29.976 7.313l-41.365 48.259c-3.813 4.448-4.687 10.708-2.239 16.03s7.77 8.732 13.628 8.732h63.575c-6.798 28.815-32.712 50.333-63.575 50.333zm32.614-80.334 59.492-69.408 29.746 69.408zm115.392-15.131-30.946-72.209 103.155-26.821zm173.328 95.465c-36.025 0-65.333-29.309-65.333-65.333 0-21.731 10.675-41.006 27.045-52.89l24.441 58.659c3.186 7.647 11.969 11.263 19.615 8.077 7.647-3.187 11.263-11.968 8.077-19.615l-24.454-58.69c3.455-.567 6.995-.875 10.608-.875 36.025 0 65.333 29.309 65.333 65.333s-29.308 65.334-65.332 65.334z"/>
        </svg>
        <p class="popupText">Bikes available: ${available_bikes} </p>
        </br>
        <svg id="Capa_1" height="10%" viewBox="0 0 458.706 458.706" width="10%" xmlns="http://www.w3.org/2000/svg">
          <path d="m229.353 163.824h-32.765v65.529h32.765c18.062 0 32.765-14.703 32.765-32.765s-14.703-32.764-32.765-32.764z"/>
          <path d="m425.941 0h-393.176c-18.094 0-32.765 14.671-32.765 32.765v393.176c0 18.094 14.671 32.765 32.765 32.765h393.176c18.094 0 32.765-14.671 32.765-32.765v-393.176c0-18.094-14.671-32.765-32.765-32.765zm-196.588 294.882h-32.765v65.529h-65.529v-262.117h98.294c54.203 0 98.294 44.091 98.294 98.294s-44.091 98.294-98.294 98.294z"/>
        </svg>
        <p class="popupText">Spaces available: ${available_stands}</p>
        </div>`;

    document.getElementById("content").style.display = "block";

    // Create new popup
    popup = new Popup(
      new google.maps.LatLng(lat, lng),
      document.getElementById("content")
    );
    popup.setMap(map);

    // Create chart (parameters if first chart created since app start and whether dark/light mode)
    if (typeof chartOptions == "undefined") {
      drawOccupancyWeekly(number);
    } else {
      drawOccupancyWeekly(number, chartOptions);
    }

    // track currently selected station
    activeStation = number;
  }

  // Initialise map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 53.345804, lng: -6.26031 },
    restriction: {
      latLngBounds: {
        north: 54.345804,
        south: 52.345804,
        east: -5.26031,
        west: -7.26031,
      },
      strictBounds: false,
    },
    streetViewControl: false,
    mapTypeControl: false,
    zoom: 14,
    // Found in mapStyle.js
    styles: darkMap,
  });

  let darkToggle = document.getElementsByClassName("darkToggle");
  for (var i = 0; i < darkToggle.length; i++) {
    darkToggle[i].style.fill = "#2d3142";
  }

  // Initialise bikes/parking toggle on app startup (found in bikeParkingToggle.js)
  showParking();
  showBikes();

  // creating a popup class
  // taken and adapted from:
  //https://developers.google.com/maps/documentation/javascript/examples/overlay-popup

  class Popup extends google.maps.OverlayView {
    constructor(position, content) {
      super();
      this.position = position;
      content.classList.add("popup-bubble");
      // This zero-height div is positioned at the bottom of the bubble.
      const bubbleAnchor = document.createElement("div");
      bubbleAnchor.classList.add("popup-bubble-anchor");
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement("div");
      this.containerDiv.classList.add("popup-container");
      this.containerDiv.appendChild(bubbleAnchor);
      // Optionally stop clicks, etc., from bubbling up to the map.
      Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd() {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    /** Called when the popup is removed from the map. */
    onRemove() {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
      const divPosition = this.getProjection().fromLatLngToDivPixel(
        this.position
      );
      // Hide the popup when it is far out of view.
      const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
          ? "block"
          : "none";

      if (display === "block") {
        this.containerDiv.style.left = divPosition.x + "px";
        this.containerDiv.style.top = divPosition.y + "px";
      }

      if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }
    }
  }

  // Call stations route to get static stations data along with most recent update
  fetch("/stations")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let stationData = data;
      data.forEach((station) => {
        let stationMarkerList = [
          station.name,
          String(station.available_bikes),
          String(station.available_bike_stands),
          String(station.pos_lat),
          String(station.pos_lng),
          String(station.number),
        ];

        // Fill dropdown menu with station data
        document.getElementById("stationList").innerHTML +=
          '<option value="' +
          stationMarkerList +
          '">' +
          station.name +
          "</option>";

        // Populate map with circle markers
        let Circle = new google.maps.Circle({
          strokeColor: changeCircleColour(
            station[markerToggle],
            station.bike_stands
          ),
          strokeOpacity: "0.8",
          strokeWeight: 2,
          fillColor: changeCircleColour(
            station[markerToggle],
            station.bike_stands
          ),
          fillOpacity: 0.35,
          map: map,
          center: { lat: station.pos_lat, lng: station.pos_lng },
          radius: 60,
          clickable: true,

          // Used for changing circle colour
          available_bikes: station.available_bikes,
          available_bike_stands: station.available_bike_stands,
          bike_stands: station.bike_stands,
        });

        // When circle markers are clicked
        Circle.addListener("click", () => {
          // Test if this is the first time a circle has been clicked since app startup
          if (selectChart == false) {
            selectChart = true;
            // Initialise chart and show chart selection buttons
            showHourly();
            document.getElementById("chart-button-grid").style.display = "grid";
          }
          marker(stationMarkerList);
        });

        // Changes circle markers' colours depending on percentage of available bikes/spaces when mousing over
        Circle.addListener("mouseover", () => {
          if ((station[markerToggle] / station.bike_stands) * 100 <= 10) {
            Circle.setOptions({ fillColor: "#d72800", strokeColor: "#d72800" });
          } else if (
            (station[markerToggle] / station.bike_stands) * 100 <=
            20
          ) {
            Circle.setOptions({ fillColor: "#ff9441", strokeColor: "#ff9441" });
          } else if (
            (station[markerToggle] / station.bike_stands) * 100 <=
            30
          ) {
            Circle.setOptions({ fillColor: "#FFE89E", strokeColor: "#FFE89E" });
          } else {
            Circle.setOptions({ fillColor: "#6eafff", strokeColor: "#6eafff" });
          }
        });
        // Same as above except changes colours back to normal on mouse out
        Circle.addListener("mouseout", () => {
          if ((station[markerToggle] / station.bike_stands) * 100 <= 10) {
            Circle.setOptions({ fillColor: "#8b1a00", strokeColor: "#8b1a00" });
          } else if (
            (station[markerToggle] / station.bike_stands) * 100 <=
            20
          ) {
            Circle.setOptions({ fillColor: "#d25c00", strokeColor: "#d25c00" });
          } else if (
            (station[markerToggle] / station.bike_stands) * 100 <=
            30
          ) {
            Circle.setOptions({ fillColor: "#F5BB00", strokeColor: "#F5BB00" });
          } else {
            Circle.setOptions({ fillColor: "#0877ff", strokeColor: "#0877ff" });
          }
        });

        // Displays the number of bikes/spaces available over each circle
        let Marker = new google.maps.Marker({
          position: { lat: station.pos_lat, lng: station.pos_lng },
          map: map,
          label: {
            text: station.available_bikes.toString(),
            color: "white",
          },
          // Uses a custom image scaled down to be size 0 (invisible), so just the text remains above the circle
          icon: {
            url:
              "https://icon-library.com/images/circle-icon-png/circle-icon-png-11.jpg",
            size: new google.maps.Size(0, 0),
          },

          // Stores bike and spaces data for display
          available_bikes: station.available_bikes,
          available_bike_stands: station.available_bike_stands,
        });
        // Add markers and circles to array initialised at top of file
        markerList.push(Marker);
        circleList.push(Circle);
      });

      // Dropdown selection
      document.getElementById("stationList").onchange = function () {
        // Tests if first time a marker/dropdown has been interacted with
        if (selectChart == false) {
          selectChart = true;
          // Initialises chart and shows chart selection buttons
          showHourly();
          document.getElementById("chart-button-grid").style.display = "grid";
        }
        var id = document.getElementById("stationList").value;
        id = id.split(",");
        console.log("List function called with " + id);
        // Calls marker function above to show chart/popup
        marker(id);
      };
    })
    // Detects error in fetch
    .catch((err) => {
      console.log("Error!", err);
    });
}
