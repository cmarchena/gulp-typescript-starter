/**
 * Common database helper functions.
 */

// export default
export default class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 3001; // Change this to your server port
    return "http://localhost:1337/restaurants";
  }

  /* public static fetchRestaurants(callback: any) {
    fetch(`${DBHelper.DATABASE_URL}/restaurants`)
      .then((res) => {
        if (res.ok) {
          res.json().then(getRestaurants);

        } else {
          const error = (`There is an an error: ${res.status}`);
          callback(error, null);
        }
      })
      .catch((e) => requestError(e));

    function requestError(e: any) {
      console.log(e);
    }

    function getRestaurants(data: any) {
      const restaurants = data;
      callback(null, restaurants);
    }
  } */
  public static fetchRestaurants(callback: any) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", DBHelper.DATABASE_URL);

    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        // =================== Original Code==========
        // const json = JSON.parse(xhr.responseText);
        // const restaurants = json.restaurants; */
        // ===================Note for reviewer===========================
        /* Originally the app fetched data from restaurants.json which has only one property ("restaurants") with an array of objects as value. On the other hand, the api endpoint http://localhost:1337/restaurants instead returns an array of objects. There is no "restaurants" property, then json.restaurants does not exists. It's possible then to define restaurants constant in just one step   */
        const restaurants = JSON.parse(xhr.responseText);
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  public static fetchRestaurantById(id: number, callback: any) {

    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error: any, restaurants: any) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find((r: any) => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
          console.log("ok", restaurant);
        } else { // Restaurant does not exist in the database
          callback("Restaurant does not exist", null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  public static fetchRestaurantByCuisine(cuisine: string, callback: any) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error: any, restaurants: any) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter((r: any) => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  public static fetchRestaurantByNeighborhood(neighborhood: any, callback: any) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error: any, restaurants: any) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter((r: any) => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  public static fetchRestaurantByCuisineAndNeighborhood(cuisine: any, neighborhood: any, callback: any) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error: any, restaurants: any) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != "all") { // filter by cuisine
          results = results.filter((r: any) => r.cuisine_type == cuisine);
        }
        if (neighborhood != "all") { // filter by neighborhood
          results = results.filter((r: any) => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  public static fetchNeighborhoods(callback: any) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error: any, restaurants: any) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v: any, i: any) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v: any, i: any) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  public static fetchCuisines(callback: any) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error: any, restaurants: any) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v: any, i: any) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v: any, i: any) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  public static urlForRestaurant(restaurant: any) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */

  public static imageUrlForRestaurantMobile(restaurant: any) {
    return (`assets/img/${restaurant.photograph}-mobile.webp`);
  }

  public static imageUrlForRestaurantTablet(restaurant: any) {
    return (`assets/img/${restaurant.photograph}-tablet.webp`);
  }

  public static imageUrlForRestaurantDesktop(restaurant: any) {
    return (`assets/img/${restaurant.photograph}-desktop.webp`);
  }

  public static imageUrlForRestaurantFallback(restaurant: any) {
    return (`assets/img/${restaurant.photograph}-tablet.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  public static mapMarkerForRestaurant(restaurant: any, map: any) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map,
      animation: google.maps.Animation.DROP,
    });
    return marker;
  }

}
