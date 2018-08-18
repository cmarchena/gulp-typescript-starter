declare var google: any;
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

}
