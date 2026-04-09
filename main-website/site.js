const HOSPITAL_WHATSAPP_NUMBER = "917845927606";
const WHATSAPP_BASE = `https://wa.me/${HOSPITAL_WHATSAPP_NUMBER}?text=`;
const WHATSAPP_MESSAGE =
  "Hello Veludaiyaan Hospital, I would like to book an appointment.\n\nName:\nAge:\nProblem:\nPreferred Date:";

const WHATSAPP_LINK = WHATSAPP_BASE + encodeURIComponent(WHATSAPP_MESSAGE);
const EMERGENCY_TEL = "tel:+917845927606";
const PATIENT_GATEWAY_PATH = "/patient/login";
const PATIENT_GATEWAY_LOCAL = "http://localhost:3000/patient/login";
const FLOATING_CHATBOT_ICON = "images/robot-chat-icon.jpg";

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
let progressRaf = null;
let appointmentChatbotUi = null;
let appointmentTypingTimer = null;
let hideFloatingBookingHint = () => {};
let scheduleFloatingBookingHint = () => {};

const APPOINTMENT_CHAT_CONFIG = {
  hospitalWhatsAppNumber: HOSPITAL_WHATSAPP_NUMBER,
  resetAfterSuccessfulHandoff: false,
  doctors: [
    { id: "dr-senthil-s", en: "Dr. Senthil S" },
    { id: "dr-anbarasan-k", en: "Dr. Anbarasan K" },
    { id: "dr-rajesh-m", en: "Dr. Rajesh M" },
    { id: "dr-jayakar", en: "Dr. Jayakar" },
    { id: "dr-rajini-s", en: "Dr. Rajini S" },
    { id: "dr-nishanth-s", en: "Dr. Nishanth S" }
  ],
  timeSlots: [
    { id: "morning", en: "9:00 AM - 3:00 PM" },
    { id: "evening", en: "5:30 PM - 9:30 PM" }
  ]
};

const APPOINTMENT_CHAT_COPY = {
  en: {
    hospitalName: "Veludaiyaan Ortho & Trauma Specialty Hospital",
    assistantTitle: "Appointment Booking Assistant",
    welcome:
      "Welcome to Veludaiyaan Ortho & Trauma Specialty Hospital. I will help you book your appointment in a few quick steps.",
    askName: "What is your name?",
    askMobile: "What is your mobile number?",
    askDoctor: "Which doctor would you like to consult?",
    askReason: "What is the reason for your visit?",
    askDate: "Which date would you prefer?",
    askTiming: "Which timing do you prefer?",
    confirmPrompt: "Please confirm your appointment request details",
    nameLabel: "Patient Name",
    phoneLabel: "Phone",
    doctorLabel: "Preferred Doctor",
    reasonLabel: "Reason for Visit",
    dateLabel: "Preferred Date",
    timingLabel: "Preferred OP Timing",
    selectDoctorPlaceholder: "Select doctor",
    namePlaceholder: "Enter patient name",
    mobilePlaceholder: "Enter 10-digit mobile",
    reasonPlaceholder: "Type complaint / symptoms",
    continueButton: "Continue",
    backButton: "Back",
    restartButton: "Restart booking",
    closeButton: "Close",
    sendWhatsApp: "Send via WhatsApp",
    preparing: "Preparing WhatsApp...",
    success: "Opening WhatsApp with your appointment message...",
    fallbackText:
      "If WhatsApp did not open automatically, use the options below.",
    openWhatsApp: "Open WhatsApp",
    callHospital: "Call Hospital",
    directWhatsApp: "WhatsApp directly",
    typing: "Typing...",
    invalidName: "Please enter patient name.",
    invalidMobileRequired: "Please enter mobile number.",
    invalidMobile: "Enter a valid Indian 10-digit mobile number.",
    invalidDoctor: "Please choose a doctor.",
    invalidReason: "Please enter reason for visit.",
    invalidDateRequired: "Please choose preferred date.",
    invalidDatePast: "Preferred date cannot be in the past.",
    invalidTiming: "Please choose OP timing.",
    bookingSummaryTitle: "Appointment Request",
    confirmAvailability: "Please confirm appointment availability."
  }
};

const APPOINTMENT_CHAT_STEP_KEYS = ["name", "mobile", "doctor", "reason", "date", "timing", "confirm"];

const appointmentChatState = {
  isOpen: false,
  step: 0,
  typing: false,
  error: "",
  isSubmitting: false,
  handoffFailed: false,
  handoffSuccess: false,
  lastAttemptLink: "",
  answers: {
    name: "",
    mobile: "",
    doctorId: "",
    reason: "",
    preferredDate: "",
    timingId: ""
  }
};

function normalizeText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function getHostedSiteBasePath() {
  if (window.location.protocol === "file:") return "";
  if (!window.location.hostname.endsWith("github.io")) return "";
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  return firstSegment ? `/${firstSegment}` : "";
}

