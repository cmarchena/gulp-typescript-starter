(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
var requestRestaurants = function () { return __awaiter(_this, void 0, void 0, function () {
    var res, data, restaurants;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("http://localhost:1337/restaurants")];
            case 1:
                res = _a.sent();
                if (!(res.status == 200)) return [3 /*break*/, 3];
                return [4 /*yield*/, res.json()];
            case 2:
                data = _a.sent();
                restaurants = homePage(data);
                return [2 /*return*/, restaurants];
            case 3: throw new Error("" + res.status);
        }
    });
}); };
var errorMessage = function (e) {
    var ul = document.getElementById("restaurants-list");
    var htmlContent = "\n    <p class=\"error\">There is no connection with the server. Try again later</p>\n    ";
    ul.insertAdjacentHTML('beforebegin', htmlContent);
};
document.addEventListener('DOMContentLoaded', function (event) {
    requestRestaurants().catch(function (e) { return errorMessage(e); });
});
/* TODO: add reviews
const requestReviews = async () => {
    const res = await fetch('http://localhost:1337/reviews')
    const data = await res.json()
    console.log(data)
}
requestReviews(); */
var homePage = function (restaurants) {
    var ul = document.getElementById("restaurants-list");
    restaurants.map(function (restaurant) {
        var srcsetMobile = "images/" + restaurant.photograph + "-mobile.webp";
        var srcsetTablet = "images/" + restaurant.photograph + "-tablet.webp";
        var srcsetDesktop = "images/" + restaurant.photograph + "-desktop.webp";
        var srcsetFallback = "images/" + restaurant.photograph + "-tablet.jpg";
        var li = document.createElement("li");
        li.className = "card";
        li.innerHTML = "\n\n\n        <source media=\"(min-width: 1024px)\" srcset=\"" + srcsetDesktop + "\" type=\"image/webp\">\n  <source media=\"(min-width: 728px)\" srcset=\"" + srcsetTablet + "\" type=\"image/webp\">\n  <source media=\"(max-width: 727px)\" srcset=\"" + srcsetMobile + "\" type=\"image/webp\">\n  <source  srcset=\"" + srcsetFallback + "\" type=\"image/jpeg\">\n  <img src=\"" + srcsetFallback + "\" class=\"restaurant-img\" alt=\"" + restaurant.name + " " + restaurant.cuisine_type + " food restaurant New York City\">\n        <h3>" + restaurant.name + "</h3>\n        <p>" + restaurant.neighborhood + "</p>\n        <p>" + restaurant.address + "</p>\n        <a href=\"/restaurant.html?id=" + restaurant.id + "\">View Details</a>\n        ";
        ul.appendChild(li);
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
                    .then(function (response) { return console.log('Success:', response); });
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
                    .then(function (response) { return console.log('Success:', response); });
                this.classList.replace('yes-fav', 'no-fav');
                this.removeAttribute('aria-label');
                this.setAttribute('aria-label', 'marked as no favorite');
            }
        }
        fav.addEventListener('click', toggleFav);
        li.appendChild(fav);
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
                return [2 /*return*/, reviews];
        }
    });
}); };
document.addEventListener('DOMContentLoaded', function (event) {
    requestRestaurant();
    requestReviews();
});
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
            var url_1 = "http://localhost:1337/restaurants/" + id + "/?is_favorite=true";
            fetch(url_1, {
                method: 'PUT',
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error('Error:', error); })
                .then(function (response) { return console.log('Success:', response); });
            this.classList.replace('no-fav', 'yes-fav');
            this.removeAttribute('aria-label');
            this.setAttribute('aria-label', 'marked as favorite');
        }
        else {
            var url_2 = "http://localhost:1337/restaurants/" + id + "/?is_favorite=false";
            fetch(url_2, {
                method: 'PUT',
            }).then(function (res) { return res.json(); })
                .catch(function (error) { return console.error('Error:', error); })
                .then(function (response) { return console.log('Success:', response); });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL2luZGV4LnRzIiwic3JjL2Fzc2V0cy9qcy9yZXN0YXVyYW50LWRldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZ0JBLGlCQXNHQTtBQXRIQSxpQkFBaUI7QUFDakI7Ozs7Ozs7Ozs7Ozs7SUFhSTtBQUNKLHFCQUFxQjtBQUNyQixJQUFNLGtCQUFrQixHQUFHOzs7O29CQUNiLHFCQUFNLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxFQUFBOztnQkFBdEQsR0FBRyxHQUFHLFNBQWdEO3FCQUN0RCxDQUFBLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFBLEVBQWpCLHdCQUFpQjtnQkFDTixxQkFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUE7O2dCQUF2QixJQUFJLEdBQUcsU0FBZ0I7Z0JBQ3JCLFdBQVcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLHNCQUFPLFdBQVcsRUFBQztvQkFFdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFHLEdBQUcsQ0FBQyxNQUFRLENBQUMsQ0FBQTs7O0tBRW5DLENBQUM7QUFDRixJQUFNLFlBQVksR0FBRyxVQUFDLENBQU07SUFDeEIsSUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRXZELElBQUksV0FBVyxHQUFHLDRGQUVqQixDQUFDO0lBQ0YsRUFBRSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUVyRCxDQUFDLENBQUE7QUFDRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsVUFBQyxLQUFLO0lBQ2hELGtCQUFrQixFQUFFLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsWUFBWSxDQUFDLENBQUMsQ0FB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SUFDbkIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRWhCLENBQUMsQ0FBQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gU2VydmljZSBXb3JrZXJcbi8qIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXJcbiAgICAgICAgLnJlZ2lzdGVyKCcvc3cuanMnLCB7XG4gICAgICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigocmVnKSA9PiB7XG4gICAgICAgICAgICAvLyByZWdpc3RyYXRpb24gd29ya2VkXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVnaXN0cmF0aW9uIHN1Y2NlZWRlZC4gU2NvcGUgaXMgJHtyZWcuc2NvcGV9YCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIC8vIHJlZ2lzdHJhdGlvbiBmYWlsZWRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZWdpc3RyYXRpb24gZmFpbGVkIHdpdGggJHtlcnJvcn1gKTtcbiAgICAgICAgfSk7XG59ICovXG4vLyBFbmQgU2VydmljZSBXb3JrZXJcbmNvbnN0IHJlcXVlc3RSZXN0YXVyYW50cyA9IGFzeW5jICgpID0+IHtcbiAgICBsZXQgcmVzID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHNcIik7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgIGxldCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgICAgY29uc3QgcmVzdGF1cmFudHMgPSBob21lUGFnZShkYXRhKTtcbiAgICAgICAgcmV0dXJuIHJlc3RhdXJhbnRzO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzLnN0YXR1c31gKVxuXG59O1xuY29uc3QgZXJyb3JNZXNzYWdlID0gKGU6IGFueSkgPT4ge1xuICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN0YXVyYW50cy1saXN0XCIpO1xuXG4gICAgbGV0IGh0bWxDb250ZW50ID0gYFxuICAgIDxwIGNsYXNzPVwiZXJyb3JcIj5UaGVyZSBpcyBubyBjb25uZWN0aW9uIHdpdGggdGhlIHNlcnZlci4gVHJ5IGFnYWluIGxhdGVyPC9wPlxuICAgIGA7XG4gICAgdWwuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmViZWdpbicsIGh0bWxDb250ZW50KVxuXG59XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgcmVxdWVzdFJlc3RhdXJhbnRzKCkuY2F0Y2goZSA9PiBlcnJvck1lc3NhZ2UoZSkpXG5cbn0pO1xuXG4vKiBUT0RPOiBhZGQgcmV2aWV3c1xuY29uc3QgcmVxdWVzdFJldmlld3MgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXZpZXdzJylcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxuICAgIGNvbnNvbGUubG9nKGRhdGEpXG59XG5yZXF1ZXN0UmV2aWV3cygpOyAqL1xuXG5jb25zdCBob21lUGFnZSA9IChyZXN0YXVyYW50czogYW55KSA9PiB7XG5cbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdGF1cmFudHMtbGlzdFwiKTtcblxuICAgIHJlc3RhdXJhbnRzLm1hcCgocmVzdGF1cmFudDogYW55KSA9PiB7XG5cbiAgICAgICAgY29uc3Qgc3Jjc2V0TW9iaWxlID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tbW9iaWxlLndlYnBgO1xuICAgICAgICBjb25zdCBzcmNzZXRUYWJsZXQgPSBgaW1hZ2VzLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS10YWJsZXQud2VicGA7XG4gICAgICAgIGNvbnN0IHNyY3NldERlc2t0b3AgPSBgaW1hZ2VzLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS1kZXNrdG9wLndlYnBgO1xuICAgICAgICBjb25zdCBzcmNzZXRGYWxsYmFjayA9IGBpbWFnZXMvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LXRhYmxldC5qcGdgO1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgbGkuY2xhc3NOYW1lID0gXCJjYXJkXCI7XG4gICAgICAgIGxpLmlubmVySFRNTCA9IGBcblxuXG4gICAgICAgIDxzb3VyY2UgbWVkaWE9XCIobWluLXdpZHRoOiAxMDI0cHgpXCIgc3Jjc2V0PVwiJHtzcmNzZXREZXNrdG9wfVwiIHR5cGU9XCJpbWFnZS93ZWJwXCI+XG4gIDxzb3VyY2UgbWVkaWE9XCIobWluLXdpZHRoOiA3MjhweClcIiBzcmNzZXQ9XCIke3NyY3NldFRhYmxldH1cIiB0eXBlPVwiaW1hZ2Uvd2VicFwiPlxuICA8c291cmNlIG1lZGlhPVwiKG1heC13aWR0aDogNzI3cHgpXCIgc3Jjc2V0PVwiJHtzcmNzZXRNb2JpbGV9XCIgdHlwZT1cImltYWdlL3dlYnBcIj5cbiAgPHNvdXJjZSAgc3Jjc2V0PVwiJHtzcmNzZXRGYWxsYmFja31cIiB0eXBlPVwiaW1hZ2UvanBlZ1wiPlxuICA8aW1nIHNyYz1cIiR7c3Jjc2V0RmFsbGJhY2t9XCIgY2xhc3M9XCJyZXN0YXVyYW50LWltZ1wiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSAke3Jlc3RhdXJhbnQuY3Vpc2luZV90eXBlfSBmb29kIHJlc3RhdXJhbnQgTmV3IFlvcmsgQ2l0eVwiPlxuICAgICAgICA8aDM+JHtyZXN0YXVyYW50Lm5hbWV9PC9oMz5cbiAgICAgICAgPHA+JHtyZXN0YXVyYW50Lm5laWdoYm9yaG9vZH08L3A+XG4gICAgICAgIDxwPiR7cmVzdGF1cmFudC5hZGRyZXNzfTwvcD5cbiAgICAgICAgPGEgaHJlZj1cIi9yZXN0YXVyYW50Lmh0bWw/aWQ9JHtyZXN0YXVyYW50LmlkfVwiPlZpZXcgRGV0YWlsczwvYT5cbiAgICAgICAgYDtcbiAgICAgICAgdWwuYXBwZW5kQ2hpbGQobGkpO1xuICAgICAgICBjb25zdCBmYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGNvbnN0IGlzRmF2ID0gcmVzdGF1cmFudC5pc19mYXZvcml0ZTtcblxuICAgICAgICBpZiAoaXNGYXYgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgZmF2LmNsYXNzTGlzdC5hZGQoJ3llcy1mYXYnKTtcbiAgICAgICAgICAgIGZhdi5jbGFzc0xpc3QucmVtb3ZlKCduby1mYXYnKTtcbiAgICAgICAgICAgIGZhdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIGZhdm9yaXRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmYXYuY2xhc3NMaXN0LmFkZCgnbm8tZmF2Jyk7XG4gICAgICAgICAgICBmYXYuY2xhc3NMaXN0LnJlbW92ZSgneWVzLWZhdicpO1xuICAgICAgICAgICAgZmF2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdtYXJrZWQgYXMgbm8gZmF2b3JpdGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUZhdigpIHtcbiAgICAgICAgICAgIGlmIChmYXYuY2xhc3NOYW1lID09PSAnbm8tZmF2Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHMvJHtyZXN0YXVyYW50LmlkfS8/aXNfZmF2b3JpdGU9dHJ1ZWA7XG4gICAgICAgICAgICAgICAgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gY29uc29sZS5sb2coJ1N1Y2Nlc3M6JywgcmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZXBsYWNlKCduby1mYXYnLCAneWVzLWZhdicpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIGZhdm9yaXRlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHMvJHtyZXN0YXVyYW50LmlkfS8/aXNfZmF2b3JpdGU9ZmFsc2VgO1xuICAgICAgICAgICAgICAgIGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcikpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGNvbnNvbGUubG9nKCdTdWNjZXNzOicsIHJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVwbGFjZSgneWVzLWZhdicsICduby1mYXYnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ21hcmtlZCBhcyBubyBmYXZvcml0ZScpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgICAgICBmYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVGYXYpO1xuXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKGZhdik7XG4gICAgfSk7XG5cbn07XG4iLCIvLyBTZXJ2aWNlIFdvcmtlclxuLyogaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlclxuICAgICAgICAucmVnaXN0ZXIoJy9zdy5qcycsIHtcbiAgICAgICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKChyZWcpID0+IHtcbiAgICAgICAgICAgIC8vIHJlZ2lzdHJhdGlvbiB3b3JrZWRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZWdpc3RyYXRpb24gc3VjY2VlZGVkLiBTY29wZSBpcyAke3JlZy5zY29wZX1gKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZFxuICAgICAgICAgICAgY29uc29sZS5sb2coYFJlZ2lzdHJhdGlvbiBmYWlsZWQgd2l0aCAke2Vycm9yfWApO1xuICAgICAgICB9KTtcbn0gKi9cbi8vIEVuZCBTZXJ2aWNlIFdvcmtlclxuY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCI9XCIpO1xuY29uc3QgaWQgPSB1cmxbMV07XG5jb25zdCByZXF1ZXN0UmVzdGF1cmFudCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jlc3RhdXJhbnRzLyR7aWR9YCk7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgY29uc3QgcmVzdGF1cmFudCA9IHJlc3RhdXJhbnREZXRhaWxzUGFnZShkYXRhKTtcbiAgICByZXR1cm4gcmVzdGF1cmFudDtcbn07XG5cblxuY29uc3QgcmVxdWVzdFJldmlld3MgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXZpZXdzP3Jlc3RhdXJhbnRfaWQ9JHtpZH1gKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICBjb25zdCByZXZpZXdzID0gc2hvd1Jldmlld3MoZGF0YSk7XG4gICAgcmV0dXJuIHJldmlld3M7XG5cbn07XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgcmVxdWVzdFJlc3RhdXJhbnQoKTtcbiAgICByZXF1ZXN0UmV2aWV3cygpO1xufSk7XG5cblxuXG5cblxuY29uc3QgcmVzdGF1cmFudERldGFpbHNQYWdlID0gKHJlc3RhdXJhbnQ6IGFueSkgPT4ge1xuXG4gICAgY29uc3QgYnJlYWRjcnVtYnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJyZWFkY3J1bWItdWxcIik7XG4gICAgYnJlYWRjcnVtYnMuaW5uZXJIVE1MID0gYFxuICAgIDxsaT5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIi9cIj5Ib21lPC9hPiAvICR7cmVzdGF1cmFudC5uYW1lfVxuICAgICAgICAgICAgPC9saT5cbiAgICBgO1xuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhdXJhbnQtbmFtZVwiKTtcbiAgICBuYW1lLmlubmVySFRNTCA9IGBcbiAgICAke3Jlc3RhdXJhbnQubmFtZX1cbiAgICBgO1xuXG4gICAgY29uc3QgZmF2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGlzRmF2ID0gcmVzdGF1cmFudC5pc19mYXZvcml0ZTtcblxuICAgIGlmIChpc0ZhdiA9PT0gJ3RydWUnKSB7XG4gICAgICAgIGZhdi5jbGFzc0xpc3QuYWRkKCd5ZXMtZmF2Jyk7XG4gICAgICAgIGZhdi5jbGFzc0xpc3QucmVtb3ZlKCduby1mYXYnKTtcbiAgICAgICAgZmF2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdtYXJrZWQgYXMgZmF2b3JpdGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYXYuY2xhc3NMaXN0LmFkZCgnbm8tZmF2Jyk7XG4gICAgICAgIGZhdi5jbGFzc0xpc3QucmVtb3ZlKCd5ZXMtZmF2Jyk7XG4gICAgICAgIGZhdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIG5vIGZhdm9yaXRlJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRvZ2dsZUZhdigpIHtcbiAgICAgICAgaWYgKGZhdi5jbGFzc05hbWUgPT09ICduby1mYXYnKSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jlc3RhdXJhbnRzLyR7aWR9Lz9pc19mYXZvcml0ZT10cnVlYDtcbiAgICAgICAgICAgIGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcikpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gY29uc29sZS5sb2coJ1N1Y2Nlc3M6JywgcmVzcG9uc2UpKTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlcGxhY2UoJ25vLWZhdicsICd5ZXMtZmF2Jyk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnbWFya2VkIGFzIGZhdm9yaXRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jlc3RhdXJhbnRzLyR7aWR9Lz9pc19mYXZvcml0ZT1mYWxzZWA7XG4gICAgICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGNvbnNvbGUubG9nKCdTdWNjZXNzOicsIHJlc3BvbnNlKSk7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZXBsYWNlKCd5ZXMtZmF2JywgJ25vLWZhdicpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ21hcmtlZCBhcyBubyBmYXZvcml0ZScpO1xuICAgICAgICB9XG5cblxuICAgIH1cbiAgICBmYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVGYXYpO1xuXG4gICAgbmFtZS5hcHBlbmRDaGlsZChmYXYpO1xuICAgIGNvbnN0IHBpY3R1cmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhdXJhbnQtcGljdHVyZVwiKTtcbiAgICBjb25zdCBzcmNzZXRNb2JpbGUgPSBgaW1hZ2VzLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS1tb2JpbGUud2VicGA7XG4gICAgY29uc3Qgc3Jjc2V0VGFibGV0ID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tdGFibGV0LndlYnBgO1xuICAgIGNvbnN0IHNyY3NldERlc2t0b3AgPSBgaW1hZ2VzLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS1kZXNrdG9wLndlYnBgO1xuICAgIGNvbnN0IHNyY3NldEZhbGxiYWNrID0gYGltYWdlcy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0tZGVza3RvcC5qcGdgO1xuXG4gICAgcGljdHVyZS5pbm5lckhUTUwgPSBgXG4gICAgXG4gIDxzb3VyY2UgbWVkaWE9XCIobWluLXdpZHRoOiA3MjhweClcIiBzcmNzZXQ9XCIke3NyY3NldERlc2t0b3B9XCIgdHlwZT1cImltYWdlL3dlYnBcIj5cbiAgPHNvdXJjZSBtZWRpYT1cIihtYXgtd2lkdGg6IDcyN3B4KVwiIHNyY3NldD1cIiR7c3Jjc2V0TW9iaWxlfVwiIHR5cGU9XCJpbWFnZS93ZWJwXCI+XG4gIDxzb3VyY2UgIHNyY3NldD1cIiR7c3Jjc2V0RmFsbGJhY2t9XCIgdHlwZT1cImltYWdlL2pwZWdcIj5cbiAgPGltZyBzcmM9XCIke3NyY3NldEZhbGxiYWNrfVwiIGNsYXNzPVwicmVzdGF1cmFudC1pbWdcIiBhbHQ9XCIke3Jlc3RhdXJhbnQubmFtZX0gJHtyZXN0YXVyYW50LmN1aXNpbmVfdHlwZX0gZm9vZCByZXN0YXVyYW50IE5ldyBZb3JrIENpdHlcIj5cbiAgICBgO1xuICAgIGNvbnN0IGN1aXNpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhdXJhbnQtY3Vpc2luZVwiKTtcbiAgICBjdWlzaW5lLmlubmVySFRNTCA9IGBcbiR7cmVzdGF1cmFudC5jdWlzaW5lX3R5cGV9XG5gO1xuICAgIGNvbnN0IGFkZHJlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhdXJhbnQtYWRkcmVzc1wiKTtcbiAgICBhZGRyZXNzLmlubmVySFRNTCA9IGAgQWRkcmVzczogJHtyZXN0YXVyYW50LmFkZHJlc3N9XG4gICAgYDtcbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdGF1cmFudC1ob3Vyc1wiKTtcbiAgICBjb25zdCBvaCA9IHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmtleXMob2gpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgIHJldHVybiB7IGRheTogKGtleSksIGhvdXJzOiBvaFtrZXldIH07XG4gICAgfSk7XG5cbiAgICBjb25zdCB0aGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICB0aGVhZC5pbm5lckhUTUwgPSBgPHRyPjx0aCBjbGFzcz1cIndoaXRlLXRleHRcIj5PcGVuaW5nIEhvdXJzPC90aD48L3RyPmA7XG4gICAgdGFibGUuYXBwZW5kQ2hpbGQodGhlYWQpXG4gICAgcmVzdWx0Lm1hcChjZWxsID0+IHtcblxuICAgICAgICBjb25zdCB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICAgICAgdHIuaW5uZXJIVE1MID0gYFxuICAgIDx0ZD4ke2NlbGwuZGF5fTwvdGQ+XG4gICAgPHRkPiR7Y2VsbC5ob3Vyc308L3RkPlxuICAgIFxuICAgIGBcblxuICAgICAgICB0YWJsZS5hcHBlbmRDaGlsZCh0cilcblxuICAgIH0pXG5cblxuXG59O1xuY29uc3Qgc2hvd1Jldmlld3MgPSAocmV2aWV3czogYW55KSA9PiB7XG5cbiAgICBjb25zdCByZXZpZXdzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV2aWV3cy1saXN0XCIpO1xuXG4gICAgcmV2aWV3cy5tYXAoKHJldmlldzogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICBsaS5pbm5lckhUTUwgPSBgXG5cbiAgICAgICAgPHA+PHN0cm9uZz5BdXRob3I8L3N0cm9uZz46ICR7cmV2aWV3Lm5hbWV9IDxzcGFuIGNsYXNzPVwibGVmdFwiPjxzdHJvbmc+ICAgICAgICBSYXRpbmc8L3N0cm9uZz46ICR7cmV2aWV3LnJhdGluZ30gIDwvc3Bhbj4gPC9wPlxuICAgICAgICA8cD4ke3Jldmlldy5jb21tZW50c308L3A+XG5gXG4gICAgICAgIHJldmlld3NMaXN0LmFwcGVuZENoaWxkKGxpKTtcblxuICAgIH0pXG5cblxufTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXctZm9ybScpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50KSA9PiB7XG4gICAgY29uc29sZS5sb2coKDxIVE1MSW5wdXRFbGVtZW50PmV2ZW50LnRhcmdldCkudmFsdWUpXG59KVxuY29uc3QgYWRkUmV2aWV3ID0gKGU6IGFueSkgPT4ge1xuICAgIGxldCBuYW1lID0gKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXctYXV0aG9yJykpLnZhbHVlO1xuICAgIGxldCByYXRpbmcgPSAoPEhUTUxTZWxlY3RFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYXRpbmdfc2VsZWN0JykpLnZhbHVlO1xuICAgIGxldCBjb21tZW50cyA9ICg8SFRNTFRleHRBcmVhRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3LWNvbW1lbnRzJykpLnZhbHVlO1xuICAgIGNvbnN0IHVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jldmlld3NcIjtcbiAgICBjb25zdCBORVdfUkVWSUVXID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgXCJyZXN0YXVyYW50X2lkXCI6IGlkLFxuICAgICAgICAgICAgXCJuYW1lXCI6IG5hbWUsXG4gICAgICAgICAgICBcInJhdGluZ1wiOiByYXRpbmcsXG4gICAgICAgICAgICBcImNvbW1lbnRzXCI6IGNvbW1lbnRzXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpO1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gY29uc29sZS5sb2coJ1N1Y2Nlc3M6JywganNvbik7XG4gICAgICAgIHJldHVybiBzdWNjZXNzO1xuICAgIH1cbiAgICBORVdfUkVWSUVXKCkuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpKVxuICAgIGFsZXJ0KFwiUmV2aWV3IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5IVwiKTtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG59XG5cblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXctZm9ybScpXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgYWRkUmV2aWV3KGUpXG5cbn0pIl19
