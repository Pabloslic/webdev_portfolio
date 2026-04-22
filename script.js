const revealItems = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");
const glitchItems = document.querySelectorAll(".glitch");
const progressFill = document.getElementById("progressFill");
const introPanel = document.querySelector(".intro-panel");
const statNumbers = document.querySelectorAll(".stat-number");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navOverlay = document.getElementById("navOverlay");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const skillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const fill = entry.target;
      fill.style.width = `${fill.dataset.skill}%`;
      observer.unobserve(fill);
    });
  },
  {
    threshold: 0.45,
  }
);

skillFills.forEach((fill) => skillObserver.observe(fill));

const statsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.55,
  }
);

statNumbers.forEach((stat) => statsObserver.observe(stat));

function animateCounter(element) {
  const target = Number(element.dataset.count);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 24));

  const timer = window.setInterval(() => {
    current += step;

    if (current >= target) {
      element.textContent = `${target}+`;
      window.clearInterval(timer);
      return;
    }

    element.textContent = `${current}+`;
  }, 45);
}

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (progressFill) {
    progressFill.style.width = `${Math.min(progress, 100)}%`;
  }
}

function updateParallax() {
  if (!introPanel) {
    return;
  }

  const offset = window.scrollY * 0.12;
  introPanel.style.transform = `translateY(${offset}px)`;
}

function triggerGlitchCycle() {
  glitchItems.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add("is-active");

      window.setTimeout(() => {
        item.classList.remove("is-active");
      }, 320);
    }, index * 220);
  });
}

function closeMenu() {
  if (!menuToggle || !siteNav || !navOverlay) {
    return;
  }

  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  navOverlay.classList.remove("is-visible");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!menuToggle || !siteNav || !navOverlay) {
    return;
  }

  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  navOverlay.classList.toggle("is-visible", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

if (navOverlay) {
  navOverlay.addEventListener("click", closeMenu);
}

document.querySelectorAll('.site-nav a, .btn[href^="#"], .brand, .future-chip[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 920) {
    closeMenu();
  }
});

window.addEventListener("scroll", () => {
  updateProgressBar();
  updateParallax();
});

window.addEventListener("load", () => {
  updateProgressBar();
  updateParallax();
  triggerGlitchCycle();
  window.setInterval(triggerGlitchCycle, 2600);
});
