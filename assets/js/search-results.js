document.addEventListener("DOMContentLoaded", function () {
  const moviesContainer = document.getElementById("movies-container");
  const movieModal = document.getElementById("movie-modal");
  const modalDetails = document.getElementById("modal-details");
  const closeModalBtn = document.querySelector(".close-btn");
  const backButton = document.getElementById("back-button");
  const searchInput = document.getElementById("search-input");
  const searchResults = JSON.parse(localStorage.getItem("searchResults")) || [];

  // Očisti sadržaj pretrage iz localStorage prilikom učitavanja stranice
  localStorage.removeItem("searchResults");

  // Očisti pretragu u input polju (ako postoji)
  if (searchInput) {
    searchInput.value = "";
  }

  // Ako nema rezultata, prikazi poruku
  if (searchResults.length === 0) {
    moviesContainer.innerHTML = "<p>No results found.</p>";
  } else {
    searchResults.forEach((item) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.dataset.movieId = item.id; // Dodaj ID filma za kasniji rad
      movieCard.innerHTML = `
        <h3>${item.title || item.name}</h3>
        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${
        item.title || item.name
      }">
        <button class="heart-button">&#10084;</button>
      `;
      moviesContainer.appendChild(movieCard);

      // Dodaj event listener za klik na film
      movieCard.addEventListener("click", function () {
        showMovieDetails(item);
      });

      // Heart button funkcionalnost
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const heartButton = movieCard.querySelector(".heart-button");

      if (favorites.some((movie) => movie.id === item.id)) {
        heartButton.classList.add("favorited");
      }

      heartButton.addEventListener("click", function (event) {
        event.stopPropagation();
        if (heartButton.classList.contains("favorited")) {
          heartButton.classList.remove("favorited");
          favorites = favorites.filter((movie) => movie.id !== item.id);
        } else {
          heartButton.classList.add("favorited");
          favorites.push(item);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
      });
    });
  }

  // Funkcija za prikazivanje detalja o filmu u modalnom prozoru
  function showMovieDetails(movie) {
    modalDetails.innerHTML = `
      <h2>${movie.title || movie.name}</h2>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title || movie.name
    }">
      <p><strong>Overview:</strong> ${movie.overview}</p>
      <p><strong>Release Date:</strong> ${
        movie.release_date || movie.first_air_date
      }</p>
    `;
    movieModal.style.display = "block";
  }

  // Funkcija za zatvaranje modala
  closeModalBtn.addEventListener("click", function () {
    movieModal.style.display = "none";
  });

  // Klik na bilo koji prostor van modala zatvara modal
  window.addEventListener("click", function (event) {
    if (event.target === movieModal) {
      movieModal.style.display = "none";
    }
  });

  // Funkcionalnost za dugme "Back to Home"
  backButton.addEventListener("click", function () {
    window.location.href = "index.html";
  });
});
