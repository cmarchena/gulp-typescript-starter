(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
var restaurants;
var neighborhoods;
var cuisines;
var map;
var markers = [];
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', function (event) {
    fetchNeighborhoods();
    fetchCuisines();
});
/**
 * Fetch all neighborhoods and set their HTML.
 */
var fetchNeighborhoods = function () {
    DBHelper.requestRestaurants(function (error, neighborhoods) {
        if (error) { // Got an error
            console.error(error);
        }
        else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
};
/**
 * Set neighborhoods HTML.
 */
var fillNeighborhoodsHTML = function (neighborhoods) {
    if (neighborhoods === void 0) { neighborhoods = self.neighborhoods; }
    var select = document.getElementById('neighborhoods-select');
    neighborhoods.map(function (neighborhood) {
        var option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.appendChild(option);
    });
};
/**
 * Fetch all cuisines and set their HTML.
 */
var fetchCuisines = function () {
    DBHelper.fetchCuisines(function (error, cuisines) {
        if (error) { // Got an error!
            console.error(error);
        }
        else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
};
/**
 * Set cuisines HTML.
 */
var fillCuisinesHTML = function (cuisines) {
    if (cuisines === void 0) { cuisines = self.cuisines; }
    var select = document.getElementById('cuisines-select');
    cuisines.forEach(function (cuisine) {
        var option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.appendChild(option);
    });
};
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
    var loc = {
        lat: 40.722216,
        lng: -73.987501,
    };
    self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false,
    });
    updateRestaurants();
};
/**
 * Update page and map for current restaurants.
 */
var updateRestaurants = function () {
    var cSelect = document.getElementById('cuisines-select');
    var nSelect = document.getElementById('neighborhoods-select');
    var cIndex = cSelect.selectedIndex;
    var nIndex = nSelect.selectedIndex;
    var cuisine = cSelect[cIndex].value;
    var neighborhood = nSelect[nIndex].value;
    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
        if (error) { // Got an error!
            console.error(error);
        }
        else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    });
};
/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
var resetRestaurants = function (restaurants) {
    // Remove all restaurants
    self.restaurants = [];
    var ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';
    ul.className = 'grid';
    // Remove all map markers
    self.markers.forEach(function (m) { return m.setMap(null); });
    self.markers = [];
    self.restaurants = restaurants;
};
/**
 * Create all restaurants HTML and add them to the webpage.
 */