function resolveSiteAssetPath(relativePath) {
  const cleanPath = String(relativePath || "").replace(/^\/+/, "");
  const basePath = getHostedSiteBasePath();
  return basePath ? `${basePath}/${cleanPath}` : cleanPath;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getAppointmentChatLanguage() {
  return "en";
}

function getAppointmentChatCopy() {
  return APPOINTMENT_CHAT_COPY.en;
}

function getFloatingBookingHintLabel() {
  return "Book Appointment";
}

function getLauncherChatBadgeLabel() {
  return "CHAT";
}

function getResponsiveLauncherPlacement() {
  const width = window.innerWidth;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  if (width < 768) {
    if (isPortrait) {
      return {
        button: { right: "1rem", bottom: "5.6rem" },
        hint: { right: "1rem", bottom: "10rem" },
        panel: { right: "0.75rem", left: "0.75rem", bottom: "10rem", maxHeight: "calc(100vh - 11rem)" }
      };
    }

    return {
      button: { right: "1rem", top: "1rem" },
      hint: { right: "1rem", top: "5.1rem" },
      panel: { right: "0.75rem", left: "0.75rem", top: "5.8rem", maxHeight: "calc(100vh - 6.8rem)" }
    };
  }

  if (width < 1200) {
    if (isPortrait) {
      return {
        button: { right: "1rem", top: "5.3rem" },
        hint: { right: "1rem", top: "9.4rem" },
        panel: { right: "1rem", top: "10.2rem", width: "380px", maxHeight: "calc(100vh - 11.2rem)" }
      };
    }

    return {
      button: { left: "1rem", top: "5.3rem" },
      hint: { left: "1rem", top: "9.4rem" },
      panel: { left: "1rem", top: "10.2rem", width: "380px", maxHeight: "calc(100vh - 11.2rem)" }
    };
  }

  return {
    button: { right: "1.5rem", bottom: "1.5rem" },
    hint: { right: "1.5rem", bottom: "5.6rem" },
    panel: { right: "1.5rem", bottom: "6rem", width: "380px", maxHeight: "calc(100vh - 7rem)" }
  };
}

function getAppointmentDoctorById(doctorId) {
  return APPOINTMENT_CHAT_CONFIG.doctors.find((doctor) => doctor.id === doctorId) || null;
}

function getAppointmentTimingById(timingId) {
  return APPOINTMENT_CHAT_CONFIG.timeSlots.find((slot) => slot.id === timingId) || null;
}

function formatAppointmentDate(dateValue) {
  if (!dateValue) return "";

  const parsed = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateValue;

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(parsed);
  } catch (_) {
    return dateValue;
  }
}

function getAppointmentStepQuestion(step, copy) {
  switch (APPOINTMENT_CHAT_STEP_KEYS[step]) {
    case "name":
      return copy.askName;
    case "mobile":
      return copy.askMobile;
    case "doctor":
      return copy.askDoctor;
    case "reason":
      return copy.askReason;
    case "date":
      return copy.askDate;
    case "timing":
      return copy.askTiming;
    case "confirm":
      return copy.confirmPrompt;
    default:
      return copy.askName;
  }
}

function getAppointmentStepAnswer(step) {
  const { answers } = appointmentChatState;

  switch (APPOINTMENT_CHAT_STEP_KEYS[step]) {
    case "name":
      return answers.name;
    case "mobile":
      return answers.mobile ? `+91 ${answers.mobile}` : "";
    case "doctor": {
      const doctor = getAppointmentDoctorById(answers.doctorId);
      return doctor ? doctor.en : "";
    }
    case "reason":
      return answers.reason;
    case "date":
      return formatAppointmentDate(answers.preferredDate);
    case "timing": {
      const slot = getAppointmentTimingById(answers.timingId);
      return slot ? slot.en : "";
    }
    default:
      return "";
  }
}

function buildAppointmentWhatsAppMessage(_lang, answers) {
  const doctor = getAppointmentDoctorById(answers.doctorId);
  const timing = getAppointmentTimingById(answers.timingId);
  const doctorLabel = doctor ? doctor.en : answers.doctorId;
  const timingLabel = timing ? timing.en : answers.timingId;
  const dateLabel = formatAppointmentDate(answers.preferredDate);

  return [
    "Appointment Request",
    "",
    `Patient Name: ${answers.name}`,
    `Phone: ${answers.mobile}`,
    `Preferred Doctor: ${doctorLabel}`,
    `Reason for Visit: ${answers.reason}`,
    `Preferred Date: ${dateLabel}`,
    `Preferred OP Timing: ${timingLabel}`,
    "",
    "Please confirm appointment availability."
  ].join("\n");
}

function buildAppointmentWhatsAppUrl(message) {
  return `https://wa.me/${APPOINTMENT_CHAT_CONFIG.hospitalWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}

function validateAppointmentStep(step, copy, payload = {}) {
  const key = APPOINTMENT_CHAT_STEP_KEYS[step];
  const rawValue = payload.value ?? "";
  const normalized = normalizeText(rawValue);

  if (key === "name") {
    if (!normalized) return { valid: false, error: copy.invalidName };
    return { valid: true, value: normalized };
  }

  if (key === "mobile") {
    const digits = String(rawValue || "").replace(/\D/g, "");
    if (!digits) return { valid: false, error: copy.invalidMobileRequired };
    if (!/^[6-9]\d{9}$/.test(digits)) return { valid: false, error: copy.invalidMobile };
    return { valid: true, value: digits };
  }

  if (key === "doctor") {
    if (!normalized || !getAppointmentDoctorById(normalized)) {
      return { valid: false, error: copy.invalidDoctor };
    }
    return { valid: true, value: normalized };
  }

  if (key === "reason") {
    if (!normalized) return { valid: false, error: copy.invalidReason };
    return { valid: true, value: normalized };
  }

  if (key === "date") {
    if (!normalized) return { valid: false, error: copy.invalidDateRequired };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(`${normalized}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      return { valid: false, error: copy.invalidDatePast };
    }

    return { valid: true, value: normalized };
  }

  if (key === "timing") {
    if (!normalized || !getAppointmentTimingById(normalized)) {
      return { valid: false, error: copy.invalidTiming };
    }
    return { valid: true, value: normalized };
  }

  return { valid: true, value: normalized };
}

