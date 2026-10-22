const bookingForm = document.querySelector("#booking-form");
const formStatus = document.querySelector("#form-status");

if (!bookingForm || !formStatus) {
  console.error("Booking form behavior could not start because a required element is missing.");
} else {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = bookingForm.querySelector("#name");
    const name = nameField && nameField.value.trim() ? nameField.value.trim() : "there";

    formStatus.textContent = `Thanks, ${name}. This preview is not connected to a live form system yet, so nothing was sent.`;
  });
}