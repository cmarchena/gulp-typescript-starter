"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idb_1 = require("idb");
var DBHelper = /** @class */ (function () {
    function DBHelper() {
    }
    DBHelper.fetchRestaurantByCuisineAndNeighborhood = function (cuisine, neighborhood) {
        // Fetch all restaurants
        return DBHelper.readAllRestaurants().then(function (restaurants) {
            var results = restaurants;
            if (cuisine != 'all') { // filter by cuisine
                results = results.filter(function (r) { return r.cuisine_type == cuisine; });
            }
            if (neighborhood != 'all') { // filter by neighborhood
                results = results.filter(function (r) { return r.neighborhood == neighborhood; });
            }
            return results;
        });
    };
    DBHelper.mapMarkerForRestaurant = function (restaurant, map) {
        var marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP,
        });
        return marker;
    };
    DBHelper.DATABASE_URL = function () {
        //Changed to Heroku 
        // return 'http://localhost:1337'
        return "https://mws-project-3.herokuapp.com";
    };
    DBHelper.dbPromise = function () {
        return idb_1.default.open('test', 3, function (upgradeDb) {
            switch (upgradeDb.oldVersion) {
                case 0:
                    upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
                case 1:
                    var restStore = upgradeDb.transaction.objectStore('restaurants');
                    restStore.createIndex('cuisine', 'cuisine_type');
                    restStore.createIndex('neighborhoods', 'neighborhood');
                    restStore.createIndex('id', 'id');
                case 2:
                    upgradeDb.createObjectStore('reviews', { keyPath: 'id' });
                    var reviewsStore = upgradeDb.transaction.objectStore('reviews');
                    reviewsStore.createIndex('id', 'restaurant_id');
            }
        });
    };
    DBHelper.storedRestaurants = function () {
        return fetch(DBHelper.DATABASE_URL() + "/restaurants", {
            mode: 'cors'
        })
            .then(function (res) { return res.json(); })
            .then(function (restaurants) {
            return DBHelper.dbPromise().then(function (db) {
                var tx = db.transaction('restaurants', 'readwrite');
                var restStore = tx.objectStore('restaurants');
                restaurants.map(function (restaurant) {
                    restStore.put(restaurant);
                });
                return tx.complete.then(function () { return Promise.resolve(restaurants); });
            });
        });
    };
    DBHelper.storedReviews = function () {
        return fetch(DBHelper.DATABASE_URL() + "/reviews", {
            mode: 'cors'
        })
            .then(function (res) { return res.json(); })
            .then(function (reviews) {
            return DBHelper.dbPromise().then(function (db) {
                var tx = db.transaction('reviews', 'readwrite');
                var reviewsStore = tx.objectStore('reviews');
                reviews.map(function (review) {
                    reviewsStore.put(review);
                });
                return tx.complete.then(function () { return Promise.resolve(reviews); });
            });
        });
    };
    DBHelper.readAllRestaurants = function () {
        return DBHelper.storedRestaurants().then(function () {
            return DBHelper.dbPromise().then(function (db) {
                return db.transaction('restaurants').objectStore('restaurants').getAll();
            });
        });
    };
    DBHelper.readRestaurantById = function (id) {
        return DBHelper.storedRestaurants().then(function () {
            return DBHelper.dbPromise().then(function (db) {
                return db.transaction('restaurants').objectStore('restaurants').get(id);
            });
        });
    };
    DBHelper.getReviewById = function (id) {
        return fetch(DBHelper.DATABASE_URL() + "/reviews/?restaurant_id=" + id, {
            mode: 'cors'
        })
            .then(function (res) { return res.json(); })
            .then(function (reviews) { return reviews; });
    };
    DBHelper.readReviewById = function (id) {
        return DBHelper.storedReviews().then(function () {
            return DBHelper.dbPromise().then(function (db) {
                return db.transaction('reviews').objectStore('reviews').index('id').get(id);
            });
        });
    };
    DBHelper.readAllReviews = function () {
        return DBHelper.storedReviews().then(function () {
            return DBHelper.dbPromise().then(function (db) {
                return db.transaction('reviews').objectStore('reviews').getAll();
            });
        });
    };
    DBHelper.urlForRestaurant = function (restaurant) {
        return ("./restaurant.html?id=" + restaurant.id);
    };
    DBHelper.NEW_REVIEW = function (data) {
        if (navigator.onLine) {
            return fetch(DBHelper.DATABASE_URL() + "/reviews", {
                method: "POST",
                mode: 'cors',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(function (res) { return res.json(); })
                .then(function (success) { return console.log("Success", success); })
                .then(function () {
                alert("Review created successfully!");
                window.location.reload();
            });
        }
        else {
            return alert("You're offline!");
        }
    };
    return DBHelper;
}());
exports.default = DBHelper;
;