function clearAppointmentTypingTimer() {
  if (appointmentTypingTimer !== null) {
    window.clearTimeout(appointmentTypingTimer);
    appointmentTypingTimer = null;
  }
}

function setAppointmentChatStep(nextStep, withTyping = true) {
  appointmentChatState.step = Math.max(0, Math.min(nextStep, APPOINTMENT_CHAT_STEP_KEYS.length - 1));
  appointmentChatState.error = "";
  appointmentChatState.handoffFailed = false;
  appointmentChatState.handoffSuccess = false;

  clearAppointmentTypingTimer();

  if (withTyping && appointmentChatState.step > 0) {
    appointmentChatState.typing = true;
    renderAppointmentChatbot();
    appointmentTypingTimer = window.setTimeout(() => {
      appointmentChatState.typing = false;
      renderAppointmentChatbot();
      focusAppointmentChatInput();
    }, 280);
    return;
  }

  appointmentChatState.typing = false;
  renderAppointmentChatbot();
  focusAppointmentChatInput();
}

function resetAppointmentChatState() {
  clearAppointmentTypingTimer();
  appointmentChatState.step = 0;
  appointmentChatState.typing = false;
  appointmentChatState.error = "";
  appointmentChatState.isSubmitting = false;
  appointmentChatState.handoffFailed = false;
  appointmentChatState.handoffSuccess = false;
  appointmentChatState.lastAttemptLink = "";
  appointmentChatState.answers = {
    name: "",
    mobile: "",
    doctorId: "",
    reason: "",
    preferredDate: "",
    timingId: ""
  };
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
      [data-theme-toggle] {
        position: relative;
        min-width: 2.5rem;
        padding-left: 0.6rem !important;
        padding-right: 0.6rem !important;
        gap: 0 !important;
      }

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

function ensureAppointmentChatbotStyles() {
  if (document.getElementById("appointment-chatbot-style")) return;

  const style = document.createElement("style");
  style.id = "appointment-chatbot-style";
  style.textContent = `
    .appointment-chat-scroll::-webkit-scrollbar {
      width: 8px;
    }
    .appointment-chat-scroll::-webkit-scrollbar-thumb {
      background: rgba(14, 116, 144, 0.28);
      border-radius: 999px;
    }
    .appointment-bubble-rise {
      animation: appointmentBubbleRise 220ms ease-out;
      transform-origin: left bottom;
    }
    .appointment-typing-dot {
      width: 0.35rem;
      height: 0.35rem;
      border-radius: 999px;
      background: rgba(15, 76, 160, 0.68);
      animation: appointmentTypingPulse 1000ms infinite ease-in-out;
    }
    .appointment-typing-dot:nth-child(2) {
      animation-delay: 120ms;
    }
    .appointment-typing-dot:nth-child(3) {
      animation-delay: 240ms;
    }
    @keyframes appointmentBubbleRise {
      0% {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @keyframes appointmentTypingPulse {
      0%, 80%, 100% {
        transform: scale(0.75);
        opacity: 0.45;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;

  document.head.append(style);
}

function getAppointmentTodayInputValue() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getAppointmentSummaryHtml(copy) {
  const doctor = getAppointmentDoctorById(appointmentChatState.answers.doctorId);
  const timing = getAppointmentTimingById(appointmentChatState.answers.timingId);
  const doctorText = doctor ? doctor.en : "";
  const timingText = timing ? timing.en : "";
  const dateText = formatAppointmentDate(appointmentChatState.answers.preferredDate);

  return `
    <div class="mt-3 rounded-2xl border border-sky-100 bg-sky-50/75 p-3 text-xs text-slate-700 shadow-sm">
      <p class="text-xs font-extrabold uppercase tracking-wide text-[#0f4ca0]">${escapeHtml(copy.bookingSummaryTitle)}</p>
      <dl class="mt-2 grid gap-2">
        <div class="grid grid-cols-[9rem_1fr] gap-2"><dt class="font-semibold text-slate-500">${escapeHtml(copy.nameLabel)}</dt><dd class="font-semibold text-slate-800">${escapeHtml(appointmentChatState.answers.name)}</dd></div>
        <div class="grid grid-cols-[9rem_1fr] gap-2"><dt class="font-semibold text-slate-500">${escapeHtml(copy.phoneLabel)}</dt><dd class="font-semibold text-slate-800">${escapeHtml(appointmentChatState.answers.mobile)}</dd></div>
        <div class="grid grid-cols-[9rem_1fr] gap-2"><dt class="font-semibold text-slate-500">${escapeHtml(copy.doctorLabel)}</dt><dd class="font-semibold text-slate-800">${escapeHtml(doctorText)}</dd></div>
        <div class="grid grid-cols-[9rem_1fr] gap-2"><dt class="font-semibold text-slate-500">${escapeHtml(copy.reasonLabel)}</dt><dd class="font-semibold text-slate-800">${escapeHtml(appointmentChatState.answers.reason)}</dd></div>
        <div class="grid grid-cols-[9rem_1fr] gap-2"><dt class="font-semibold text-slate-500">${escapeHtml(copy.dateLabel)}</dt><dd class="font-semibold text-slate-800">${escapeHtml(dateText)}</dd></div>
        <div class="grid grid-cols-[9rem_1fr] gap-2"><dt class="font-semibold text-slate-500">${escapeHtml(copy.timingLabel)}</dt><dd class="font-semibold text-slate-800">${escapeHtml(timingText)}</dd></div>
      </dl>
    </div>
  `;
}

function getAppointmentConversationMarkup(copy, lang) {
  const sections = [];

  const botBubble = (content, extraClass = "") =>
    `<div class="max-w-[88%] rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm appointment-bubble-rise ${extraClass}">${content}</div>`;

  const userBubble = (content) =>
    `<div class="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-gradient-to-r from-[#0f4ca0] to-[#0f68c7] px-3 py-2 text-sm font-semibold text-white shadow-sm appointment-bubble-rise">${content}</div>`;

  const typingBubble = `
    <div class="inline-flex max-w-[88%] items-center gap-1.5 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3 py-2 shadow-sm appointment-bubble-rise">
      <span class="appointment-typing-dot"></span>
      <span class="appointment-typing-dot"></span>
      <span class="appointment-typing-dot"></span>
      <span class="ml-1 text-xs font-semibold text-slate-500">${escapeHtml(copy.typing)}</span>
    </div>
  `;

  sections.push(botBubble(escapeHtml(copy.welcome)));

  const confirmStep = APPOINTMENT_CHAT_STEP_KEYS.length - 1;

  for (let step = 0; step < confirmStep; step += 1) {
    if (appointmentChatState.step > step) {
      sections.push(botBubble(escapeHtml(getAppointmentStepQuestion(step, copy))));
      sections.push(userBubble(escapeHtml(getAppointmentStepAnswer(step, lang))));
      continue;
    }

    if (appointmentChatState.step === step) {
      sections.push(appointmentChatState.typing ? typingBubble : botBubble(escapeHtml(getAppointmentStepQuestion(step, copy))));
      break;
    }
  }

  if (appointmentChatState.step === confirmStep) {
    sections.push(appointmentChatState.typing ? typingBubble : botBubble(escapeHtml(copy.confirmPrompt)));
    if (!appointmentChatState.typing) {
      sections.push(getAppointmentSummaryHtml(copy, lang));
    }
  }

  return sections.join("");
}

function getAppointmentComposerMarkup(copy, lang) {
  const stepKey = APPOINTMENT_CHAT_STEP_KEYS[appointmentChatState.step];
  const errorHtml = appointmentChatState.error
    ? `<p class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">${escapeHtml(appointmentChatState.error)}</p>`
    : "";

  const navActions =
    appointmentChatState.step > 0
      ? `
        <div class="mt-2 flex items-center justify-between gap-2">
          <button type="button" data-appointment-back class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 ${appointmentChatState.isSubmitting ? "cursor-not-allowed opacity-60" : ""}" ${appointmentChatState.isSubmitting ? "disabled" : ""}>${escapeHtml(copy.backButton)}</button>
          <button type="button" data-appointment-restart class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 ${appointmentChatState.isSubmitting ? "cursor-not-allowed opacity-60" : ""}" ${appointmentChatState.isSubmitting ? "disabled" : ""}>${escapeHtml(copy.restartButton)}</button>
        </div>
      `
      : "";

  if (stepKey === "confirm") {
    const message = buildAppointmentWhatsAppMessage(lang, appointmentChatState.answers);
    const finalLink = buildAppointmentWhatsAppUrl(message);
    const fallbackLink = appointmentChatState.lastAttemptLink || finalLink;
    const statusText = appointmentChatState.isSubmitting
      ? `<p class="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700">${escapeHtml(copy.preparing)}</p>`
      : appointmentChatState.handoffSuccess
        ? `<p class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">${escapeHtml(copy.success)}</p>`
        : "";

    const fallbackText = appointmentChatState.handoffFailed
      ? `
        <p class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">${escapeHtml(copy.fallbackText)}</p>
        <a href="${escapeHtml(fallbackLink)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100">${escapeHtml(copy.openWhatsApp)}</a>
      `
      : "";

    return `
      <div class="grid gap-2">
        ${statusText}
        <button type="button" data-appointment-send class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0f4ca0] to-emerald-500 px-3 py-2.5 text-sm font-bold text-white shadow ${appointmentChatState.isSubmitting ? "cursor-not-allowed opacity-70" : "hover:brightness-105"}" ${appointmentChatState.isSubmitting ? "disabled" : ""}>${escapeHtml(copy.sendWhatsApp)}</button>
        <div class="grid grid-cols-2 gap-2">
          <a href="${escapeHtml(EMERGENCY_TEL)}" class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">${escapeHtml(copy.callHospital)}</a>
          <a href="https://wa.me/${escapeHtml(APPOINTMENT_CHAT_CONFIG.hospitalWhatsAppNumber)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">${escapeHtml(copy.directWhatsApp)}</a>
        </div>
        ${fallbackText}
      </div>
      ${navActions}
    `;
  }

  if (stepKey === "doctor") {
    const doctorOptions = APPOINTMENT_CHAT_CONFIG.doctors
      .map((doctor) => `<option value="${escapeHtml(doctor.id)}" ${appointmentChatState.answers.doctorId === doctor.id ? "selected" : ""}>${escapeHtml(doctor[lang])}</option>`)
      .join("");

    return `
      <form data-appointment-form class="grid gap-2">
        ${errorHtml}
        <select name="doctor" class="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f68c7]/35">
          <option value="">${escapeHtml(copy.selectDoctorPlaceholder)}</option>
          ${doctorOptions}
        </select>
        <button type="submit" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0f4ca0] to-[#0f68c7] px-3 py-2.5 text-sm font-bold text-white shadow hover:brightness-105">${escapeHtml(copy.continueButton)}</button>
      </form>
      ${navActions}
    `;
  }

  if (stepKey === "timing") {
    const timingOptions = APPOINTMENT_CHAT_CONFIG.timeSlots
      .map((slot) => `<option value="${escapeHtml(slot.id)}" ${appointmentChatState.answers.timingId === slot.id ? "selected" : ""}>${escapeHtml(slot[lang])}</option>`)
      .join("");

    return `
      <form data-appointment-form class="grid gap-2">
        ${errorHtml}
        <select name="timing" class="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f68c7]/35">
          <option value="">${escapeHtml(copy.timingLabel)}</option>
          ${timingOptions}
        </select>
        <button type="submit" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0f4ca0] to-[#0f68c7] px-3 py-2.5 text-sm font-bold text-white shadow hover:brightness-105">${escapeHtml(copy.continueButton)}</button>
      </form>
      ${navActions}
    `;
  }

  if (stepKey === "date") {
    return `
      <form data-appointment-form class="grid gap-2">
        ${errorHtml}
        <input data-appointment-input type="date" name="preferredDate" min="${escapeHtml(getAppointmentTodayInputValue())}" value="${escapeHtml(appointmentChatState.answers.preferredDate)}" class="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f68c7]/35" />
        <button type="submit" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0f4ca0] to-[#0f68c7] px-3 py-2.5 text-sm font-bold text-white shadow hover:brightness-105">${escapeHtml(copy.continueButton)}</button>
      </form>
      ${navActions}
    `;
  }

  if (stepKey === "reason") {
    return `
      <form data-appointment-form class="grid gap-2">
        ${errorHtml}
        <textarea data-appointment-input name="reason" rows="3" placeholder="${escapeHtml(copy.reasonPlaceholder)}" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f68c7]/35">${escapeHtml(appointmentChatState.answers.reason)}</textarea>
        <button type="submit" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0f4ca0] to-[#0f68c7] px-3 py-2.5 text-sm font-bold text-white shadow hover:brightness-105">${escapeHtml(copy.continueButton)}</button>
      </form>
      ${navActions}
    `;
  }

  if (stepKey === "mobile") {
    return `
      <form data-appointment-form class="grid gap-2">
        ${errorHtml}
        <input data-appointment-input type="tel" name="mobile" inputmode="numeric" maxlength="10" placeholder="${escapeHtml(copy.mobilePlaceholder)}" value="${escapeHtml(appointmentChatState.answers.mobile)}" class="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f68c7]/35" />
        <button type="submit" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0f4ca0] to-[#0f68c7] px-3 py-2.5 text-sm font-bold text-white shadow hover:brightness-105">${escapeHtml(copy.continueButton)}</button>
      </form>
      ${navActions}
    `;
  }

  return `
    <form data-appointment-form class="grid gap-2">
      ${errorHtml}
      <input data-appointment-input type="text" name="name" autocomplete="name" placeholder="${escapeHtml(copy.namePlaceholder)}" value="${escapeHtml(appointmentChatState.answers.name)}" class="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f68c7]/35" />
      <button type="submit" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0f4ca0] to-[#0f68c7] px-3 py-2.5 text-sm font-bold text-white shadow hover:brightness-105">${escapeHtml(copy.continueButton)}</button>
    </form>
    ${navActions}
  `;
}

function focusAppointmentChatInput() {
  if (!appointmentChatbotUi || !appointmentChatState.isOpen) return;
  const input = appointmentChatbotUi.controls.querySelector("[data-appointment-input]");
  if (!input || typeof input.focus !== "function") return;
  window.requestAnimationFrame(() => input.focus());
}

function renderAppointmentChatbot() {
  if (!appointmentChatbotUi) return;

  const lang = getAppointmentChatLanguage();
  const copy = getAppointmentChatCopy();
  appointmentChatbotUi.hospitalName.textContent = copy.hospitalName;
  appointmentChatbotUi.title.textContent = copy.assistantTitle;
  appointmentChatbotUi.stream.innerHTML = getAppointmentConversationMarkup(copy, lang);
  appointmentChatbotUi.controls.innerHTML = getAppointmentComposerMarkup(copy, lang);
  bindAppointmentChatbotControls();

  window.requestAnimationFrame(() => {
    appointmentChatbotUi.stream.scrollTop = appointmentChatbotUi.stream.scrollHeight;
  });
}

function closeAppointmentChatbot() {
  if (!appointmentChatbotUi) return;
  appointmentChatState.isOpen = false;
  clearAppointmentTypingTimer();
  appointmentChatbotUi.root.classList.add("pointer-events-none");
  appointmentChatbotUi.root.classList.remove("pointer-events-auto");
  appointmentChatbotUi.backdrop.classList.add("opacity-0", "pointer-events-none");
  appointmentChatbotUi.backdrop.classList.remove("opacity-100", "pointer-events-auto");
  appointmentChatbotUi.panel.classList.add("opacity-0", "pointer-events-none", "translate-y-4", "scale-[0.98]");
  appointmentChatbotUi.panel.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0", "scale-100");
  scheduleFloatingBookingHint();
}

function openAppointmentChatbot() {
  ensureAppointmentChatbotUi();
  hideFloatingBookingHint(true);
  appointmentChatState.isOpen = true;
  appointmentChatbotUi.root.classList.remove("pointer-events-none");
  appointmentChatbotUi.root.classList.add("pointer-events-auto");
  appointmentChatbotUi.backdrop.classList.remove("opacity-0", "pointer-events-none");
  appointmentChatbotUi.backdrop.classList.add("opacity-100", "pointer-events-auto");
  appointmentChatbotUi.panel.classList.remove("opacity-0", "pointer-events-none", "translate-y-4", "scale-[0.98]");
  appointmentChatbotUi.panel.classList.add("opacity-100", "pointer-events-auto", "translate-y-0", "scale-100");
  renderAppointmentChatbot();
  focusAppointmentChatInput();
}

function bindAppointmentChatbotControls() {
  if (!appointmentChatbotUi) return;

  appointmentChatbotUi.controls.querySelectorAll("[data-appointment-restart]").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      resetAppointmentChatState();
      renderAppointmentChatbot();
    });
  });

  appointmentChatbotUi.controls.querySelectorAll("[data-appointment-back]").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      if (appointmentChatState.isSubmitting || appointmentChatState.step <= 0) return;
      setAppointmentChatStep(appointmentChatState.step - 1, false);
    });
  });

  const sendButton = appointmentChatbotUi.controls.querySelector("[data-appointment-send]");
  if (sendButton && sendButton.dataset.bound !== "true") {
    sendButton.dataset.bound = "true";
    sendButton.addEventListener("click", () => {
      if (appointmentChatState.isSubmitting) return;
      const lang = getAppointmentChatLanguage();
      const message = buildAppointmentWhatsAppMessage(lang, appointmentChatState.answers);
      const targetLink = buildAppointmentWhatsAppUrl(message);
      appointmentChatState.lastAttemptLink = targetLink;
      appointmentChatState.error = "";
      appointmentChatState.handoffFailed = false;
      appointmentChatState.handoffSuccess = false;
      appointmentChatState.isSubmitting = true;
      renderAppointmentChatbot();

      window.setTimeout(() => {
        let popup = null;
        try {
          popup = window.open(targetLink, "_blank", "noopener,noreferrer");
        } catch (_) {
          popup = null;
        }

        appointmentChatState.isSubmitting = false;
        appointmentChatState.handoffSuccess = Boolean(popup);
        appointmentChatState.handoffFailed = !popup;
        renderAppointmentChatbot();

        if (popup && APPOINTMENT_CHAT_CONFIG.resetAfterSuccessfulHandoff) {
          window.setTimeout(() => {
            resetAppointmentChatState();
            renderAppointmentChatbot();
          }, 650);
        }
      }, 340);
    });
  }

  const form = appointmentChatbotUi.controls.querySelector("[data-appointment-form]");
  if (form && form.dataset.bound !== "true") {
    form.dataset.bound = "true";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (appointmentChatState.isSubmitting) return;

      const copy = getAppointmentChatCopy();
      const formData = new FormData(form);
      const stepKey = APPOINTMENT_CHAT_STEP_KEYS[appointmentChatState.step];
      const rawValueMap = {
        name: formData.get("name") || "",
        mobile: formData.get("mobile") || "",
        doctor: formData.get("doctor") || "",
        reason: formData.get("reason") || "",
        date: formData.get("preferredDate") || "",
        timing: formData.get("timing") || ""
      };

      const result = validateAppointmentStep(
        appointmentChatState.step,
        copy,
        { value: rawValueMap[stepKey] || "" }
      );

      if (!result.valid) {
        appointmentChatState.error = result.error || "";
        appointmentChatState.handoffFailed = false;
        appointmentChatState.handoffSuccess = false;
        renderAppointmentChatbot();
        focusAppointmentChatInput();
        return;
      }

      if (stepKey === "name") appointmentChatState.answers.name = result.value;
      if (stepKey === "mobile") appointmentChatState.answers.mobile = result.value;
      if (stepKey === "doctor") appointmentChatState.answers.doctorId = result.value;
      if (stepKey === "reason") appointmentChatState.answers.reason = result.value;
      if (stepKey === "date") appointmentChatState.answers.preferredDate = result.value;
      if (stepKey === "timing") appointmentChatState.answers.timingId = result.value;

      setAppointmentChatStep(appointmentChatState.step + 1, true);
    });
  }
}

