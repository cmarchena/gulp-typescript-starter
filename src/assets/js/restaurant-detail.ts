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
const url = window.location.href.split("=");
const id = url[1];
const requestRestaurant = async () => {
    const res = await fetch(`http://localhost:1337/restaurants/${id}`);
    const data = await res.json();
    const restaurant = restaurantDetailsPage(data);
    console.log(restaurant)
    return restaurant;
};
const requestReviews = async () => {
    const res = await fetch(`http://localhost:1337/reviews?restaurant_id=${id}`);
    const data = await res.json();
    const reviews = showReviews(data);
    console.log(reviews)
    return reviews;
};
document.addEventListener('DOMContentLoaded', (event) => {
    requestRestaurant();
    requestReviews();
});
(<any>window).initMap = () => {
    const loc = {
        lat: 40.722216,
        lng: -73.987501,
    };
    (<any>self).map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false,
    });

};


const restaurantDetailsPage = (restaurant: any) => {
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
            const url = `http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=true`;
            fetch(url, {
                method: 'PUT',
            }).then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => console.log('Success:', response, url));
            this.classList.replace('no-fav', 'yes-fav');
            this.removeAttribute('aria-label');
            this.setAttribute('aria-label', 'marked as favorite');
        } else {
            const url = `http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=false`;
            fetch(url, {
                method: 'PUT',
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

    const result = Object.keys(oh).map((key) => {
        return { day: (key), hours: oh[key] };
    });

    const thead = document.createElement("tr");
    thead.innerHTML = `<tr><th class="white-text">Opening Hours</th></tr>`;
    table.appendChild(thead)
    result.map(cell => {

        const tr = document.createElement("tr");
        tr.innerHTML = `
    <td>${cell.day}</td>
    <td>${cell.hours}</td>
    
    `

        table.appendChild(tr)

    })



};
const showReviews = (reviews: any) => {
    console.log(reviews)
    const reviewsList = document.getElementById("reviews-list");

    reviews.map((review: any) => {
        const li = document.createElement("li");
        li.innerHTML = `

        <p><strong>Author</strong>: ${review.name} <span class="left"><strong>        Rating</strong>: ${review.rating}  </span> </p>
        <p>${review.comments}</p>
`
        reviewsList.appendChild(li);

    })


};
document.getElementById('review-form').addEventListener('input', (event) => {
    console.log((<HTMLInputElement>event.target).value)
})
const addReview = (e: any) => {
    let name = (<HTMLInputElement>document.getElementById('review-author')).value;
    let rating = (<HTMLSelectElement>document.getElementById('rating_select')).value;
    let comments = (<HTMLTextAreaElement>document.getElementById('review-comments')).value;
    const url = "http://localhost:1337/reviews";
    const NEW_REVIEW = async () => {
        const data = {
            "restaurant_id": id,
            "name": name,
            "rating": rating,
            "comments": comments
        }
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await res.json();
        const success = console.log('Success:', json);
        return success;
    }
    NEW_REVIEW().catch(error => console.error('Error:', error))
    alert("Review created successfully!");
    window.location.reload();
}


const form = document.getElementById('review-form')
form.addEventListener("submit", (e) => {
    e.preventDefault();
    addReview(e)

})