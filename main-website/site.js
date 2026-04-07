const WHATSAPP_BASE = "https://wa.me/917845927606?text=";
const WHATSAPP_MESSAGE =
  "Hello Veludaiyaan Hospital, I would like to book an appointment.\n\nName:\nAge:\nProblem:\nPreferred Date:";

const WHATSAPP_LINK = WHATSAPP_BASE + encodeURIComponent(WHATSAPP_MESSAGE);
const EMERGENCY_TEL = "tel:+917845927606";
const PATIENT_GATEWAY_PATH = "/patient/login";
const PATIENT_GATEWAY_LOCAL = "http://localhost:3000/patient/login";

const THEME_LABELS = {
  light: "LIGHT",
  dark: "DARK"
};

const THEME_SYMBOLS = {
  dark: `
    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.3 14.8a8 8 0 1 1-11.1-11 7 7 0 1 0 11.1 11Z" />
    </svg>
  `,
  light: `
    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5V5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  `
};

const ICON_PATHS = {
  phone: `
    <path d="M2.25 4.5a1.5 1.5 0 0 1 1.5-1.5h2.9a1.5 1.5 0 0 1 1.45 1.12l.58 2.33a1.5 1.5 0 0 1-.43 1.45l-1.2 1.2a12.04 12.04 0 0 0 5.91 5.91l1.2-1.2a1.5 1.5 0 0 1 1.45-.43l2.33.58A1.5 1.5 0 0 1 21 17.35v2.9a1.5 1.5 0 0 1-1.5 1.5h-.75C9.33 21.75 2.25 14.67 2.25 6.75V4.5Z" />
  `,
  landline: `
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M10 6h4M12 18h.01" />
  `,
  whatsapp: `
    <path d="M20.5 11.5a8.5 8.5 0 0 1-12.55 7.5L3.5 20.5l1.5-4.2a8.5 8.5 0 1 1 15.5-4.8Z" />
    <path d="M9.8 8.8c.1-.3.3-.4.6-.4h.6c.2 0 .4.1.5.3l.4 1c.1.2 0 .4-.1.5l-.4.5c.4.8 1.1 1.5 1.9 1.9l.5-.4c.1-.1.3-.2.5-.1l1 .4c.2.1.3.3.3.5v.6c0 .3-.1.5-.4.6-.3.1-.7.2-1 .2-2.3 0-4.7-2.4-4.7-4.7 0-.4.1-.7.2-1Z" />
  `,
  instagram: `
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  `,
  linkedin: `
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
    <path d="M8 10.5V16M8 8v.01M11.5 16v-3.2a1.8 1.8 0 0 1 3.6 0V16" />
  `,
  map: `
    <path d="M12 21s6-5.25 6-11a6 6 0 1 0-12 0c0 5.75 6 11 6 11Z" />
    <circle cx="12" cy="10" r="2.25" />
  `,
  care: `
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8M8 12h8" />
  `,
  shield: `
    <path d="M12 3l7 3v5c0 5-3.4 8.5-7 10-3.6-1.5-7-5-7-10V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  `,
  bone: `
    <circle cx="6.5" cy="10" r="2.5" />
    <circle cx="8.5" cy="14" r="2.5" />
    <circle cx="15.5" cy="10" r="2.5" />
    <circle cx="17.5" cy="14" r="2.5" />
    <path d="M8 11.5h8M8 12.5h8" />
  `,
  facility: `
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M12 8v6M9 11h6M8 20v-4h8v4" />
  `,
  pulse: `
    <path d="M3 12h4l2-3 3 6 2-4h7" />
    <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10Z" />
  `
};

let currentTheme = "light";
let currentLanguage = "en";
let translateInitPromise = null;
let progressRaf = null;

function normalizeText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function buildIcon(type, sizeClass = "h-4 w-4") {
  const path = ICON_PATHS[type];
  if (!path) return "";

  return `
    <svg
      aria-hidden="true"
      class="${sizeClass} shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      ${path}
    </svg>
  `;
}

function decorateInteractiveIcon(el, type, options = {}) {
  if (!el || el.dataset.iconDecorated === "true") return;

  const text = normalizeText(el.textContent);
  const iconOnly = options.iconOnly === true;
  const iconSize = iconOnly ? "h-5 w-5" : "h-4 w-4";
  const icon = buildIcon(type, iconSize);

  if (!icon) return;

  if (iconOnly) {
    el.innerHTML = `<span class="sr-only">${options.label || text || type}</span>${icon}`;
    el.classList.add("inline-flex", "items-center", "justify-center");
    if (!el.getAttribute("aria-label")) {
      el.setAttribute("aria-label", options.label || text || type);
    }
    el.dataset.iconDecorated = "true";
    return;
  }

  if (!text) return;

  el.textContent = "";
  el.insertAdjacentHTML("beforeend", icon);
  const label = document.createElement("span");
  label.textContent = text;
  el.append(label);

  el.classList.add("inline-flex", "items-center", "gap-2");
  if (el.classList.contains("text-center")) {
    el.classList.add("justify-center");
  }
  el.dataset.iconDecorated = "true";
}

