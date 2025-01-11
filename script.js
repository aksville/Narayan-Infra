const adminCredentials = { username: "admin", password: "Admin@123" };
let drivers = [];
let driverLogs = {};
let notifications = [];

// Utility functions
const toggleVisibility = (inputId, buttonId) => {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
    } else {
        input.type = "password";
        button.textContent = "Show";
    }
};

// Toggle password visibility
document.getElementById("toggleLoginPassword").addEventListener("click", () => toggleVisibility("loginPassword", "toggleLoginPassword"));
document.getElementById("toggleSignUpPassword").addEventListener("click", () => toggleVisibility("signUpPassword", "toggleSignUpPassword"));

// Open Sign-Up Page
document.getElementById("openSignUp").addEventListener("click", () => {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signUpPage").style.display = "block";
});

// Open Login Page
document.getElementById("openLogin").addEventListener("click", () => {
    document.getElementById("signUpPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
});

// Sign-Up functionality
document.getElementById("signUpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signUpUsername").value;
    const password = document.getElementById("signUpPassword").value;

    if (drivers.some(d => d.username === username)) {
        alert("Username already exists. Please choose a different username.");
        return;
    }

    drivers.push({ username, password });
    alert("Sign-Up successful! You can now log in.");
    document.getElementById("signUpForm").reset();
    document.getElementById("signUpPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
});

// Login functionality
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("adminDashboard").style.display = "block";
        displayDrivers();
    } else if (drivers.some(d => d.username === username && d.password === password)) {
        sessionStorage.setItem("currentDriver", username);
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("driverDashboard").style.display = "block";
        loadDriverNotifications(username);
        loadDriverLogs(username);
        loadPerformanceSummary(username);
    } else {
        document.getElementById("loginError").textContent = "Invalid credentials!";
    }
});

// Admin: Add Driver
document.getElementById("addDriver").addEventListener("click", () => {
    const username = prompt("Enter driver's username:");
    const password = prompt("Enter driver's password:");
    if (username && password) {
        drivers.push({ username, password });
        alert("Driver added successfully!");
        displayDrivers();
    }
});

// Admin: View Drivers
function displayDrivers() {
    const driverList = drivers.map(d => `<p>${d.username}</p>`).join("");
    document.getElementById("driverList").innerHTML = driverList || "No drivers available.";
}

// Admin: Generate PDF
document.getElementById("generatePDF").addEventListener("click", () => {
    alert("PDF generation is not yet implemented. Placeholder for feature.");
});

// Admin: Export to Excel
document.getElementById("exportToExcel").addEventListener("click", () => {
    alert("Excel export is not yet implemented. Placeholder for feature.");
});

// Admin: Send Notifications
document.getElementById("sendNotification").addEventListener("click", () => {
    const message = document.getElementById("notificationMessage").value;
    if (message) {
        notifications.push({ message, timestamp: new Date().toLocaleString() });
        alert("Notification sent to all drivers!");
    }
});

// Driver: Submit Log
document.getElementById("logForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = sessionStorage.getItem("currentDriver");
    const log = {
        distance: document.getElementById("logDistance").value,
        load: document.getElementById("logLoad").value,
        expenses: document.getElementById("logExpenses").value,
        notes: document.getElementById("logNotes").value,
        date: new Date().toLocaleString()
    };

    if (!driverLogs[username]) driverLogs[username] = [];
    driverLogs[username].push(log);
    alert("Log submitted!");
    loadDriverLogs(username);
    loadPerformanceSummary(username);
});

// Driver: Load Logs
function loadDriverLogs(username) {
    const logs = driverLogs[username] || [];
    const logHTML = logs.map(log => `
        <div>
            <p><strong>Date:</strong> ${log.date}</p>
            <p><strong>Distance:</strong> ${log.distance} km</p>
            <p><strong>Load:</strong> ${log.load} tons</p>
            <p><strong>Expenses:</strong> ₹${log.expenses}</p>
            <p><strong>Notes:</strong> ${log.notes}</p>
            <hr>
        </div>
    `).join("");
    document.getElementById("logHistory").innerHTML = logHTML || "No logs available.";
}

// Driver: Load Performance Summary
function loadPerformanceSummary(username) {
    const logs = driverLogs[username] || [];
    const totalTrips = logs.length;
    const totalDistance = logs.reduce((sum, log) => sum + parseFloat(log.distance), 0);
    const totalLoad = logs.reduce((sum, log) => sum + parseFloat(log.load), 0);
    const totalExpenses = logs.reduce((sum, log) => sum + parseFloat(log.expenses), 0);

    const summaryHTML = `
        <p><strong>Total Trips:</strong> ${totalTrips}</p>
        <p><strong>Total Distance:</strong> ${totalDistance} km</p>
        <p><strong>Total Load:</strong> ${totalLoad} tons</p>
        <p><strong>Total Expenses:</strong> ₹${totalExpenses}</p>
    `;
    document.getElementById("performanceSummary").innerHTML = summaryHTML || "No data available.";
}

// Driver: Load Notifications
function loadDriverNotifications(username) {
    const notificationHTML = notifications.map(n => `
        <p>${n.message} <small>(${n.timestamp})</small></p>
    `).join("");
    document.getElementById("driverNotifications").innerHTML = notificationHTML || "No notifications.";
}

// Logout functionality
document.getElementById("logoutAdmin").addEventListener("click", () => {
    sessionStorage.clear(); // Clear all session data
    document.getElementById("adminDashboard").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
});

document.getElementById("logoutDriver").addEventListener("click", () => {
    sessionStorage.clear(); // Clear all session data
    document.getElementById("driverDashboard").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
});
