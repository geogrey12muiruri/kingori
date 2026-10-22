import { categories } from "./conversations/categories.js";
import { conversations } from "./conversations/conversations.js";

const archive = document.querySelector("#conversation-archive");
const searchInput = document.querySelector("#conversation-search");
const formatControls = document.querySelector(".format-controls");
const categorySelect = document.querySelector("#category-filter");
const sortSelect = document.querySelector("#conversation-sort");
const conversationList = document.querySelector(".conversation-list");
const resultCount = document.querySelector(".conversation-results");
const emptyMessage = document.querySelector(".conversation-empty");
const dialog = document.querySelector("#conversation-dialog");
const MAX_VISIBLE_CONVERSATIONS = 3;

if (
  !archive ||
  !searchInput ||
  !formatControls ||
  !(categorySelect instanceof HTMLSelectElement) ||
  !(sortSelect instanceof HTMLSelectElement) ||
  !conversationList ||
  !resultCount ||
  !emptyMessage ||
  !(dialog instanceof HTMLDialogElement)
) {
  console.error("Conversation archive could not start: a required page element is missing.");
} else {
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const query = new URLSearchParams(window.location.search);
  const requestedCategory = query.get("category");
  const state = {
    format: ["video", "audio"].includes(query.get("format")) ? query.get("format") : "all",
    sort: query.get("sort") === "popular" ? "popular" : "latest",
    category: categoryBySlug.has(requestedCategory) ? requestedCategory : "all",
    search: "",
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  }

  function formatViewCount(count) {
    if (!Number.isInteger(count) || count < 0) return "";
    return `${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count)} views`;
  }

  function formatDuration(seconds, label) {
    if (label) return label;
    if (!Number.isFinite(seconds)) return "";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours ? `${hours} hr ${minutes} min` : `${minutes} min`;
  }

  function formatDate(date) {
    if (!date) return "";
    const parsedDate = new Date(`${date}T00:00:00Z`);
    return Number.isNaN(parsedDate.getTime())
      ? ""
      : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(parsedDate);
  }

  function visibleConversations() {
    const search = state.search.trim().toLocaleLowerCase();
    const matches = conversations.filter((conversation) => {
      const matchesFormat = state.format === "all" || conversation.format === state.format;
      const matchesCategory = state.category === "all" || conversation.categories.includes(state.category);
      const searchable = [
        conversation.title,
        ...conversation.guests,
        conversation.topic ?? "",
        conversation.sourceDescription ?? "",
        ...conversation.categories.map((slug) => categoryBySlug.get(slug)?.name ?? ""),
      ].join(" ").toLocaleLowerCase();

      return matchesFormat && matchesCategory && (!search || searchable.includes(search));
    });
    return matches.sort((first, second) => {
      if (state.sort === "popular") {
        const firstViews = first.viewCount ?? -1;
        const secondViews = second.viewCount ?? -1;
        return secondViews - firstViews ||
          (second.releaseDate ?? "").localeCompare(first.releaseDate ?? "");
      }
      const dateOrder = (second.releaseDate ?? "").localeCompare(first.releaseDate ?? "");
      const firstOrder = first.source.order ?? Number.MAX_SAFE_INTEGER;
      const secondOrder = second.source.order ?? Number.MAX_SAFE_INTEGER;
      return dateOrder || firstOrder - secondOrder;
    });
  }

  function renderCategoryOptions() {
    const options = [{ slug: "all", name: "All themes" }, ...categories];
    categorySelect.innerHTML = options.map(({ slug, name }) => {
      const count = slug === "all"
        ? conversations.filter((item) => state.format === "all" || item.format === state.format).length
        : conversations.filter((item) =>
          item.categories.includes(slug) && (state.format === "all" || item.format === state.format),
        ).length;
      return `<option value="${escapeHtml(slug)}">${escapeHtml(name)} (${count})</option>`;
    }).join("");
    categorySelect.value = state.category;
  }

  function renderConversationList() {
    const matches = visibleConversations();
    const visible = matches.slice(0, MAX_VISIBLE_CONVERSATIONS);
    const conversationLabel = matches.length === 1 ? "conversation" : "conversations";
    resultCount.textContent = `Showing ${visible.length} of ${matches.length} matching ${conversationLabel}`;
    emptyMessage.hidden = visible.length > 0;
    conversationList.setAttribute("aria-busy", "false");
    conversationList.innerHTML = visible.map((conversation) => {
      const formatLabel = conversation.format === "video" ? "YouTube video" : "Spotify podcast";
      const sourceIndex = conversation.format === "video"
        ? String(conversation.source.order).padStart(3, "0")
        : `P${String(conversation.source.sourceId.replace("ep-", "")).padStart(2, "0")}`;
      const guests = conversation.guests.length
        ? `<p class="conversation-guest">${escapeHtml(conversation.guests.join(", "))}</p>`
        : "";
      const metadata = [
        formatDuration(conversation.durationSeconds, conversation.durationLabel),
        formatDate(conversation.releaseDate),
        conversation.format === "video" ? formatViewCount(conversation.viewCount) : "",
      ].filter(Boolean).join(" · ");
      const topicTags = conversation.categories.length
        ? conversation.categories.map((slug) => {
          const category = categoryBySlug.get(slug);
          return category
            ? `<span class="conversation-tag">${escapeHtml(category.name)}</span>`
            : "";
        }).join("")
        : '<span class="conversation-tag conversation-tag-pending">Category review</span>';
      const coverImage = conversation.thumbnailUrl
        ? `<img class="conversation-cover" src="${escapeHtml(conversation.thumbnailUrl)}" alt="" loading="lazy" decoding="async">`
        : "";
      const conversationAction = conversation.mediaUrl
        ? `<a class="conversation-details" href="${escapeHtml(conversation.mediaUrl)}" target="_blank" rel="noopener noreferrer">${conversation.format === "video" ? "Watch on YouTube" : "Listen on Spotify"} <span aria-hidden="true">↗</span></a>`
        : `<button class="conversation-details" type="button" data-conversation-id="${escapeHtml(conversation.id)}">Conversation details <span aria-hidden="true">↗</span></button>`;

      return `
        <li class="conversation-item">
          <article class="conversation-entry${coverImage ? " conversation-entry-has-cover" : ""}${conversation.format === "audio" ? " conversation-entry-audio" : ""}">
            ${coverImage}
            <p class="conversation-index">${escapeHtml(sourceIndex)} <span>/ ${escapeHtml(formatLabel)}</span></p>
            <div class="conversation-copy">
              <h3>${escapeHtml(conversation.title)}</h3>
              ${guests}
              ${metadata ? `<p class="conversation-meta">${escapeHtml(metadata)}</p>` : ""}
              <div class="conversation-tags">${topicTags}</div>
            </div>
            ${conversationAction}
          </article>
        </li>`;
    }).join("");
  }

  function renderDialog(conversation) {
    const platformName = conversation.format === "video" ? "YouTube" : "Spotify";
    const formatName = conversation.format === "video" ? "Video conversation" : "Audio podcast";
    const categoriesText = conversation.categories
      .map((slug) => categoryBySlug.get(slug)?.name)
      .filter(Boolean)
      .join(", ");
    const metadata = [
      [conversation.guests.length > 1 ? "Guests" : "Guest", conversation.guests.length
        ? conversation.guests.join(", ")
        : "Not separately identified in the source"],
      ["Format", formatName],
      ["Duration", formatDuration(conversation.durationSeconds, conversation.durationLabel)],
      ["Released", formatDate(conversation.releaseDate)],
      ["Themes", categoriesText],
    ].filter(([, value]) => Boolean(value));
    const description = conversation.sourceDescription
      ? `<section class="dialog-source-description"><h3>Source description excerpt</h3><p>${escapeHtml(conversation.sourceDescription)}</p><p class="source-note">This text comes from the supplied source and may be incomplete.</p></section>`
      : '<p class="dialog-missing-description">An episode summary has not been supplied in the source catalogue.</p>';
    const mediaAction = conversation.mediaUrl
      ? `<a class="button button-light" href="${escapeHtml(conversation.mediaUrl)}" target="_blank" rel="noopener noreferrer">Open this ${platformName} episode <span aria-hidden="true">↗</span></a>`
      : `<p class="dialog-link-note">The individual episode link is not included in the supplied catalogue. This link opens the official ${platformName} destination; search for the title there.</p><a class="button button-light" href="${escapeHtml(conversation.platformUrl)}" target="_blank" rel="noopener noreferrer">Browse Dr. King’ori on ${platformName} <span aria-hidden="true">↗</span></a>`;

    dialog.innerHTML = `
      <div class="conversation-dialog-content">
        <form method="dialog"><button class="dialog-close" aria-label="Close conversation details">Close <span aria-hidden="true">×</span></button></form>
        <p class="eyebrow">${escapeHtml(formatName)}</p>
        <h2 id="conversation-dialog-title">${escapeHtml(conversation.title)}</h2>
        <dl class="dialog-metadata">${metadata.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>
        ${description}
        ${mediaAction}
      </div>`;

    dialog.setAttribute("aria-labelledby", "conversation-dialog-title");
    dialog.showModal();
  }

  function updateFilters() {
    if (state.format === "audio" && state.sort === "popular") {
      state.sort = "latest";
    }
    sortSelect.value = state.sort;
    sortSelect.querySelector('[value="popular"]').disabled = state.format === "audio";
    formatControls.querySelectorAll("button[data-format]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.format === state.format));
    });
    renderCategoryOptions();
    renderConversationList();
  }

  categorySelect.addEventListener("change", () => {
    state.category = categorySelect.value;
    updateFilters();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    renderConversationList();
  });

  formatControls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-format]");
    if (!button) return;
    state.format = button.dataset.format;
    updateFilters();
  });

  searchInput.addEventListener("input", () => {
    state.search = searchInput.value;
    renderConversationList();
  });

  conversationList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-conversation-id]");
    if (!button) return;
    const conversation = conversations.find((entry) => entry.id === button.dataset.conversationId);
    if (!conversation) {
      console.error(`Conversation details could not be opened: "${button.dataset.conversationId}" was not found.`);
      return;
    }
    renderDialog(conversation);
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  updateFilters();
}
