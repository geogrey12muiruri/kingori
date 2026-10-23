function updateFooterDates() {
  const currentYear = document.querySelector("#currentyear");

  if (currentYear) {
    currentYear.textContent = `${new Date().getFullYear()}`;
  }
}

function syncHeaderHeight() {
  const header = document.querySelector(".page-header");
  if (!header) return;

  const apply = () => {
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
  };

  apply();
  window.addEventListener("resize", apply);
}
function setupScrollChrome() {
  const header = document.querySelector(".page-header");
  const toTop = document.querySelector(".to-top");
  const homeHeader = document.body.classList.contains("home-page") ? header : null;

  if (!homeHeader && !toTop) return;

  const update = () => {
    const scrolled = window.scrollY;

    if (homeHeader) {
      homeHeader.classList.toggle("is-stuck", scrolled > 24);
    }

    if (toTop) {
      toTop.classList.toggle("is-visible", scrolled > window.innerHeight * 0.85);
    }
  };

  if (toTop) {
    toTop.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

updateFooterDates();
syncHeaderHeight();
setupScrollChrome();
