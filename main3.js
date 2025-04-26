const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");
const cartBtn = document.getElementById("cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartForm = document.getElementById("cart-form");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const welcomeMessage = document.getElementById("welcome-message");
const userNameSpan = document.getElementById("user-name");
const loginText = document.getElementById("login-text");
const authModal = document.getElementById("auth-modal");
const modalClose = document.getElementById("modal-close");
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const paymentModal = document.getElementById("payment-modal");
const paymentModalClose = document.getElementById("payment-modal-close");
const cardPaymentModal = document.getElementById("card-payment-modal");
const cardPaymentModalClose = document.getElementById("card-payment-modal-close");
const confirmationModal = document.getElementById("confirmation-modal");
const confirmationModalClose = document.getElementById("confirmation-modal-close");
const confirmationCloseBtn = document.getElementById("confirmation-close-btn");
const serviceBookingModal = document.getElementById("service-booking-modal");
const serviceBookingModalClose = document.getElementById("service-booking-modal-close");
const cartPopup = document.getElementById("cart-popup");
const cartPopupMessage = document.getElementById("cart-popup-message");
const searchBtn = document.getElementById("search-btn");
const searchBar = document.getElementById("search-bar");
const searchClose = document.getElementById("search-close");
const searchInput = document.getElementById("search-input");
const searchSubmit = document.getElementById("search-submit");
let cart = [];
let currentUser = null;

// Load user from localStorage
function loadUser() {
  const userData = localStorage.getItem("currentUser");
  if (userData) {
    currentUser = JSON.parse(userData);
    updateNavForLoggedInUser();
  }
}

loadUser();

// Auto-show login modal on page load if not logged in
window.onload = () => {
  if (!currentUser) {
    promptLogin();
  }
};

// Navigation menu toggle
menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

// Function to open login modal
function promptLogin() {
  authModal.style.display = "flex";
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.style.display = "block";
  registerForm.style.display = "none";
}

// Authentication modal
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  promptLogin();
});

modalClose.addEventListener("click", () => {
  authModal.style.display = "none";
});

loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.style.display = "block";
  registerForm.style.display = "none";
});

registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.style.display = "block";
  loginForm.style.display = "none";
});

// Validation functions
function validateEmail(email) {
  return email.includes("@");
}

function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}

function validatePassword(password) {
  return password.length >= 10 && /[!@#$%^&*]/.test(password);
}

function validateCardNumber(cardNumber) {
  return /^\d{10}$/.test(cardNumber);
}

function validateCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

// Register
document.getElementById("register-submit").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const phone = document.getElementById("register-phone").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;

  if (!name || !phone || !email || !password) {
    alert("All fields are required.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Email must contain '@'.");
    return;
  }

  if (!validatePhone(phone)) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  if (!validatePassword(password)) {
    alert("Password must be at least 10 characters and include one special character.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some((user) => user.email === email)) {
    alert("Email already registered.");
    return;
  }

  users.push({ name, phone, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registration successful! Please login.");
  loginTab.click();
});

// Login
document.getElementById("login-submit").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
  authModal.style.display = "none";
  updateNavForLoggedInUser();
});

// Update navigation for logged-in user
function updateNavForLoggedInUser() {
  loginBtn.style.display = "none";
  welcomeMessage.style.display = "inline";
  userNameSpan.textContent = currentUser.name;
  logoutBtn.style.display = "inline";
  // Trigger animation by resetting and re-adding the animation
  welcomeMessage.style.animation = "none";
  setTimeout(() => {
    welcomeMessage.style.animation = "slideInWelcome 0.5s ease forwards";
  }, 10);
}

// Logout
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  currentUser = null;
  localStorage.removeItem("currentUser");
  loginBtn.style.display = "inline";
  welcomeMessage.style.display = "none";
  logoutBtn.style.display = "none";
  loginText.textContent = "Login";
  cart = [];
  updateCart();
  promptLogin();
});

// Cart functionality
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    if (!currentUser) {
      alert("Please login to add items to the cart.");
      promptLogin();
      return;
    }
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);
    cart.push({ name, price });
    updateCart();
    showCartPopup(name);
  });
});

function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <span>${item.name} - $${item.price}</span>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
  document.getElementById("cart-count").textContent = cart.length;
  cartForm.style.display = cart.length > 0 ? "block" : "none";
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function showCartPopup(itemName) {
  cartPopupMessage.textContent = `Added ${itemName} to Cart!`;
  cartPopup.style.display = "block";
  setTimeout(() => {
    cartPopup.style.display = "none";
  }, 2000);
}

