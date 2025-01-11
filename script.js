// Admin credentials
const adminUsername = "admin";
const adminPassword = "1234";

// Persistent storage keys
const STORAGE_KEYS = {
    USERS: "users",
    EXPENSES: "expenses",
    ANNOUNCEMENTS: "announcements",
    CHAT: "chatMessages",
};

// Global variables
let loggedInUser = null;

// Load data from localStorage
function loadData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Initialize localStorage keys if not set
function initStorage() {
    Object.values(STORAGE_KEYS).forEach((key) => {
        if (!localStorage.getItem(key)) saveData(key, []);
    });
}
initStorage();

// Event Listeners
document.getElementById("login-btn").addEventListener("click", handleLogin);
document.getElementById("signup-btn").addEventListener("click", handleSignup);
document.getElementById("signup-link").addEventListener("click", showSignup);
document.getElementById("login-link").addEventListener("click", showLogin);

// Admin actions
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("post-announcement-btn").addEventListener("click", postAnnouncement);
document.getElementById("print-receipt-btn").addEventListener("click", printReceipt);
document.getElementById("send-chat-btn-admin").addEventListener("click", () =>
    sendMessage("admin")
);

// Driver actions
document.getElementById("logout-btn-driver").addEventListener("click", logout);
document.getElementById("submit-expense-btn").addEventListener("click", submitExpense);
document.getElementById("send-chat-btn-driver").addEventListener("click", () =>
    sendMessage("driver")
);

// Authentication
function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === adminUsername && password === adminPassword) {
        loggedInUser = { username: "Admin", role: "admin" };
        showAdminPanel();
    } else {
        const users = loadData(STORAGE_KEYS.USERS);
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
            loggedInUser = user;
            showDriverPanel();
        } else {
            alert("Invalid login credentials.");
        }
    }
}

function handleSignup() {
    const username = document.getElementById("new-username").value.trim();
    const password = document.getElementById("new-password").value.trim();

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const users = loadData(STORAGE_KEYS.USERS);
    if (users.some((u) => u.username === username)) {
        alert("Username already exists. Please choose another.");
        return;
    }

    users.push({ username, password, role: "driver" });
    saveData(STORAGE_KEYS.USERS, users);
    alert("Sign-up successful! Please log in.");
    showLogin();
}

function logout() {
    loggedInUser = null;
    showLogin();
}

function showSignup() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("signup").style.display = "block";
}

function showLogin() {
    document.getElementById("auth").style.display = "block";
    document.getElementById("signup").style.display = "none";
    document.getElementById("admin-panel").style.display = "none";
    document.getElementById("driver-panel").style.display = "none";
}

function showAdminPanel() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    renderExpenses();
    renderAnnouncements();
    renderChat();
}

function showDriverPanel() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById("driver-panel").style.display = "block";
    renderAnnouncements();
    renderChat();
}

// Announcements
function postAnnouncement() {
    const announcement = document.getElementById("announcement-input").value.trim();
    if (!announcement) return;

    const announcements = loadData(STORAGE_KEYS.ANNOUNCEMENTS);
    announcements.push({ message: announcement, timestamp: new Date().toLocaleString() });
    saveData(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    document.getElementById("announcement-input").value = "";
    renderAnnouncements();
}

function renderAnnouncements() {
    const announcements = loadData(STORAGE_KEYS.ANNOUNCEMENTS);
    const containers = document.querySelectorAll(".announcement-list");
    containers.forEach((container) => {
        container.innerHTML = announcements
            .map(
                (a) =>
                    `<div class="announcement-item"><strong>${a.timestamp}</strong>: ${a.message}</div>`
            )
            .join("");
    });
}

// Expenses
function submitExpense() {
    const toll = parseFloat(document.getElementById("toll-expense").value.trim());
    const fuel = parseFloat(document.getElementById("fuel-expense").value.trim());
    const distance = parseFloat(document.getElementById("distance-travelled").value.trim());

    if (isNaN(toll) || isNaN(fuel) || isNaN(distance)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const today = new Date().toLocaleDateString();
    const expenses = loadData(STORAGE_KEYS.EXPENSES);
    const userExpenses = expenses.filter((e) => e.username === loggedInUser.username && e.date === today);

    if (userExpenses.length >= 2) {
        alert("You can only submit details twice a day.");
        return;
    }

    expenses.push({ username: loggedInUser.username, toll, fuel, distance, date: today });
    saveData(STORAGE_KEYS.EXPENSES, expenses);

    alert("Expense submitted successfully!");
    document.getElementById("toll-expense").value = "";
    document.getElementById("fuel-expense").value = "";
    document.getElementById("distance-travelled").value = "";
}

function renderExpenses() {
    const expenses = loadData(STORAGE_KEYS.EXPENSES);
    const container = document.getElementById("expense-list");
    container.innerHTML = expenses
        .map(
            (e) =>
                `<div class="expense-item">
                    <input type="radio" name="selected-expense" value="${e.username}|${e.date}">
                    <strong>${e.username}</strong> (Date: ${e.date}) - Toll: ₹${e.toll}, Fuel: ₹${e.fuel}, Distance: ${e.distance} km
                </div>`
        )
        .join("");
}

function printReceipt() {
    const selected = document.querySelector('input[name="selected-expense"]:checked');
    if (!selected) {
        alert("Please select an expense to print.");
        return;
    }

    const [username, date] = selected.value.split("|");
    const expenses = loadData(STORAGE_KEYS.EXPENSES);
    const expense = expenses.find((e) => e.username === username && e.date === date);

    if (expense) {
        const receipt = `
            <h2 style="text-align:center;">NARAYAN INFRA</h2>
            <p><strong>Driver:</strong> ${username}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Toll Expense:</strong> ₹${expense.toll}</p>
            <p><strong>Fuel Expense:</strong> ₹${expense.fuel}</p>
            <p><strong>Distance Travelled:</strong> ${expense.distance} km</p>
        `;
        const receiptPreview = document.getElementById("receipt-preview");
        receiptPreview.innerHTML = receipt;
        receiptPreview.style.display = "block";
        window.print();
    }
}

// Chat
function sendMessage(senderRole) {
    const inputId = senderRole === "admin" ? "chat-input-admin" : "chat-input-driver";
    const message = document.getElementById(inputId).value.trim();
    if (!message) return;

    const chatMessages = loadData(STORAGE_KEYS.CHAT);
    chatMessages.push({
        sender: loggedInUser.username,
        message,
        timestamp: new Date().toLocaleString(),
        role: senderRole,
    });
    saveData(STORAGE_KEYS.CHAT, chatMessages);
    document.getElementById(inputId).value = "";
    renderChat();
}

function renderChat() {
    const chatMessages = loadData(STORAGE_KEYS.CHAT);
    const containers = document.querySelectorAll(".chat-box");
    containers.forEach((container) => {
        container.innerHTML = chatMessages
            .map(
                (msg) =>
                    `<div class="chat-message ${
                        msg.role === "admin" ? "chat-admin" : "chat-user"
                    }"><strong>${msg.sender}</strong>: ${msg.message} (${msg.timestamp})</div>`
            )
            .join("");
    });
}

// Final Initialization
showLogin();
