import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnGsFh61RxlMiJKE3aHFZz3CB4H_RgDGc",
  authDomain: "my-portfolio-4e8ea.firebaseapp.com",
  projectId: "my-portfolio-4e8ea",
  storageBucket: "my-portfolio-4e8ea.firebasestorage.app",
  messagingSenderId: "269516234172",
  appId: "1:269516234172:web:9079dcaf52fdf3feabdfb9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const SUPER_ADMIN = "mgodimgodi6@gmail.com";

let contributors = [];

// ── AUTH GUARD ─────────────────────────────────────────
getRedirectResult(auth).catch(console.error);

onAuthStateChanged(auth, (user) => {
  if (user && user.email === SUPER_ADMIN) {
    // ✅ Super Admin confirmed
    document.getElementById("auth-loading").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";
    document.getElementById("admin-email").textContent = user.email;
    loadContributors();
  } else if (user) {
    // ⛔ Wrong account
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  } else {
    // Not logged in — redirect to sign in
    signInWithRedirect(auth, provider);
  }
});

// ── SIGN OUT ───────────────────────────────────────────
window.signOutAdmin = () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// ── LOAD CONTRIBUTORS ──────────────────────────────────
async function loadContributors() {
  try {
    const res = await fetch("contributors.json");
    const data = await res.json();
    contributors = data.contributors;
    renderTable();
    document.getElementById("total-contributors").textContent = contributors.length;
  } catch (err) {
    console.error("Failed to load contributors:", err);
  }
}

// ── RENDER TABLE ───────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById("contributors-tbody");
  if (contributors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="loading-row">No contributors yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = contributors.map((c, i) => `
    <tr>
      <td>${c.name}</td>
      <td><a href="https://github.com/${c.github}" target="_blank" class="github-link">@${c.github}</a></td>
      <td>${c.role}</td>
      <td><span class="access-badge">${c.access}</span></td>
      <td>${c.added}</td>
      <td><button class="remove-btn" onclick="removeContributor(${i})">
        <i class="fas fa-trash"></i> Remove
      </button></td>
    </tr>
  `).join("");
}

// ── ADD CONTRIBUTOR ────────────────────────────────────
window.showAddForm = () => {
  document.getElementById("add-form").style.display = "block";
};

window.hideAddForm = () => {
  document.getElementById("add-form").style.display = "none";
  clearForm();
};

window.addContributor = () => {
  const name = document.getElementById("new-name").value.trim();
  const github = document.getElementById("new-github").value.trim();
  const role = document.getElementById("new-role").value.trim();
  const access = document.getElementById("new-access").value;

  if (!name || !github || !role) {
    alert("Please fill in all fields.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  contributors.push({ name, github, role, access, added: today });
  renderTable();
  document.getElementById("total-contributors").textContent = contributors.length;
  hideAddForm();
};

// ── REMOVE CONTRIBUTOR ─────────────────────────────────
window.removeContributor = (index) => {
  if (confirm(`Remove ${contributors[index].name}?`)) {
    contributors.splice(index, 1);
    renderTable();
    document.getElementById("total-contributors").textContent = contributors.length;
  }
};

function clearForm() {
  document.getElementById("new-name").value = "";
  document.getElementById("new-github").value = "";
  document.getElementById("new-role").value = "";
  document.getElementById("new-access").value = "Write";
}