// Service booking modal with dynamic forms
document.querySelectorAll(".service__card").forEach((card) => {
  card.addEventListener("click", () => {
    if (!currentUser) {
      alert("Please login to book a service.");
      promptLogin();
      return;
    }
    const service = card.dataset.service;
    const serviceName = card.dataset.name;
    document.getElementById("service-booking-title").textContent = `Book ${serviceName}`;
    const formContainer = document.getElementById("service-booking-form");
    formContainer.innerHTML = generateServiceForm(service);
    formContainer.dataset.type = service;
    formContainer.dataset.name = serviceName;
    serviceBookingModal.style.display = "flex";
  });
});

function generateServiceForm(service) {
  switch (service) {
    case "flight":
      return `
        <label for="flight-date">Travel Date:</label>
        <input type="date" id="flight-date" required />
        <label for="flight-age">Age:</label>
        <input type="number" id="flight-age" min="1" required />
        <label for="flight-gender">Gender:</label>
        <select id="flight-gender" required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label for="flight-name">Full Name:</label>
        <input type="text" id="flight-name" required />
        <label for="flight-departure">Departure City:</label>
        <input type="text" id="flight-departure" required />
        <label for="flight-destination">Destination City:</label>
        <input type="text" id="flight-destination" required />
        <button class="btn submit-booking">Confirm Booking</button>
      `;
    case "train":
      return `
        <label for="train-date">Travel Date:</label>
        <input type="date" id="train-date" required />
        <label for="train-age">Age:</label>
        <input type="number" id="train-age" min="1" required />
        <label for="train-gender">Gender:</label>
        <select id="train-gender" required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label for="train-name">Full Name:</label>
        <input type="text" id="train-name" required />
        <label for="train-source">Source Station:</label>
        <input type="text" id="train-source" required />
        <label for="train-destination">Destination Station:</label>
        <input type="text" id="train-destination" required />
        <button class="btn submit-booking">Confirm Booking</button>
      `;
    case "bus":
      return `
        <label for="bus-date">Travel Date:</label>
        <input type="date" id="bus-date" required />
        <label for="bus-age">Age:</label>
        <input type="number" id="bus-age" min="1" required />
        <label for="bus-gender">Gender:</label>
        <select id="bus-gender" required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label for="bus-name">Full Name:</label>
        <input type="text" id="bus-name" required />
        <label for="bus-source">Source City:</label>
        <input type="text" id="bus-source" required />
        <label for="bus-destination">Destination City:</label>
        <input type="text" id="bus-destination" required />
        <button class="btn submit-booking">Confirm Booking</button>
      `;
    case "event":
      return `
        <label for="event-date">Event Date:</label>
        <input type="date" id="event-date" required />
        <label for="event-name">Event Name:</label>
        <input type="text" id="event-name" required />
        <label for="event-genre">Genre:</label>
        <select id="event-genre" required>
          <option value="Music">Music</option>
          <option value="Festival">Festival</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
        </select>
        <button class="btn submit-booking">Confirm Booking</button>
      `;
    case "weather":
      return `
        <label for="weather-date">Date:</label>
        <input type="date" id="weather-date" required />
        <label for="weather-time">Time:</label>
        <input type="time" id="weather-time" required />
        <button class="btn submit-booking">Confirm Booking</button>
      `;
    case "customization":
      return `
        <label for="customization-name">Name:</label>
        <input type="text" id="customization-name" required />
        <label for="customization-phone">Phone Number:</label>
        <input type="text" id="customization-phone" required />
        <button class="btn submit-booking">Confirm Booking</button>
      `;
    default:
      return "";
  }
}

serviceBookingModalClose.addEventListener("click", () => {
  serviceBookingModal.style.display = "none";
});

