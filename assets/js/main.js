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

function renderSharedComponents() {
  const navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-semibold" href="index.html">Ulster Uni Gym</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link nav-home" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link nav-info" href="information.html">Information</a></li>
            <li class="nav-item"><a class="nav-link nav-membership" href="membership.html">Memberships</a></li>
            <li class="nav-item"><a class="nav-link nav-signup" href="signup.html">Sign Up</a></li>
            <li class="nav-item"><a class="nav-link nav-login" href="login.html">Log In</a></li>
            <li class="nav-item"><a class="nav-link nav-dashboard auth-only d-none" href="dashboard.html">Dashboard</a></li>
          </ul>
          <div class="d-flex gap-2 align-items-center">
            <span class="text-white-50 small auth-only d-none">Logged in as <span class="js-user-name">Member</span></span>
            <button class="btn btn-outline-light btn-sm auth-only d-none js-logout" type="button">Log Out</button>
          </div>
        </div>
      </div>
    </nav>`;

  const footer = `
    <footer class="site-footer border-top py-4 mt-5">
      <div class="container d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <p class="mb-0 small">Ulster University Gym Template</p>
        <ul class="nav small">
          <li class="nav-item"><a class="nav-link px-2 py-0 nav-home" href="index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link px-2 py-0 nav-info" href="information.html">Information</a></li>
          <li class="nav-item"><a class="nav-link px-2 py-0 nav-membership" href="membership.html">Memberships</a></li>
          <li class="nav-item"><a class="nav-link px-2 py-0 nav-signup" href="signup.html">Sign Up</a></li>
          <li class="nav-item"><a class="nav-link px-2 py-0 nav-login" href="login.html">Log In</a></li>
          <li class="nav-item auth-only d-none"><a class="nav-link px-2 py-0 nav-dashboard" href="dashboard.html">Dashboard</a></li>
        </ul>
        <p class="mb-0 small text-secondary">© <span class="js-current-year"></span> Ulster University</p>
      </div>
    </footer>`;

  const $navbar = $("#navbar-placeholder");
  const $footer = $("#footer-placeholder");

  if ($navbar.length) {
    $navbar.html(navbar);
  }
  if ($footer.length) {
    $footer.html(footer);
  }
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

function updateFooterYear() {
  $(".js-current-year").text(new Date().getFullYear());
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
  renderSharedComponents();
  updateNavbar();
  updateFooterYear();
  bindLogout();
  bindSignupForm();
  bindLoginForm();
  bindInterestForm();
  bindContactForm();
});
