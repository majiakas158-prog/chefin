// =====================================
// CheafIn - Signup JavaScript
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Get Elements
    // =========================

    const chefBtn = document.getElementById("chefBtn");
    const restaurantBtn = document.getElementById("restaurantBtn");

    const chefFields = document.getElementById("chefFields");
    const restaurantFields = document.getElementById("restaurantFields");

    const signupForm = document.getElementById("signupForm");

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // =========================
    // Default Role
    // =========================

    let selectedRole = "chef";

    // =========================
    // Chef Button
    // =========================

    chefBtn.addEventListener("click", function () {

        selectedRole = "chef";

        chefBtn.classList.add("active");
        restaurantBtn.classList.remove("active");

        chefFields.style.display = "block";
        restaurantFields.style.display = "none";

    });

    // =========================
    // Restaurant Button
    // =========================

    restaurantBtn.addEventListener("click", function () {

        selectedRole = "restaurant";

        restaurantBtn.classList.add("active");
        chefBtn.classList.remove("active");

        restaurantFields.style.display = "block";
        chefFields.style.display = "none";

    });

    // =========================
    // Show / Hide Password
    // =========================

    togglePassword.addEventListener("click", function () {

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

    // =========================
    // Show / Hide Confirm Password
    // =========================

    toggleConfirmPassword.addEventListener("click", function () {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";

            toggleConfirmPassword.classList.remove("fa-eye");
            toggleConfirmPassword.classList.add("fa-eye-slash");

        } else {

            confirmPassword.type = "password";

            toggleConfirmPassword.classList.remove("fa-eye-slash");
            toggleConfirmPassword.classList.add("fa-eye");

        }

    });

    // =========================
    // Register User
    // =========================

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fullName = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const phone = signupForm.querySelector('input[type="tel"]').value;

        if (
            fullName === "" ||
            email === "" ||
            phone === "" ||
            password.value === "" ||
            confirmPassword.value === ""
        ) {

            alert("Please fill all required fields.");

            return;

        }

        if (password.value.length < 6) {

            alert("Password must be at least 6 characters.");

            return;

        }

        if (password.value !== confirmPassword.value) {

            alert("Passwords do not match.");

            return;

        }

        // =========================
        // Save User
        // =========================

        const user = {

            fullName,
            email,
            phone,
            password: password.value,
            role: selectedRole

        };

        localStorage.setItem("cheafinUser", JSON.stringify(user));

        alert("Account created successfully!");

        window.location.href = "signin.html";

    });

});