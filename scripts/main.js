function updateFooterDates() {
  const currentYear = document.querySelector("#currentyear");

  if (currentYear) {
    currentYear.textContent = `${new Date().getFullYear()}`;
  }
}

updateFooterDates();