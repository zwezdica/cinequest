document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "5df76076ebfb77b9c2c3b58c751c1772"; // API Key from TheMovieDB
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const filterSelect = document.getElementById("filter-select");

  // Handle search button click
  searchButton.addEventListener("click", function () {
    const searchQuery = searchInput.value;
    const filter = filterSelect.value;

    // Redirect to results page with search query and filter type
    window.location.href = `results.html?query=${searchQuery}&filter=${filter}`;
  });
});
