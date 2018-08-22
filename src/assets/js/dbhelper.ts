import idb from "idb";
interface Restaurant {
    address: string;
    createdAt: Date;
    cuisine_type: string;
    id: number;
    is_favorite: string;
    latlng: object;
    name: string;
    neighborhood: string;
    operating_hours: object;
    photograph: number;
    updatedAt: Date;
}
interface Review {
    comments: string;
    createdAt: Date;
    id: number;
    name: string;
    rating: number;
    restaurant_id: number;
    updatedAt: Date;
}
class DBHelper {

    static DATABASE_URL = () => {
        const port: number = 1337; // Change this to your server port
        return `http://localhost:${port}`;
    };
    public static dbPromise = () => {
        return idb.open('test', 4, (upgradeDb) => {
            switch (upgradeDb.oldVersion) {
                case 0:
                    upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
                case 1:
                    const restStore = upgradeDb.transaction.objectStore('restaurants');
                    restStore.createIndex('cuisine', 'cuisine_type');
                case 2:
                    restStore.createIndex('neighborhoods', 'neighborhood')
                case 3:
                    upgradeDb.createObjectStore('reviews', { keyPath: 'id' });
                    const reviewsStore = upgradeDb.transaction.objectStore('reviews')
                    reviewsStore.createIndex('id', 'restaurant_id')

            }
        })
    };

    public static storedRestaurants = () => {
        return fetch(`${DBHelper.DATABASE_URL()}/restaurants`)
            .then((res: Response) => res.json())
            .then((restaurants: Restaurant[]) => {
                return DBHelper.dbPromise().then((db) => {
                    const tx = db.transaction('restaurants', 'readwrite');
                    const restStore = tx.objectStore('restaurants');
                    restaurants.map((restaurant: Restaurant) => {
                        restStore.put(restaurant);
                    })
                    return tx.complete.then(() => Promise.resolve(restaurants))

                })
            })
    }
    public static storedReviews = () => {
        return fetch(`${DBHelper.DATABASE_URL()}/reviews`)
            .then((res: Response) => res.json())
            .then((reviews: Review[]) => {
                return DBHelper.dbPromise().then((db) => {
                    const tx = db.transaction('reviews', 'readwrite');
                    const reviewsStore = tx.objectStore('reviews');
                    reviews.map((review: Review) => {
                        reviewsStore.put(review);
                    })
                    return tx.complete.then(() => Promise.resolve(reviews))

                })
            })
    };
    public static readAllRestaurants = () => {
        return DBHelper.dbPromise().then((db) => {
            return db.transaction('restaurants').objectStore('restaurants').getAll();
        }).then((allRestaurants) => {
            console.log("All Restaurants", allRestaurants)
        })
    };
    public static readRestaurantsByCuisine = () => {
        return DBHelper.dbPromise().then((db) => {
            return db.transaction('restaurants').objectStore('restaurants').index('cuisine').getAll();
        }).then((restaurantsByCuisine) => {
            console.log("Restaurants by Cuisine", restaurantsByCuisine)
        })
    };
    public static readRestaurantsByNeighborhood = () => {
        return DBHelper.dbPromise().then((db) => {
            const tx = db.transaction('restaurants');
            var restStore = tx.objectStore('restaurants');
            const restIndex = restStore.index('neighborhoods')
            return restIndex.getAll();
        }).then((restaurantsByNeighborhood) => {
            console.log("Restaurants by Neighboorhood", restaurantsByNeighborhood)
        })
    };
}



document.addEventListener("DOMContentLoaded", (event) => {

    DBHelper.storedRestaurants();
    DBHelper.readAllRestaurants();
    DBHelper.storedReviews();
    DBHelper.readRestaurantsByCuisine();
    DBHelper.readRestaurantsByNeighborhood();
});