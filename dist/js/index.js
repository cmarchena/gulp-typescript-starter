// Service Worker
/* if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js', {
            scope: '/',
        })
        .then((reg) => {
            // registration worked
            console.log(`Registration succeeded. Scope is ${reg.scope}`);
        })
        .catch((error) => {
            // registration failed
            console.log(`Registration failed with ${error}`);
        });
} */
// End Service Worker
var restaurants;
var neighborhoods;
var cuisines;
var map;
var markers = [];
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    fetchNeighborhoods();
    fetchCuisines();
});
/**
 * Fetch all neighborhoods and set their HTML.
 */
var fetchNeighborhoods = function () {
    DBHelper.requestRestaurants(function (error, neighborhoods) {
        if (error) { // Got an error
            console.error(error);
        }
        else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
};
/**
 * Set neighborhoods HTML.
 */
var fillNeighborhoodsHTML = function (neighborhoods) {
    if (neighborhoods === void 0) { neighborhoods = self.neighborhoods; }
    var select = document.getElementById("neighborhoods-select");
    neighborhoods.map(function (neighborhood) {
        var option = document.createElement("option");
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.appendChild(option);
    });
};
/**
 * Fetch all cuisines and set their HTML.
 */
var fetchCuisines = function () {
    DBHelper.fetchCuisines(function (error, cuisines) {
        if (error) { // Got an error!
            console.error(error);
        }
        else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
};
/**
 * Set cuisines HTML.
 */
var fillCuisinesHTML = function (cuisines) {
    if (cuisines === void 0) { cuisines = self.cuisines; }
    var select = document.getElementById("cuisines-select");
    cuisines.forEach(function (cuisine) {
        var option = document.createElement("option");
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.appendChild(option);
    });
};
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
    var loc = {
        lat: 40.722216,
        lng: -73.987501,
    };
    self.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: loc,
        scrollwheel: false,
    });
    updateRestaurants();
};
/**
 * Update page and map for current restaurants.
 */
var updateRestaurants = function () {
    var cSelect = document.getElementById("cuisines-select");
    var nSelect = document.getElementById("neighborhoods-select");
    var cIndex = cSelect.selectedIndex;
    var nIndex = nSelect.selectedIndex;
    var cuisine = cSelect[cIndex].value;
    var neighborhood = nSelect[nIndex].value;
    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
        if (error) { // Got an error!
            console.error(error);
        }
        else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    });
};
/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
var resetRestaurants = function (restaurants) {
    // Remove all restaurants
    self.restaurants = [];
    var ul = document.getElementById("restaurants-list");
    ul.innerHTML = "";
    ul.className = "grid";
    // Remove all map markers
    self.markers.forEach(function (m) { return m.setMap(null); });
    self.markers = [];
    self.restaurants = restaurants;
};
/**
 * Create all restaurants HTML and add them to the webpage.
 */
var fillRestaurantsHTML = function (restaurants) {
    if (restaurants === void 0) { restaurants = self.restaurants; }
    var ul = document.getElementById("restaurants-list");
    restaurants.forEach(function (restaurant) {
        ul.appendChild(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
};
/**
 * Create restaurant HTML.
 */
var createRestaurantHTML = function (restaurant) {
    var li = document.createElement("li");
    li.className = "card";
    var picture = document.createElement("picture");
    var srcsetDesktop = "images/" + restaurant.photograph + "-desktop.webp";
    var srcsetTablet = "images/" + restaurant.photograph + "-tablet.webp";
    var srcsetMobile = "images/" + restaurant.photograph + "-mobile.webp";
    var srcsetFallback = "images/" + restaurant.photograph + "-tablet.jpg";
    picture.innerHTML = "<source media=\"(min-width: 1024px)\" srcset=\"" + srcsetDesktop + "\" type=\"image/webp\">\n  <source media=\"(min-width: 728px)\" srcset=\"" + srcsetTablet + "\" type=\"image/webp\">\n  <source media=\"(max-width: 727px)\" srcset=\"" + srcsetMobile + "\" type=\"image/webp\">\n  <source  srcset=\"" + srcsetFallback + "\" type=\"image/jpeg\">\n  <img src=\"" + srcsetFallback + "\" class=\"restaurant-img\" alt=\"" + restaurant.name + " " + restaurant.cuisine_type + " food restaurant New York City\">";
    li.appendChild(picture);
    // TODO PROJECT REVIEW
    // Correct restaurant's name semantic mistake in index.html
    var name = document.createElement("h3");
    name.innerHTML = restaurant.name;
    li.appendChild(name);
    var fav = document.createElement("span");
    var isFav = restaurant.is_favorite;
    if (isFav === "true") {
        fav.classList.add("yes-fav");
        fav.classList.remove("no-fav");
        fav.setAttribute("aria-label", "marked as favorite");
    }
    else {
        fav.classList.add("no-fav");
        fav.classList.remove("yes-fav");
        fav.setAttribute("aria-label", "marked as no favorite");
    }
    function toggleFav() {
        if (fav.className === "no-fav") {
            var url_1 = "http://localhost:1337/restaurants/" + restaurant.id + "/?is_favorite=true";
            fetch(url_1, {
                method: "PUT",
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error("Error:", error); })
                .then(function (response) { return console.log("Success:", response, url_1); });
            this.classList.replace("no-fav", "yes-fav");
            this.removeAttribute("aria-label");
            this.setAttribute("aria-label", "marked as favorite");
        }
        else {
            var url_2 = "http://localhost:1337/restaurants/" + restaurant.id + "/?is_favorite=false";
            fetch(url_2, {
                method: "PUT",
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error("Error:", error); })
                .then(function (response) { return console.log("Success:", response, url_2); });
            this.classList.replace("yes-fav", "no-fav");
            this.removeAttribute("aria-label");
            this.setAttribute("aria-label", "marked as no favorite");
        }
    }
    fav.addEventListener("click", toggleFav);
    li.appendChild(fav);
    var neighborhood = document.createElement("p");
    neighborhood.innerHTML = restaurant.neighborhood;
    li.appendChild(neighborhood);
    var address = document.createElement("p");
    address.innerHTML = restaurant.address;
    li.appendChild(address);
    var more = document.createElement("a");
    more.innerHTML = "View Details";
    more.href = DBHelper.urlForRestaurant(restaurant);
    var restName = restaurant.name;
    var cuisine = restaurant.cuisine_type;
    var location = restaurant.neighborhood;
    more.setAttribute("aria-label", " View " + restName + " details. " + cuisine + " restaurant located in " + location);
    li.appendChild(more);
    return li;
};
/**
 * Add markers for current restaurants to the map.
 */
var addMarkersToMap = function (restaurants) {
    if (restaurants === void 0) { restaurants = self.restaurants; }
    restaurants.forEach(function (restaurant) {
        // Add marker to the map
        var marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, "click", function () {
            window.location.href = marker.url;
        });
        self.markers.push(marker);
    });
};
