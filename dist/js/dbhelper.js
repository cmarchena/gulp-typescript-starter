var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var DBHelper = /** @class */ (function () {
    function DBHelper() {
    }
    Object.defineProperty(DBHelper, "DATABASE_URL", {
        get: function () {
            var port = 1337; // Change this to your server port
            return "http://localhost:" + port;
        },
        enumerable: true,
        configurable: true
    });
    DBHelper.fetchRestaurantByCuisine = function (cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.requestRestaurants(function (error, restaurants) {
            if (error) {
                callback(error, null);
            }
            else {
                // Filter restaurants to have only given cuisine type
                var results = restaurants.filter(function (r) { return r.cuisine_type == cuisine; });
                callback(null, results);
            }
        });
    };
    DBHelper.fetchRestaurantByNeighborhood = function (neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.requestRestaurants(function (error, restaurants) {
            if (error) {
                callback(error, null);
            }
            else {
                // Filter restaurants to have only given neighborhood
                var results = restaurants.filter(function (r) { return r.neighborhood == neighborhood; });
                callback(null, results);
            }
        });
    };
    DBHelper.fetchRestaurantByCuisineAndNeighborhood = function (cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.requestRestaurants(function (error, restaurants) {
            if (error) {
                callback(error, null);
            }
            else {
                var results = restaurants;
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(function (r) { return r.cuisine_type == cuisine; });
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(function (r) { return r.neighborhood == neighborhood; });
                }
                callback(null, results);
            }
        });
    };
    DBHelper.fetchNeighborhoods = function (callback) {
        // Fetch all restaurants
        DBHelper.requestRestaurants(function (error, restaurants) {
            if (error) {
                callback(error, null);
            }
            else {
                // Get all neighborhoods from all restaurants
                var neighborhoods_1 = restaurants.map(function (restaurant) { return restaurant.neighborhood; });
                // Remove duplicates from neighborhoods;
                var neighborhoodSet = new Set(neighborhoods_1);
                var uniqueNeighborhoods = Array.from(neighborhoodSet);
                callback(null, uniqueNeighborhoods);
            }
        });
    };
    DBHelper.fetchCuisines = function (callback) {
        // Fetch all restaurants
        DBHelper.requestRestaurants(function (error, restaurants) {
            if (error) {
                callback(error, null);
            }
            else {
                // Get all cuisines from all restaurants
                var cuisines_1 = restaurants.map(function (restaurant) { return restaurant.cuisine_type; });
                // Remove duplicates from cuisines
                var cuisinesSet = new Set(cuisines_1);
                var uniqueCuisines = Array.from(cuisinesSet);
                callback(null, uniqueCuisines);
            }
        });
    };
    DBHelper.urlForRestaurant = function (restaurant) {
        return ("./restaurant.html?id=" + restaurant.id);
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
    DBHelper.dbPromise = function () {
        return idb.open('db', 2, function (upgradeDb) {
            switch (upgradeDb.oldVersion) {
                case 0:
                    upgradeDb.createObjectStore('restaurants', {
                        keyPath: 'id'
                    });
                case 1:
                    var reviews = upgradeDb.createObjectStore('reviews', {
                        keyPath: 'id'
                    });
                    reviews.createIndex('restaurant', 'restaurant_id');
            }
        });
    };
    DBHelper.requestRestaurants = function (callback) { return __awaiter(_this, void 0, void 0, function () {
        var getRestaurants, res, data, restaurants_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getRestaurants = function (data) {
                        var restaurants = data;
                        callback(null, restaurants);
                    };
                    return [4 /*yield*/, fetch(DBHelper.DATABASE_URL + "/restaurants")];
                case 1:
                    res = _a.sent();
                    if (!(res.status == 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    restaurants_1 = getRestaurants(data);
                    return [2 /*return*/, restaurants_1];
                case 3: throw new Error("" + res.status);
            }
        });
    }); };
    DBHelper.requestRestaurant = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data, restaurant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://localhost:1337/restaurants/" + id)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    restaurant = restaurantDetailsPage(data);
                    console.log(restaurant);
                    return [2 /*return*/, restaurant];
            }
        });
    }); };
    DBHelper.requestReviews = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data, reviews;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://localhost:1337/reviews?restaurant_id=" + id)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    reviews = showReviews(data);
                    console.log(reviews);
                    return [2 /*return*/, reviews];
            }
        });
    }); };
    return DBHelper;
}());
