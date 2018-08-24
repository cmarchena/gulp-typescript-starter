
import DBHelper from './dbhelper';
import { Restaurant } from './interfaces';
import map from './map'
//Service Worker
if ('serviceWorker' in navigator) {
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
}
//End Service Worker



/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", (event) => {
    if (document.title === "Restaurant Reviews") {
        indexPage();

    }
});
let locations: string[] = [];

/**
 * Fetch all neighborhoods and set their HTML.
 */

const indexPage = () => {
    fetchNeighborhoods();
    fetchCuisines();
    fillRestaurantsHTML('', '');

    updateRestaurants();

}
const fetchNeighborhoods = () => {
    DBHelper.readAllRestaurants().then((restaurants: Restaurant[]) => {


        const neighborhoods = restaurants.map((restaurant: Restaurant) => restaurant.neighborhood);
        // Remove duplicates from neighborhoods;
        const neighborhoodSet = new Set(neighborhoods)
        const uniqueNeighborhoods = Array.from(neighborhoodSet)

        return uniqueNeighborhoods;

    }).then((uniqueNeighborhoods) => fillNeighborhoodsHTML(uniqueNeighborhoods))
}

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods: any) => {
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
    DBHelper.readAllRestaurants().then((restaurants: Restaurant[]) => {
        const cuisines = restaurants.map((restaurant: Restaurant) => restaurant.cuisine_type);
        // Remove duplicates from neighborhoods;
        const cuisineSet = new Set(cuisines)
        const uniqueCuisines = Array.from(cuisineSet)
        return uniqueCuisines

    }).then((uniqueCuisines) => fillCuisinesHTML(uniqueCuisines))

};


/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines: any) => {
    const select = document.getElementById("cuisines-select");

    cuisines.map((cuisine: any) => {
        const option = document.createElement("option");
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.appendChild(option);
    });



};

/**
 * Initialize Google map, called from HTML.
 */

const updateRestaurants = () => {


    let state = {
        cuisine: '',
        neighborhood: '',
    }
    const fetchCuisine =
        document.getElementById("cuisines-select").addEventListener('change', (e) => {
            const cuisine = (e.target as HTMLSelectElement).value;
            console.log((e.target as HTMLSelectElement).value);
            state.cuisine = cuisine;
            changeDOM();

        })


    const fetchNeighborhood = document.getElementById("neighborhoods-select").addEventListener('change', (e) => {
        const neighborhood = (e.target as HTMLSelectElement).value;
        console.log((e.target as HTMLSelectElement).value);
        state.neighborhood = neighborhood;
        changeDOM();

    });

    const changeDOM = () => {

        document.getElementById('restaurants-list').innerHTML = '';
        fillRestaurantsHTML(state.cuisine, state.neighborhood);
        locations = [];
        console.log("Arriba", locations)
    }
}

const fillRestaurantsHTML = (cuisine: any, neighborhood: any) => {

    DBHelper.readAllRestaurants().then((restaurants: any) => {

        const ul = document.getElementById('restaurants-list');
        const selectedNeighborhood = neighborhood;
        const selectedCuisine = cuisine;
        const filteredRestaurants =
            (!selectedCuisine && !selectedNeighborhood) ?
                restaurants :
                (selectedCuisine && selectedNeighborhood) ?
                    restaurants.filter((restaurant: any) => {
                        return restaurant.neighborhood === selectedNeighborhood
                    }).filter(
                        (restaurant: any) => { return restaurant.cuisine_type === selectedCuisine }
                    ) :
                    (selectedCuisine || selectedNeighborhood) ?
                        restaurants.filter((restaurant: any) => {
                            return restaurant.neighborhood === selectedNeighborhood || restaurant.cuisine_type === selectedCuisine
                        })
                        : restaurants;


        if (filteredRestaurants.length === 0) {

            const p = document.createElement('p');
            p.innerHTML = 'There is no restaurants matching your criteria. Try again a broader selection';
            ul.insertAdjacentElement('afterbegin', p);
            locations = [];
            showMap(locations);


        }
        else {

            filteredRestaurants.map((restaurant: Restaurant) => {
                locations.push(restaurant.latlng)
                ul.appendChild(createRestaurantHTML(restaurant));

                return locations;
            })


            showMap(locations);
        }
        console.log("Abajo", locations)

    })
}

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
            const url = `${DBHelper.DATABASE_URL()}/restaurants/${restaurant.id}/?is_favorite=true`;
            fetch(url, {
                method: "PUT",
                mode: 'cors'
            }).then((res) => res.json())
                .catch((error) => console.error("Error:", error))
                .then((response) => console.log("Success:", response, url));
            this.classList.replace("no-fav", "yes-fav");
            this.removeAttribute("aria-label");
            this.setAttribute("aria-label", "marked as favorite");
        } else {
            const url = `${DBHelper.DATABASE_URL()}/restaurants/${restaurant.id}/?is_favorite=false`;
            fetch(url, {
                method: "PUT",
                mode: 'cors',
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
const showMap = (locations: any) => {
    map(locations)
}

