import idb from "idb";
import { Restaurant, Review } from './interfaces'
declare var google: any;
export default class DBHelper {

    static DATABASE_URL = () => {
        //Changed to Heroku 
        // return 'http://localhost:1337'
        return `https://mws-project-3.herokuapp.com`;
    };
    static dbPromise = () => {
        return idb.open('test', 3, (upgradeDb) => {
            switch (upgradeDb.oldVersion) {
                case 0:
                    upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
                case 1:
                    const restStore = upgradeDb.transaction.objectStore('restaurants');
                    restStore.createIndex('cuisine', 'cuisine_type');
                    restStore.createIndex('neighborhoods', 'neighborhood');
                    restStore.createIndex('id', 'id')
                case 2:
                    upgradeDb.createObjectStore('reviews', { keyPath: 'id' });
                    const reviewsStore = upgradeDb.transaction.objectStore('reviews')
                    reviewsStore.createIndex('id', 'restaurant_id')

            }
        })
    };

    static storedRestaurants = () => {
        return fetch(`${DBHelper.DATABASE_URL()}/restaurants`, {
            mode: 'cors'
        })
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

    static storedReviews = () => {
        return fetch(`${DBHelper.DATABASE_URL()}/reviews`, {
            mode: 'cors'
        })
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
    static readAllRestaurants = () => {
        return DBHelper.storedRestaurants().then(() => {
            return DBHelper.dbPromise().then((db) => {
                return db.transaction('restaurants').objectStore('restaurants').getAll();
            })
        })
    }
    static readRestaurantById = (id: number) => {
        return DBHelper.storedRestaurants().then(() => {
            return DBHelper.dbPromise().then((db) => {
                return db.transaction('restaurants').objectStore('restaurants').get(id);
            })
        })
    }
    static getReviewById = (id: number) => {
        return fetch(`${DBHelper.DATABASE_URL()}/reviews/?restaurant_id=${id}`, {
            mode: 'cors'
        })
            .then(res => res.json())
            .then((reviews) => reviews)
    }
    static readReviewById = (id: number) => {
        return DBHelper.storedReviews().then(() => {
            return DBHelper.dbPromise().then((db) => {
                return db.transaction('reviews').objectStore('reviews').index('id').get(id);
            })
        })
    }
    static readAllReviews = () => {
        return DBHelper.storedReviews().then(() => {
            return DBHelper.dbPromise().then((db) => {
                return db.transaction('reviews').objectStore('reviews').getAll();
            })
        })
    };
    static fetchRestaurantByCuisineAndNeighborhood(cuisine: string, neighborhood: string) {
        // Fetch all restaurants
        return DBHelper.readAllRestaurants().then((restaurants) => {

            let results = restaurants;
            if (cuisine != 'all') { // filter by cuisine
                results = results.filter(r => r.cuisine_type == cuisine);
            }
            if (neighborhood != 'all') { // filter by neighborhood
                results = results.filter(r => r.neighborhood == neighborhood);
            }
            return results;
        })
    }
    static urlForRestaurant = (restaurant: Restaurant) => {
        return (`./restaurant.html?id=${restaurant.id}`);
    }
    static mapMarkerForRestaurant(restaurant: Restaurant, map: any) {
        const marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map,
            animation: google.maps.Animation.DROP,
        });
        return marker;
    }
    static NEW_REVIEW = (data: object) => {

        if (navigator.onLine) {
            return fetch(`${DBHelper.DATABASE_URL()}/reviews`, {
                method: "POST",
                mode: 'cors',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then((success) => console.log("Success", success))
                .then(() => {
                    alert("Review created successfully!")
                    window.location.reload()
                })

        } else {
            return alert("You're offline!")
        }
    }
    // static toggleFav = (id: number, isFav: any) => {
    //     if (isFav == 'true' && navigator.onLine) {
    //         const url = `http://localhost:1337/restaurants/${id}/?is_favorite=true`;
    //         return fetch(url, {
    //             method: "PUT",
    //         }).then((res) => res.json())

    //             .then((response) => console.log("Success:", response, url));
    //     } else {
    //         const url = `http://localhost:1337/restaurants/${id}/?is_favorite=false`;
    //         return fetch(url, {
    //             method: "PUT",
    //         }).then((res) => res.json())

    //             .then((response) => console.log("Success:", response, url));
    //     }

    // }
    // static toggleFav = () => {

    //     if (fav.className === "no-fav" && navigator.onLine) {
    //         const url = `http://localhost:1337/restaurants/${id}/?is_favorite=true`;
    //         fetch(url, {
    //             method: "PUT",
    //         }).then((res) => res.json())
    //             .catch((error) => console.error("Error:", error))
    //             .then((response) => console.log("Success:", response, url));
    //         fav.classList.replace("no-fav", "yes-fav");
    //         fav.removeAttribute("aria-label");
    //         fav.setAttribute("aria-label", "marked as favorite");
    //     } else {
    //         const url = `http://localhost:1337/restaurants/${id}/?is_favorite=false`;
    //         fetch(url, {
    //             method: "PUT",
    //         }).then((res) => res.json())
    //             .catch((error) => console.error("Error:", error))
    //             .then((response) => console.log("Success:", response, url));
    //         fav.classList.replace("yes-fav", "no-fav");
    //         fav.removeAttribute("aria-label");
    //         fav.setAttribute("aria-label", "marked as no favorite");
    //     }

    // }

};