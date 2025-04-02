// Hamburger menu functionality
const navbarNav = document.querySelector(".navbar-nav");
const hamburgerMenu = document.querySelector("#hamburger-menu");

// Ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = (e) => {
  e.preventDefault();
  navbarNav.classList.toggle("active");
};

// Klik di luar sidebar untuk menutup menu
document.addEventListener("click", function (e) {
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// Search Functionality (Enhanced)
const searchIcon = document.querySelector("#search");
const searchContainer = document.querySelector(".search-container");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const menuSection = document.querySelector("#menu");
const menuCards = document.querySelectorAll(".menu-card");
const menuRow = document.querySelector("#menu .row");

// Toggle search box
searchIcon.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  searchContainer.classList.toggle("active");

  // Auto-focus when opened
  if (searchContainer.classList.contains("active")) {
    searchInput.focus();
  } else {
    resetSearch();
  }
});

// Real-time search as typing
searchInput.addEventListener("input", performSearch);

// Search when button clicked
searchButton.addEventListener("click", performSearch);

// Search when Enter key is pressed
searchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    performSearch();
    // Scroll to menu section if there are results
    const visibleCards = document.querySelectorAll(
      ".menu-card[style='display: block;']"
    );
    if (visibleCards.length > 0 && searchInput.value.trim() !== "") {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  }
});

// Close when clicking outside
document.addEventListener("click", function (e) {
  if (!searchIcon.contains(e.target) && !searchContainer.contains(e.target)) {
    searchContainer.classList.remove("active");
  }
});

// Cegah penutupan saat mengklik di dalam search container
searchContainer.addEventListener("click", function (e) {
  e.stopPropagation();
});

// Enhanced search function
function performSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  let hasResults = false;

  // If search is empty, show all cards
  if (searchTerm === "") {
    resetSearch();
    return;
  }

  // Add a results counter at the top of menu section
  let resultsCounter = document.querySelector(".search-results-counter");
  if (!resultsCounter) {
    resultsCounter = document.createElement("p");
    resultsCounter.className = "search-results-counter";
    menuSection.insertBefore(resultsCounter, menuRow);
  }

  // Count visible items
  let visibleCount = 0;

  menuCards.forEach((card) => {
    const title = card
      .querySelector(".menu-card-title")
      .textContent.toLowerCase();
    const price = card
      .querySelector(".menu-card-price")
      .textContent.toLowerCase();

    const isMatch = title.includes(searchTerm) || price.includes(searchTerm);

    // Apply highlight if match found
    const titleElement = card.querySelector(".menu-card-title");
    const priceElement = card.querySelector(".menu-card-price");

    // Remove any previous highlights
    titleElement.innerHTML = titleElement.textContent;
    priceElement.innerHTML = priceElement.textContent;

    // Apply new highlights if there's a match
    if (isMatch) {
      visibleCount++;
      hasResults = true;

      // Add highlight to title if it contains the search term
      if (title.includes(searchTerm)) {
        const highlightedTitle = titleElement.textContent.replace(
          new RegExp(searchTerm, "gi"),
          (match) => `<span class="highlight">${match}</span>`
        );
        titleElement.innerHTML = highlightedTitle;
      }

      // Add highlight to price if it contains the search term
      if (price.includes(searchTerm)) {
        const highlightedPrice = priceElement.textContent.replace(
          new RegExp(searchTerm, "gi"),
          (match) => `<span class="highlight">${match}</span>`
        );
        priceElement.innerHTML = highlightedPrice;
      }
    }

    // Show or hide the card
    card.style.display = isMatch ? "block" : "none";
  });

  // Update results counter
  resultsCounter.textContent = hasResults
    ? `Ditemukan ${visibleCount} menu dengan kata kunci "${searchTerm}"`
    : `Tidak ada menu yang cocok dengan kata kunci "${searchTerm}"`;

  // Add a "no results" message if nothing found
  let noResultsMsg = document.querySelector(".no-results-message");
  if (!hasResults) {
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.className = "no-results-message";
      noResultsMsg.innerHTML = `
        <p>Tidak ada menu yang cocok dengan pencarian Anda.</p>
        <button class="reset-search-btn">Tampilkan Semua Menu</button>
      `;
      menuRow.appendChild(noResultsMsg);

      // Add event listener to the reset button
      document
        .querySelector(".reset-search-btn")
        .addEventListener("click", function () {
          resetSearch();
          searchInput.value = "";
        });
    }
  } else if (noResultsMsg) {
    noResultsMsg.remove();
  }

  // If there are results, scroll to menu section
  if (
    hasResults &&
    searchInput.value.trim() !== "" &&
    !searchContainer.classList.contains("active")
  ) {
    menuSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Reset search
function resetSearch() {
  // Remove results counter
  const resultsCounter = document.querySelector(".search-results-counter");
  if (resultsCounter) {
    resultsCounter.remove();
  }

  // Remove "no results" message
  const noResultsMsg = document.querySelector(".no-results-message");
  if (noResultsMsg) {
    noResultsMsg.remove();
  }

  // Restore all cards and remove highlights
  menuCards.forEach((card) => {
    card.style.display = "block";

    // Remove highlights
    const titleElement = card.querySelector(".menu-card-title");
    const priceElement = card.querySelector(".menu-card-price");

    titleElement.innerHTML = titleElement.textContent;
    priceElement.innerHTML = priceElement.textContent;
  });
}
