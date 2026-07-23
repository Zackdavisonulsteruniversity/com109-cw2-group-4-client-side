const STORAGE_KEYS = {
  users: "uuGymUsers",
  session: "uuGymSession",
  interestDraft: "uuGymInterestDraft",
  memberProfiles: "uuGymMemberProfiles",
  accessibilityPrefs: "uuGymAccessibilityPrefs"
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

function getAccessibilityPrefs() {
  const defaults = { highContrast: false, largeText: false, reducedMotion: false };
  return { ...defaults, ...readJson(STORAGE_KEYS.accessibilityPrefs, defaults) };
}

function setAccessibilityPrefs(prefs) {
  writeJson(STORAGE_KEYS.accessibilityPrefs, prefs);
}

function applyAccessibilityPrefs() {
  const prefs = getAccessibilityPrefs();
  $("body")
    .toggleClass("a11y-high-contrast", prefs.highContrast)
    .toggleClass("a11y-large-text", prefs.largeText)
    .toggleClass("a11y-reduced-motion", prefs.reducedMotion);

  $(".js-toggle-contrast").attr("aria-pressed", String(prefs.highContrast));
  $(".js-toggle-text").attr("aria-pressed", String(prefs.largeText));
  $(".js-toggle-motion").attr("aria-pressed", String(prefs.reducedMotion));
}

function ensureSkipLink() {
  const $main = $("main").first();
  if (!$main.length) return;

  const mainId = $main.attr("id") || "main-content";
  $main.attr("id", mainId).attr("tabindex", "-1");

  if (!$(".skip-link").length) {
    $("body").prepend(`<a class="skip-link" href="#${mainId}">Skip to main content</a>`);
  } else {
    $(".skip-link").attr("href", `#${mainId}`);
  }
}

function renderSharedComponents() {
  const navbar = `
    <header class="site-header">
      <div class="utility-bar py-2">
        <div class="container d-flex flex-column flex-md-row justify-content-between gap-1 small">
          <span>Ulster University Gym</span>
          <span>Student, staff, and community memberships</span>
        </div>
      </div>
      <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div class="container">
          <a class="navbar-brand fw-bold text-primary" href="index.html">Ulster Uni Gym</a>
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
            <div class="d-flex align-items-center gap-2 accessibility-controls me-2" role="group" aria-label="Accessibility controls">
              <button class="btn btn-outline-secondary btn-sm js-toggle-contrast" type="button" aria-pressed="false" title="Toggle high contrast">Contrast</button>
              <button class="btn btn-outline-secondary btn-sm js-toggle-text" type="button" aria-pressed="false" title="Toggle larger text">Text +</button>
              <button class="btn btn-outline-secondary btn-sm js-toggle-motion" type="button" aria-pressed="false" title="Toggle reduced motion">Motion</button>
            </div>
            <div class="d-flex align-items-center gap-3">
              <span class="small text-secondary auth-only d-none">Logged in as <span class="js-user-name">Member</span></span>
              <button class="btn btn-primary btn-sm auth-only d-none js-logout" type="button">Log Out</button>
            </div>
          </div>
        </div>
      </nav>
    </header>`;

  const footer = `
    <footer class="site-footer mt-5">
      <div class="container py-5">
        <div class="row g-4">
          <div class="col-md-4">
            <h2 class="h6 footer-heading">Ulster Uni Gym</h2>
            <p class="small text-secondary mb-0">A clean, modern membership portal for students, staff, and community users.</p>
          </div>
          <div class="col-md-4">
            <h2 class="h6 footer-heading">Quick Links</h2>
            <ul class="list-unstyled footer-links mb-0">
              <li><a class="nav-link px-0 nav-home" href="index.html">Home</a></li>
              <li><a class="nav-link px-0 nav-info" href="information.html">Information</a></li>
              <li><a class="nav-link px-0 nav-membership" href="membership.html">Memberships</a></li>
              <li><a class="nav-link px-0 nav-signup" href="signup.html">Sign Up</a></li>
              <li><a class="nav-link px-0 nav-login" href="login.html">Log In</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h2 class="h6 footer-heading">Membership Snapshot</h2>
            <p class="small text-secondary mb-1">UU Student: £230/yr or £21/mo</p>
            <p class="small text-secondary mb-1">Staff & Grads: £280/yr or £26/mo</p>
            <p class="small text-secondary mb-0">Community: £325/yr or £31/mo</p>
          </div>
        </div>
      </div>
      <div class="footer-bottom border-top py-3">
        <div class="container d-flex flex-column flex-md-row justify-content-between gap-2 small text-secondary">
          <span>© <span class="js-current-year"></span> Ulster University</span>
          <span>Memberships and access details are sample content.</span>
        </div>
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

function bindAccessibilityControls() {
  $(document).on("click", ".js-toggle-contrast", () => {
    const prefs = getAccessibilityPrefs();
    prefs.highContrast = !prefs.highContrast;
    setAccessibilityPrefs(prefs);
    applyAccessibilityPrefs();
  });

  $(document).on("click", ".js-toggle-text", () => {
    const prefs = getAccessibilityPrefs();
    prefs.largeText = !prefs.largeText;
    setAccessibilityPrefs(prefs);
    applyAccessibilityPrefs();
  });

  $(document).on("click", ".js-toggle-motion", () => {
    const prefs = getAccessibilityPrefs();
    prefs.reducedMotion = !prefs.reducedMotion;
    setAccessibilityPrefs(prefs);
    applyAccessibilityPrefs();
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

function updateFooterYear() {
  $(".js-current-year").text(new Date().getFullYear());
}

function setMessage(selector, message, isError) {
  $(selector)
    .attr("role", "status")
    .attr("aria-live", "polite")
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
  applyAccessibilityPrefs();
  ensureSkipLink();
  guardDashboard();
  renderSharedComponents();
  bindAccessibilityControls();
  updateNavbar();
  applyAccessibilityPrefs();
  updateFooterYear();
  bindLogout();
  bindSignupForm();
  bindLoginForm();
  bindInterestForm();
  bindContactForm();
});
