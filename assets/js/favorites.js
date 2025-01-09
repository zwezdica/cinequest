document.addEventListener("DOMContentLoaded", function () {
  const favoritesContainer = document.getElementById("favorites-container");
  const movieModal = document.getElementById("movie-modal");
  const modalDetails = document.getElementById("modal-details");
  const closeModalBtn = document.querySelector(".close-btn");

  // Učitaj podatke iz localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Funkcija za prikazivanje omiljenih filmova
  function displayFavorites() {
    favoritesContainer.innerHTML = ""; // Očisti prethodni sadržaj

    if (favorites.length === 0) {
      favoritesContainer.innerHTML = "<p>No favorite movies found.</p>";
    } else {
      favorites.forEach((item) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.dataset.movieId = item.id;
        movieCard.innerHTML = `
          <h3>${item.title || item.name}</h3>
          <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${
          item.title || item.name
        }">
          <button class="heart-button">&#10084;</button>
        `;
        favoritesContainer.appendChild(movieCard);

        // Klik na karticu otvara modal
        movieCard.addEventListener("click", function () {
          showMovieDetails(item);
        });

        // Heart button funkcionalnost
        const heartButton = movieCard.querySelector(".heart-button");

        // Provera da li je film već u omiljenim
        if (favorites.some((fav) => fav.id === item.id)) {
          heartButton.classList.add("favorited");
        } else {
          heartButton.classList.remove("favorited");
        }

        heartButton.addEventListener("click", function (event) {
          event.stopPropagation(); // Sprečavanje da se klik na srce pokrene klik na film

          // Dodavanje/uklanjanje iz omiljenih
          if (heartButton.classList.contains("favorited")) {
            heartButton.classList.remove("favorited");
            // Uklanjanje filma iz liste
            favorites = favorites.filter((movie) => movie.id !== item.id);
            movieCard.remove(); // Uklanjanje iz DOM-a
          } else {
            heartButton.classList.add("favorited");
            // Proveravamo da li film već postoji u omiljenima
            if (!favorites.some((fav) => fav.id === item.id)) {
              favorites.push(item); // Dodaj film u omiljene
            }
          }

          // Ažuriraj localStorage sa novom listom
          localStorage.setItem("favorites", JSON.stringify(favorites));
        });
      });
    }
  }

  // Funkcija za dodavanje više filmova u omiljene
  function addMultipleMoviesToFavorites(movies) {
    movies.forEach((movie) => {
      if (!favorites.some((fav) => fav.id === movie.id)) {
        favorites.push(movie); // Dodaj film u omiljene
      }
    });

    // Ažuriraj localStorage sa novom listom
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites(); // Ponovo prikaži omiljene filmove
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
    movieModal.style.display = "block"; // Prikazivanje modala
  }

  // Funkcija za zatvaranje modala
  closeModalBtn.addEventListener("click", function () {
    movieModal.style.display = "none"; // Sakrivanje modala
  });

  // Klik na bilo koji prostor van modala zatvara modal
  window.addEventListener("click", function (event) {
    if (event.target === movieModal) {
      movieModal.style.display = "none";
    }
  });

  // Prikazivanje omiljenih filmova prilikom učitavanja stranice
  displayFavorites();

  // Pozivanje funkcije za dodavanje više filmova u omiljene
  addMultipleMoviesToFavorites();
});
