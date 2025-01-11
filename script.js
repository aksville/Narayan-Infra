// Admin credentials
const adminUsername = "admin";
const adminPassword = "1234";

// User storage
let users = [];
let loggedInUser = null;

// Event Listeners
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("signup-btn").addEventListener("click", signUp);
document.querySelectorAll("#logout-btn").forEach((btn) => {
    btn.addEventListener("click", logout);
});
document.getElementById("signup-link").addEventListener("click", showSignup);
document.getElementById("login-link").addEventListener("click", showLogin);
document.getElementById("announce-btn").addEventListener("click", sendAnnouncement);
document.getElementById("submit-travel-btn").addEventListener("click", submitTravelDetails);
document.getElementById("toggle-password").addEventListener("click", togglePassword);
document.getElementById("toggle-new-password").addEventListener("click", toggleNewPassword);

// Login Function
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === adminUsername && password === adminPassword) {
        showAdminPanel();
    } else {
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
            loggedInUser = user;
            showDriverPanel();
        } else {
            alert("Invalid username or password!");
        }
    }
}

// Sign-Up Function
function signUp() {
    const username = document.getElementById("new-username").value.trim();
    const password = document.getElementById("new-password").value.trim();

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (users.some((u) => u.username === username)) {
        alert("Username already exists!");
    } else {
        users.push({ username, password, travelDetails: [], announcement: "" });
        alert("Sign-up successful! Please log in.");
        showLogin();
    }
}

// Logout Function
function logout() {
    loggedInUser = null;
    showLogin();
}

// Send Announcement (Admin)
function sendAnnouncement() {
    const message = document.getElementById("announcement").value.trim();

    if (!message) {
        alert("Announcement message cannot be empty.");
        return;
    }

    alert("Announcement sent to all drivers!");
    users.forEach((user) => {
        if (user.username !== adminUsername) {
            user.announcement = message;
        }
    });
}

// Submit Travel Details (Driver)
function submitTravelDetails() {
    const distance = parseFloat(document.getElementById("travel-distance").value.trim());
    const expense = parseFloat(document.getElementById("travel-expense").value.trim());

    if (isNaN(distance) || isNaN(expense) || !distance || !expense) {
        alert("Please enter valid distance and expense.");
        return;
    }

    loggedInUser.travelDetails.push({ distance, expense });
    alert("Travel details submitted successfully!");
    updateDriverDetailsTable();
}

// Show Sign-Up Form
function showSignup() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("signup").style.display = "block";
}

// Show Login Form
function showLogin() {
    document.getElementById("auth").style.display = "block";
    document.getElementById("signup").style.display = "none";
    document.getElementById("admin-panel").style.display = "none";
    document.getElementById("driver-panel").style.display = "none";
}

// Display Admin Panel
function showAdminPanel() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    updateAdminTable();
}

// Display Driver Panel
function showDriverPanel() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("driver-panel").style.display = "block";
    updateDriverDetailsTable();

    const announcementArea = document.getElementById("announcement-area");
    if (loggedInUser.announcement) {
        announcementArea.style.display = "block";
        document.getElementById("announcement-message").textContent = loggedInUser.announcement;
    } else {
        announcementArea.style.display = "none";
    }
}

// Update Admin Table
function updateAdminTable() {
    const tableBody = document.getElementById("drivers-table").querySelector("tbody");
    tableBody.innerHTML = users
        .map(
            (user) =>
                `<tr>
                    <td>${user.username}</td>
                    <td>${calculateTotalDistance(user)}</td>
                    <td>${calculateTotalExpense(user)}</td>
                    <td><button onclick="printReceipt('${user.username}')">Print Receipt</button></td>
                </tr>`
        )
        .join("");
}

// Update Driver Details Table
function updateDriverDetailsTable() {
    const tableBody = document.getElementById("driver-details-table").querySelector("tbody");
    tableBody.innerHTML = loggedInUser.travelDetails
        .map(
            (detail) => `
            <tr>
                <td>${detail.distance}</td>
                <td>${detail.expense}</td>
            </tr>`
        )
        .join("");
}

// Calculate Total Distance for a Driver
function calculateTotalDistance(user) {
    return user.travelDetails.reduce((sum, detail) => sum + detail.distance, 0).toFixed(2);
}

// Calculate Total Expense for a Driver
function calculateTotalExpense(user) {
    return user.travelDetails.reduce((sum, detail) => sum + detail.expense, 0).toFixed(2);
}

// Print Receipt (Admin)
function printReceipt(username) {
    const user = users.find((u) => u.username === username);
    if (!user) return;

    const receiptWindow = window.open("", "_blank", "width=800,height=600");
    receiptWindow.document.write(`
        <h1>Narayan Infra Receipt</h1>
        <p><strong>Driver:</strong> ${username}</p>
        <p><strong>Total Distance:</strong> ${calculateTotalDistance(user)} km</p>
        <p><strong>Total Expense:</strong> ₹${calculateTotalExpense(user)}</p>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
}

// Toggle Password Visibility (Login)
function togglePassword() {
    const passwordField = document.getElementById("password");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}

// Toggle Password Visibility (Sign-Up)
function toggleNewPassword() {
    const passwordField = document.getElementById("new-password");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}