function decorateStaticIcon(el, type) {
  if (!el || el.dataset.iconDecorated === "true" || el.children.length > 0) return;

  const text = normalizeText(el.textContent);
  const icon = buildIcon(type, "h-4 w-4");
  if (!text || !icon) return;

  el.textContent = "";
  el.insertAdjacentHTML("beforeend", `${icon}<span>${text}</span>`);
  el.classList.add("inline-flex", "items-center", "gap-1.5");
  el.dataset.iconDecorated = "true";
}

function wireQuickLinks() {
  document.querySelectorAll("[data-wa-link]").forEach((el) => {
    if (el.tagName === "A") {
      el.setAttribute("href", WHATSAPP_LINK);
    }
  });

  document.querySelectorAll("[data-emergency-call]").forEach((el) => {
    if (el.tagName === "A") {
      el.setAttribute("href", EMERGENCY_TEL);
    }
  });
}

function wirePatientGatewayLinks() {
  const useLocalGateway =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const getHostedBasePath = () => {
    if (!window.location.hostname.endsWith("github.io")) {
      return "";
    }

    const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
    return firstSegment ? `/${firstSegment}` : "";
  };

  const gatewayUrl = useLocalGateway
    ? PATIENT_GATEWAY_LOCAL
    : `${getHostedBasePath()}${PATIENT_GATEWAY_PATH}`;

  document.querySelectorAll("a[data-patient-gateway]").forEach((el) => {
    el.setAttribute("href", gatewayUrl);
    el.setAttribute("title", "Open Patient Portal");
  });
}

function decorateInterfaceIcons() {
  document.querySelectorAll("a[data-emergency-call]").forEach((el) => {
    decorateInteractiveIcon(el, "phone");
  });

  document.querySelectorAll("a[data-wa-link]").forEach((el) => {
    const text = normalizeText(el.textContent);
    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
    const isFloating = el.classList.contains("fixed") || aria.includes("whatsapp");
    const iconOnly = isFloating || text.toUpperCase() === "WA";
    decorateInteractiveIcon(el, "whatsapp", { iconOnly, label: "WhatsApp" });
    if (isFloating) {
      if (!el.getAttribute("aria-label")) {
        el.setAttribute("aria-label", "WhatsApp Chat");
      }
      el.setAttribute("title", "WhatsApp Chat");
    }
  });

  document.querySelectorAll('a[href^="tel:+914142233606"]').forEach((el) => {
    decorateInteractiveIcon(el, "landline");
  });

  document.querySelectorAll('a[href*="instagram.com"]').forEach((el) => {
    decorateInteractiveIcon(el, "instagram");
  });

  document.querySelectorAll('a[href*="linkedin.com"]').forEach((el) => {
    decorateInteractiveIcon(el, "linkedin");
  });

  document.querySelectorAll("a").forEach((el) => {
    const text = normalizeText(el.textContent);
    if (/directions|map/i.test(text)) {
      decorateInteractiveIcon(el, "map");
    }
  });

  document.querySelectorAll("span, p").forEach((el) => {
    const text = normalizeText(el.textContent);

    if (text === "Manjakuppam, Cuddalore") {
      decorateStaticIcon(el, "map");
      return;
    }

    if (text === "04142 233606" || text === "Landline: 04142 233606") {
      decorateStaticIcon(el, "landline");
    }
  });
}

function getHeadingIconType(text) {
  const value = normalizeText(text).toLowerCase();

  if (!value) return null;

  if (/emergency|trauma|critical|casualty|ambulance|stabilization/.test(value)) {
    return "shield";
  }

  if (/knee|hip|spine|joint|arth|ortho|foot|ankle|pain|sports|fracture/.test(value)) {
    return "bone";
  }

  if (/surgery|operation|procedure|ot|reconstructive|maxillary/.test(value)) {
    return "care";
  }

  if (/doctor|medical|team|cardio|internal|clinical|governance|consultation/.test(value)) {
    return "care";
  }

  if (/facility|inpatient|room|x-ray|lab|pharmacy|diagnostics|workflow|infrastructure/.test(value)) {
    return "facility";
  }

  if (/patient|recovery|follow-up|journey|mission|vision|trust/.test(value)) {
    return "pulse";
  }

  return null;
}

