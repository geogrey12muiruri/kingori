import { categoryCounts } from "./category-counts.js";
import { categoryHighlights } from "./category-highlights.js";

const topicLinks = document.querySelectorAll("[data-category].topic-card, [data-category].topic-shortcut");

topicLinks.forEach((link) => {
  const category = link.dataset.category;
  const count = categoryCounts[category];
  const countLabel = link.querySelector(".topic-count");

  if (count === undefined || !countLabel) {
    console.error(`Homepage topic count could not be shown: category "${category}" or its count element is missing.`);
    return;
  }

  countLabel.textContent = `${count} ${count === 1 ? "conversation" : "conversations"}`;

  const image = link.querySelector("[data-category-image]");
  const highlight = categoryHighlights[category];
  if (image instanceof HTMLImageElement && highlight) {
    image.src = highlight.thumbnailUrl;
    image.alt = `YouTube thumbnail for ${highlight.title}${highlight.guest ? ` with ${highlight.guest}` : ""}`;
  } else if (link.classList.contains("topic-card")) {
    console.error(`Homepage topic image could not be shown: no verified conversation thumbnail for "${category}".`);
  }
});
