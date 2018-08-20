declare var google: any;
declare var idb: any;
class DBHelper {


    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}`;
    }

    static requestRestaurants = async (callback: any) => {
        const getRestaurants = (data: any) => {
            const restaurants = data;
            callback(null, restaurants);
        }
        let res = await fetch(`${DBHelper.DATABASE_URL}/restaurants`);
        if (res.status == 200) {
            let data = await res.json();
            const restaurants = getRestaurants(data);
            return restaurants;
        }
        throw new Error(`${res.status}`)

    };

    static requestRestaurant = async () => {
        const res = await fetch(`http://localhost:1337/restaurants/${id}`);
        const data = await res.json();
        const restaurant = restaurantDetailsPage(data);
        console.log(restaurant)
        return restaurant;
    };
    static requestReviews = async () => {
        const res = await fetch(`http://localhost:1337/reviews?restaurant_id=${id}`);
        const data = await res.json();
        const reviews = showReviews(data);
        console.log(reviews)
        return reviews;
    };


    static fetchRestaurantByCuisine(cuisine: any, callback: any) {
        // Fetch all restaurants  with proper error handling
        DBHelper.requestRestaurants((error: any, restaurants: any) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter((r: any) => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }
    static fetchRestaurantByNeighborhood(neighborhood: any, callback: any) {
        // Fetch all restaurants
        DBHelper.requestRestaurants((error: any, restaurants: any) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter((r: any) => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }
    static fetchRestaurantByCuisineAndNeighborhood(cuisine: any, neighborhood: any, callback: any) {
        // Fetch all restaurants
        DBHelper.requestRestaurants((error: any, restaurants: any) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants;
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter((r: any) => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter((r: any) => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }
    static fetchNeighborhoods(callback: any) {
        // Fetch all restaurants
        DBHelper.requestRestaurants((error: any, restaurants: any) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((restaurant: any) => restaurant.neighborhood);
                // Remove duplicates from neighborhoods;
                const neighborhoodSet = new Set(neighborhoods)
                const uniqueNeighborhoods = Array.from(neighborhoodSet)
                callback(null, uniqueNeighborhoods);
            }
        });
    }
    static fetchCuisines(callback: any) {
        // Fetch all restaurants
        DBHelper.requestRestaurants((error: any, restaurants: any) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((restaurant: any) => restaurant.cuisine_type);
                // Remove duplicates from cuisines
                const cuisinesSet = new Set(cuisines);
                const uniqueCuisines = Array.from(cuisinesSet)
                callback(null, uniqueCuisines);
            }
        });
    }
    static urlForRestaurant(restaurant: any) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    static mapMarkerForRestaurant(restaurant: any, map: any) {
        const marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map,
            animation: google.maps.Animation.DROP,
        });
        return marker;
    }
    static dbPromise() {
        return idb.open('db', 2, function (upgradeDb: any) {
            switch (upgradeDb.oldVersion) {
                case 0:
                    upgradeDb.createObjectStore('restaurants', {
                        keyPath: 'id'
                    });
                case 1:
                    const reviews = upgradeDb.createObjectStore('reviews', {
                        keyPath: 'id'
                    });
                    reviews.createIndex('restaurant', 'restaurant_id')
            }
        });
    }

}