var fillRestaurantsHTML = function (restaurants) {
    if (restaurants === void 0) { restaurants = self.restaurants; }
    var ul = document.getElementById('restaurants-list');
    restaurants.forEach(function (restaurant) {
        ul.appendChild(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
};
/**
 * Create restaurant HTML.
 */
var createRestaurantHTML = function (restaurant) {
    var li = document.createElement('li');
    li.className = 'card';
    var picture = document.createElement('picture');
    var srcsetDesktop = "images/" + restaurant.photograph + "-desktop.webp";
    var srcsetTablet = "images/" + restaurant.photograph + "-tablet.webp";
    var srcsetMobile = "images/" + restaurant.photograph + "-mobile.webp";
    var srcsetFallback = "images/" + restaurant.photograph + "-tablet.jpg";
    picture.innerHTML = "<source media=\"(min-width: 1024px)\" srcset=\"" + srcsetDesktop + "\" type=\"image/webp\">\n  <source media=\"(min-width: 728px)\" srcset=\"" + srcsetTablet + "\" type=\"image/webp\">\n  <source media=\"(max-width: 727px)\" srcset=\"" + srcsetMobile + "\" type=\"image/webp\">\n  <source  srcset=\"" + srcsetFallback + "\" type=\"image/jpeg\">\n  <img src=\"" + srcsetFallback + "\" class=\"restaurant-img\" alt=\"" + restaurant.name + " " + restaurant.cuisine_type + " food restaurant New York City\">";
    li.appendChild(picture);
    // TODO PROJECT REVIEW
    // Correct restaurant's name semantic mistake in index.html
    var name = document.createElement('h3');
    name.innerHTML = restaurant.name;
    li.appendChild(name);
    var fav = document.createElement('span');
    var isFav = restaurant.is_favorite;
    if (isFav === 'true') {
        fav.classList.add('yes-fav');
        fav.classList.remove('no-fav');
        fav.setAttribute('aria-label', 'marked as favorite');
    }
    else {
        fav.classList.add('no-fav');
        fav.classList.remove('yes-fav');
        fav.setAttribute('aria-label', 'marked as no favorite');
    }
    function toggleFav() {
        if (fav.className === 'no-fav') {
            var url_1 = "http://localhost:1337/restaurants/" + restaurant.id + "/?is_favorite=true";
            fetch(url_1, {
                method: 'PUT',
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error('Error:', error); })
                .then(function (response) { return console.log('Success:', response, url_1); });
            this.classList.replace('no-fav', 'yes-fav');
            this.removeAttribute('aria-label');
            this.setAttribute('aria-label', 'marked as favorite');
        }
        else {
            var url_2 = "http://localhost:1337/restaurants/" + restaurant.id + "/?is_favorite=false";
            fetch(url_2, {
                method: 'PUT',
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error('Error:', error); })
                .then(function (response) { return console.log('Success:', response, url_2); });
            this.classList.replace('yes-fav', 'no-fav');
            this.removeAttribute('aria-label');
            this.setAttribute('aria-label', 'marked as no favorite');
        }
    }
    fav.addEventListener('click', toggleFav);
    li.appendChild(fav);
    var neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.appendChild(neighborhood);
    var address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.appendChild(address);
    var more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForRestaurant(restaurant);
    var restName = restaurant.name;
    var cuisine = restaurant.cuisine_type;
    var location = restaurant.neighborhood;
    more.setAttribute('aria-label', " View " + restName + " details. " + cuisine + " restaurant located in " + location);
    li.appendChild(more);
    return li;
};
/**
 * Add markers for current restaurants to the map.
 */
var addMarkersToMap = function (restaurants) {
    if (restaurants === void 0) { restaurants = self.restaurants; }
    restaurants.forEach(function (restaurant) {
        // Add marker to the map
        var marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, 'click', function () {
            window.location.href = marker.url;
        });
        self.markers.push(marker);
    });
};

},{}],2:[function(require,module,exports){
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
var url = window.location.href.split("=");
var id = url[1];
var requestRestaurant = function () { return __awaiter(_this, void 0, void 0, function () {
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
var requestReviews = function () { return __awaiter(_this, void 0, void 0, function () {
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
document.addEventListener('DOMContentLoaded', function (event) {
    requestRestaurant();
    requestReviews();
});
window.initMap = function () {
    var loc = {
        lat: 40.722216,
        lng: -73.987501,
    };
    self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false,
    });
};
var restaurantDetailsPage = function (restaurant) {
    var breadcrumbs = document.getElementById("breadcrumb-ul");
    breadcrumbs.innerHTML = "\n    <li>\n              <a href=\"/\">Home</a> / " + restaurant.name + "\n            </li>\n    ";
    var name = document.getElementById("restaurant-name");
    name.innerHTML = "\n    " + restaurant.name + "\n    ";
    var fav = document.createElement('span');
    var isFav = restaurant.is_favorite;
    if (isFav === 'true') {
        fav.classList.add('yes-fav');
        fav.classList.remove('no-fav');
        fav.setAttribute('aria-label', 'marked as favorite');
    }
    else {
        fav.classList.add('no-fav');
        fav.classList.remove('yes-fav');
        fav.setAttribute('aria-label', 'marked as no favorite');
    }
    function toggleFav() {
        if (fav.className === 'no-fav') {
            var url_1 = "http://localhost:1337/restaurants/" + restaurant.id + "/?is_favorite=true";
            fetch(url_1, {
                method: 'PUT',
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error('Error:', error); })
                .then(function (response) { return console.log('Success:', response, url_1); });
            this.classList.replace('no-fav', 'yes-fav');
            this.removeAttribute('aria-label');
            this.setAttribute('aria-label', 'marked as favorite');
        }
        else {
            var url_2 = "http://localhost:1337/restaurants/" + restaurant.id + "/?is_favorite=false";
            fetch(url_2, {
                method: 'PUT',
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error('Error:', error); })
                .then(function (response) { return console.log('Success:', response, url_2); });
            this.classList.replace('yes-fav', 'no-fav');
            this.removeAttribute('aria-label');
            this.setAttribute('aria-label', 'marked as no favorite');
        }
    }
    fav.addEventListener('click', toggleFav);
    name.appendChild(fav);
    var picture = document.getElementById("restaurant-picture");
    var srcsetMobile = "images/" + restaurant.photograph + "-mobile.webp";
    var srcsetTablet = "images/" + restaurant.photograph + "-tablet.webp";
    var srcsetDesktop = "images/" + restaurant.photograph + "-desktop.webp";
    var srcsetFallback = "images/" + restaurant.photograph + "-desktop.jpg";
    picture.innerHTML = "\n    \n  <source media=\"(min-width: 728px)\" srcset=\"" + srcsetDesktop + "\" type=\"image/webp\">\n  <source media=\"(max-width: 727px)\" srcset=\"" + srcsetMobile + "\" type=\"image/webp\">\n  <source  srcset=\"" + srcsetFallback + "\" type=\"image/jpeg\">\n  <img src=\"" + srcsetFallback + "\" class=\"restaurant-img\" alt=\"" + restaurant.name + " " + restaurant.cuisine_type + " food restaurant New York City\">\n    ";
    var cuisine = document.getElementById("restaurant-cuisine");
    cuisine.innerHTML = "\n" + restaurant.cuisine_type + "\n";
    var address = document.getElementById("restaurant-address");
    address.innerHTML = " Address: " + restaurant.address + "\n    ";
    var table = document.getElementById("restaurant-hours");
    var oh = restaurant.operating_hours;
    var result = Object.keys(oh).map(function (key) {
        return { day: (key), hours: oh[key] };
    });
    var thead = document.createElement("tr");
    thead.innerHTML = "<tr><th class=\"white-text\">Opening Hours</th></tr>";
    table.appendChild(thead);
    result.map(function (cell) {
        var tr = document.createElement("tr");
        tr.innerHTML = "\n    <td>" + cell.day + "</td>\n    <td>" + cell.hours + "</td>\n    \n    ";
        table.appendChild(tr);
    });
};
var showReviews = function (reviews) {
    console.log(reviews);
    var reviewsList = document.getElementById("reviews-list");
    reviews.map(function (review) {
        var li = document.createElement("li");
        li.innerHTML = "\n\n        <p><strong>Author</strong>: " + review.name + " <span class=\"left\"><strong>        Rating</strong>: " + review.rating + "  </span> </p>\n        <p>" + review.comments + "</p>\n";
        reviewsList.appendChild(li);
    });
};
document.getElementById('review-form').addEventListener('input', function (event) {
    console.log(event.target.value);
});
var addReview = function (e) {
    var name = document.getElementById('review-author').value;
    var rating = document.getElementById('rating_select').value;
    var comments = document.getElementById('review-comments').value;
    var url = "http://localhost:1337/reviews";
    var NEW_REVIEW = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, res, json, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = {
                        "restaurant_id": id,
                        "name": name,
                        "rating": rating,
                        "comments": comments
                    };
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _a.sent();
                    success = console.log('Success:', json);
                    return [2 /*return*/, success];
            }
        });
    }); };
    NEW_REVIEW().catch(function (error) { return console.error('Error:', error); });
    alert("Review created successfully!");
    window.location.reload();
};
var form = document.getElementById('review-form');
form.addEventListener("submit", function (e) {
    e.preventDefault();
    addReview(e);
});

},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL2luZGV4LnRzIiwic3JjL2Fzc2V0cy9qcy9yZXN0YXVyYW50LWRldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLGlCQUFpQjtBQUNqQjs7Ozs7Ozs7Ozs7OztJQWFJO0FBQ0oscUJBQXFCO0FBQ3JCLElBQUksV0FBVyxDQUFDO0FBQ2hCLElBQUksYUFBa0IsQ0FBQztBQUN2QixJQUFJLFFBQVEsQ0FBQztBQUNiLElBQUksR0FBRyxDQUFDO0FBQ1IsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ25COztHQUVHO0FBQ0gsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFVBQUMsS0FBSztJQUNoRCxrQkFBa0IsRUFBRSxDQUFDO0lBQ3JCLGFBQWEsRUFBRSxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBRUg7O0dBRUc7QUFFSCxJQUFNLGtCQUFrQixHQUFHO0lBQ3ZCLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLEtBQVUsRUFBRSxhQUFrQjtRQUN2RCxJQUFJLEtBQUssRUFBRSxFQUFFLGVBQWU7WUFDeEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QjthQUFNO1lBQ0csSUFBSyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7WUFDMUMscUJBQXFCLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBR0Q7O0dBRUc7QUFDSCxJQUFNLHFCQUFxQixHQUFHLFVBQUMsYUFBeUM7SUFBekMsOEJBQUEsRUFBQSxnQkFBc0IsSUFBSyxDQUFDLGFBQWE7SUFDcEUsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQy9ELGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQyxZQUFpQjtRQUNoQyxJQUFNLE1BQU0s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SSxHQUFHLFNBQWdCO29CQUN2QixPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzlDLHNCQUFPLE9BQU8sRUFBQzs7O1NBQ2xCLENBQUE7SUFDRCxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFBO0lBQzNELEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDN0IsQ0FBQyxDQUFBO0FBR0QsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNuRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQUMsQ0FBQztJQUM5QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbkIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRWhCLENBQUMsQ0FBQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnk7XG4vLyBTZXJ2aWNlIFdvcmtlclxuLyogaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlclxuICAgICAgICAucmVnaXN0ZXIoJy9zdy5qcycsIHtcbiAgICAgICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKChyZWcpID0+IHtcbiAgICAgICAgICAgIC8vIHJlZ2lzdHJhdGlvbiB3b3JrZWRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZWdpc3RyYXRpb24gc3VjY2VlZGVkLiBTY29wZSBpcyAke3JlZy5zY29wZX1gKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZFxuICAgICAgICAgICAgY29uc29sZS5sb2coYFJlZ2lzdHJhdGlvbiBmYWlsZWQgd2l0aCAke2Vycm9yfWApO1xuICAgICAgICB9KTtcbn0gKi9cbi8vIEVuZCBTZXJ2aWNlIFdvcmtlclxubGV0IHJlc3RhdXJhbnRzO1xubGV0IG5laWdoYm9yaG9vZHM6IGFueTtcbmxldCBjdWlzaW5lcztcbmxldCBtYXA7XG5jb25zdCBtYXJrZXJzID0gW107XG4vKipcbiAqIEZldGNoIG5laWdoYm9yaG9vZHMgYW5kIGN1aXNpbmVzIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgZmV0Y2hOZWlnaGJvcmhvb2RzKCk7XG4gICAgZmV0Y2hDdWlzaW5lcygpO1xufSk7XG5cbi8qKlxuICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgYW5kIHNldCB0aGVpciBIVE1MLlxuICovXG5cbmNvbnN0IGZldGNoTmVpZ2hib3Job29kcyA9ICgpID0+IHtcbiAgICBEQkhlbHBlci5yZXF1ZXN0UmVzdGF1cmFudHMoKGVycm9yOiBhbnksIG5laWdoYm9yaG9vZHM6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHsgLy8gR290IGFuIGVycm9yXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICg8YW55PnNlbGYpLm5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzO1xuICAgICAgICAgICAgZmlsbE5laWdoYm9yaG9vZHNIVE1MKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4vKipcbiAqIFNldCBuZWlnaGJvcmhvb2RzIEhUTUwuXG4gKi9cbmNvbnN0IGZpbGxOZWlnaGJvcmhvb2RzSFRNTCA9IChuZWlnaGJvcmhvb2RzID0gKDxhbnk+c2VsZikubmVpZ2hib3Job29kcykgPT4ge1xuICAgIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xuICAgIG5laWdoYm9yaG9vZHMubWFwKChuZWlnaGJvcmhvb2Q6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IG5laWdoYm9yaG9vZDtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gbmVpZ2hib3Job29kO1xuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcblxuICAgIH0pO1xuXG59O1xuXG4vKipcbiAqIEZldGNoIGFsbCBjdWlzaW5lcyBhbmQgc2V0IHRoZWlyIEhUTUwuXG4gKi9cbmNvbnN0IGZldGNoQ3Vpc2luZXMgPSAoKSA9PiB7XG4gICAgREJIZWxwZXIuZmV0Y2hDdWlzaW5lcygoZXJyb3I6IGFueSwgY3Vpc2luZXM6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHsgLy8gR290IGFuIGVycm9yIVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoPGFueT5zZWxmKS5jdWlzaW5lcyA9IGN1aXNpbmVzO1xuICAgICAgICAgICAgZmlsbEN1aXNpbmVzSFRNTCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFNldCBjdWlzaW5lcyBIVE1MLlxuICovXG5jb25zdCBmaWxsQ3Vpc2luZXNIVE1MID0gKGN1aXNpbmVzID0gKDxhbnk+c2VsZikuY3Vpc2luZXMpID0+IHtcbiAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vpc2luZXMtc2VsZWN0Jyk7XG5cbiAgICBjdWlzaW5lcy5mb3JFYWNoKChjdWlzaW5lOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSBjdWlzaW5lO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBjdWlzaW5lO1xuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBHb29nbGUgbWFwLCBjYWxsZWQgZnJvbSBIVE1MLlxuICovXG4oPGFueT53aW5kb3cpLmluaXRNYXAgPSAoKSA9PiB7XG4gICAgY29uc3QgbG9jID0ge1xuICAgICAgICBsYXQ6IDQwLjcyMjIxNixcbiAgICAgICAgbG5nOiAtNzMuOTg3NTAxLFxuICAgIH07XG4gICAgKDxhbnk+c2VsZikubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgICAgem9vbTogMTIsXG4gICAgICAgIGNlbnRlcjogbG9jLFxuICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgfSk7XG5cbiAgICB1cGRhdGVSZXN0YXVyYW50cygpO1xufTtcblxuLyoqXG4gKiBVcGRhdGUgcGFnZSBhbmQgbWFwIGZvciBjdXJyZW50IHJlc3RhdXJhbnRzLlxuICovXG5jb25zdCB1cGRhdGVSZXN0YXVyYW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBjU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1aXNpbmVzLXNlbGVjdCcpO1xuICAgIGNvbnN0IG5TZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmVpZ2hib3Job29kcy1zZWxlY3QnKTtcblxuICAgIGNvbnN0IGNJbmRleCA9ICg8SFRNTFNlbGVjdEVsZW1lbnQ+Y1NlbGVjdCkuc2VsZWN0ZWRJbmRleDtcbiAgICBjb25zdCBuSW5kZXggPSAoPEhUTUxTZWxlY3RFbGVtZW50Pm5TZWxlY3QpLnNlbGVjdGVkSW5kZXg7XG5cbiAgICBjb25zdCBjdWlzaW5lID0gKDxhbnk+Y1NlbGVjdClbY0luZGV4XS52YWx1ZTtcbiAgICBjb25zdCBuZWlnaGJvcmhvb2QgPSAoPGFueT5uU2VsZWN0KVtuSW5kZXhdLnZhbHVlO1xuXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgKGVycm9yOiBhbnksIHJlc3RhdXJhbnRzOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzZXRSZXN0YXVyYW50cyhyZXN0YXVyYW50cyk7XG4gICAgICAgICAgICBmaWxsUmVzdGF1cmFudHNIVE1MKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogQ2xlYXIgY3VycmVudCByZXN0YXVyYW50cywgdGhlaXIgSFRNTCBhbmQgcmVtb3ZlIHRoZWlyIG1hcCBtYXJrZXJzLlxuICovXG5jb25zdCByZXNldFJlc3RhdXJhbnRzID0gKHJlc3RhdXJhbnRzOiBhbnkpID0+IHtcbiAgICAvLyBSZW1vdmUgYWxsIHJlc3RhdXJhbnRzXG4gICAgKDxhbnk+c2VsZikucmVzdGF1cmFudHMgPSBbXTtcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XG4gICAgdWwuaW5uZXJIVE1MID0gJyc7XG4gICAgdWwuY2xhc3NOYW1lID0gJ2dyaWQnO1xuXG5cbiAgICAvLyBSZW1vdmUgYWxsIG1hcCBtYXJrZXJzXG4gICAgKDxhbnk+c2VsZikubWFya2Vycy5mb3JFYWNoKChtOiBhbnkpID0+IG0uc2V0TWFwKG51bGwpKTtcbiAgICAoPGFueT5zZWxmKS5tYXJrZXJzID0gW107XG4gICAgKDxhbnk+c2VsZikucmVzdGF1cmFudHMgPSByZXN0YXVyYW50cztcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFsbCByZXN0YXVyYW50cyBIVE1MIGFuZCBhZGQgdGhlbSB0byB0aGUgd2VicGFnZS5cbiAqL1xuY29uc3QgZmlsbFJlc3RhdXJhbnRzSFRNTCA9IChyZXN0YXVyYW50cyA9ICg8YW55PnNlbGYpLnJlc3RhdXJhbnRzKSA9PiB7XG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpO1xuICAgIHJlc3RhdXJhbnRzLmZvckVhY2goKHJlc3RhdXJhbnQ6IGFueSkgPT4ge1xuICAgICAgICB1bC5hcHBlbmRDaGlsZChjcmVhdGVSZXN0YXVyYW50SFRNTChyZXN0YXVyYW50KSk7XG4gICAgfSk7XG4gICAgYWRkTWFya2Vyc1RvTWFwKCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IEhUTUwuXG4gKi9cbmNvbnN0IGNyZWF0ZVJlc3RhdXJhbnRIVE1MID0gKHJlc3RhdXJhbnQ6IGFueSkgPT4ge1xuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaS5jbGFzc05hbWUgPSAnY2FyZCc7XG4gICAgY29uc3QgcGljdHVyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3BpY3R1cmUnKTtcbiAgICBjb25zdCBzcmNzZXREZXNrdG9wID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tZGVza3RvcC53ZWJwYDtcbiAgICBjb25zdCBzcmNzZXRUYWJsZXQgPSBgaW1hZ2VzLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS10YWJsZXQud2VicGA7XG4gICAgY29uc3Qgc3Jjc2V0TW9iaWxlID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tbW9iaWxlLndlYnBgO1xuICAgIGNvbnN0IHNyY3NldEZhbGxiYWNrID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tdGFibGV0LmpwZ2A7XG4gICAgcGljdHVyZS5pbm5lckhUTUwgPSBgPHNvdXJjZSBtZWRpYT1cIihtaW4td2lkdGg6IDEwMjRweClcIiBzcmNzZXQ9XCIke3NyY3NldERlc2t0b3B9XCIgdHlwZT1cImltYWdlL3dlYnBcIj5cbiAgPHNvdXJjZSBtZWRpYT1cIihtaW4td2lkdGg6IDcyOHB4KVwiIHNyY3NldD1cIiR7c3Jjc2V0VGFibGV0fVwiIHR5cGU9XCJpbWFnZS93ZWJwXCI+XG4gIDxzb3VyY2UgbWVkaWE9XCIobWF4LXdpZHRoOiA3MjdweClcIiBzcmNzZXQ9XCIke3NyY3NldE1vYmlsZX1cIiB0eXBlPVwiaW1hZ2Uvd2VicFwiPlxuICA8c291cmNlICBzcmNzZXQ9XCIke3NyY3NldEZhbGxiYWNrfVwiIHR5cGU9XCJpbWFnZS9qcGVnXCI+XG4gIDxpbWcgc3JjPVwiJHtzcmNzZXRGYWxsYmFja31cIiBjbGFzcz1cInJlc3RhdXJhbnQtaW1nXCIgYWx0PVwiJHtyZXN0YXVyYW50Lm5hbWV9ICR7cmVzdGF1cmFudC5jdWlzaW5lX3R5cGV9IGZvb2QgcmVzdGF1cmFudCBOZXcgWW9yayBDaXR5XCI+YDtcblxuICAgIGxpLmFwcGVuZENoaWxkKHBpY3R1cmUpO1xuICAgIC8vIFRPRE8gUFJPSkVDVCBSRVZJRVdcbiAgICAvLyBDb3JyZWN0IHJlc3RhdXJhbnQncyBuYW1lIHNlbWFudGljIG1pc3Rha2UgaW4gaW5kZXguaHRtbFxuXG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gICAgbmFtZS5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5hbWU7XG4gICAgbGkuYXBwZW5kQ2hpbGQobmFtZSk7XG4gICAgY29uc3QgZmF2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGlzRmF2ID0gcmVzdGF1cmFudC5pc19mYXZvcml0ZTtcbiAgICBpZiAoaXNGYXYgPT09ICd0cnVlJykge1xuICAgICAgICBmYXYuY2xhc3NMaXN0LmFkZCgneWVzLWZhdicpO1xuICAgICAgICBmYXYuY2xhc3NMaXN0LnJlbW92ZSgnbm8tZmF2Jyk7XG4gICAgICAgIGZhdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIGZhdm9yaXRlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmF2LmNsYXNzTGlzdC5hZGQoJ25vLWZhdicpO1xuICAgICAgICBmYXYuY2xhc3NMaXN0LnJlbW92ZSgneWVzLWZhdicpO1xuICAgICAgICBmYXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ21hcmtlZCBhcyBubyBmYXZvcml0ZScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUZhdigpIHtcbiAgICAgICAgaWYgKGZhdi5jbGFzc05hbWUgPT09ICduby1mYXYnKSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jlc3RhdXJhbnRzLyR7cmVzdGF1cmFudC5pZH0vP2lzX2Zhdm9yaXRlPXRydWVgO1xuICAgICAgICAgICAgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiBjb25zb2xlLmxvZygnU3VjY2VzczonLCByZXNwb25zZSwgdXJsKSk7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZXBsYWNlKCduby1mYXYnLCAneWVzLWZhdicpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ21hcmtlZCBhcyBmYXZvcml0ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXN0YXVyYW50cy8ke3Jlc3RhdXJhbnQuaWR9Lz9pc19mYXZvcml0ZT1mYWxzZWA7XG4gICAgICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGNvbnNvbGUubG9nKCdTdWNjZXNzOicsIHJlc3BvbnNlLCB1cmwpKTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlcGxhY2UoJ3llcy1mYXYnLCAnbm8tZmF2Jyk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIG5vIGZhdm9yaXRlJyk7XG4gICAgICAgIH1cblxuXG4gICAgfVxuICAgIGZhdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUZhdik7XG5cbiAgICBsaS5hcHBlbmRDaGlsZChmYXYpO1xuXG4gICAgY29uc3QgbmVpZ2hib3Job29kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIG5laWdoYm9yaG9vZC5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5laWdoYm9yaG9vZDtcbiAgICBsaS5hcHBlbmRDaGlsZChuZWlnaGJvcmhvb2QpO1xuXG5cbiAgICBjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGFkZHJlc3MuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5hZGRyZXNzO1xuICAgIGxpLmFwcGVuZENoaWxkKGFkZHJlc3MpO1xuXG4gICAgY29uc3QgbW9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBtb3JlLmlubmVySFRNTCA9ICdWaWV3IERldGFpbHMnO1xuICAgIG1vcmUuaHJlZiA9IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gICAgY29uc3QgcmVzdE5hbWUgPSByZXN0YXVyYW50Lm5hbWU7XG4gICAgY29uc3QgY3Vpc2luZSA9IHJlc3RhdXJhbnQuY3Vpc2luZV90eXBlO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gcmVzdGF1cmFudC5uZWlnaGJvcmhvb2Q7XG4gICAgbW9yZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBgIFZpZXcgJHtyZXN0TmFtZX0gZGV0YWlscy4gJHtjdWlzaW5lfSByZXN0YXVyYW50IGxvY2F0ZWQgaW4gJHtsb2NhdGlvbn1gKTtcbiAgICBsaS5hcHBlbmRDaGlsZChtb3JlKTtcblxuICAgIHJldHVybiBsaTtcbn07XG5cbi8qKlxuICogQWRkIG1hcmtlcnMgZm9yIGN1cnJlbnQgcmVzdGF1cmFudHMgdG8gdGhlIG1hcC5cbiAqL1xuY29uc3QgYWRkTWFya2Vyc1RvTWFwID0gKHJlc3RhdXJhbnRzID0gKDxhbnk+c2VsZikucmVzdGF1cmFudHMpID0+IHtcbiAgICByZXN0YXVyYW50cy5mb3JFYWNoKChyZXN0YXVyYW50OiBhbnkpID0+IHtcbiAgICAgICAgLy8gQWRkIG1hcmtlciB0byB0aGUgbWFwXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IERCSGVscGVyLm1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgKDxhbnk+c2VsZikubWFwKTtcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG1hcmtlci51cmw7XG4gICAgICAgIH0pO1xuICAgICAgICAoPGFueT5zZWxmKS5tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICB9KTtcbn07IiwiLy8gU2VydmljZSBXb3JrZXJcbi8qIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXJcbiAgICAgICAgLnJlZ2lzdGVyKCcvc3cuanMnLCB7XG4gICAgICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigocmVnKSA9PiB7XG4gICAgICAgICAgICAvLyByZWdpc3RyYXRpb24gd29ya2VkXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVnaXN0cmF0aW9uIHN1Y2NlZWRlZC4gU2NvcGUgaXMgJHtyZWcuc2NvcGV9YCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIC8vIHJlZ2lzdHJhdGlvbiBmYWlsZWRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZWdpc3RyYXRpb24gZmFpbGVkIHdpdGggJHtlcnJvcn1gKTtcbiAgICAgICAgfSk7XG59ICovXG4vLyBFbmQgU2VydmljZSBXb3JrZXJcbmNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KFwiPVwiKTtcbmNvbnN0IGlkID0gdXJsWzFdO1xuY29uc3QgcmVxdWVzdFJlc3RhdXJhbnQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXN0YXVyYW50cy8ke2lkfWApO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpO1xuICAgIGNvbnN0IHJlc3RhdXJhbnQgPSByZXN0YXVyYW50RGV0YWlsc1BhZ2UoZGF0YSk7XG4gICAgY29uc29sZS5sb2cocmVzdGF1cmFudClcbiAgICByZXR1cm4gcmVzdGF1cmFudDtcbn07XG5jb25zdCByZXF1ZXN0UmV2aWV3cyA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jldmlld3M/cmVzdGF1cmFudF9pZD0ke2lkfWApO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpO1xuICAgIGNvbnN0IHJldmlld3MgPSBzaG93UmV2aWV3cyhkYXRhKTtcbiAgICBjb25zb2xlLmxvZyhyZXZpZXdzKVxuICAgIHJldHVybiByZXZpZXdzO1xufTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoZXZlbnQpID0+IHtcbiAgICByZXF1ZXN0UmVzdGF1cmFudCgpO1xuICAgIHJlcXVlc3RSZXZpZXdzKCk7XG59KTtcbig8YW55PndpbmRvdykuaW5pdE1hcCA9ICgpID0+IHtcbiAgICBjb25zdCBsb2MgPSB7XG4gICAgICAgIGxhdDogNDAuNzIyMjE2LFxuICAgICAgICBsbmc6IC03My45ODc1MDEsXG4gICAgfTtcbiAgICAoPGFueT5zZWxmKS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICB6b29tOiAxMixcbiAgICAgICAgY2VudGVyOiBsb2MsXG4gICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICB9KTtcblxufTtcblxuXG5jb25zdCByZXN0YXVyYW50RGV0YWlsc1BhZ2UgPSAocmVzdGF1cmFudDogYW55KSA9PiB7XG4gICAgY29uc3QgYnJlYWRjcnVtYnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJyZWFkY3J1bWItdWxcIik7XG4gICAgYnJlYWRjcnVtYnMuaW5uZXJIVE1MID0gYFxuICAgIDxsaT5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIi9cIj5Ib21lPC9hPiAvICR7cmVzdGF1cmFudC5uYW1lfVxuICAgICAgICAgICAgPC9saT5cbiAgICBgO1xuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhdXJhbnQtbmFtZVwiKTtcbiAgICBuYW1lLmlubmVySFRNTCA9IGBcbiAgICAke3Jlc3RhdXJhbnQubmFtZX1cbiAgICBgO1xuXG4gICAgY29uc3QgZmF2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGlzRmF2ID0gcmVzdGF1cmFudC5pc19mYXZvcml0ZTtcblxuICAgIGlmIChpc0ZhdiA9PT0gJ3RydWUnKSB7XG4gICAgICAgIGZhdi5jbGFzc0xpc3QuYWRkKCd5ZXMtZmF2Jyk7XG4gICAgICAgIGZhdi5jbGFzc0xpc3QucmVtb3ZlKCduby1mYXYnKTtcbiAgICAgICAgZmF2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdtYXJrZWQgYXMgZmF2b3JpdGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYXYuY2xhc3NMaXN0LmFkZCgnbm8tZmF2Jyk7XG4gICAgICAgIGZhdi5jbGFzc0xpc3QucmVtb3ZlKCd5ZXMtZmF2Jyk7XG4gICAgICAgIGZhdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIG5vIGZhdm9yaXRlJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRvZ2dsZUZhdigpIHtcbiAgICAgICAgaWYgKGZhdi5jbGFzc05hbWUgPT09ICduby1mYXYnKSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jlc3RhdXJhbnRzLyR7cmVzdGF1cmFudC5pZH0vP2lzX2Zhdm9yaXRlPXRydWVgO1xuICAgICAgICAgICAgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiBjb25zb2xlLmxvZygnU3VjY2VzczonLCByZXNwb25zZSwgdXJsKSk7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZXBsYWNlKCduby1mYXYnLCAneWVzLWZhdicpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ21hcmtlZCBhcyBmYXZvcml0ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXN0YXVyYW50cy8ke3Jlc3RhdXJhbnQuaWR9Lz9pc19mYXZvcml0ZT1mYWxzZWA7XG4gICAgICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGNvbnNvbGUubG9nKCdTdWNjZXNzOicsIHJlc3BvbnNlLCB1cmwpKTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlcGxhY2UoJ3llcy1mYXYnLCAnbm8tZmF2Jyk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIG5vIGZhdm9yaXRlJyk7XG4gICAgICAgIH1cblxuXG4gICAgfVxuICAgIGZhdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUZhdik7XG5cbiAgICBuYW1lLmFwcGVuZENoaWxkKGZhdik7XG4gICAgY29uc3QgcGljdHVyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdGF1cmFudC1waWN0dXJlXCIpO1xuICAgIGNvbnN0IHNyY3NldE1vYmlsZSA9IGBpbWFnZXMvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LW1vYmlsZS53ZWJwYDtcbiAgICBjb25zdCBzcmNzZXRUYWJsZXQgPSBgaW1hZ2VzLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS10YWJsZXQud2VicGA7XG4gICAgY29uc3Qgc3Jjc2V0RGVza3RvcCA9IGBpbWFnZXMvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LWRlc2t0b3Aud2VicGA7XG4gICAgY29uc3Qgc3Jjc2V0RmFsbGJhY2sgPSBgaW1hZ2VzLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS1kZXNrdG9wLmpwZ2A7XG5cbiAgICBwaWN0dXJlLmlubmVySFRNTCA9IGBcbiAgICBcbiAgPHNvdXJjZSBtZWRpYT1cIihtaW4td2lkdGg6IDcyOHB4KVwiIHNyY3NldD1cIiR7c3Jjc2V0RGVza3RvcH1cIiB0eXBlPVwiaW1hZ2Uvd2VicFwiPlxuICA8c291cmNlIG1lZGlhPVwiKG1heC13aWR0aDogNzI3cHgpXCIgc3Jjc2V0PVwiJHtzcmNzZXRNb2JpbGV9XCIgdHlwZT1cImltYWdlL3dlYnBcIj5cbiAgPHNvdXJjZSAgc3Jjc2V0PVwiJHtzcmNzZXRGYWxsYmFja31cIiB0eXBlPVwiaW1hZ2UvanBlZ1wiPlxuICA8aW1nIHNyYz1cIiR7c3Jjc2V0RmFsbGJhY2t9XCIgY2xhc3M9XCJyZXN0YXVyYW50LWltZ1wiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSAke3Jlc3RhdXJhbnQuY3Vpc2luZV90eXBlfSBmb29kIHJlc3RhdXJhbnQgTmV3IFlvcmsgQ2l0eVwiPlxuICAgIGA7XG4gICAgY29uc3QgY3Vpc2luZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdGF1cmFudC1jdWlzaW5lXCIpO1xuICAgIGN1aXNpbmUuaW5uZXJIVE1MID0gYFxuJHtyZXN0YXVyYW50LmN1aXNpbmVfdHlwZX1cbmA7XG4gICAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdGF1cmFudC1hZGRyZXNzXCIpO1xuICAgIGFkZHJlc3MuaW5uZXJIVE1MID0gYCBBZGRyZXNzOiAke3Jlc3RhdXJhbnQuYWRkcmVzc31cbiAgICBgO1xuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN0YXVyYW50LWhvdXJzXCIpO1xuICAgIGNvbnN0IG9oID0gcmVzdGF1cmFudC5vcGVyYXRpbmdfaG91cnM7XG5cbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3Qua2V5cyhvaCkubWFwKChrZXkpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgZGF5OiAoa2V5KSwgaG91cnM6IG9oW2tleV0gfTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgIHRoZWFkLmlubmVySFRNTCA9IGA8dHI+PHRoIGNsYXNzPVwid2hpdGUtdGV4dFwiPk9wZW5pbmcgSG91cnM8L3RoPjwvdHI+YDtcbiAgICB0YWJsZS5hcHBlbmRDaGlsZCh0aGVhZClcbiAgICByZXN1bHQubWFwKGNlbGwgPT4ge1xuXG4gICAgICAgIGNvbnN0IHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgICAgICB0ci5pbm5lckhUTUwgPSBgXG4gICAgPHRkPiR7Y2VsbC5kYXl9PC90ZD5cbiAgICA8dGQ+JHtjZWxsLmhvdXJzfTwvdGQ+XG4gICAgXG4gICAgYFxuXG4gICAgICAgIHRhYmxlLmFwcGVuZENoaWxkKHRyKVxuXG4gICAgfSlcblxuXG5cbn07XG5jb25zdCBzaG93UmV2aWV3cyA9IChyZXZpZXdzOiBhbnkpID0+IHtcbiAgICBjb25zb2xlLmxvZyhyZXZpZXdzKVxuICAgIGNvbnN0IHJldmlld3NMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXZpZXdzLWxpc3RcIik7XG5cbiAgICByZXZpZXdzLm1hcCgocmV2aWV3OiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIGxpLmlubmVySFRNTCA9IGBcblxuICAgICAgICA8cD48c3Ryb25nPkF1dGhvcjwvc3Ryb25nPjogJHtyZXZpZXcubmFtZX0gPHNwYW4gY2xhc3M9XCJsZWZ0XCI+PHN0cm9uZz4gICAgICAgIFJhdGluZzwvc3Ryb25nPjogJHtyZXZpZXcucmF0aW5nfSAgPC9zcGFuPiA8L3A+XG4gICAgICAgIDxwPiR7cmV2aWV3LmNvbW1lbnRzfTwvcD5cbmBcbiAgICAgICAgcmV2aWV3c0xpc3QuYXBwZW5kQ2hpbGQobGkpO1xuXG4gICAgfSlcblxuXG59O1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlldy1mb3JtJykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQpID0+IHtcbiAgICBjb25zb2xlLmxvZygoPEhUTUxJbnB1dEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS52YWx1ZSlcbn0pXG5jb25zdCBhZGRSZXZpZXcgPSAoZTogYW55KSA9PiB7XG4gICAgbGV0IG5hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlldy1hdXRob3InKSkudmFsdWU7XG4gICAgbGV0IHJhdGluZyA9ICg8SFRNTFNlbGVjdEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhdGluZ19zZWxlY3QnKSkudmFsdWU7XG4gICAgbGV0IGNvbW1lbnRzID0gKDxIVE1MVGV4dEFyZWFFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXctY29tbWVudHMnKSkudmFsdWU7XG4gICAgY29uc3QgdXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjEzMzcvcmV2aWV3c1wiO1xuICAgIGNvbnN0IE5FV19SRVZJRVcgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBcInJlc3RhdXJhbnRfaWRcIjogaWQsXG4gICAgICAgICAgICBcIm5hbWVcIjogbmFtZSxcbiAgICAgICAgICAgIFwicmF0aW5nXCI6IHJhdGluZyxcbiAgICAgICAgICAgIFwiY29tbWVudHNcIjogY29tbWVudHNcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBjb25zb2xlLmxvZygnU3VjY2VzczonLCBqc29uKTtcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3M7XG4gICAgfVxuICAgIE5FV19SRVZJRVcoKS5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcikpXG4gICAgYWxlcnQoXCJSZXZpZXcgY3JlYXRlZCBzdWNjZXNzZnVsbHkhXCIpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbn1cblxuXG5jb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlldy1mb3JtJylcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBhZGRSZXZpZXcoZSlcblxufSkiXX0=
