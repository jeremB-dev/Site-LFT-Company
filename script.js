// Classe pour gérer le menu mobile

class MobileMenu {
  constructor() {
    this.menuIcon = document.getElementById("menu-icon");

    this.navLinks = document.getElementById("nav-links");

    this.isOpen = false;

    this.init();
  }

  init() {
    this.menuIcon.addEventListener("click", () => this.toggleMenu());

    document.addEventListener("click", (event) =>
      this.handleOutsideClick(event)
    );

    this.menuIcon.setAttribute("aria-expanded", "false");
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;

    this.updateMenuState();
  }

  closeMenu() {
    this.isOpen = false;

    this.updateMenuState();
  }

  updateMenuState() {
    this.menuIcon.classList.toggle("active", this.isOpen);

    this.navLinks.classList.toggle("active", this.isOpen);

    this.menuIcon.setAttribute("aria-expanded", this.isOpen.toString());
  }

  handleOutsideClick(event) {
    const isClickInsideMenu = this.navLinks.contains(event.target);

    const isClickOnIcon = this.menuIcon.contains(event.target);

    if (!isClickInsideMenu && !isClickOnIcon && this.isOpen) {
      this.closeMenu();
    }
  }
}

// Classe pour gérer le carousel

class Carousel {
  constructor() {
    this.carousel = document.getElementById("categoryCarousel");

    this.carouselInner = this.carousel.querySelector(".carousel-inner");

    this.items = Array.from(this.carousel.querySelectorAll(".carousel-item"));

    this.prevBtn = this.carousel.querySelector(".carousel-control-prev");

    this.nextBtn = this.carousel.querySelector(".carousel-control-next");

    this.currentIndex = 0;

    this.isMobile = window.innerWidth <= 576;

    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 576;

    this.itemsPerView = this.getItemsPerView();

    this.itemWidth = 0;

    this.isAnimating = false;

    this.init();
  }

  init() {
    if (!this.isMobile) {
      this.calculateItemWidth();

      this.setupControls();

      this.setupEventListeners();

      this.checkButtonsVisibility();
    }
  }

  getItemsPerView() {
    if (this.isMobile) return 1;

    if (this.isTablet) return 2;

    return 3;
  }

  calculateItemWidth() {
    if (this.isMobile) return;

    const item = this.items[0];

    const style = window.getComputedStyle(item);

    const gap = parseInt(window.getComputedStyle(this.carouselInner).gap);

    this.itemWidth = item.offsetWidth + gap;
  }

  setupEventListeners() {
    // Gestion du redimensionnement avec debounce

    let resizeTimeout;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        const wasMobile = this.isMobile;

        const wasTablet = this.isTablet;

        this.isMobile = window.innerWidth <= 576;

        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 576;

        if (wasMobile !== this.isMobile || wasTablet !== this.isTablet) {
          this.itemsPerView = this.getItemsPerView();

          this.calculateItemWidth();

          this.resetPosition();

          this.checkButtonsVisibility();
        }
      }, 100);
    });

    // Gestion du swipe sur mobile

    if ("ontouchstart" in window) {
      let touchStartX = 0;

      let touchEndX = 0;

      this.carousel.addEventListener(
        "touchstart",

        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },

        { passive: true }
      );

      this.carousel.addEventListener(
        "touchend",

        (e) => {
          touchEndX = e.changedTouches[0].screenX;

          this.handleSwipe(touchStartX, touchEndX);
        },

        { passive: true }
      );
    }
  }

  handleSwipe(startX, endX) {
    if (this.isMobile) return;

    const swipeThreshold = 50;

    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.slide("next");
      } else {
        this.slide("prev");
      }
    }
  }

  setupControls() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener(
        "click",

        () => !this.isAnimating && this.slide("prev")
      );
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener(
        "click",

        () => !this.isAnimating && this.slide("next")
      );
    }
  }

  slide(direction) {
    if (this.isMobile || this.isAnimating) return;

    this.isAnimating = true;

    const maxIndex = this.items.length - this.itemsPerView;

    if (direction === "next" && this.currentIndex < maxIndex) {
      this.currentIndex++;
    } else if (direction === "prev" && this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.isAnimating = false;

      return;
    }

    this.updateCarouselPosition();

    this.checkButtonsVisibility();

    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  updateCarouselPosition() {
    if (this.isMobile) return;

    const translateX = -this.currentIndex * this.itemWidth;

    this.carouselInner.style.transform = `translateX(${translateX}px)`;
  }

  checkButtonsVisibility() {
    if (this.isMobile) {
      if (this.prevBtn) this.prevBtn.style.display = "none";

      if (this.nextBtn) this.nextBtn.style.display = "none";

      return;
    }

    if (this.prevBtn) {
      this.prevBtn.style.display = this.currentIndex > 0 ? "flex" : "none";
    }

    if (this.nextBtn) {
      const maxIndex = this.items.length - this.itemsPerView;

      this.nextBtn.style.display =
        this.currentIndex < maxIndex ? "flex" : "none";
    }
  }

  resetPosition() {
    this.currentIndex = 0;

    if (!this.isMobile) {
      this.carouselInner.style.transform = "translateX(0)";

      this.checkButtonsVisibility();
    }
  }
}

// Classe pour gérer la modale À propos avec animations

class AboutModal {
  constructor(mobileMenu) {
    this.modal = document.getElementById("aboutModal");

    this.aboutLink = document.querySelector(".nav-links li:last-child a");

    this.closeBtn = document.getElementById("closeModal");

    this.mobileMenu = mobileMenu; // Instance de MobileMenu passée en paramètre

    this.isAnimating = false;

    this.init();
  }

  init() {
    // Gestionnaire pour ouvrir la modale

    this.aboutLink.addEventListener("click", (e) => {
      e.preventDefault();

      if (!this.isAnimating) {
        this.openModal();

        // Ferme le menu hamburger en utilisant la méthode de la classe MobileMenu

        this.mobileMenu.closeMenu();
      }
    });

    // Gestionnaire pour fermer la modale

    this.closeBtn.addEventListener("click", () => {
      if (!this.isAnimating) {
        this.closeModal();
      }
    });

    // Fermeture au clic en dehors

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal && !this.isAnimating) {
        this.closeModal();
      }
    });

    // Fermeture avec la touche Escape

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.modal.classList.contains("active") &&
        !this.isAnimating
      ) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.isAnimating = true;

    this.modal.style.display = "flex";

    // Force reflow pour l'animation

    this.modal.offsetHeight;

    this.modal.classList.add("active");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  closeModal() {
    this.isAnimating = true;

    this.modal.classList.remove("active");

    setTimeout(() => {
      this.modal.style.display = "none";

      document.body.style.overflow = "";

      this.isAnimating = false;
    }, 300);
  }
}

// Initialisation au chargement de la page

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = new MobileMenu();

  new Carousel();

  new AboutModal(mobileMenu);
});
