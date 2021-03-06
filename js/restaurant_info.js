let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
      google.maps.event.addListener(this.map, 'ariaInvisible', ()=> {
        const firstDiv = document.querySelector('.gm-style').firstElementChild;
        firstDiv.setAttribute('aria-hidden', 'true');
        firstDiv.setAttribute('tabIndex', '-1');
      });
      google.maps.event.addListener(this.map, 'iframeInvisible', ()=> {
        const firstFrame = document.querySelector('iframe');
        firstFrame.setAttribute('tabIndex', '-1');
      });
    }
  });
}


/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.tabIndex = 0;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.tabIndex = 0;

  const picture = document.getElementById('restaurant-img-container');

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

  /*420px image width*/
  const imageD = document.createElement('source');
  imageD.media = '(min-width:1024px) and (max-width:1366px)'
  imageD.srcset = DBHelper.imageUrlForRestaurantD(restaurant);
  picture.append(imageD);

  /* Fallback image */
  const defaultImage = document.createElement('img');
  defaultImage.className = 'restaurant-img';
  defaultImage.src = DBHelper.imageUrlForRestaurant(restaurant);
  defaultImage.alt = 'Restaurant ' + restaurant.name + ' image';
  defaultImage.tabIndex = "0";
  picture.append(defaultImage);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.tabIndex = 0;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.tabIndex = 0;
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.tabIndex = 0;
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.tabIndex = 0;
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.tabIndex = 0;
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.tabIndex = 0;
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.tabIndex = 0;
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.tabIndex = 0;
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
