let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  google.maps.event.addListener(this.map, 'ariaInvisible', ()=> {
    const firstDiv = document.querySelector('.gm-style').firstElementChild;
    firstDiv.setAttribute('aria-hidden', 'true');
    firstDiv.setAttribute('tabIndex', '-1');
  });
  google.maps.event.addListener(this.map, 'iframeInvisible', ()=> {
    const firstFrame = document.querySelector('iframe');
    firstFrame.setAttribute('tabIndex', '-1');
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const picture = document.createElement('picture');
  li.append(picture);

  /*300px image width */
  const imageA = document.createElement('source');
  imageA.media = '(min-width:320px) and (max-width:359px)'
  imageA.srcset = DBHelper.imageUrlForRestaurantA(restaurant);
  picture.append(imageA);

  /*330px image width*/
  const imageB = document.createElement('source');
  imageB.media = '(min-width:375px) and (max-width:1023px)'
  imageB.srcset = DBHelper.imageUrlForRestaurantB(restaurant);
  picture.append(imageB);

  // /*360px image width*/
  // const imageC = document.createElement('source');
  // imageC.media = '(min-width:768px) and (max-height:1024px)'
  // imageC.srcset = DBHelper.imageUrlForRestaurantC(restaurant);
  // picture.append(imageC);

  /*420px image width*/
  const imageD = document.createElement('source');
  imageD.media = '(min-width:1024px) and (max-height:1366px)'
  imageD.srcset = DBHelper.imageUrlForRestaurantD(restaurant);
  picture.append(imageD);

  /* Fallback image */
  const defaultImage = document.createElement('img');
  defaultImage.className = 'restaurant-img';
  defaultImage.src = DBHelper.imageUrlForRestaurant(restaurant);
  defaultImage.alt = 'Restaurant ' + restaurant.name + ' image';
  defaultImage.tabIndex = '0';
  picture.append(defaultImage);

  const info = document.createElement('div');
  info.className = 'info-wrapper';
  li.append(info);

  const name = document.createElement('h1');
  name.tabIndex = '0';
  name.innerHTML = restaurant.name;
  info.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.setAttribute('name', 'Neighborhood');
  neighborhood.tabIndex = '0';
  neighborhood.innerHTML = restaurant.neighborhood;
  info.append(neighborhood);

  const address = document.createElement('address');
  address.tabIndex = '0';
  address.innerHTML = restaurant.address;
  info.append(address);

  const more = document.createElement('a');
  more.setAttribute('role', 'button');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  info.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
