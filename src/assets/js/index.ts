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
const requestRestaurants = async () => {
    let res = await fetch("http://localhost:1337/restaurants");
    if (res.status == 200) {
        let data = await res.json();
        const restaurants = homePage(data);
        return restaurants;
    }
    throw new Error(`${res.status}`)

};
const errorMessage = (e: any) => {
    const ul = document.getElementById("restaurants-list");

    let htmlContent = `
    <p class="error">There is no connection with the server. Try again later</p>
    `;
    ul.insertAdjacentHTML('beforebegin', htmlContent)

}
document.addEventListener('DOMContentLoaded', (event) => {
    requestRestaurants().catch(e => errorMessage(e))

});

/* TODO: add reviews
const requestReviews = async () => {
    const res = await fetch('http://localhost:1337/reviews')
    const data = await res.json()
    console.log(data)
}
requestReviews(); */

const homePage = (restaurants: any) => {

    const ul = document.getElementById("restaurants-list");

    restaurants.map((restaurant: any) => {

        const srcsetMobile = `images/${restaurant.photograph}-mobile.webp`;
        const srcsetTablet = `images/${restaurant.photograph}-tablet.webp`;
        const srcsetDesktop = `images/${restaurant.photograph}-desktop.webp`;
        const srcsetFallback = `images/${restaurant.photograph}-tablet.jpg`;
        const li = document.createElement("li");
        li.className = "card";
        li.innerHTML = `


        <source media="(min-width: 1024px)" srcset="${srcsetDesktop}" type="image/webp">
  <source media="(min-width: 728px)" srcset="${srcsetTablet}" type="image/webp">
  <source media="(max-width: 727px)" srcset="${srcsetMobile}" type="image/webp">
  <source  srcset="${srcsetFallback}" type="image/jpeg">
  <img src="${srcsetFallback}" class="restaurant-img" alt="${restaurant.name} ${restaurant.cuisine_type} food restaurant New York City">
        <h3>${restaurant.name}</h3>
        <p>${restaurant.neighborhood}</p>
        <p>${restaurant.address}</p>
        <a href="/restaurant.html?id=${restaurant.id}">View Details</a>
        `;
        ul.appendChild(li);
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
                    .then(response => console.log('Success:', response));
                this.classList.replace('no-fav', 'yes-fav');
                this.removeAttribute('aria-label');
                this.setAttribute('aria-label', 'marked as favorite');
            } else {
                const url = `http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=false`;
                fetch(url, {
                    method: 'PUT',
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => console.log('Success:', response));
                this.classList.replace('yes-fav', 'no-fav');
                this.removeAttribute('aria-label');
                this.setAttribute('aria-label', 'marked as no favorite');
            }


        }
        fav.addEventListener('click', toggleFav);

        li.appendChild(fav);
    });

};
