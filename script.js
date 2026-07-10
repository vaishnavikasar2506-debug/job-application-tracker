// =====================================================
// script.js
// Talks to our PHP API (fetch), then handles rendering,
// search, filter, sort, and UI interactions in the browser.
// =====================================================

// ----- Grab references to DOM elements we'll reuse often -----
const applicationList = document.getElementById("applicationList");
const modalOverlay = document.getElementById("modalOverlay");
const applicationForm = document.getElementById("applicationForm");
const modalTitle = document.getElementById("modalTitle");
const addNewBtn = document.getElementById("addNewBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortSelect = document.getElementById("sortSelect");
const themeToggleBtn = document.getElementById("themeToggleBtn");

// This variable holds the full list of applications fetched from the
// server. We keep a "master copy" here and filter/sort it in-memory,
// instead of re-fetching from the server every time the user types.
let allApplications = [];

// Base path to our PHP API folder
const API_BASE = "api";

// =====================================================
// STEP 1: FETCH all applications from the server
// =====================================================
async function fetchApplications() {
  try {
    const response = await fetch(`${API_BASE}/get_applications.php`);
    const result = await response.json();

    if (result.success) {
      allApplications = result.data;
      applyFiltersAndRender();
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    applicationList.innerHTML = `<p>Could not connect to server. Is XAMPP running?</p>`;
  }
}

// =====================================================
// STEP 2: RENDER job cards to the page
// =====================================================
function renderApplications(applications) {
  applicationList.innerHTML = ""; // clear old cards before re-drawing

  if (applications.length === 0) {
    applicationList.innerHTML = `<p>No applications found.</p>`;
    return;
  }

  applications.forEach((app) => {
    const card = document.createElement("div");
    card.className = "job-card";

    // template literal builds the card's inner HTML using the app's data
    card.innerHTML = `
      <button class="favorite-star" data-id="${app.id}">
        ${Number(app.is_favorite) === 1 ? "⭐" : "☆"}
      </button>
      <h3>${app.company_name}</h3>
      <p>${app.job_role}</p>
      <p>Deadline: ${app.deadline ? app.deadline : "—"}</p>
      <span class="status-badge status-${app.status}">${app.status}</span>
      <div class="card-actions">
        <button class="edit-btn" data-id="${app.id}">Edit</button>
        <button class="delete-btn" data-id="${app.id}">Delete</button>
      </div>
    `;

    applicationList.appendChild(card);
  });
}

// =====================================================
// STEP 3: DASHBOARD STATS
// =====================================================
function updateStats(applications) {
  document.getElementById("statTotal").textContent = applications.length;
  document.getElementById("statInterview").textContent =
    applications.filter((a) => a.status === "Interview").length;
  document.getElementById("statOffer").textContent =
    applications.filter((a) => a.status === "Offer").length;
  document.getElementById("statRejected").textContent =
    applications.filter((a) => a.status === "Rejected").length;
}

// =====================================================
// STEP 4: SEARCH + FILTER + SORT (all done client-side
// on the allApplications array we already fetched)
// =====================================================
function applyFiltersAndRender() {
  let result = [...allApplications]; // copy so we don't mutate the master list

  // --- Search by company name ---
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm) {
    result = result.filter((app) =>
      app.company_name.toLowerCase().includes(searchTerm)
    );
  }

  // --- Filter by status ---
  const statusValue = statusFilter.value;
  if (statusValue !== "all") {
    result = result.filter((app) => app.status === statusValue);
  }

  // --- Sort ---
  const sortValue = sortSelect.value;
  if (sortValue === "company") {
    result.sort((a, b) => a.company_name.localeCompare(b.company_name));
  } else if (sortValue === "deadline") {
    result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }

  renderApplications(result);
  updateStats(allApplications); // stats always reflect ALL applications, not filtered view
}

// =====================================================
// STEP 5: MODAL open/close logic
// =====================================================
function openModal(mode, app = null) {
  modalOverlay.classList.add("active");

  if (mode === "add") {
    modalTitle.textContent = "Add Application";
    applicationForm.reset();
    document.getElementById("applicationId").value = "";
  } else if (mode === "edit" && app) {
    modalTitle.textContent = "Edit Application";
    document.getElementById("applicationId").value = app.id;
    document.getElementById("companyName").value = app.company_name;
    document.getElementById("jobRole").value = app.job_role;
    document.getElementById("applicationStatus").value = app.status;
    document.getElementById("deadlineDate").value = app.deadline || "";
    document.getElementById("notes").value = app.notes || "";
  }
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

// =====================================================
// STEP 6: ADD / EDIT (SAVE) — sends data to PHP
// =====================================================
applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the form from reloading the page

  const id = document.getElementById("applicationId").value;

  const payload = {
    company_name: document.getElementById("companyName").value,
    job_role: document.getElementById("jobRole").value,
    status: document.getElementById("applicationStatus").value,
    deadline: document.getElementById("deadlineDate").value,
    notes: document.getElementById("notes").value,
  };

  const isEditing = id !== "";
  const url = isEditing
    ? `${API_BASE}/update_application.php`
    : `${API_BASE}/add_application.php`;

  if (isEditing) payload.id = id;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (result.success) {
      closeModal();
      fetchApplications(); // refresh the list from the server
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Save failed:", error);
  }
});

// =====================================================
// STEP 7: DELETE, EDIT, FAVORITE — using event delegation
// Instead of adding a listener to every button (which would
// need re-attaching every time we re-render), we add ONE
// listener to the parent and check what was actually clicked.
// =====================================================
applicationList.addEventListener("click", async (event) => {
  const target = event.target;
  const id = target.dataset.id;

  // ----- DELETE -----
  if (target.classList.contains("delete-btn")) {
    const confirmed = confirm("Delete this application?");
    if (!confirmed) return;

    const response = await fetch(`${API_BASE}/delete_application.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await response.json();
    if (result.success) fetchApplications();
  }

  // ----- EDIT -----
  if (target.classList.contains("edit-btn")) {
    const app = allApplications.find((a) => a.id == id);
    openModal("edit", app);
  }

  // ----- FAVORITE TOGGLE -----
  if (target.classList.contains("favorite-star")) {
    const response = await fetch(`${API_BASE}/toggle_favorite.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await response.json();
    if (result.success) fetchApplications();
  }
});

// =====================================================
// STEP 8: Search / Filter / Sort listeners
// =====================================================
searchInput.addEventListener("input", applyFiltersAndRender);
statusFilter.addEventListener("change", applyFiltersAndRender);
sortSelect.addEventListener("change", applyFiltersAndRender);

// =====================================================
// STEP 9: Modal open/close buttons
// =====================================================
addNewBtn.addEventListener("click", () => openModal("add"));
cancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal(); // click outside box closes it
});

// =====================================================
// STEP 10: Dark mode toggle (saved in localStorage —
// this ONE piece of UI preference is fine to keep client-side,
// since it's not "application data")
// =====================================================
function applyStoredTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.textContent = "☀️ Light Mode";
  }
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// =====================================================
// INITIALIZE app on page load
// =====================================================
applyStoredTheme();
fetchApplications();
