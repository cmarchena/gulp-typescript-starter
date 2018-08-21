declare var google: any;
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
let restaurants;
let neighborhoods: any;
let cuisines;
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
    DBHelper.requestRestaurants((error: any, neighborhoods: any) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            (self as any).neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = (self as any).neighborhoods) => {
    const select = document.getElementById("neighborhoods-select");
    neighborhoods.map((neighborhood: any) => {
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
    DBHelper.fetchCuisines((error: any, cuisines: any) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            (self as any).cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = (self as any).cuisines) => {
    const select = document.getElementById("cuisines-select");

    cuisines.forEach((cuisine: any) => {
        const option = document.createElement("option");
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.appendChild(option);
    });
};

/**
 * Initialize Google map, called from HTML.
 */
(window as any).initMap = () => {
    const loc = {
        lat: 40.722216,
        lng: -73.987501,
    };
    (self as any).map = new google.maps.Map(document.getElementById("map"), {
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

    const cIndex = (cSelect as HTMLSelectElement).selectedIndex;
    const nIndex = (nSelect as HTMLSelectElement).selectedIndex;

    const cuisine = (cSelect as any)[cIndex].value;
    const neighborhood = (nSelect as any)[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error: any, restaurants: any) => {
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
const resetRestaurants = (restaurants: any) => {
    // Remove all restaurants
    (self as any).restaurants = [];
    const ul = document.getElementById("restaurants-list");
    ul.innerHTML = "";
    ul.className = "grid";

    // Remove all map markers
    (self as any).markers.forEach((m: any) => m.setMap(null));
    (self as any).markers = [];
    (self as any).restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = (self as any).restaurants) => {
    const ul = document.getElementById("restaurants-list");
    restaurants.forEach((restaurant: any) => {
        ul.appendChild(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant: any) => {
    const li = document.createElement("li");
    li.className = "card";
    const picture = document.createElement("picture");
    const srcsetDesktop = `images/${restaurant.photograph}-desktop.webp`;
    const srcsetTablet = `images/${restaurant.photograph}-tablet.webp`;
    const srcsetMobile = `images/${restaurant.photograph}-mobile.webp`;
    const srcsetFallback = `images/${restaurant.photograph}-tablet.jpg`;
    picture.innerHTML = `<source media="(min-width: 1024px)" srcset="${srcsetDesktop}" type="image/webp">
  <source media="(min-width: 728px)" srcset="${srcsetTablet}" type="image/webp">
  <source media="(max-width: 727px)" srcset="${srcsetMobile}" type="image/webp">
  <source  srcset="${srcsetFallback}" type="image/jpeg">
  <img src="${srcsetFallback}" class="restaurant-img" alt="${restaurant.name} ${restaurant.cuisine_type} food restaurant New York City">`;

    li.appendChild(picture);
    // TODO PROJECT REVIEW
    // Correct restaurant's name semantic mistake in index.html

    const name = document.createElement("h3");
    name.innerHTML = restaurant.name;
    li.appendChild(name);
    const fav = document.createElement("span");
    const isFav = restaurant.is_favorite;
    if (isFav === "true") {
        fav.classList.add("yes-fav");
        fav.classList.remove("no-fav");
        fav.setAttribute("aria-label", "marked as favorite");
    } else {
        fav.classList.add("no-fav");
        fav.classList.remove("yes-fav");
        fav.setAttribute("aria-label", "marked as no favorite");
    }

    function toggleFav() {
        if (fav.className === "no-fav") {
            const url = `http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=true`;
            fetch(url, {
                method: "PUT",
            }).then((res) => res.json())
                .catch((error) => console.error("Error:", error))
                .then((response) => console.log("Success:", response, url));
            this.classList.replace("no-fav", "yes-fav");
            this.removeAttribute("aria-label");
            this.setAttribute("aria-label", "marked as favorite");
        } else {
            const url = `http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=false`;
            fetch(url, {
                method: "PUT",
            }).then((res) => res.json())
                .catch((error) => console.error("Error:", error))
                .then((response) => console.log("Success:", response, url));
            this.classList.replace("yes-fav", "no-fav");
            this.removeAttribute("aria-label");
            this.setAttribute("aria-label", "marked as no favorite");
        }

    }
    fav.addEventListener("click", toggleFav);

    li.appendChild(fav);

    const neighborhood = document.createElement("p");
    neighborhood.innerHTML = restaurant.neighborhood;
    li.appendChild(neighborhood);

    const address = document.createElement("p");
    address.innerHTML = restaurant.address;
    li.appendChild(address);

    const more = document.createElement("a");
    more.innerHTML = "View Details";
    more.href = DBHelper.urlForRestaurant(restaurant);
    const restName = restaurant.name;
    const cuisine = restaurant.cuisine_type;
    const location = restaurant.neighborhood;
    more.setAttribute("aria-label", ` View ${restName} details. ${cuisine} restaurant located in ${location}`);
    li.appendChild(more);

    return li;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = (self as any).restaurants) => {
    restaurants.forEach((restaurant: any) => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, (self as any).map);
        google.maps.event.addListener(marker, "click", () => {
            window.location.href = marker.url;
        });
        (self as any).markers.push(marker);
    });
};
