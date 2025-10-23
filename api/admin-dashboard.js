import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAyUuew-e4wlIdUDx7olNKx68sjD1UXY9U",
  authDomain: "iyal-survey.firebaseapp.com",
  projectId: "iyal-survey",
  storageBucket: "iyal-survey.appspot.com",
  messagingSenderId: "356060656195",
  appId: "1:356060656195:web:d0357a25774de984371af6",
  measurementId: "G-28XENM0B78"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const adminCodeInput = document.getElementById("adminCodeInput");
const codeBtn = document.getElementById("codeBtn");
const codeError = document.getElementById("codeError");
const dashboardContent = document.getElementById("dashboardContent");
const codeAccess = document.getElementById("codeAccess");
const userTable = document.getElementById("userTable");
const searchBar = document.getElementById("searchBar");
const userDetailsModal = document.getElementById("userDetailsModal");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.querySelector(".closeBtn");

// ✅ Admin Code from environment variable (Vercel)
const ADMIN_CODE = window.ADMIN_CODE || "9000000000"; // fallback if testing locally

// Admin Code Verification
codeBtn.addEventListener("click", () => {
  codeError.textContent = "";
  const code = adminCodeInput.value.trim();

  if (!code) {
    codeError.textContent = "Please enter the admin code.";
    return;
  }

  if (code === ADMIN_CODE) {
    codeAccess.style.display = "none";
    dashboardContent.style.display = "block";
    fetchUsers();
  } else {
    codeError.textContent = "Access denied. Wrong code.";
  }
});

// Fetch users from Firestore
function fetchUsers() {
  const usersCol = collection(db, "users");
  onSnapshot(usersCol, (snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    displayUsers(users);
  });
}

// Display users in table
function displayUsers(users) {
  userTable.innerHTML = "";
  const searchQuery = searchBar.value.trim().toLowerCase();

  users
    .filter(u => u.email.toLowerCase().includes(searchQuery))
    .forEach(user => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.name || "N/A"}</td>
        <td>${user.email || "N/A"}</td>
        <td>${user.id}</td>
        <td>₦${user.balance || 0}</td>
        <td>${user.referralCount || 0}</td>
        <td>${new Date(user.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</td>
      `;
      tr.addEventListener("click", () => showUserDetails(user));
      userTable.appendChild(tr);
    });
}

// Search functionality
searchBar.addEventListener("input", fetchUsers);

// Modal functionality
function showUserDetails(user) {
  modalContent.innerHTML = `
    <span class="closeBtn">&times;</span>
    <h2>${user.name || "N/A"}</h2>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>UID:</strong> ${user.id}</p>
    <p><strong>Balance:</strong> ₦${user.balance || 0}</p>
    <p><strong>Referrals:</strong> ${user.referralCount || 0}</p>
    <p><strong>Created:</strong> ${new Date(user.createdAt?.seconds * 1000 || Date.now()).toLocaleString()}</p>
  `;
  userDetailsModal.style.display = "flex";

  document.querySelector(".closeBtn").addEventListener("click", () => {
    userDetailsModal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === userDetailsModal) userDetailsModal.style.display = "none";
});
