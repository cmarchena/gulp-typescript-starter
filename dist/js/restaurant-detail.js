"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbhelper_1 = require("./dbhelper");
var map_1 = require("./map");
var url = window.location.href.split("=");
var id = parseInt(url[1]);
document.addEventListener("DOMContentLoaded", function (event) {
    if (document.title === "Restaurant Info") {
        return restaurantDetailsPage(id);
    }
});
var restDetail = function (id) {
    return dbhelper_1.default.readRestaurantById(id).then(function (restaurant) {
        var locations = [];
        locations.push(restaurant.latlng);
        map_1.default(locations);
        var form = document.getElementById("review-form");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            addReview(e);
        });
        var breadcrumbs = document.getElementById("breadcrumb-ul");
        breadcrumbs.innerHTML = "\n        <li>\n                  <a href=\"/\">Home</a> / " + restaurant.name + "\n                </li>\n        ";
        var name = document.getElementById("restaurant-name");
        name.innerHTML = "\n        " + restaurant.name + "\n        ";
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
                var url_1 = dbhelper_1.default.DATABASE_URL() + "/restaurants/" + restaurant.id + "/?is_favorite=true";
                fetch(url_1, {
                    method: 'PUT',
                    mode: 'cors'
                }).then(function (res) { return res.json(); })
                    .catch(function (error) { return console.error('Error:', error); })
                    .then(function (response) { return console.log('Success:', response, url_1); });
                this.classList.replace('no-fav', 'yes-fav');
                this.removeAttribute('aria-label');
                this.setAttribute('aria-label', 'marked as favorite');
            }
            else {
                var url_2 = dbhelper_1.default.DATABASE_URL() + "/restaurants/" + restaurant.id + "/?is_favorite=false";
                fetch(url_2, {
                    method: 'PUT',
                    mode: 'cors'
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
        picture.innerHTML = "\n    \n      <source media=\"(min-width: 728px)\" srcset=\"" + srcsetDesktop + "\" type=\"image/webp\">\n      <source media=\"(max-width: 727px)\" srcset=\"" + srcsetMobile + "\" type=\"image/webp\">\n      <source  srcset=\"" + srcsetFallback + "\" type=\"image/jpeg\">\n      <img src=\"" + srcsetFallback + "\" class=\"restaurant-img\" alt=\"" + restaurant.name + " " + restaurant.cuisine_type + " food restaurant New York City\">\n        ";
        var cuisine = document.getElementById("restaurant-cuisine");
        cuisine.innerHTML = "\n    " + restaurant.cuisine_type + "\n    ";
        var address = document.getElementById("restaurant-address");
        address.innerHTML = " Address: " + restaurant.address + "\n        ";
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
            tr.innerHTML = "\n        <td>" + cell.day + "</td>\n        <td>" + cell.hours + "</td>\n    \n        ";
            table.appendChild(tr);
        });
    });
};
var showReviews = function (id) {
    return dbhelper_1.default.getReviewById(id).then(function (reviews) {
        document.getElementById("review-form").addEventListener("input", function (event) {
            console.log(event.target.value);
        });
        var reviewsList = document.getElementById("reviews-list");
        reviews
            // .filter((filteredReview) => filteredReview.restaurant_id === id)
            .reverse()
            .map(function (review) {
            var li = document.createElement("li");
            li.innerHTML = "\n\n        <p><strong>Author</strong>: " + review.name + " <span class=\"left\"><strong>        Rating</strong>: " + review.rating + "  </span> </p>\n        <p>" + review.comments + "</p>\n";
            reviewsList.appendChild(li);
        });
    });
};
var addReview = function (e) {
    var name = document.getElementById("review-author").value;
    var rating = document.getElementById("rating_select").value;
    var comments = document.getElementById("review-comments").value;
    var data = {
        restaurant_id: id,
        name: name,
        rating: rating,
        comments: comments,
    };
    dbhelper_1.default.NEW_REVIEW(data);
};
var restaurantDetailsPage = function (id) {
    restDetail(id);
    showReviews(id);
};