function decorateContentHeadingIcons() {
  document.querySelectorAll("main h2, main h3").forEach((heading) => {
    if (!heading || heading.dataset.headingIconDecorated === "true") return;
    if (heading.querySelector("svg")) return;

    const text = normalizeText(heading.textContent);
    const iconType = getHeadingIconType(text);
    if (!iconType) return;

    const icon = buildIcon(iconType, "h-4 w-4");
    if (!icon) return;

    heading.insertAdjacentHTML("afterbegin", icon);
    heading.classList.add("flex", "flex-wrap", "items-start", "gap-2");
    heading.dataset.headingIconDecorated = "true";
  });
}

function injectAlignmentStyles() {
  if (document.getElementById("site-alignment-styles")) return;

  const style = document.createElement("style");
  style.id = "site-alignment-styles";
  style.textContent = `
    .site-main-shell h1,
    .site-main-shell h2 {
      text-wrap: balance;
    }
    .site-card-stack {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .site-card-stack > :last-child {
      margin-bottom: 0;
    }
    .site-grid-stretch {
      align-items: stretch;
    }
  `;
  document.head.append(style);
}

function injectHeaderToggleMobileStyles() {
  if (document.getElementById("site-toggle-mobile-styles")) return;

  const style = document.createElement("style");
  style.id = "site-toggle-mobile-styles";
  style.textContent = `
    @media (max-width: 767.98px) {
      [data-lang-toggle],
      [data-theme-toggle] {
        position: relative;
        min-width: 2.5rem;
        padding-left: 0.6rem !important;
        padding-right: 0.6rem !important;
        gap: 0 !important;
      }

      [data-lang-toggle] [data-lang-label],
      [data-theme-toggle] [data-theme-icon] {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    }
  `;
  document.head.append(style);
}

function setupGlobalAlignment() {
  injectAlignmentStyles();
  injectHeaderToggleMobileStyles();

  const main = document.querySelector("main");
  if (main) {
    main.classList.add("site-main-shell");
  }

  document.querySelectorAll("main .grid").forEach((grid) => {
    const directCards = Array.from(grid.children).filter((el) =>
      el.matches("article, aside, section, div")
    );
    if (directCards.length >= 2) {
      grid.classList.add("site-grid-stretch");
    }
  });

  document.querySelectorAll("main article").forEach((card) => {
    card.classList.add("site-card-stack");
  });

  const heroAside = document.querySelector("main > section aside");
  if (heroAside) {
    heroAside.classList.add("h-full", "flex", "flex-col");
  }
}

function injectMotionStyles() {
  if (document.getElementById("site-motion-styles")) return;

  const style = document.createElement("style");
  style.id = "site-motion-styles";
  style.textContent = `
    @keyframes siteGradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes siteFloatBob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes siteSoftPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.25); }
      70% { box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
    }
    @keyframes siteSheenMove {
      0% { transform: translateX(-140%); }
      55% { transform: translateX(140%); }
      100% { transform: translateX(140%); }
    }
    @keyframes siteRotateSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes siteKenBurns {
      0% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
      100% { transform: translateY(0); }
    }
    @keyframes siteRiseIn {
      0% { opacity: 0; transform: translateY(16px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .site-scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      pointer-events: none;
      z-index: 90;
    }
    .site-scroll-progress-bar {
      height: 100%;
      transform-origin: left center;
      transform: scaleX(0);
      background: linear-gradient(90deg, #0f68c7 0%, #06b6d4 55%, #10b981 100%);
      box-shadow: 0 0 14px rgba(6, 182, 212, 0.45);
      transition: transform .14s linear;
    }
    .site-hover-lift {
      transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
      will-change: transform;
    }
    .site-hover-lift:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
    }
    .site-gradient-shift {
      background-size: 200% 200%;
      animation: siteGradientShift 12s ease infinite;
    }
    .site-float-bob {
      animation: siteFloatBob 3.1s ease-in-out infinite;
    }
    .site-soft-pulse {
      animation: siteSoftPulse 2.8s ease-out infinite;
    }
    .site-btn-sheen {
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }
    .site-btn-sheen::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.35) 48%, transparent 78%);
      transform: translateX(-140%);
      animation: siteSheenMove 4.2s ease-in-out infinite;
      pointer-events: none;
    }
    .site-rotate-slow {
      animation: siteRotateSlow 11s linear infinite;
    }
    .site-hero-media {
      animation: siteKenBurns 12s ease-in-out infinite;
      transform-origin: center;
    }
    .site-rise-in {
      opacity: 0;
      animation: siteRiseIn .72s cubic-bezier(.22,.61,.36,1) forwards;
    }
    @media (prefers-reduced-motion: reduce) {
      .site-hover-lift,
      .site-gradient-shift,
      .site-float-bob,
      .site-soft-pulse,
      .site-btn-sheen::after,
      .site-rotate-slow,
      .site-hero-media,
      .site-rise-in {
        animation: none !important;
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
      }
    }
  `;
  document.head.append(style);
}

