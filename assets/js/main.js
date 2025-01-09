document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "5df76076ebfb77b9c2c3b58c751c1772";
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const filterSelect = document.getElementById("filter-select");
  const favoritesCard = document.getElementById("favorites-card");
  const loginButton = document.getElementById("login-button");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const detailsContainer = document.getElementById("details-container");

  // Popuni dropdown sa žanrovima
  fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      const genres = data.genres;
      genres.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        filterSelect.appendChild(option);
      });
    });

  // Funkcija za filtriranje filmova prema žanru
  filterSelect.addEventListener("change", function () {
    const genreId = filterSelect.value;
    if (genreId !== "genre") {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("searchResults", JSON.stringify(data.results));
          window.location.href = "search-results.html";
        });
    }
  });

  // Funkcija za prikazivanje detalja o filmu desno
  function showMovieDetails(movie) {
    detailsContainer.innerHTML = `
      <h2>${movie.title || movie.name}</h2>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title || movie.name
    }">
      <p><strong>Overview:</strong> ${movie.overview}</p>
      <p><strong>Release Date:</strong> ${
        movie.release_date || movie.first_air_date
      }</p>
    `;
  }

  // Pretraga filmova i osoba
  searchButton.addEventListener("click", function () {
    const searchQuery = searchInput.value.trim();

    if (searchQuery) {
      const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        searchQuery
      )}`;
      const personUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(
        searchQuery
      )}`;

      fetch(movieUrl)
        .then((response) => response.json())
        .then((movieData) => {
          const results = movieData.results || [];

          return fetch(personUrl)
            .then((response) => response.json())
            .then((personData) => {
              if (personData.results && personData.results.length > 0) {
                personData.results.forEach((person) => {
                  if (person.known_for) {
                    results.push(...person.known_for);
                  }
                });
              }
              localStorage.setItem("searchResults", JSON.stringify(results));
              window.location.href = "search-results.html";
            });
        })
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    } else {
      alert("Please enter a search query.");
    }
  });

  // Prikazivanje detalja kada se klikne na film
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.addEventListener("click", function (event) {
    if (event.target.closest(".movie-card")) {
      const movieId = event.target.closest(".movie-card").dataset.movieId;
      const movie = JSON.parse(localStorage.getItem("searchResults")).find(
        (movie) => movie.id == movieId
      );
      showMovieDetails(movie); // Prikazivanje detalja o filmu
    }
  });

  // Redirecija to favorites stranu
  favoritesCard.addEventListener("click", function () {
    window.location.href = "favorites.html";
  });

  // Funkcionalnost za login formu
  loginButton.addEventListener("click", function (event) {
    event.preventDefault(); // Sprečava reload stranice
    alert("Uspešno ste ulogovani");

    // Resetovanje input polja
    usernameInput.value = "";
    passwordInput.value = "";
  });
});
