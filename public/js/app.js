// eslint-disable-next-line prefer-const
let restaurantArray = [];

$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });
});

// Search restaurants by city
$("#searchCityBtn").on("click", e => {
  e.preventDefault();

  const searchCity = $("#restaurantSearchCityInput")
    .val()
    .trim();

  let queryURL =
    "https://thefork.p.rapidapi.com/locations/auto-complete?text=" + searchCity;

  const locationSearch = {
    async: true,
    crossDomain: true,
    url: queryURL,
    method: "GET",
    headers: {
      "x-rapidapi-host": "thefork.p.rapidapi.com",
      "x-rapidapi-key": "e915407c69msh9ee027f59377df5p171a0bjsncb60597ede45"
    }
  };
  $.ajax(locationSearch).done(response => {
    const googlePlaceId = response.data.geolocation[0].id.id;

    queryURL =
      "https://thefork.p.rapidapi.com/locations/list?google_place_id=" +
      googlePlaceId;

    const cityIdSearch = {
      async: true,
      crossDomain: true,
      url: queryURL,
      method: "GET",
      headers: {
        "x-rapidapi-host": "thefork.p.rapidapi.com",
        "x-rapidapi-key": "e915407c69msh9ee027f59377df5p171a0bjsncb60597ede45"
      }
    };

    $.ajax(cityIdSearch).done(response => {
      const cityId = response.id_city;
      //const lat = response.coordinates.latitude;
      //const long = response.coordinates.longitude;

      queryURL =
        "https://thefork.p.rapidapi.com/restaurants/list?queryPlaceValueCityId=" +
        cityId;

      const finalRestSearch = {
        async: true,
        crossDomain: true,
        url: queryURL,
        method: "GET",
        headers: {
          "x-rapidapi-host": "thefork.p.rapidapi.com",
          "x-rapidapi-key": "e915407c69msh9ee027f59377df5p171a0bjsncb60597ede45"
        }
      };
      $.ajax(finalRestSearch).done(response => {
        let i;
        //console.log(response);
        for (i = 0; i <= 9; i++) {
          const restObject = {
            name: response.data[i].name,
            id: response.data[i].id,
            cuisine: response.data[i].servesCuisine,
            photo: response.data[i].mainPhoto[0]
          };

          restaurantArray[i] = restObject;
        }
        console.log(restaurantArray);
      });
    });
  });

  //Search any restaurant by name (EU)
  $("#searchNameBtn").on("click", e => {
    e.preventDefault();

    const searchName = $("#restaurantSearchNameInput")
      .val()
      .trim();

    const queryURL =
      "https://thefork.p.rapidapi.com/restaurants/auto-complete?text=" +
      searchName;

    const restNameSearch = {
      async: true,
      crossDomain: true,
      url: queryURL,
      method: "GET",
      headers: {
        "x-rapidapi-host": "thefork.p.rapidapi.com",
        "x-rapidapi-key": "e915407c69msh9ee027f59377df5p171a0bjsncb60597ede45"
      }
    };

    $.ajax(restNameSearch).done(response => {
      const searchRestId = response.data.autocomplete[0].id;

      const searchRestIdInfo = {
        async: true,
        crossDomain: true,
        url:
          "https://thefork.p.rapidapi.com/restaurants/get-info?locale=en_US&id_restaurant=" +
          searchRestId,
        method: "GET",
        headers: {
          "x-rapidapi-host": "thefork.p.rapidapi.com",
          "x-rapidapi-key": "e915407c69msh9ee027f59377df5p171a0bjsncb60597ede45"
        }
      };

      $.ajax(searchRestIdInfo).done(response => {
        console.log(response.data);
      });
    });
  });
});