function setupAmbientAnimations() {
  injectMotionStyles();

  document.querySelectorAll("main article").forEach((card) => {
    card.classList.add("site-hover-lift");
  });

  document.querySelectorAll("a[class*='bg-gradient']").forEach((btn) => {
    btn.classList.add("site-btn-sheen");
  });

  document.querySelectorAll("main section [class*='from-brand-700'][class*='to-cyan-500'], main section [class*='from-brand-700'][class*='to-emerald-600']").forEach((block) => {
    block.classList.add("site-gradient-shift");
  });

  document.querySelectorAll("a[data-wa-link].fixed").forEach((btn) => {
    if (btn.classList.contains("fixed")) {
      btn.classList.add("site-float-bob", "site-soft-pulse");
    }
  });

  document.querySelectorAll("img[src*='hero.jpg']").forEach((img) => {
    img.classList.add("site-hero-media");
  });

  document.querySelectorAll("[data-lang-toggle] svg").forEach((icon) => {
    icon.classList.add("site-rotate-slow");
  });

  const firstSection = document.querySelector("main > section:first-of-type");
  if (firstSection) {
    const heroBits = Array.from(firstSection.querySelectorAll("h1:not([data-reveal]), h2:not([data-reveal]), p:not([data-reveal]), a, img, article")).slice(0, 10);
    heroBits.forEach((el, index) => {
      if (el.dataset.riseAnimated === "true") return;
      el.classList.add("site-rise-in");
      el.style.animationDelay = `${110 + index * 70}ms`;
      el.dataset.riseAnimated = "true";
    });
  }
}

function setupFloatingWhatsAppButton() {
  const floatingButtons = Array.from(document.querySelectorAll("a[data-wa-link].fixed"));
  if (!floatingButtons.length) return;

  const syncFloatingButton = () => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    floatingButtons.forEach((btn) => {
      btn.style.position = "fixed";
      btn.style.right = "1.5rem";
      btn.style.bottom = "1.5rem";
      btn.style.zIndex = "55";

      if (!btn.getAttribute("aria-label")) {
        btn.setAttribute("aria-label", "WhatsApp Chat");
      }
      btn.setAttribute("title", "WhatsApp Chat");

      if (isDesktop) {
        btn.classList.remove("hidden");
        btn.classList.add("inline-flex");
      } else {
        btn.classList.add("hidden");
        btn.classList.remove("inline-flex");
      }

      if (btn.parentElement !== document.body) {
        document.body.append(btn);
      }
    });
  };

  syncFloatingButton();
  window.addEventListener("resize", syncFloatingButton);
}

function setupScrollProgressBar() {
  if (document.getElementById("site-scroll-progress")) return;

  const wrap = document.createElement("div");
  wrap.id = "site-scroll-progress";
  wrap.className = "site-scroll-progress";
  wrap.innerHTML = `<div class="site-scroll-progress-bar"></div>`;
  document.body.append(wrap);

  const bar = wrap.firstElementChild;
  if (!bar) return;

  const update = () => {
    progressRaf = null;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 1;
    bar.style.transform = `scaleX(${progress})`;
  };

  const requestUpdate = () => {
    if (progressRaf !== null) return;
    progressRaf = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  const actionTheme = isDark ? "light" : "dark";

  currentTheme = isDark ? "dark" : "light";
  document.documentElement.classList.toggle("dark", isDark);

  document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
    icon.textContent = THEME_LABELS[actionTheme];
  });

  document.querySelectorAll("[data-theme-symbol]").forEach((symbol) => {
    symbol.innerHTML = THEME_SYMBOLS[actionTheme];
  });

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-label", actionTheme === "light" ? "Switch to light theme" : "Switch to dark theme");
  });

  try {
    localStorage.setItem("site-theme", currentTheme);
  } catch (_) {
    // Ignore storage restrictions.
  }
}

function setupThemeToggle() {
  let initialTheme = "light";
  try {
    const saved = localStorage.getItem("site-theme");
    if (saved === "dark" || saved === "light") {
      initialTheme = saved;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initialTheme = "dark";
    }
  } catch (_) {
    // Ignore storage restrictions.
  }

  applyTheme(initialTheme);

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark");
      applyTheme(isDark ? "light" : "dark");
    });
  });
}

