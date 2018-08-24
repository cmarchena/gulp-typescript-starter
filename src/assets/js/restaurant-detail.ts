
import DBHelper from './dbhelper';
import map from './map';

import { Restaurant, Window } from './interfaces';

const url = window.location.href.split("=");
const id = parseInt(url[1]);


document.addEventListener("DOMContentLoaded", (event) => {
    if (document.title === "Restaurant Info") {
        return restaurantDetailsPage(id)
    }
});

const restDetail = (id: number) => {
    return DBHelper.readRestaurantById(id).then((restaurant: Restaurant) => {
        const locations = [];
        locations.push(restaurant.latlng)
        map(locations);
        const form = document.getElementById("review-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            addReview(e);

        })

        const breadcrumbs = document.getElementById("breadcrumb-ul");
        breadcrumbs.innerHTML = `
        <li>
                  <a href="/">Home</a> / ${restaurant.name}
                </li>
        `;
        const name = document.getElementById("restaurant-name");
        name.innerHTML = `
        ${restaurant.name}
        `;

        const fav = document.createElement('span');
        const isFav = restaurant.is_favorite;

        if (isFav === 'true') {
            fav.classList.add('yes-fav');
            fav.classList.remove('no-fav');
            fav.setAttribute('aria-label', 'marked as favorite');
        } else {
            fav.classList.add('no-fav');
            fav.classList.remove('yes-fav');
            fav.setAttribute('aria-label', 'marked as no favorite');
        }
        function toggleFav() {
            if (fav.className === 'no-fav') {
                const url = `${DBHelper.DATABASE_URL()}/restaurants/${restaurant.id}/?is_favorite=true`;
                fetch(url, {
                    method: 'PUT',
                    mode: 'cors'
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => console.log('Success:', response, url));
                this.classList.replace('no-fav', 'yes-fav');
                this.removeAttribute('aria-label');
                this.setAttribute('aria-label', 'marked as favorite');
            } else {
                const url = `${DBHelper.DATABASE_URL()}/restaurants/${restaurant.id}/?is_favorite=false`;
                fetch(url, {
                    method: 'PUT',
                    mode: 'cors'
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => console.log('Success:', response, url));
                this.classList.replace('yes-fav', 'no-fav');
                this.removeAttribute('aria-label');
                this.setAttribute('aria-label', 'marked as no favorite');
            }


        }
        fav.addEventListener('click', toggleFav);

        name.appendChild(fav);
        const picture = document.getElementById("restaurant-picture");
        const srcsetMobile = `images/${restaurant.photograph}-mobile.webp`;
        const srcsetTablet = `images/${restaurant.photograph}-tablet.webp`;
        const srcsetDesktop = `images/${restaurant.photograph}-desktop.webp`;
        const srcsetFallback = `images/${restaurant.photograph}-desktop.jpg`;

        picture.innerHTML = `
    
      <source media="(min-width: 728px)" srcset="${srcsetDesktop}" type="image/webp">
      <source media="(max-width: 727px)" srcset="${srcsetMobile}" type="image/webp">
      <source  srcset="${srcsetFallback}" type="image/jpeg">
      <img src="${srcsetFallback}" class="restaurant-img" alt="${restaurant.name} ${restaurant.cuisine_type} food restaurant New York City">
        `;
        const cuisine = document.getElementById("restaurant-cuisine");
        cuisine.innerHTML = `
    ${restaurant.cuisine_type}
    `;
        const address = document.getElementById("restaurant-address");
        address.innerHTML = ` Address: ${restaurant.address}
        `;
        const table = document.getElementById("restaurant-hours");
        const oh = restaurant.operating_hours;

        const result = Object.keys(oh).map((key: any) => {
            return { day: (key), hours: oh[key] };
        });

        const thead = document.createElement("tr");
        thead.innerHTML = `<tr><th class="white-text">Opening Hours</th></tr>`;
        table.appendChild(thead);
        result.map((cell) => {

            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${cell.day}</td>
        <td>${cell.hours}</td>
    
        `;

            table.appendChild(tr);

        });
    })
}
const showReviews = (id: number) => {
    return DBHelper.getReviewById(id).then(reviews => {
        document.getElementById("review-form").addEventListener("input", (event) => {
            console.log((event.target as HTMLInputElement).value);
        });

        const reviewsList = document.getElementById("reviews-list");

        reviews
            // .filter((filteredReview) => filteredReview.restaurant_id === id)
            .reverse()
            .map((review: any) => {
                const li = document.createElement("li");
                li.innerHTML = `

        <p><strong>Author</strong>: ${review.name} <span class="left"><strong>        Rating</strong>: ${review.rating}  </span> </p>
        <p>${review.comments}</p>
`;
                reviewsList.appendChild(li);

            });
    })

};

const addReview = (e: any) => {

    const name = (document.getElementById("review-author") as HTMLInputElement).value;
    const rating = (document.getElementById("rating_select") as HTMLSelectElement).value;
    const comments = (document.getElementById("review-comments") as HTMLTextAreaElement).value;


    const data = {
        restaurant_id: id,
        name: name,
        rating: rating,
        comments: comments,
    };
    DBHelper.NEW_REVIEW(data)


};
const restaurantDetailsPage = (id: number) => {
    restDetail(id);

    showReviews(id);



};