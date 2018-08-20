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
document.addEventListener('DOMContentLoaded', function (event) {
    DBHelper.requestRestaurant();
    DBHelper.requestReviews();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL2luZGV4LnRzIiwic3JjL2Fzc2V0cy9qcy9yZXN0YXVyYW50LWRldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLGlCQUFpQjtBQUNqQjs7Ozs7Ozs7Ozs7OztJQWFJO0FBQ0oscUJBQXFCO0FBQ3JCLElBQUksV0FBVyxDQUFDO0FBQ2hCLElBQUksYUFBa0IsQ0FBQztBQUN2QixJQUFJLFFBQVEsQ0FBQztBQUNiLElBQUksR0FBRyxDQUFDO0FBQ1IsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ25COztHQUVHO0FBQ0gsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFVBQUMsS0FBSztJQUNoRCxrQkFBa0IsRUFBRSxDQUFDO0lBQ3JCLGFBQWEsRUFBRSxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBRUg7O0dBRUc7QUFFSCxJQUFNLGtCQUFrQixHQUFHO0lBQ3ZCLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLEtBQVUsRUFBRSxhQUFrQjtRQUN2RCxJQUFJLEtBQUssRUFBRSxFQUFFLGVBQWU7WUFDeEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QjthQUFNO1lBQ0csSUFBSyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7WUFDMUMscUJBQXFCLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBR0Q7O0dBRUc7QUFDSCxJQUFNLHFCQUFxQixHQUFHLFVBQUMsYUFBeUM7SUFBekMsOEJBQUEsRUFBQSxnQkFBc0IsSUFBSyxDQUFDLGFBQWE7SUFDcEUsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQy9ELGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQyxZQUFpQjtRQUNoQyxJQUFNLE1BQU0s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b290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImRlY2xhcmUgdmFyIGdvb2dsZTogYW55O1xuLy8gU2VydmljZSBXb3JrZXJcbi8qIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXJcbiAgICAgICAgLnJlZ2lzdGVyKCcvc3cuanMnLCB7XG4gICAgICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigocmVnKSA9PiB7XG4gICAgICAgICAgICAvLyByZWdpc3RyYXRpb24gd29ya2VkXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVnaXN0cmF0aW9uIHN1Y2NlZWRlZC4gU2NvcGUgaXMgJHtyZWcuc2NvcGV9YCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIC8vIHJlZ2lzdHJhdGlvbiBmYWlsZWRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZWdpc3RyYXRpb24gZmFpbGVkIHdpdGggJHtlcnJvcn1gKTtcbiAgICAgICAgfSk7XG59ICovXG4vLyBFbmQgU2VydmljZSBXb3JrZXJcbmxldCByZXN0YXVyYW50cztcbmxldCBuZWlnaGJvcmhvb2RzOiBhbnk7XG5sZXQgY3Vpc2luZXM7XG5sZXQgbWFwO1xuY29uc3QgbWFya2VycyA9IFtdO1xuLyoqXG4gKiBGZXRjaCBuZWlnaGJvcmhvb2RzIGFuZCBjdWlzaW5lcyBhcyBzb29uIGFzIHRoZSBwYWdlIGlzIGxvYWRlZC5cbiAqL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICAgIGZldGNoTmVpZ2hib3Job29kcygpO1xuICAgIGZldGNoQ3Vpc2luZXMoKTtcbn0pO1xuXG4vKipcbiAqIEZldGNoIGFsbCBuZWlnaGJvcmhvb2RzIGFuZCBzZXQgdGhlaXIgSFRNTC5cbiAqL1xuXG5jb25zdCBmZXRjaE5laWdoYm9yaG9vZHMgPSAoKSA9PiB7XG4gICAgREJIZWxwZXIucmVxdWVzdFJlc3RhdXJhbnRzKChlcnJvcjogYW55LCBuZWlnaGJvcmhvb2RzOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoPGFueT5zZWxmKS5uZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcztcbiAgICAgICAgICAgIGZpbGxOZWlnaGJvcmhvb2RzSFRNTCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuLyoqXG4gKiBTZXQgbmVpZ2hib3Job29kcyBIVE1MLlxuICovXG5jb25zdCBmaWxsTmVpZ2hib3Job29kc0hUTUwgPSAobmVpZ2hib3Job29kcyA9ICg8YW55PnNlbGYpLm5laWdoYm9yaG9vZHMpID0+IHtcbiAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmVpZ2hib3Job29kcy1zZWxlY3QnKTtcbiAgICBuZWlnaGJvcmhvb2RzLm1hcCgobmVpZ2hib3Job29kOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSBuZWlnaGJvcmhvb2Q7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IG5laWdoYm9yaG9vZDtcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG5cbiAgICB9KTtcblxufTtcblxuLyoqXG4gKiBGZXRjaCBhbGwgY3Vpc2luZXMgYW5kIHNldCB0aGVpciBIVE1MLlxuICovXG5jb25zdCBmZXRjaEN1aXNpbmVzID0gKCkgPT4ge1xuICAgIERCSGVscGVyLmZldGNoQ3Vpc2luZXMoKGVycm9yOiBhbnksIGN1aXNpbmVzOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKDxhbnk+c2VsZikuY3Vpc2luZXMgPSBjdWlzaW5lcztcbiAgICAgICAgICAgIGZpbGxDdWlzaW5lc0hUTUwoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiBTZXQgY3Vpc2luZXMgSFRNTC5cbiAqL1xuY29uc3QgZmlsbEN1aXNpbmVzSFRNTCA9IChjdWlzaW5lcyA9ICg8YW55PnNlbGYpLmN1aXNpbmVzKSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1aXNpbmVzLXNlbGVjdCcpO1xuXG4gICAgY3Vpc2luZXMuZm9yRWFjaCgoY3Vpc2luZTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gY3Vpc2luZTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gY3Vpc2luZTtcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgR29vZ2xlIG1hcCwgY2FsbGVkIGZyb20gSFRNTC5cbiAqL1xuKDxhbnk+d2luZG93KS5pbml0TWFwID0gKCkgPT4ge1xuICAgIGNvbnN0IGxvYyA9IHtcbiAgICAgICAgbGF0OiA0MC43MjIyMTYsXG4gICAgICAgIGxuZzogLTczLjk4NzUwMSxcbiAgICB9O1xuICAgICg8YW55PnNlbGYpLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgIHpvb206IDEyLFxuICAgICAgICBjZW50ZXI6IGxvYyxcbiAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgdXBkYXRlUmVzdGF1cmFudHMoKTtcbn07XG5cbi8qKlxuICogVXBkYXRlIHBhZ2UgYW5kIG1hcCBmb3IgY3VycmVudCByZXN0YXVyYW50cy5cbiAqL1xuY29uc3QgdXBkYXRlUmVzdGF1cmFudHMgPSAoKSA9PiB7XG4gICAgY29uc3QgY1NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdWlzaW5lcy1zZWxlY3QnKTtcbiAgICBjb25zdCBuU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25laWdoYm9yaG9vZHMtc2VsZWN0Jyk7XG5cbiAgICBjb25zdCBjSW5kZXggPSAoPEhUTUxTZWxlY3RFbGVtZW50PmNTZWxlY3QpLnNlbGVjdGVkSW5kZXg7XG4gICAgY29uc3QgbkluZGV4ID0gKDxIVE1MU2VsZWN0RWxlbWVudD5uU2VsZWN0KS5zZWxlY3RlZEluZGV4O1xuXG4gICAgY29uc3QgY3Vpc2luZSA9ICg8YW55PmNTZWxlY3QpW2NJbmRleF0udmFsdWU7XG4gICAgY29uc3QgbmVpZ2hib3Job29kID0gKDxhbnk+blNlbGVjdClbbkluZGV4XS52YWx1ZTtcblxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZChjdWlzaW5lLCBuZWlnaGJvcmhvb2QsIChlcnJvcjogYW55LCByZXN0YXVyYW50czogYW55KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikgeyAvLyBHb3QgYW4gZXJyb3IhXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc2V0UmVzdGF1cmFudHMocmVzdGF1cmFudHMpO1xuICAgICAgICAgICAgZmlsbFJlc3RhdXJhbnRzSFRNTCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIENsZWFyIGN1cnJlbnQgcmVzdGF1cmFudHMsIHRoZWlyIEhUTUwgYW5kIHJlbW92ZSB0aGVpciBtYXAgbWFya2Vycy5cbiAqL1xuY29uc3QgcmVzZXRSZXN0YXVyYW50cyA9IChyZXN0YXVyYW50czogYW55KSA9PiB7XG4gICAgLy8gUmVtb3ZlIGFsbCByZXN0YXVyYW50c1xuICAgICg8YW55PnNlbGYpLnJlc3RhdXJhbnRzID0gW107XG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpO1xuICAgIHVsLmlubmVySFRNTCA9ICcnO1xuICAgIHVsLmNsYXNzTmFtZSA9ICdncmlkJztcblxuXG4gICAgLy8gUmVtb3ZlIGFsbCBtYXAgbWFya2Vyc1xuICAgICg8YW55PnNlbGYpLm1hcmtlcnMuZm9yRWFjaCgobTogYW55KSA9PiBtLnNldE1hcChudWxsKSk7XG4gICAgKDxhbnk+c2VsZikubWFya2VycyA9IFtdO1xuICAgICg8YW55PnNlbGYpLnJlc3RhdXJhbnRzID0gcmVzdGF1cmFudHM7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhbGwgcmVzdGF1cmFudHMgSFRNTCBhbmQgYWRkIHRoZW0gdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmNvbnN0IGZpbGxSZXN0YXVyYW50c0hUTUwgPSAocmVzdGF1cmFudHMgPSAoPGFueT5zZWxmKS5yZXN0YXVyYW50cykgPT4ge1xuICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRzLWxpc3QnKTtcbiAgICByZXN0YXVyYW50cy5mb3JFYWNoKChyZXN0YXVyYW50OiBhbnkpID0+IHtcbiAgICAgICAgdWwuYXBwZW5kQ2hpbGQoY3JlYXRlUmVzdGF1cmFudEhUTUwocmVzdGF1cmFudCkpO1xuICAgIH0pO1xuICAgIGFkZE1hcmtlcnNUb01hcCgpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MLlxuICovXG5jb25zdCBjcmVhdGVSZXN0YXVyYW50SFRNTCA9IChyZXN0YXVyYW50OiBhbnkpID0+IHtcbiAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGkuY2xhc3NOYW1lID0gJ2NhcmQnO1xuICAgIGNvbnN0IHBpY3R1cmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwaWN0dXJlJyk7XG4gICAgY29uc3Qgc3Jjc2V0RGVza3RvcCA9IGBpbWFnZXMvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LWRlc2t0b3Aud2VicGA7XG4gICAgY29uc3Qgc3Jjc2V0VGFibGV0ID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tdGFibGV0LndlYnBgO1xuICAgIGNvbnN0IHNyY3NldE1vYmlsZSA9IGBpbWFnZXMvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LW1vYmlsZS53ZWJwYDtcbiAgICBjb25zdCBzcmNzZXRGYWxsYmFjayA9IGBpbWFnZXMvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LXRhYmxldC5qcGdgO1xuICAgIHBpY3R1cmUuaW5uZXJIVE1MID0gYDxzb3VyY2UgbWVkaWE9XCIobWluLXdpZHRoOiAxMDI0cHgpXCIgc3Jjc2V0PVwiJHtzcmNzZXREZXNrdG9wfVwiIHR5cGU9XCJpbWFnZS93ZWJwXCI+XG4gIDxzb3VyY2UgbWVkaWE9XCIobWluLXdpZHRoOiA3MjhweClcIiBzcmNzZXQ9XCIke3NyY3NldFRhYmxldH1cIiB0eXBlPVwiaW1hZ2Uvd2VicFwiPlxuICA8c291cmNlIG1lZGlhPVwiKG1heC13aWR0aDogNzI3cHgpXCIgc3Jjc2V0PVwiJHtzcmNzZXRNb2JpbGV9XCIgdHlwZT1cImltYWdlL3dlYnBcIj5cbiAgPHNvdXJjZSAgc3Jjc2V0PVwiJHtzcmNzZXRGYWxsYmFja31cIiB0eXBlPVwiaW1hZ2UvanBlZ1wiPlxuICA8aW1nIHNyYz1cIiR7c3Jjc2V0RmFsbGJhY2t9XCIgY2xhc3M9XCJyZXN0YXVyYW50LWltZ1wiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSAke3Jlc3RhdXJhbnQuY3Vpc2luZV90eXBlfSBmb29kIHJlc3RhdXJhbnQgTmV3IFlvcmsgQ2l0eVwiPmA7XG5cbiAgICBsaS5hcHBlbmRDaGlsZChwaWN0dXJlKTtcbiAgICAvLyBUT0RPIFBST0pFQ1QgUkVWSUVXXG4gICAgLy8gQ29ycmVjdCByZXN0YXVyYW50J3MgbmFtZSBzZW1hbnRpYyBtaXN0YWtlIGluIGluZGV4Lmh0bWxcblxuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuICAgIG5hbWUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xuICAgIGxpLmFwcGVuZENoaWxkKG5hbWUpO1xuICAgIGNvbnN0IGZhdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBpc0ZhdiA9IHJlc3RhdXJhbnQuaXNfZmF2b3JpdGU7XG4gICAgaWYgKGlzRmF2ID09PSAndHJ1ZScpIHtcbiAgICAgICAgZmF2LmNsYXNzTGlzdC5hZGQoJ3llcy1mYXYnKTtcbiAgICAgICAgZmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25vLWZhdicpO1xuICAgICAgICBmYXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ21hcmtlZCBhcyBmYXZvcml0ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZhdi5jbGFzc0xpc3QuYWRkKCduby1mYXYnKTtcbiAgICAgICAgZmF2LmNsYXNzTGlzdC5yZW1vdmUoJ3llcy1mYXYnKTtcbiAgICAgICAgZmF2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdtYXJrZWQgYXMgbm8gZmF2b3JpdGUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVGYXYoKSB7XG4gICAgICAgIGlmIChmYXYuY2xhc3NOYW1lID09PSAnbm8tZmF2Jykge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXN0YXVyYW50cy8ke3Jlc3RhdXJhbnQuaWR9Lz9pc19mYXZvcml0ZT10cnVlYDtcbiAgICAgICAgICAgIGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcikpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gY29uc29sZS5sb2coJ1N1Y2Nlc3M6JywgcmVzcG9uc2UsIHVybCkpO1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVwbGFjZSgnbm8tZmF2JywgJ3llcy1mYXYnKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdtYXJrZWQgYXMgZmF2b3JpdGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHMvJHtyZXN0YXVyYW50LmlkfS8/aXNfZmF2b3JpdGU9ZmFsc2VgO1xuICAgICAgICAgICAgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiBjb25zb2xlLmxvZygnU3VjY2VzczonLCByZXNwb25zZSwgdXJsKSk7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZXBsYWNlKCd5ZXMtZmF2JywgJ25vLWZhdicpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ21hcmtlZCBhcyBubyBmYXZvcml0ZScpO1xuICAgICAgICB9XG5cblxuICAgIH1cbiAgICBmYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVGYXYpO1xuXG4gICAgbGkuYXBwZW5kQ2hpbGQoZmF2KTtcblxuICAgIGNvbnN0IG5laWdoYm9yaG9vZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBuZWlnaGJvcmhvb2QuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uZWlnaGJvcmhvb2Q7XG4gICAgbGkuYXBwZW5kQ2hpbGQobmVpZ2hib3Job29kKTtcblxuXG4gICAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcbiAgICBsaS5hcHBlbmRDaGlsZChhZGRyZXNzKTtcblxuICAgIGNvbnN0IG1vcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgbW9yZS5pbm5lckhUTUwgPSAnVmlldyBEZXRhaWxzJztcbiAgICBtb3JlLmhyZWYgPSBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xuICAgIGNvbnN0IHJlc3ROYW1lID0gcmVzdGF1cmFudC5uYW1lO1xuICAgIGNvbnN0IGN1aXNpbmUgPSByZXN0YXVyYW50LmN1aXNpbmVfdHlwZTtcbiAgICBjb25zdCBsb2NhdGlvbiA9IHJlc3RhdXJhbnQubmVpZ2hib3Job29kO1xuICAgIG1vcmUuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYCBWaWV3ICR7cmVzdE5hbWV9IGRldGFpbHMuICR7Y3Vpc2luZX0gcmVzdGF1cmFudCBsb2NhdGVkIGluICR7bG9jYXRpb259YCk7XG4gICAgbGkuYXBwZW5kQ2hpbGQobW9yZSk7XG5cbiAgICByZXR1cm4gbGk7XG59O1xuXG4vKipcbiAqIEFkZCBtYXJrZXJzIGZvciBjdXJyZW50IHJlc3RhdXJhbnRzIHRvIHRoZSBtYXAuXG4gKi9cbmNvbnN0IGFkZE1hcmtlcnNUb01hcCA9IChyZXN0YXVyYW50cyA9ICg8YW55PnNlbGYpLnJlc3RhdXJhbnRzKSA9PiB7XG4gICAgcmVzdGF1cmFudHMuZm9yRWFjaCgocmVzdGF1cmFudDogYW55KSA9PiB7XG4gICAgICAgIC8vIEFkZCBtYXJrZXIgdG8gdGhlIG1hcFxuICAgICAgICBjb25zdCBtYXJrZXIgPSBEQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsICg8YW55PnNlbGYpLm1hcCk7XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBtYXJrZXIudXJsO1xuICAgICAgICB9KTtcbiAgICAgICAgKDxhbnk+c2VsZikubWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgfSk7XG59OyIsIi8vIFNlcnZpY2UgV29ya2VyXG4vKiBpZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyXG4gICAgICAgIC5yZWdpc3RlcignL3N3LmpzJywge1xuICAgICAgICAgICAgc2NvcGU6ICcvJyxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlZykgPT4ge1xuICAgICAgICAgICAgLy8gcmVnaXN0cmF0aW9uIHdvcmtlZFxuICAgICAgICAgICAgY29uc29sZS5sb2coYFJlZ2lzdHJhdGlvbiBzdWNjZWVkZWQuIFNjb3BlIGlzICR7cmVnLnNjb3BlfWApO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAvLyByZWdpc3RyYXRpb24gZmFpbGVkXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVnaXN0cmF0aW9uIGZhaWxlZCB3aXRoICR7ZXJyb3J9YCk7XG4gICAgICAgIH0pO1xufSAqL1xuLy8gRW5kIFNlcnZpY2UgV29ya2VyXG5jb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdChcIj1cIik7XG5jb25zdCBpZCA9IHVybFsxXTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICAgIERCSGVscGVyLnJlcXVlc3RSZXN0YXVyYW50KCk7XG4gICAgREJIZWxwZXIucmVxdWVzdFJldmlld3MoKTtcbn0pO1xuKDxhbnk+d2luZG93KS5pbml0TWFwID0gKCkgPT4ge1xuICAgIGNvbnN0IGxvYyA9IHtcbiAgICAgICAgbGF0OiA0MC43MjIyMTYsXG4gICAgICAgIGxuZzogLTczLjk4NzUwMSxcbiAgICB9O1xuICAgICg8YW55PnNlbGYpLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgIHpvb206IDEyLFxuICAgICAgICBjZW50ZXI6IGxvYyxcbiAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgIH0pO1xuXG59O1xuXG5cbmNvbnN0IHJlc3RhdXJhbnREZXRhaWxzUGFnZSA9IChyZXN0YXVyYW50OiBhbnkpID0+IHtcbiAgICBjb25zdCBicmVhZGNydW1icyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJlYWRjcnVtYi11bFwiKTtcbiAgICBicmVhZGNydW1icy5pbm5lckhUTUwgPSBgXG4gICAgPGxpPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiL1wiPkhvbWU8L2E+IC8gJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICA8L2xpPlxuICAgIGA7XG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdGF1cmFudC1uYW1lXCIpO1xuICAgIG5hbWUuaW5uZXJIVE1MID0gYFxuICAgICR7cmVzdGF1cmFudC5uYW1lfVxuICAgIGA7XG5cbiAgICBjb25zdCBmYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgaXNGYXYgPSByZXN0YXVyYW50LmlzX2Zhdm9yaXRlO1xuXG4gICAgaWYgKGlzRmF2ID09PSAndHJ1ZScpIHtcbiAgICAgICAgZmF2LmNsYXNzTGlzdC5hZGQoJ3llcy1mYXYnKTtcbiAgICAgICAgZmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25vLWZhdicpO1xuICAgICAgICBmYXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ21hcmtlZCBhcyBmYXZvcml0ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZhdi5jbGFzc0xpc3QuYWRkKCduby1mYXYnKTtcbiAgICAgICAgZmF2LmNsYXNzTGlzdC5yZW1vdmUoJ3llcy1mYXYnKTtcbiAgICAgICAgZmF2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdtYXJrZWQgYXMgbm8gZmF2b3JpdGUnKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdG9nZ2xlRmF2KCkge1xuICAgICAgICBpZiAoZmF2LmNsYXNzTmFtZSA9PT0gJ25vLWZhdicpIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHMvJHtyZXN0YXVyYW50LmlkfS8/aXNfZmF2b3JpdGU9dHJ1ZWA7XG4gICAgICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGNvbnNvbGUubG9nKCdTdWNjZXNzOicsIHJlc3BvbnNlLCB1cmwpKTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlcGxhY2UoJ25vLWZhdicsICd5ZXMtZmF2Jyk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIGZhdm9yaXRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jlc3RhdXJhbnRzLyR7cmVzdGF1cmFudC5pZH0vP2lzX2Zhdm9yaXRlPWZhbHNlYDtcbiAgICAgICAgICAgIGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcikpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gY29uc29sZS5sb2coJ1N1Y2Nlc3M6JywgcmVzcG9uc2UsIHVybCkpO1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVwbGFjZSgneWVzLWZhdicsICduby1mYXYnKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdtYXJrZWQgYXMgbm8gZmF2b3JpdGUnKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgZmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRmF2KTtcblxuICAgIG5hbWUuYXBwZW5kQ2hpbGQoZmF2KTtcbiAgICBjb25zdCBwaWN0dXJlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN0YXVyYW50LXBpY3R1cmVcIik7XG4gICAgY29uc3Qgc3Jjc2V0TW9iaWxlID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tbW9iaWxlLndlYnBgO1xuICAgIGNvbnN0IHNyY3NldFRhYmxldCA9IGBpbWFnZXMvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LXRhYmxldC53ZWJwYDtcbiAgICBjb25zdCBzcmNzZXREZXNrdG9wID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tZGVza3RvcC53ZWJwYDtcbiAgICBjb25zdCBzcmNzZXRGYWxsYmFjayA9IGBpbWFnZXMvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LWRlc2t0b3AuanBnYDtcblxuICAgIHBpY3R1cmUuaW5uZXJIVE1MID0gYFxuICAgIFxuICA8c291cmNlIG1lZGlhPVwiKG1pbi13aWR0aDogNzI4cHgpXCIgc3Jjc2V0PVwiJHtzcmNzZXREZXNrdG9wfVwiIHR5cGU9XCJpbWFnZS93ZWJwXCI+XG4gIDxzb3VyY2UgbWVkaWE9XCIobWF4LXdpZHRoOiA3MjdweClcIiBzcmNzZXQ9XCIke3NyY3NldE1vYmlsZX1cIiB0eXBlPVwiaW1hZ2Uvd2VicFwiPlxuICA8c291cmNlICBzcmNzZXQ9XCIke3NyY3NldEZhbGxiYWNrfVwiIHR5cGU9XCJpbWFnZS9qcGVnXCI+XG4gIDxpbWcgc3JjPVwiJHtzcmNzZXRGYWxsYmFja31cIiBjbGFzcz1cInJlc3RhdXJhbnQtaW1nXCIgYWx0PVwiJHtyZXN0YXVyYW50Lm5hbWV9ICR7cmVzdGF1cmFudC5jdWlzaW5lX3R5cGV9IGZvb2QgcmVzdGF1cmFudCBOZXcgWW9yayBDaXR5XCI+XG4gICAgYDtcbiAgICBjb25zdCBjdWlzaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN0YXVyYW50LWN1aXNpbmVcIik7XG4gICAgY3Vpc2luZS5pbm5lckhUTUwgPSBgXG4ke3Jlc3RhdXJhbnQuY3Vpc2luZV90eXBlfVxuYDtcbiAgICBjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN0YXVyYW50LWFkZHJlc3NcIik7XG4gICAgYWRkcmVzcy5pbm5lckhUTUwgPSBgIEFkZHJlc3M6ICR7cmVzdGF1cmFudC5hZGRyZXNzfVxuICAgIGA7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhdXJhbnQtaG91cnNcIik7XG4gICAgY29uc3Qgb2ggPSByZXN0YXVyYW50Lm9wZXJhdGluZ19ob3VycztcblxuICAgIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5rZXlzKG9oKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICByZXR1cm4geyBkYXk6IChrZXkpLCBob3Vyczogb2hba2V5XSB9O1xuICAgIH0pO1xuXG4gICAgY29uc3QgdGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgdGhlYWQuaW5uZXJIVE1MID0gYDx0cj48dGggY2xhc3M9XCJ3aGl0ZS10ZXh0XCI+T3BlbmluZyBIb3VyczwvdGg+PC90cj5gO1xuICAgIHRhYmxlLmFwcGVuZENoaWxkKHRoZWFkKVxuICAgIHJlc3VsdC5tYXAoY2VsbCA9PiB7XG5cbiAgICAgICAgY29uc3QgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgIHRyLmlubmVySFRNTCA9IGBcbiAgICA8dGQ+JHtjZWxsLmRheX08L3RkPlxuICAgIDx0ZD4ke2NlbGwuaG91cnN9PC90ZD5cbiAgICBcbiAgICBgXG5cbiAgICAgICAgdGFibGUuYXBwZW5kQ2hpbGQodHIpXG5cbiAgICB9KVxuXG5cblxufTtcbmNvbnN0IHNob3dSZXZpZXdzID0gKHJldmlld3M6IGFueSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJldmlld3MpXG4gICAgY29uc3QgcmV2aWV3c0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJldmlld3MtbGlzdFwiKTtcblxuICAgIHJldmlld3MubWFwKChyZXZpZXc6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgbGkuaW5uZXJIVE1MID0gYFxuXG4gICAgICAgIDxwPjxzdHJvbmc+QXV0aG9yPC9zdHJvbmc+OiAke3Jldmlldy5uYW1lfSA8c3BhbiBjbGFzcz1cImxlZnRcIj48c3Ryb25nPiAgICAgICAgUmF0aW5nPC9zdHJvbmc+OiAke3Jldmlldy5yYXRpbmd9ICA8L3NwYW4+IDwvcD5cbiAgICAgICAgPHA+JHtyZXZpZXcuY29tbWVudHN9PC9wPlxuYFxuICAgICAgICByZXZpZXdzTGlzdC5hcHBlbmRDaGlsZChsaSk7XG5cbiAgICB9KVxuXG5cbn07XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3LWZvcm0nKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCg8SFRNTElucHV0RWxlbWVudD5ldmVudC50YXJnZXQpLnZhbHVlKVxufSlcbmNvbnN0IGFkZFJldmlldyA9IChlOiBhbnkpID0+IHtcbiAgICBsZXQgbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3LWF1dGhvcicpKS52YWx1ZTtcbiAgICBsZXQgcmF0aW5nID0gKDxIVE1MU2VsZWN0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmF0aW5nX3NlbGVjdCcpKS52YWx1ZTtcbiAgICBsZXQgY29tbWVudHMgPSAoPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlldy1jb21tZW50cycpKS52YWx1ZTtcbiAgICBjb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXZpZXdzXCI7XG4gICAgY29uc3QgTkVXX1JFVklFVyA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIFwicmVzdGF1cmFudF9pZFwiOiBpZCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBuYW1lLFxuICAgICAgICAgICAgXCJyYXRpbmdcIjogcmF0aW5nLFxuICAgICAgICAgICAgXCJjb21tZW50c1wiOiBjb21tZW50c1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGNvbnNvbGUubG9nKCdTdWNjZXNzOicsIGpzb24pO1xuICAgICAgICByZXR1cm4gc3VjY2VzcztcbiAgICB9XG4gICAgTkVXX1JFVklFVygpLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKSlcbiAgICBhbGVydChcIlJldmlldyBjcmVhdGVkIHN1Y2Nlc3NmdWxseSFcIik7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xufVxuXG5cbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3LWZvcm0nKVxuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGFkZFJldmlldyhlKVxuXG59KSJdfQ==
