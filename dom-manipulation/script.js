const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const importFileInput = document.getElementById("importFile");
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const syncStatus = document.getElementById("syncStatus");


// Load quotes from localStorage OR fallback to default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is poetry.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" },
  { text: "First, solve the problem. Then, write the code.", category: "Development" }
];

// Save quotes to localStorage
function localStorage.setItem() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display random quote (ALX-required name)
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = quote.text;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `— ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  // Optional: sessionStorage example (last viewed quote)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add new quote (ALX logic requirement)
function createAddQuoteForm() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  showRandomQuote();
}

// Export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");

/* ---------- Storage Helpers ---------- */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

function loadSelectedCategory() {
  return localStorage.getItem("selectedCategory") || "all";
}

/* ---------- Quotes Data ---------- */
let quotes = [
  { text: "Code is poetry.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" },
  { text: "First, solve the problem. Then, write the code.", category: "Development" }
];

loadQuotes();

/* ---------- Populate Categories ---------- */
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent =
      category === "all" ? "All Categories" : category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = loadSelectedCategory();
}

/* ---------- Display Quote ---------- */
function showRandomQuote(filteredQuotes = quotes) {
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = quote.text;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `– ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

/* ---------- Filter Logic ---------- */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveSelectedCategory(selectedCategory);

  if (selectedCategory === "all") {
    showRandomQuote(quotes);
  } else {
    const filtered = quotes.filter(
      q => q.category === selectedCategory
    );
    showRandomQuote(filtered);
  }
}

/* ---------- Add Quote ---------- */
function createAddQuoteForm() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  filterQuotes();
}

/* ---------- Event Listeners ---------- */
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);

/* ---------- Init ---------- */
populateCategories();
filterQuotes();

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Simulate server quotes structure
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Server fetch failed:", error);
    return [];
  }
}
async function postQuotesToServer(quotesData) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotesData)
    });

    console.log("Quotes posted to server");
  } catch (error) {
    console.error("Failed to post quotes:", error);
  }
}

async function syncWithServer() {
  syncStatus.textContent = "Syncing with server...";

  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length > 0) {
    // Server takes precedence
    quotes.length = 0;
    quotes.push(...serverQuotes);

    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuotes();

    // ✅ REQUIRED BY ALX
    syncStatus.textContent = "Quotes synced with server!";
    alert("Quotes synced with server!");
  } else {
    syncStatus.textContent = "No updates from server.";
  }
}



  syncStatus.textContent = "Syncing with server...";

  const serverQuotes = await fetchServerQuotes();

  if (serverQuotes.length > 0) {
    // SERVER TAKES PRECEDENCE
    quotes.length = 0;
    quotes.push(...serverQuotes);

    // Persist update
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    displayRandomQuote();

    syncStatus.textContent = "Data synced. Server version applied.";
  } else {
    syncStatus.textContent = "No updates from server.";
  }
}
setInterval(syncQuotes, 15000);

