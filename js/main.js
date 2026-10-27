const WHATSAPP_NUMBER = "5551989727254";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
const quoteForm = document.querySelector("#quote-form");
const yearElement = document.querySelector("#current-year");
const galleryDialog = document.querySelector(".gallery-lightbox");
const galleryLinks = Array.from(document.querySelectorAll(".gallery-image-link"));

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (galleryDialog instanceof HTMLDialogElement && galleryLinks.length > 0) {
  const galleryImage = galleryDialog.querySelector(".lightbox-image");
  const galleryTitle = galleryDialog.querySelector("#lightbox-title");
  const gallerySubtitle = galleryDialog.querySelector("#lightbox-subtitle");
  const galleryCounter = galleryDialog.querySelector(".lightbox-counter");
  const closeButton = galleryDialog.querySelector(".lightbox-close");
  const previousButton = galleryDialog.querySelector(".lightbox-previous");
  const nextButton = galleryDialog.querySelector(".lightbox-next");
  let activeGalleryLinks = [];
  let activeImageIndex = 0;
  let activeGalleryLink = null;

  const showGalleryImage = (index) => {
    activeImageIndex = (index + activeGalleryLinks.length) % activeGalleryLinks.length;
    const galleryLink = activeGalleryLinks[activeImageIndex];
    const thumbnail = galleryLink.querySelector("img");

    galleryImage.src = galleryLink.href;
    galleryImage.alt = thumbnail.alt;
    galleryTitle.textContent = galleryLink.dataset.galleryTitle;
    gallerySubtitle.textContent = galleryLink.dataset.gallerySubtitle;
    galleryCounter.textContent = `Imagem ${activeImageIndex + 1} de ${activeGalleryLinks.length}`;
  };

  galleryLinks.forEach((galleryLink) => {
    galleryLink.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      const galleryGroup = galleryLink.closest(".gallery-group");
      activeGalleryLinks = galleryGroup
        ? Array.from(galleryGroup.querySelectorAll(".gallery-image-link"))
        : [galleryLink];
      activeGalleryLink = galleryLink;
      showGalleryImage(activeGalleryLinks.indexOf(galleryLink));
      galleryDialog.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", () => galleryDialog.close());
  previousButton.addEventListener("click", () => showGalleryImage(activeImageIndex - 1));
  nextButton.addEventListener("click", () => showGalleryImage(activeImageIndex + 1));
  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) {
      galleryDialog.close();
    }
  });
  galleryDialog.addEventListener("close", () => activeGalleryLink?.focus());
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 760px)").matches) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      navigation.classList.remove("is-open");
    }
  });
}

if (quoteForm) {
  const residentialType = quoteForm.querySelector('input[name="clientType"][value="Residencial (casa)"]');
  const residenceArea = quoteForm.querySelector(".residence-area");
  const residenceAreaInputs = residenceArea.querySelectorAll('input[name="residenceArea"]');
  const updateResidenceArea = () => {
    const isResidential = residentialType.checked;
    residenceArea.hidden = !isResidential;
    residenceAreaInputs.forEach((input) => {
      input.required = isResidential;
      if (!isResidential) {
        input.checked = false;
      }
    });
  };

  quoteForm.querySelectorAll('input[name="clientType"]').forEach((input) => {
    input.addEventListener("change", updateResidenceArea);
  });

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) {
      return;
    }

    const formData = new FormData(quoteForm);
    const name = String(formData.get("name")).trim();
    const phone = String(formData.get("phone")).trim();
    const email = String(formData.get("email")).trim();
    const clientType = String(formData.get("clientType"));
    const residenceArea = String(formData.get("residenceArea") || "");
    const details = String(formData.get("details")).trim();
    const message = [
      "Olá! Gostaria de solicitar um orçamento.",
      "",
      `Nome: ${name}`,
      `Telefone / WhatsApp: ${phone}`,
      `E-mail: ${email || "Não informado"}`,
      `Tipo de orçamento: ${clientType}`,
      ...(residenceArea ? [`Área do serviço: ${residenceArea}`] : []),
      `Necessidade: ${details || "Gostaria de conversar sobre o serviço."}`,
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
}