function ensureAppointmentChatbotUi() {
  if (appointmentChatbotUi) return appointmentChatbotUi;

  ensureAppointmentChatbotStyles();

  const root = document.createElement("div");
  root.id = "appointment-chatbot-root";
  root.className = "pointer-events-none fixed inset-0 z-[80]";
  root.innerHTML = `
    <div data-appointment-backdrop class="pointer-events-none absolute inset-0 bg-slate-950/35 opacity-0 transition-opacity duration-200"></div>
    <section data-appointment-panel class="pointer-events-none absolute bottom-24 left-3 right-3 flex max-h-[78vh] translate-y-4 scale-[0.98] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white opacity-0 shadow-2xl shadow-slate-900/25 transition-all duration-200 md:left-auto md:right-6 md:w-[380px]">
      <header class="border-b border-slate-200 bg-gradient-to-r from-[#0f4ca0] via-[#0f68c7] to-emerald-500 px-4 py-3 text-white">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-white/85" data-appointment-hospital></p>
            <p class="truncate text-sm font-extrabold" data-appointment-title></p>
          </div>
          <button type="button" data-appointment-close class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white hover:bg-white/20" aria-label="Close chatbot">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </header>
      <div data-appointment-stream class="appointment-chat-scroll flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-4"></div>
      <div data-appointment-controls class="border-t border-slate-200 bg-white px-3 py-3"></div>
    </section>
  `;

  document.body.append(root);

  const backdrop = root.querySelector("[data-appointment-backdrop]");
  const panel = root.querySelector("[data-appointment-panel]");
  const closeButton = root.querySelector("[data-appointment-close]");
  const hospitalName = root.querySelector("[data-appointment-hospital]");
  const title = root.querySelector("[data-appointment-title]");
  const stream = root.querySelector("[data-appointment-stream]");
  const controls = root.querySelector("[data-appointment-controls]");

  appointmentChatbotUi = {
    root,
    backdrop,
    panel,
    closeButton,
    hospitalName,
    title,
    stream,
    controls
  };

  if (closeButton) {
    closeButton.addEventListener("click", closeAppointmentChatbot);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeAppointmentChatbot);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && appointmentChatState.isOpen) {
      closeAppointmentChatbot();
    }
  });

  renderAppointmentChatbot();
  return appointmentChatbotUi;
}

