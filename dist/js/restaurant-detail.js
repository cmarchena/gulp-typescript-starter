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