function ensureTranslateStyles() {
  if (document.getElementById("translate-ui-hide")) return;

  const style = document.createElement("style");
  style.id = "translate-ui-hide";
  style.textContent = `
    .goog-te-banner-frame.skiptranslate { display: none !important; }
    body { top: 0 !important; }
    #google_translate_element { position: absolute; left: -9999px; top: -9999px; }
  `;
  document.head.append(style);
}

function ensureTranslateWidget() {
  if (translateInitPromise) return translateInitPromise;

  translateInitPromise = new Promise((resolve, reject) => {
    if (document.querySelector(".goog-te-combo")) {
      resolve();
      return;
    }

    ensureTranslateStyles();

    let container = document.getElementById("google_translate_element");
    if (!container) {
      container = document.createElement("div");
      container.id = "google_translate_element";
      document.body.append(container);
    }

    window.googleTranslateElementInit = () => {
      try {
        if (!window.google || !window.google.translate) {
          reject(new Error("Google Translate failed to initialize."));
          return;
        }

        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ta",
            autoDisplay: false
          },
          "google_translate_element"
        );

        setTimeout(resolve, 250);
      } catch (error) {
        reject(error);
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => reject(new Error("Google Translate script failed to load."));
      document.head.append(script);
    }
  });

  return translateInitPromise;
}

function updateLanguageToggleUi() {
  const isTamil = currentLanguage === "ta";

  document.querySelectorAll("[data-lang-label]").forEach((label) => {
    label.textContent = isTamil ? "English" : "Tamil";
  });

  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.setAttribute("aria-label", isTamil ? "Switch language to English" : "Switch language to Tamil");
    btn.setAttribute("title", isTamil ? "Switch to English" : "Switch to Tamil");
  });
}

function applyLanguage(language) {
  currentLanguage = language === "ta" ? "ta" : "en";
  updateLanguageToggleUi();

  try {
    localStorage.setItem("site-language", currentLanguage);
  } catch (_) {
    // Ignore storage restrictions.
  }

  ensureTranslateWidget()
    .then(() => {
      const combo = document.querySelector(".goog-te-combo");
      if (!combo) return;

      const target = currentLanguage === "ta" ? "ta" : "en";
      if (combo.value !== target) {
        combo.value = target;
        combo.dispatchEvent(new Event("change"));
      }
    })
    .catch(() => {
      // Ignore translate failures and keep English content.
    });
}

function setupLanguageToggle() {
  let initialLanguage = "en";
  try {
    const saved = localStorage.getItem("site-language");
    if (saved === "en" || saved === "ta") {
      initialLanguage = saved;
    }
  } catch (_) {
    // Ignore storage restrictions.
  }

  updateLanguageToggleUi();

  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(currentLanguage === "ta" ? "en" : "ta");
    });
  });

  applyLanguage(initialLanguage);
}

function setupMobileMenu() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");

  if (!menuBtn || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  setOpen(false);

  menuBtn.addEventListener("click", () => {
    const open = menu.classList.contains("hidden");
    setOpen(open);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      setOpen(false);
    }
  });
}

function highlightActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const page = href.split("/").pop() || "index.html";
    const active = page === current;

    link.classList.toggle("bg-brand-100", active);
    link.classList.toggle("text-brand-800", active);
    link.classList.toggle("dark:bg-slate-800", active);
    link.classList.toggle("dark:text-brand-300", active);
  });
}

function setupRevealAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = Array.from(document.querySelectorAll("[data-reveal]"));

  if (!elements.length) return;

  elements.forEach((el, index) => {
    el.classList.add("transition-all", "duration-700", "ease-out", "opacity-0", "translate-y-6");
    el.style.transitionDelay = `${Math.min((index % 10) * 65, 420)}ms`;
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach((el) => {
      el.classList.remove("opacity-0", "translate-y-6");
      el.classList.add("opacity-100", "translate-y-0");
      el.style.transitionDelay = "0ms";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("opacity-0", "translate-y-6");
        entry.target.classList.add("opacity-100", "translate-y-0");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function init() {
  wireQuickLinks();
  wirePatientGatewayLinks();
  setupScrollProgressBar();
  setupGlobalAlignment();
  decorateInterfaceIcons();
  decorateContentHeadingIcons();
  setupFloatingWhatsAppButton();
  setupAmbientAnimations();
  setupThemeToggle();
  setupLanguageToggle();
  setupMobileMenu();
  highlightActiveNav();
  setupRevealAnimations();
}

init();
