document.addEventListener("DOMContentLoaded", function () {
  // Current year in footer
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Language selector: Gujarati, English, Hindi
  const languageSelect = document.getElementById("languageSelect");

  function applyLanguage(language) {
    const supportedLanguages = ["gu", "en", "hi"];

    if (!supportedLanguages.includes(language)) {
      language = "gu";
    }

    document.documentElement.lang = language;

    // Translate all elements with data-en, data-gu or data-hi
    document.querySelectorAll("[data-" + language + "]").forEach(
      function (element) {
        const translatedText =
          element.getAttribute("data-" + language);

        if (translatedText !== null) {
          element.textContent = translatedText;
        }
      }
    );

    // Translate placeholders
    document.querySelectorAll("[data-placeholder-" + language + "]")
      .forEach(function (element) {
        element.placeholder =
          element.getAttribute("data-placeholder-" + language);
      });

    if (languageSelect) {
      languageSelect.value = language;
    }

    // Let pages such as order.html update dynamic dropdowns
    document.dispatchEvent(
      new CustomEvent("websiteLanguageChanged", {
        detail: { language: language }
      })
    );

    try {
      localStorage.setItem("bew-language", language);
    } catch (error) {
      // Language switching still works without browser storage.
    }
  }

  let savedLanguage = "gu";

  try {
    savedLanguage = localStorage.getItem("bew-language") || "gu";
  } catch (error) {
    savedLanguage = "gu";
  }

  if (languageSelect) {
    languageSelect.value = savedLanguage;
  }

  applyLanguage(savedLanguage);

  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      applyLanguage(languageSelect.value);
    });
  }

  // Dark / Light theme
  const themeToggle = document.getElementById("themeToggle");
  let darkMode = false;

  try {
    darkMode = localStorage.getItem("bew-theme") === "dark";
  } catch (error) {
    darkMode = false;
  }

  function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    if (themeToggle) {
      themeToggle.textContent = isDark ? "☀️" : "🌙";

      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );

      themeToggle.title = isDark ? "Light Mode" : "Dark Mode";
    }

    try {
      localStorage.setItem("bew-theme", isDark ? "dark" : "light");
    } catch (error) {
      // Theme still works without browser storage.
    }
  }

  applyTheme(darkMode);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      darkMode = !document.body.classList.contains("dark-mode");
      applyTheme(darkMode);
    });
  }

  // Highlight current navigation link
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("#mainNav a").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Shared website helpers
  window.BrahmaniWebsite = {
    isValidIndianMobile: function (phone) {
      return /^[6-9]\d{9}$/.test(String(phone).trim());
    },

    isAnkleshwarServiceArea: function (area) {
      return String(area).trim().toLowerCase() === "ankleshwar";
    },

    openWhatsApp: function (message, phone) {
      const number = phone || "919426521721";
      const cleanNumber = String(number).replace(/\D/g, "");

      if (!/^\d{12}$/.test(cleanNumber)) {
        alert("Please check the WhatsApp number.");
        return;
      }

      const url =
        "https://wa.me/" +
        cleanNumber +
        "?text=" +
        encodeURIComponent(
          String(
            message ||
            "Hello, I need electrical service in Ankleshwar."
          )
        );

      window.open(url, "_blank", "noopener,noreferrer");
    },

    applyLanguage: applyLanguage
  };

  console.log("Brahmani Electrical Works website loaded successfully.");
});