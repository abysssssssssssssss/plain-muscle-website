const root = document.documentElement;

// Theme: the light switch in the header, same storage key as the old placeholder.
const lightSwitch = document.querySelector(".light-switch");
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateLight() {
  const dark = root.dataset.theme === "dark";
  const label = dark ? "Turn the light on" : "Turn the light off";
  lightSwitch.setAttribute("aria-label", label);
  lightSwitch.setAttribute("aria-pressed", String(dark));
  lightSwitch.title = label;
  themeColor.content = dark ? "#000000" : "#ffffff";
}

lightSwitch.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("plain-muscle-theme", root.dataset.theme);
  } catch {}
  updateLight();
});

updateLight();

// Mobile menu.
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  nav.classList.toggle("open", open);
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
  }
});

// Product and Legal dropdowns: click to open, Escape or an outside click to close.
const dropdowns = [...document.querySelectorAll(".dropdown")];

function setDropdown(dropdown, open) {
  dropdown.classList.toggle("open", open);
  dropdown.querySelector(".dropdown-toggle").setAttribute("aria-expanded", String(open));
}

for (const dropdown of dropdowns) {
  dropdown.querySelector(".dropdown-toggle").addEventListener("click", () => {
    const open = !dropdown.classList.contains("open");
    dropdowns.forEach((other) => setDropdown(other, other === dropdown && open));
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown")) dropdowns.forEach((dropdown) => setDropdown(dropdown, false));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const open = dropdowns.find((dropdown) => dropdown.classList.contains("open"));
  if (open) {
    setDropdown(open, false);
    open.querySelector(".dropdown-toggle").focus();
  }
});

// Header border once the page scrolls.
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Fade sections in as they scroll into view.
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("in"));
}

// Reviews. TODO: add real reviews after launch, e.g.
// { name: "Alex", stars: 5, text: "The only gym app I've kept using." }
// Never add made-up reviews.
const REVIEWS = [];

const reviewList = document.querySelector("[data-reviews]");
if (reviewList && REVIEWS.length) {
  reviewList.replaceChildren(
    ...REVIEWS.map((review) => {
      const figure = document.createElement("figure");
      figure.className = "review";
      const stars = document.createElement("div");
      stars.className = "stars";
      stars.textContent = "★".repeat(review.stars) + "☆".repeat(5 - review.stars);
      stars.setAttribute("aria-label", `${review.stars} out of 5 stars`);
      const quote = document.createElement("blockquote");
      quote.textContent = `“${review.text}”`;
      const caption = document.createElement("figcaption");
      caption.textContent = review.name;
      figure.append(stars, quote, caption);
      return figure;
    }),
  );
  document.querySelector("[data-reviews-empty]")?.remove();
}
