function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { validEmail: false, reason: "Email cannot be empty" };
  }

  if (!emailRegex.test(email)) {
    return { validEmail: false, reason: "Invalid email format" };
  }

  if (email.length > 50) {
    return { validEmail: false, reason: "Email too long" };
  }

  return { validEmail: true, reason: "Email valid" };
}

function validateUsername(username) {
  if (!username) {
    return { validUsername: false, reason: "Username cannot be empty" };
  }

  if (username.length < 3) {
    return { validUsername: false, reason: "Username too short" };
  }

  if (username.length > 10) {
    return { validUsername: false, reason: "Username too long" };
  }
  return { validUsername: true, reason: "Username valid" };
}

function validatePassword(password, confirmationPassword) {
  if (!password) {
    return { validPassword: false, reason: "Password cannot be empty" };
  }

  if (password !== confirmationPassword) {
    return { validPassword: false, reason: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { validPassword: false, reason: "Password too short" };
  }

  if (password.length > 20) {
    return { validPassword: false, reason: "Password too long" };
  }

  const complexityRegex = /(?=.*[0-9])(?=.*[!@#$%^&*])/;

  if (!complexityRegex.test(password)) {
    return {
      validPassword: false,
      reason:
        "Password must contain at least one special character and one number",
    };
  }

  return { validPassword: true, reason: "Password valid" };
}

function doesUserExist(username) {
  return localStorage.getItem(username) !== null;
}

function createUser(event) {
  if (event) event.preventDefault();

  const user = {
    username: document.forms["signup-form"]["username"].value.trim(),
    email: document.forms["signup-form"]["email"].value.trim(),
    password: document.forms["signup-form"]["password"].value,
    passwordConfirm: document.forms["signup-form"]["confirm-password"].value,
  };

  const usernameChecks = validateUsername(user.username);
  const emailChecks = validateEmail(user.email);
  const passwordChecks = validatePassword(user.password, user.passwordConfirm);

  if (!usernameChecks.validUsername) {
    alert(usernameChecks.reason);
    return;
  }
  if (!emailChecks.validEmail) {
    alert(emailChecks.reason);
    return;
  }
  if (!passwordChecks.validPassword) {
    alert(passwordChecks.reason);
    return;
  }

  if (doesUserExist(user.username)) {
    alert("User already exists");
    return;
  }

  // Remove confirmation property before saving to storage
  const { passwordConfirm, ...userToStore } = user;

  setLocalStorageValue(user.username, JSON.stringify(userToStore));
  alert("Account created successfully!");
  window.location.href = "login.html";
}

function loginUser(event) {
  if (event) event.preventDefault();

  const usernameInput =
    document.forms["login-form"]["login-username"].value.trim();
  const passwordInput = document.forms["login-form"]["login-password"].value;

  if (!usernameInput || !passwordInput) {
    alert("Please fill in all fields");
    return;
  }

  // Check if user exists in local storage
  const storedData = getLocalStorageValue(usernameInput);
  if (!storedData) {
    alert("Invalid username or password");
    return;
  }

  const userObject = JSON.parse(storedData);

  // Verify password matches the stored account
  if (userObject.password !== passwordInput) {
    alert("Invalid username or password");
    return;
  }

  // Store the current user in local storage for session management
  setLocalStorageValue("currentUser", usernameInput);

  alert("Login successful!");
  window.location.href = "index.html";
}

function getLocalStorageValue(key) {
  return localStorage.getItem(key);
}

function setLocalStorageValue(key, value) {
  localStorage.setItem(key, value);
}

function removeLocalStorageValue(key) {
  localStorage.removeItem(key);
}

function clearLocalStorage() {
  localStorage.clear();
}

function doesLocalStorageKeyExist(key) {
  return localStorage.getItem(key) !== null;
}
