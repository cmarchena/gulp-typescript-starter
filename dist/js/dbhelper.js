"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var idb_1 = require("idb");
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
    DBHelper.requestRestaurants = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, restaurants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(DBHelper.DATABASE_URL + "/restaurants")];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    restaurants = _a.sent();
                    console.log(restaurants);
                    return [2 /*return*/, restaurants];
            }
        });
    }); };
    /* static requestRestaurants = async (callback: any) => {
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

    }; */
    DBHelper.requestRestaurant = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var res, restaurant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://localhost:1337/restaurants/" + id)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    restaurant = _a.sent();
                    console.log(restaurant);
                    return [2 /*return*/, restaurant];
            }
        });
    }); };
    /*
    static requestRestaurant = async () => {
        const res = await fetch(`http://localhost:1337/restaurants/${id}`);
        const data = await res.json();
        const restaurant = restaurantDetailsPage(data);
        console.log(restaurant)
        return restaurant;
    }; */
    DBHelper.requestReviews = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var res, reviews;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://localhost:1337/reviews?restaurant_id=" + id)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    reviews = _a.sent();
                    console.log(reviews);
                    return [2 /*return*/, reviews];
            }
        });
    }); };
    return DBHelper;
}());
var getRestaurantsName = function () {
    DBHelper.requestRestaurants().then(function (restaurants) {
        restaurants.map(function (restaurant) {
            console.log(restaurant.name);
        });
    })
        .catch(function (err) {
        var section = document.createElement("section");
        section.innerHTML = "<div class=\"error\">There is a network connection problem. Please Retry later.\n        Error Code: " + err + "</div>";
        document.body.appendChild(section);
    });
};
var getReviewList = function (id) {
    DBHelper.requestReviews(id).then(function (reviewList) { return reviewList.map(function (review) {
        console.log(review.comments);
    }); });
};
document.addEventListener("DOMContentLoaded", function (event) {
    dbPromise;
    DBHelper.requestRestaurant(2);
    getReviewList(2);
    getRestaurantsName();
});
/* const dbPromise = idb.open("db-test", 1, (upgradeDb) => {
    const keyValStore = upgradeDb.createObjectStore('keyval');
    keyValStore.put('Caracola', 'Hola')
}); */
var dbPromise = idb_1.default.open('test', 1, function (upgradeDb) {
});