function setupFloatingWhatsAppButton() {
  const floatingButtons = Array.from(document.querySelectorAll("a[data-wa-link].fixed"));
  if (!floatingButtons.length) return;

  ensureAppointmentChatbotUi();

  let hint = document.getElementById("appointment-floating-hint");
  if (!hint) {
    hint = document.createElement("div");
    hint.id = "appointment-floating-hint";
    hint.className =
      "pointer-events-none fixed z-[56] flex max-w-[220px] items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xl shadow-slate-900/15 opacity-0 translate-y-2 scale-95 transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
    hint.innerHTML = `
      <span data-floating-hint-label></span>
      <span class="absolute -bottom-1 right-5 h-2.5 w-2.5 rotate-45 border-b border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"></span>
    `;
  }

  if (hint.parentElement !== document.body) {
    document.body.append(hint);
  }

  const hintLabel = hint.querySelector("[data-floating-hint-label]");
  let idleTimer = null;
  let hideTimer = null;

  const clearIdleTimer = () => {
    if (idleTimer !== null) {
      window.clearTimeout(idleTimer);
      idleTimer = null;
    }
  };

  const clearHideTimer = () => {
    if (hideTimer !== null) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  const getVisibleFloatingButton = () =>
    floatingButtons.find((btn) => btn.classList.contains("inline-flex") && !btn.classList.contains("hidden"));

  const canShowHint = () => Boolean(getVisibleFloatingButton()) && !appointmentChatState.isOpen;

  const hideHint = (immediate = false) => {
    clearHideTimer();
    hint.classList.add("opacity-0", "translate-y-2", "scale-95");
    hint.classList.remove("opacity-100", "translate-y-0", "scale-100");
    if (immediate) {
      hint.classList.add("duration-0");
      window.requestAnimationFrame(() => {
        hint.classList.remove("duration-0");
      });
    }
  };

  const showHint = () => {
    if (!canShowHint()) return;
    if (hintLabel) {
      hintLabel.textContent = getFloatingBookingHintLabel();
    }

    hint.classList.remove("opacity-0", "translate-y-2", "scale-95");
    hint.classList.add("opacity-100", "translate-y-0", "scale-100");

    clearHideTimer();
    hideTimer = window.setTimeout(() => {
      hideHint();
    }, 3000);
  };

  const scheduleHint = () => {
    clearIdleTimer();
    if (!canShowHint()) return;
    idleTimer = window.setTimeout(() => {
      showHint();
    }, 3000);
  };

  hideFloatingBookingHint = (immediate = false) => {
    clearIdleTimer();
    hideHint(immediate);
  };

  scheduleFloatingBookingHint = () => {
    scheduleHint();
  };

  const syncFloatingButton = () => {
    const placement = getResponsiveLauncherPlacement();
    const robotIconSrc = `${resolveSiteAssetPath(FLOATING_CHATBOT_ICON)}?v=20260408`;

    floatingButtons.forEach((btn) => {
      btn.style.position = "fixed";
      btn.style.left = "auto";
      btn.style.right = "auto";
      btn.style.top = "auto";
      btn.style.bottom = "auto";

      if (placement.button.left) btn.style.left = placement.button.left;
      if (placement.button.right) btn.style.right = placement.button.right;
      if (placement.button.top) btn.style.top = placement.button.top;
      if (placement.button.bottom) btn.style.bottom = placement.button.bottom;

      btn.style.zIndex = "55";
      btn.style.display = "inline-flex";

      btn.setAttribute("aria-label", "Book Appointment");
      btn.setAttribute("title", "Book Appointment");
      btn.setAttribute("href", "#");
      btn.classList.add("overflow-visible", "p-0", "ring-2", "ring-white/80", "dark:ring-slate-900/70", "group");
      btn.classList.remove("bg-gradient-to-br", "from-emerald-500", "to-emerald-600", "text-white");

      if (btn.dataset.robotIconApplied !== "true") {
        btn.dataset.robotIconApplied = "true";
        btn.innerHTML = `
          <span class="sr-only">Book Appointment</span>
          <span class="relative block h-full w-full">
            <img
              src="${robotIconSrc}"
              alt=""
              data-robot-chat-icon
              class="h-full w-full rounded-full object-cover"
              loading="eager"
              decoding="async"
              draggable="false"
            />
            <span data-robot-chat-badge class="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 px-2 py-0.5 text-[9px] font-black tracking-wide text-[#0f4ca0] shadow-md dark:border-slate-700 dark:bg-slate-900/95 dark:text-cyan-200">${escapeHtml(getLauncherChatBadgeLabel())}</span>
          </span>
        `;
      }

      const robotImage = btn.querySelector("img[data-robot-chat-icon]");
      if (robotImage) {
        robotImage.setAttribute("src", robotIconSrc);
      }

      const badge = btn.querySelector("[data-robot-chat-badge]");
      if (badge) {
        badge.textContent = getLauncherChatBadgeLabel();
      }

      btn.classList.remove("hidden");
      btn.classList.add("inline-flex");

      if (btn.parentElement !== document.body) {
        document.body.append(btn);
      }

      if (btn.dataset.appointmentLauncherBound !== "true") {
        btn.dataset.appointmentLauncherBound = "true";
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          hideFloatingBookingHint(true);
          if (appointmentChatState.isOpen) {
            closeAppointmentChatbot();
            return;
          }
          openAppointmentChatbot();
        });
      }
    });

    hint.style.left = "auto";
    hint.style.right = "auto";
    hint.style.top = "auto";
    hint.style.bottom = "auto";
    if (placement.hint.left) hint.style.left = placement.hint.left;
    if (placement.hint.right) hint.style.right = placement.hint.right;
    if (placement.hint.top) hint.style.top = placement.hint.top;
    if (placement.hint.bottom) hint.style.bottom = placement.hint.bottom;
    hint.style.maxWidth = "min(220px, calc(100vw - 2rem))";

    if (appointmentChatbotUi && appointmentChatbotUi.panel) {
      const panel = appointmentChatbotUi.panel;
      panel.style.left = "auto";
      panel.style.right = "auto";
      panel.style.top = "auto";
      panel.style.bottom = "auto";
      panel.style.width = placement.panel.width || "";
      panel.style.maxHeight = placement.panel.maxHeight || "";

      if (placement.panel.left) panel.style.left = placement.panel.left;
      if (placement.panel.right) panel.style.right = placement.panel.right;
      if (placement.panel.top) panel.style.top = placement.panel.top;
      if (placement.panel.bottom) panel.style.bottom = placement.panel.bottom;
    }

    scheduleHint();
  };

  syncFloatingButton();
  window.addEventListener("resize", syncFloatingButton);

  const onScrollActivity = () => {
    hideFloatingBookingHint();
    scheduleHint();
  };

  const onPointerActivity = () => {
    if (appointmentChatState.isOpen) return;
    hideFloatingBookingHint();
    scheduleHint();
  };

  window.addEventListener("scroll", onScrollActivity, { passive: true });
  window.addEventListener("wheel", onScrollActivity, { passive: true });
  window.addEventListener("touchmove", onScrollActivity, { passive: true });
  window.addEventListener("mousemove", onPointerActivity, { passive: true });
  window.addEventListener("touchstart", onPointerActivity, { passive: true });
  window.addEventListener("keydown", onPointerActivity);
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

