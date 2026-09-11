// ==============================
// CheafIn - Sign In JavaScript
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // Get Elements
    // ===========================

    const chefRole = document.getElementById("chefRole");
    const restaurantRole = document.getElementById("restaurantRole");

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const loginForm = document.getElementById("loginForm");

    const remember = document.getElementById("remember");

    const togglePassword = document.getElementById("togglePassword");

    // ===========================
    // Default Role
    // ===========================

    let selectedRole = localStorage.getItem("selectedRole") || "chef";

    if (selectedRole === "chef") {

        chefRole.classList.add("active");
        restaurantRole.classList.remove("active");

    } else {

        restaurantRole.classList.add("active");
        chefRole.classList.remove("active");

    }

    // ===========================
    // Chef Button
    // ===========================

    chefRole.addEventListener("click", () => {

        selectedRole = "chef";

        localStorage.setItem("selectedRole", selectedRole);

        chefRole.classList.add("active");
        restaurantRole.classList.remove("active");

    });

    // ===========================
    // Restaurant Button
    // ===========================

    restaurantRole.addEventListener("click", () => {

        selectedRole = "restaurant";

        localStorage.setItem("selectedRole", selectedRole);

        restaurantRole.classList.add("active");
        chefRole.classList.remove("active");

    });

    // ===========================
    // Show / Hide Password
    // ===========================

    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");

        } else {

            password.type = "password";

            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");

        }

    });

    // ===========================
    // Remember Email
    // ===========================

    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {

        email.value = savedEmail;
        remember.checked = true;

    }

    // ===========================
    // Login
    // ===========================

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const userEmail = email.value.trim();
        const userPassword = password.value.trim();

        if (userEmail === "" || userPassword === "") {

            alert("Please fill in all fields.");

            return;

        }

        // Remember Email

        if (remember.checked) {

            localStorage.setItem("rememberEmail", userEmail);

        } else {

            localStorage.removeItem("rememberEmail");

        }

        // Demo Login

        alert("Login Successful!");

        if (selectedRole === "chef") {

            window.location.href = "chef-dashboard.html";

        } else {

            window.location.href = "restaurant-dashboard.html";

        }

    });

});