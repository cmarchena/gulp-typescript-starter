import DBHelper from "./dbhelper";
// Service Worker
/* if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/sw.js", { scope: '/' })
        .then(function (reg) {
            // registration worked
            console.log("Registration succeeded. Scope is " + reg.scope);
        })
        .catch(function (error) {
            // registration failed
            console.log("Registration failed with " + error);
        });
} */

// End Service Worker

let restaurants,
    neighborhoods,
    cuisines;
let map;
const markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", (event) => {
    fetchNeighborhoods();
    fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById("neighborhoods-select");
    neighborhoods.forEach((neighborhood) => {
        const option = document.createElement("option");
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.appendChild(option);
    });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById("cuisines-select");

    cuisines.forEach((cuisine) => {
        const option = document.createElement("option");
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.appendChild(option);
    });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    const loc = {
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
const updateRestaurants = () => {
    const cSelect = document.getElementById("cuisines-select");
    const nSelect = document.getElementById("neighborhoods-select");

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById("restaurants-list");
    ul.innerHTML = "";

    // Remove all map markers
    self.markers.forEach((m) => m.setMap(null));
    self.markers = [];
    self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById("restaurants-list");
    restaurants.forEach((restaurant) => {
        ul.appendChild(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
    const li = document.createElement("li");
    const picture = document.createElement("picture");
    const srcsetDesktop = DBHelper.imageUrlForRestaurantDesktop(restaurant);
    const srcsetTablet = DBHelper.imageUrlForRestaurantTablet(restaurant);
    const srcsetMobile = DBHelper.imageUrlForRestaurantMobile(restaurant);
    picture.innerHTML = `<source media="(min-width: 1024px)" srcset="${srcsetDesktop}">
  <source media="(min-width: 728px)" srcset="${srcsetTablet}">
  <img src="${srcsetMobile}" class="restaurant-img" alt="${restaurant.name} ${restaurant.cuisine_type} food restaurant New York City">`;

    li.appendChild(picture);
    // TODO PROJECT REVIEW
    // Correct restaurant's name semantic mistake in index.html

    const name = document.createElement("h3");
    name.innerHTML = restaurant.name;
    li.appendChild(name);

    const neighborhood = document.createElement("p");
    neighborhood.innerHTML = restaurant.neighborhood;
    li.appendChild(neighborhood);

    const address = document.createElement("p");
    address.innerHTML = restaurant.address;
    li.appendChild(address);

    const more = document.createElement("a");
    more.innerHTML = "View Details";
    more.href = DBHelper.urlForRestaurant(restaurant);
    li.appendChild(more);

    return li;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach((restaurant) => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, "click", () => {
            window.location.href = marker.url;
        });
        self.markers.push(marker);
    });
};