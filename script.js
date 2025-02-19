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
    this.menuIcon.classList.toggle("active");
    this.navLinks.classList.toggle("active");
    this.menuIcon.setAttribute("aria-expanded", this.isOpen.toString());
  }

  handleOutsideClick(event) {
    const isClickInsideMenu = this.navLinks.contains(event.target);
    const isClickOnIcon = this.menuIcon.contains(event.target);

    if (!isClickInsideMenu && !isClickOnIcon && this.isOpen) {
      this.toggleMenu();
    }
  }
}

// Classe pour gérer le carousel
class CustomCarousel {
  constructor() {
    this.carousel = document.getElementById("categoryCarousel");
    this.carouselInner = this.carousel.querySelector(".carousel-inner");
    this.items = Array.from(this.carousel.querySelectorAll(".carousel-item"));
    this.totalItems = this.items.length;
    this.currentPosition = 0;

    // Configuration
    this.itemWidth = this.getItemWidth();
    this.itemsPerView = this.getItemsPerView();
    this.slideInterval = 5000;

    this.init();
  }

  init() {
    this.setupControls();
    this.setupResponsive();
    this.updateItemsWidth();
  }

  getItemWidth() {
    const item = this.items[0];
    const style = window.getComputedStyle(item);
    return (
      item.offsetWidth +
      parseInt(style.marginLeft) +
      parseInt(style.marginRight)
    );
  }

  getItemsPerView() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  updateItemsWidth() {
    const width = `calc(${100 / this.itemsPerView}% - 54px)`;
    this.items.forEach((item) => (item.style.width = width));
  }

  goToSlide(index) {
    this.carouselInner.style.transform = `translateX(${this.currentPosition}px)`;
    this.updateIndicators(index * this.itemsPerView);
  }

  slide(direction) {
    const maxPosition = -(this.totalItems - this.itemsPerView) * this.itemWidth;

    if (direction === "next") {
      this.currentPosition -= this.itemWidth;
      if (this.currentPosition < maxPosition) {
        this.currentPosition = 0;
      }
    } else {
      this.currentPosition += this.itemWidth;
      if (this.currentPosition > 0) {
        this.currentPosition = maxPosition;
      }
    }

    this.carouselInner.style.transform = `translateX(${this.currentPosition}px)`;
  }

  setupControls() {
    const prevButton = this.carousel.querySelector(".carousel-control-prev");
    const nextButton = this.carousel.querySelector(".carousel-control-next");

    prevButton.addEventListener("click", () => {
      this.slide("prev");
    });

    nextButton.addEventListener("click", () => {
      this.slide("next");
    });
  }

  startAutoplay() {
    this.autoplayTimer = setInterval(
      () => this.slide("next"),
      this.slideInterval
    );
  }

  stopAutoplay() {
    clearInterval(this.autoplayTimer);
  }

  setupResponsive() {
    window.addEventListener("resize", () => {
      const newItemsPerView = this.getItemsPerView();
      if (newItemsPerView !== this.itemsPerView) {
        this.itemsPerView = newItemsPerView;
        this.updateItemsWidth();
        this.itemWidth = this.getItemWidth();
        this.currentPosition = 0;
        this.carouselInner.style.transform = `translateX(0)`;
      }
    });
  }
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  new MobileMenu();
  new CustomCarousel();
});
