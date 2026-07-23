const STORAGE_KEYS = {
  users: "uuGymUsers",
  session: "uuGymSession",
  interestDraft: "uuGymInterestDraft",
  memberProfiles: "uuGymMemberProfiles"
};

function readJson(key, fallback) {
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readJson(STORAGE_KEYS.users, []);
}

function getSession() {
  return readJson(STORAGE_KEYS.session, null);
}

function setSession(user) {
  writeJson(STORAGE_KEYS.session, {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    plan: user.plan || "Not set",
    studentId: user.studentId || "Not set"
  });
}

function updateNavbar() {
  const page = $("body").data("page");
  const session = getSession();
  const navClass = `.nav-${page}`;
  $(navClass).addClass("active");

  if (session) {
    $(".auth-only").removeClass("d-none");
    $(".js-user-name").text(session.name || "Member");
    $(".nav-login").closest(".nav-item").addClass("d-none");
    $(".nav-signup").closest(".nav-item").addClass("d-none");
  }
}

function setMessage(selector, message, isError) {
  $(selector)
    .text(message)
    .toggleClass("text-danger", Boolean(isError))
    .toggleClass("text-success", !isError);
}

function bindSignupForm() {
  const $form = $("#signupForm");
  if (!$form.length) return;

  $form.on("submit", function (event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());

    if (!this.checkValidity()) {
      setMessage(".js-signup-message", "Please fill in all required fields.", true);
      return;
    }

    const users = getUsers();
    const email = formData.email.trim().toLowerCase();
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setMessage(".js-signup-message", "An account with this email already exists.", true);
      return;
    }

    const newUser = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email,
      studentId: formData.studentId.trim(),
      password: formData.password,
      plan: formData.plan
    };

    users.push(newUser);
    writeJson(STORAGE_KEYS.users, users);
    setSession(newUser);
    setMessage(".js-signup-message", "Account created. Redirecting to dashboard...", false);
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
}

function bindLoginForm() {
  const $form = $("#loginForm");
  if (!$form.length) return;

  $form.on("submit", function (event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    if (!this.checkValidity()) {
      setMessage(".js-login-message", "Please enter your email and password.", true);
      return;
    }

    const email = formData.email.trim().toLowerCase();
    const users = getUsers();
    const matchedUser = users.find((user) => user.email === email && user.password === formData.password);

    if (!matchedUser) {
      setMessage(".js-login-message", "Invalid login details (template check).", true);
      return;
    }

    setSession(matchedUser);
    setMessage(".js-login-message", "Login successful. Redirecting...", false);
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
}

function bindInterestForm() {
  const $form = $("#interestForm");
  if (!$form.length) return;

  const existingDraft = readJson(STORAGE_KEYS.interestDraft, null);
  if (existingDraft) {
    Object.entries(existingDraft).forEach(([key, value]) => {
      $form.find(`[name="${key}"]`).val(value);
    });
  }

  $form.on("submit", function (event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    writeJson(STORAGE_KEYS.interestDraft, formData);
    setMessage(".js-interest-message", "Draft saved in localStorage.", false);
  });
}

function guardDashboard() {
  if ($("body").data("page") !== "dashboard") return;

  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  $(".js-dashboard-name").text(session.name || "Member");
  $(".js-dashboard-plan").text(session.plan || "Not set");
  $(".js-dashboard-student-id").text(session.studentId || "Not set");
}

function bindContactForm() {
  const $form = $("#contactForm");
  if (!$form.length) return;

  const session = getSession();
  if (!session) return;

  const profileStore = readJson(STORAGE_KEYS.memberProfiles, {});
  const existingProfile = profileStore[session.email];
  if (existingProfile) {
    Object.entries(existingProfile).forEach(([key, value]) => {
      $form.find(`[name="${key}"]`).val(value);
    });
  }

  $form.on("submit", function (event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    profileStore[session.email] = formData;
    writeJson(STORAGE_KEYS.memberProfiles, profileStore);
    setMessage(".js-contact-message", "Profile details saved locally.", false);
  });
}

function bindLogout() {
  $(".js-logout").on("click", () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    window.location.href = "login.html";
  });
}

$(function () {
  guardDashboard();
  updateNavbar();
  bindSignupForm();
  bindLoginForm();
  bindInterestForm();
  bindContactForm();
  bindLogout();
});
