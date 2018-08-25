"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbhelper_1 = require("./dbhelper");
var map_1 = require("./map");
//Service Worker
// Check that service workers are registered
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
    });
}
//End Service Worker
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    if (document.title === "Restaurant Reviews") {
        indexPage();
    }
});
var locations = [];
/**
 * Fetch all neighborhoods and set their HTML.
 */
var indexPage = function () {
    fetchNeighborhoods();
    fetchCuisines();
    fillRestaurantsHTML('', '');
    updateRestaurants();
};
var fetchNeighborhoods = function () {
    dbhelper_1.default.readAllRestaurants().then(function (restaurants) {
        var neighborhoods = restaurants.map(function (restaurant) { return restaurant.neighborhood; });
        // Remove duplicates from neighborhoods;
        var neighborhoodSet = new Set(neighborhoods);
        var uniqueNeighborhoods = Array.from(neighborhoodSet);
        return uniqueNeighborhoods;
    }).then(function (uniqueNeighborhoods) { return fillNeighborhoodsHTML(uniqueNeighborhoods); });
};
/**
 * Set neighborhoods HTML.
 */
var fillNeighborhoodsHTML = function (neighborhoods) {
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
    dbhelper_1.default.readAllRestaurants().then(function (restaurants) {
        var cuisines = restaurants.map(function (restaurant) { return restaurant.cuisine_type; });
        // Remove duplicates from neighborhoods;
        var cuisineSet = new Set(cuisines);
        var uniqueCuisines = Array.from(cuisineSet);
        return uniqueCuisines;
    }).then(function (uniqueCuisines) { return fillCuisinesHTML(uniqueCuisines); });
};
/**
 * Set cuisines HTML.
 */
var fillCuisinesHTML = function (cuisines) {
    var select = document.getElementById("cuisines-select");
    cuisines.map(function (cuisine) {
        var option = document.createElement("option");
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.appendChild(option);
    });
};
/**
 * Initialize Google map, called from HTML.
 */
var updateRestaurants = function () {
    var state = {
        cuisine: '',
        neighborhood: '',
    };
    var fetchCuisine = document.getElementById("cuisines-select").addEventListener('change', function (e) {
        var cuisine = e.target.value;
        console.log(e.target.value);
        state.cuisine = cuisine;
        changeDOM();
    });
    var fetchNeighborhood = document.getElementById("neighborhoods-select").addEventListener('change', function (e) {
        var neighborhood = e.target.value;
        console.log(e.target.value);
        state.neighborhood = neighborhood;
        changeDOM();
    });
    var changeDOM = function () {
        document.getElementById('restaurants-list').innerHTML = '';
        fillRestaurantsHTML(state.cuisine, state.neighborhood);
        locations = [];
        console.log("Arriba", locations);
    };
};
var fillRestaurantsHTML = function (cuisine, neighborhood) {
    dbhelper_1.default.readAllRestaurants().then(function (restaurants) {
        var ul = document.getElementById('restaurants-list');
        var selectedNeighborhood = neighborhood;
        var selectedCuisine = cuisine;
        var filteredRestaurants = (!selectedCuisine && !selectedNeighborhood) ?
            restaurants :
            (selectedCuisine && selectedNeighborhood) ?
                restaurants.filter(function (restaurant) {
                    return restaurant.neighborhood === selectedNeighborhood;
                }).filter(function (restaurant) { return restaurant.cuisine_type === selectedCuisine; }) :
                (selectedCuisine || selectedNeighborhood) ?
                    restaurants.filter(function (restaurant) {
                        return restaurant.neighborhood === selectedNeighborhood || restaurant.cuisine_type === selectedCuisine;
                    })
                    : restaurants;
        if (filteredRestaurants.length === 0) {
            var p = document.createElement('p');
            p.innerHTML = 'There is no restaurants matching your criteria. Try again a broader selection';
            ul.insertAdjacentElement('afterbegin', p);
            locations = [];
            showMap(locations);
        }
        else {
            filteredRestaurants.map(function (restaurant) {
                locations.push(restaurant.latlng);
                ul.appendChild(createRestaurantHTML(restaurant));
                return locations;
            });
            showMap(locations);
        }
        console.log("Abajo", locations);
    });
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
            var url_1 = dbhelper_1.default.DATABASE_URL() + "/restaurants/" + restaurant.id + "/?is_favorite=true";
            fetch(url_1, {
                method: "PUT",
                mode: 'cors'
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error("Error:", error); })
                .then(function (response) { return console.log("Success:", response, url_1); });
            this.classList.replace("no-fav", "yes-fav");
            this.removeAttribute("aria-label");
            this.setAttribute("aria-label", "marked as favorite");
        }
        else {
            var url_2 = dbhelper_1.default.DATABASE_URL() + "/restaurants/" + restaurant.id + "/?is_favorite=false";
            fetch(url_2, {
                method: "PUT",
                mode: 'cors',
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
    more.href = dbhelper_1.default.urlForRestaurant(restaurant);
    var restName = restaurant.name;
    var cuisine = restaurant.cuisine_type;
    var location = restaurant.neighborhood;
    more.setAttribute("aria-label", " View " + restName + " details. " + cuisine + " restaurant located in " + location);
    li.appendChild(more);
    return li;
};
var showMap = function (locations) {
    map_1.default(locations);
};
