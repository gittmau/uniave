document.addEventListener("DOMContentLoaded", () => {
  Navigation.init();
  initHero();
  initGallery();
  initContentFilter();
});

function initHero() {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const content = document.querySelector(".hero-content");
  if (slides.length < 2 || !content) return;
  let index = 0;
  const counter = document.querySelector(".hero-counter");
  const eyebrow = content.querySelector(".eyebrow");
  const title = content.querySelector(".display-title");
  const copy = content.querySelector(".hero-copy");
  const description = content.querySelector(".hero-description");
  const primaryAction = content.querySelector(".hero-actions .button:not(.secondary)");
  const secondaryAction = content.querySelector(".hero-actions .button.secondary");
  let timer;

  const updateContent = (slide) => {
    eyebrow.textContent = slide.dataset.eyebrow;
    title.textContent = slide.dataset.title;
    copy.textContent = slide.dataset.copy;
    description.textContent = slide.dataset.description || "";
    description.hidden = !slide.dataset.description;
    primaryAction.textContent = slide.dataset.primaryLabel;
    primaryAction.href = slide.dataset.primaryHref;
    secondaryAction.hidden = !slide.dataset.secondaryLabel;
    if (slide.dataset.secondaryLabel) {
      secondaryAction.textContent = slide.dataset.secondaryLabel;
      secondaryAction.href = slide.dataset.secondaryHref;
    }
  };

  const showSlide = (nextIndex) => {
    slides[index].classList.remove("active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add("active");
    updateContent(slides[index]);
    if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };

  const restartTimer = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(index + 1), 18000);
  };

  document.querySelector(".hero-prev")?.addEventListener("click", () => {
    showSlide(index - 1);
    restartTimer();
  });

  document.querySelector(".hero-next")?.addEventListener("click", () => {
    showSlide(index + 1);
    restartTimer();
  });

  updateContent(slides[index]);
  restartTimer();
}

function initGallery() {
  const trigger = document.querySelector(".gallery-trigger");
  const dialog = document.querySelector("#ovum-gallery");
  if (!trigger || !dialog || typeof dialog.showModal !== "function") return;

  const thumbnails = [...dialog.querySelectorAll(".gallery-thumbnail")];
  const preview = dialog.querySelector(".gallery-preview");
  const photo = dialog.querySelector(".gallery-photo");
  const counter = dialog.querySelector(".gallery-counter");
  const viewer = dialog.querySelector(".gallery-viewer");
  let selectedIndex = 0;
  let touchStartX = null;

  const showPhoto = (nextIndex) => {
    selectedIndex = (nextIndex + thumbnails.length) % thumbnails.length;
    const thumbnailImage = thumbnails[selectedIndex].querySelector("img");
    photo.src = thumbnailImage.getAttribute("src");
    photo.alt = `Foto ${selectedIndex + 1} de ${thumbnails.length}`;
    counter.textContent = `${selectedIndex + 1} / ${thumbnails.length}`;
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.setAttribute("aria-pressed", String(index === selectedIndex));
    });
    preview.hidden = false;
    dialog.classList.add("is-previewing");
  };

  const closePreview = () => {
    preview.hidden = true;
    dialog.classList.remove("is-previewing");
    thumbnails[selectedIndex].focus();
  };

  trigger.addEventListener("click", () => {
    selectedIndex = 0;
    thumbnails.forEach((thumbnail) => thumbnail.setAttribute("aria-pressed", "false"));
    preview.hidden = true;
    dialog.showModal();
  });

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => showPhoto(index));
  });

  dialog.querySelector(".gallery-close").addEventListener("click", () => dialog.close());
  dialog.querySelector(".gallery-preview-close").addEventListener("click", closePreview);
  dialog.querySelector(".gallery-prev").addEventListener("click", () => showPhoto(selectedIndex - 1));
  dialog.querySelector(".gallery-next").addEventListener("click", () => showPhoto(selectedIndex + 1));

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (preview.hidden) {
        dialog.close();
      } else {
        closePreview();
      }
      return;
    }

    if (preview.hidden) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(selectedIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(selectedIndex - 1);
    }
  });

  dialog.addEventListener("cancel", (event) => {
    if (!preview.hidden) {
      event.preventDefault();
      closePreview();
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    preview.hidden = true;
    dialog.classList.remove("is-previewing");
    trigger.focus();
  });

  viewer.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  viewer.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) > 40) showPhoto(selectedIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
}

function initContentFilter() {
  const filter = document.querySelector("#content-filter");
  if (!filter) return;
  const cards = [...document.querySelectorAll("[data-category]")];
  filter.addEventListener("change", () => {
    cards.forEach((card) => {
      card.hidden = filter.value !== "todos" && card.dataset.category !== filter.value;
    });
  });
}