function getSitePathContext(pathname) {
  const segments = pathname.split("/").filter(Boolean);

  if (window.location.hostname.endsWith("github.io") && segments.length) {
    return {
      basePath: `/${segments[0]}`,
      pathSegments: segments.slice(1)
    };
  }

  return {
    basePath: "",
    pathSegments: segments
  };
}

function enforceCleanUrl() {
  const { basePath, pathSegments } = getSitePathContext(window.location.pathname);
  if (!pathSegments.length) return false;

  const last = pathSegments[pathSegments.length - 1].toLowerCase();
  let cleanPath = null;

  if (last === "index.html") {
    const parentSegments = pathSegments.slice(0, -1);
    cleanPath = parentSegments.length ? `/${parentSegments.join("/")}/` : "/";
  } else {
    const match = last.match(/^(about|services|doctors|facilities|contact)\.html$/);
    if (match) {
      const nextSegments = pathSegments.slice(0, -1).concat(match[1]);
      cleanPath = `/${nextSegments.join("/")}/`;
    }
  }

  if (!cleanPath) return false;

  const targetPath = `${basePath}${cleanPath}`;
  if (targetPath === window.location.pathname) return false;

  window.location.replace(`${targetPath}${window.location.search}${window.location.hash}`);
  return true;
}

function getPageKeyFromPath(pathname) {
  const { pathSegments: segments } = getSitePathContext(pathname);

  if (!segments.length) return "home";

  let page = segments[segments.length - 1].toLowerCase();

  if (page === "index.html") {
    page = segments.length > 1 ? segments[segments.length - 2].toLowerCase() : "home";
  }

  page = page.replace(/\.html$/, "");
  return page === "index" ? "home" : page;
}

function getPageKeyFromHref(href) {
  try {
    const resolved = new URL(href, window.location.origin);
    return getPageKeyFromPath(resolved.pathname);
  } catch {
    return "home";
  }
}

function highlightActiveNav() {
  const current = getPageKeyFromPath(window.location.pathname);

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const page = getPageKeyFromHref(href);
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
  if (enforceCleanUrl()) return;

  wireQuickLinks();
  wirePatientGatewayLinks();
  setupScrollProgressBar();
  setupGlobalAlignment();
  decorateInterfaceIcons();
  decorateContentHeadingIcons();
  setupFloatingWhatsAppButton();
  setupAmbientAnimations();
  setupThemeToggle();
  setupMobileMenu();
  highlightActiveNav();
  setupRevealAnimations();
}

init();