// Handle booking submission for cart and services
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("submit-booking")) {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to confirm booking.");
      promptLogin();
      return;
    }

    const form = e.target.closest(".booking__form") || cartForm;
    const type = form.dataset.type || "cart";
    const serviceName = form.dataset.name || "Travel Package";
    let bookingDetails = {};

    if (type === "cart") {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      bookingDetails = {
        type,
        serviceName,
        adults: document.getElementById("adults").value,
        children: document.getElementById("children").value,
        fromDate: document.getElementById("from-date").value,
        toDate: document.getElementById("to-date").value,
      };
      if (bookingDetails.adults < 1 || !bookingDetails.fromDate || !bookingDetails.toDate) {
        alert("Please fill in all required fields.");
        return;
      }
    } else {
      switch (type) {
        case "flight":
          bookingDetails = {
            type,
            serviceName,
            date: document.getElementById("flight-date").value,
            age: document.getElementById("flight-age").value,
            gender: document.getElementById("flight-gender").value,
            name: document.getElementById("flight-name").value,
            departure: document.getElementById("flight-departure").value,
            destination: document.getElementById("flight-destination").value,
          };
          if (!bookingDetails.date || !bookingDetails.age || !bookingDetails.gender || !bookingDetails.name ||
              !bookingDetails.departure || !bookingDetails.destination) {
            alert("Please fill in all required fields.");
            return;
          }
          break;
        case "train":
          bookingDetails = {
            type,
            serviceName,
            date: document.getElementById("train-date").value,
            age: document.getElementById("train-age").value,
            gender: document.getElementById("train-gender").value,
            name: document.getElementById("train-name").value,
            source: document.getElementById("train-source").value,
            destination: document.getElementById("train-destination").value,
          };
          if (!bookingDetails.date || !bookingDetails.age || !bookingDetails.gender || !bookingDetails.name ||
              !bookingDetails.source || !bookingDetails.destination) {
            alert("Please fill in all required fields.");
            return;
          }
          break;
        case "bus":
          bookingDetails = {
            type,
            serviceName,
            date: document.getElementById("bus-date").value,
            age: document.getElementById("bus-age").value,
            gender: document.getElementById("bus-gender").value,
            name: document.getElementById("bus-name").value,
            source: document.getElementById("bus-source").value,
            destination: document.getElementById("bus-destination").value,
          };
          if (!bookingDetails.date || !bookingDetails.age || !bookingDetails.gender || !bookingDetails.name ||
              !bookingDetails.source || !bookingDetails.destination) {
            alert("Please fill in all required fields.");
            return;
          }
          break;
        case "event":
          bookingDetails = {
            type,
            serviceName,
            date: document.getElementById("event-date").value,
            eventName: document.getElementById("event-name").value,
            genre: document.getElementById("event-genre").value,
          };
          if (!bookingDetails.date || !bookingDetails.eventName || !bookingDetails.genre) {
            alert("Please fill in all required fields.");
            return;
          }
          break;
        case "weather":
          bookingDetails = {
            type,
            serviceName,
            date: document.getElementById("weather-date").value,
            time: document.getElementById("weather-time").value,
          };
          if (!bookingDetails.date || !bookingDetails.time) {
            alert("Please fill in all required fields.");
            return;
          }
          break;
        case "customization":
          bookingDetails = {
            type,
            serviceName,
            name: document.getElementById("customization-name").value,
            phone: document.getElementById("customization-phone").value,
          };
          if (!bookingDetails.name || !bookingDetails.phone) {
            alert("Please fill in all required fields.");
            return;
          }
          if (!validatePhone(bookingDetails.phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
          }
          break;
      }
    }

    paymentModal.style.display = "flex";
    window.bookingDetails = bookingDetails;
    serviceBookingModal.style.display = "none";
  }
});

// Payment modal
paymentModalClose.addEventListener("click", () => {
  paymentModal.style.display = "none";
});

document.querySelectorAll(".payment__btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const paymentMethod = e.target.dataset.method;
    paymentModal.style.display = "none";

    if (paymentMethod === "Credit Card" || paymentMethod === "Debit Card") {
      cardPaymentModal.style.display = "flex";
      window.paymentDetails = { paymentMethod };
    } else {
      showConfirmation({ paymentMethod });
    }
  });
});

// Card payment modal
cardPaymentModalClose.addEventListener("click", () => {
  cardPaymentModal.style.display = "none";
});

document.getElementById("card-payment-submit").addEventListener("click", (e) => {
  e.preventDefault();
  const cardType = document.getElementById("card-type").value;
  const cardNumber = document.getElementById("card-number").value.trim();
  const cvv = document.getElementById("card-cvv").value.trim();

  if (!cardType || !cardNumber || !cvv) {
    alert("Please fill in all card details.");
    return;
  }

  if (!validateCardNumber(cardNumber)) {
    alert("Card number must be exactly 10 digits.");
    return;
  }

  if (!validateCVV(cvv)) {
    alert("CVV must be exactly 3 digits.");
    return;
  }

  cardPaymentModal.style.display = "none";
  showConfirmation({
    paymentMethod: window.paymentDetails.paymentMethod,
    cardType,
    cardNumber: cardNumber.slice(-4),
    cvv,
  });
});

// Show confirmation modal
function showConfirmation(paymentInfo) {
  const { type, serviceName, ...details } = window.bookingDetails;
  let detailsHtml = `<strong>Service:</strong> ${serviceName}<br>`;

  if (type === "cart") {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    detailsHtml += `
      <strong>Destinations:</strong> ${cart.map((item) => item.name).join(", ")}<br>
      <strong>Total:</strong> $${total}<br>
      <strong>Adults:</strong> ${details.adults}<br>
      <strong>Children:</strong> ${details.children}<br>
      <strong>From:</strong> ${details.fromDate}<br>
      <strong>To:</strong> ${details.toDate}<br>
    `;
  } else if (type === "flight" || type === "train" || type === "bus") {
    detailsHtml += `
      <strong>Date:</strong> ${details.date}<br>
      <strong>Full Name:</strong> ${details.name}<br>
      <strong>Age:</strong> ${details.age}<br>
      <strong>Gender:</strong> ${details.gender}<br>
      <strong>${type === "flight" ? "Departure" : "Source"}:</strong> ${details.departure || details.source}<br>
      <strong>Destination:</strong> ${details.destination}<br>
    `;
  } else if (type === "event") {
    detailsHtml += `
      <strong>Date:</strong> ${details.date}<br>
      <strong>Event Name:</strong> ${details.eventName}<br>
      <strong>Genre:</strong> ${details.genre}<br>
    `;
  } else if (type === "weather") {
    detailsHtml += `
      <strong>Date:</strong> ${details.date}<br>
      <strong>Time:</strong> ${details.time}<br>
    `;
  } else if (type === "customization") {
    detailsHtml += `
      <strong>Name:</strong> ${details.name}<br>
      <strong>Phone:</strong> ${details.phone}<br>
    `;
  }

  detailsHtml += `<strong>Payment Method:</strong> ${paymentInfo.paymentMethod}<br>`;
  if (paymentInfo.cardType) {
    detailsHtml += `
      <strong>Card Type:</strong> ${paymentInfo.cardType}<br>
      <strong>Card Number Ending:</strong> ****${paymentInfo.cardNumber}<br>
    `;
  }

  confirmationModal.style.display = "flex";
  document.getElementById("confirmation-details").innerHTML = detailsHtml;

  if (type === "cart") {
    cart = [];
    updateCart();
    cartForm.reset();
  }
}

// Confirmation modal
confirmationModalClose.addEventListener("click", () => {
  confirmationModal.style.display = "none";
});

confirmationCloseBtn.addEventListener("click", () => {
  confirmationModal.style.display = "none";
});

// Search functionality
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchBar.classList.toggle("active");
  searchInput.focus();
});

searchClose.addEventListener("click", () => {
  searchBar.classList.remove("active");
  resetSearch();
});

searchSubmit.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".destination__card");
  let found = false;

  cards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    if (query === "" || name.includes(query)) {
      card.style.display = "block";
      card.classList.toggle("highlight", query !== "" && name.includes(query));
      if (name.includes(query)) found = true;
    } else {
      card.style.display = "none";
      card.classList.remove("highlight");
    }
  });

  document.getElementById("search-not-found").style.display = found || query === "" ? "none" : "block";
}

function resetSearch() {
  searchInput.value = "";
  const cards = document.querySelectorAll(".destination__card");
  cards.forEach((card) => {
    card.style.display = "block";
    card.classList.remove("highlight");
  });
  document.getElementById("search-not-found").style.display = "none";
}

// ScrollReveal animations
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
  easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content .section__subheader", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".header__btns", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".service__card", {
  duration: 1000,
  interval: 300,
  scale: 0.85,
});

ScrollReveal().reveal(".destination__card", {
  ...scrollRevealOption,
  interval: 200,
  rotate: { x: 10 },
});

ScrollReveal().reveal(".trip__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".trip__content .section__subheader", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".trip__content .section__header", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".trip__list li", {
  ...scrollRevealOption,
  delay: 1500,
  interval: 400,
});

ScrollReveal().reveal(".client__content .section__subheader", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".client__content .section__header", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".cart__container", {
  ...scrollRevealOption,
  delay: 500,
  scale: 0.9,
});

const swiper = new Swiper(".swiper", {
  direction: "vertical",
  autoHeight: true,
  slidesPerView: 1,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
});