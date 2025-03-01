document.addEventListener("DOMContentLoaded", function () {
  const swipers = document.querySelectorAll(".swiper");

  swipers.forEach((element) => {
    if (element.dataset.swiperInitialized) return;
    element.dataset.swiperInitialized = "true";

    let prevSelector = element.getAttribute("data-nav-prev");
    let nextSelector = element.getAttribute("data-nav-next");

    let prevButton = prevSelector ? document.querySelector(prevSelector) : element.nextElementSibling?.classList.contains("swiper-button-prev") ? element.nextElementSibling : element.parentElement?.querySelector(".swiper-button-prev");

    let nextButton = nextSelector ? document.querySelector(nextSelector) : prevButton?.nextElementSibling?.classList.contains("swiper-button-next") ? prevButton.nextElementSibling : element.parentElement?.querySelector(".swiper-button-next");

    // Get the thumbsElement dynamically
    let thumbsElement = document.querySelector(element.getAttribute("data-thumbs"));

    // Function to extract Swiper options from an element's data attributes
    function getSwiperOptions(el) {
      return {
        slidesPerView: el.getAttribute("data-slides-per-view") || "auto",
        centeredSlides: el.getAttribute("data-centered") === "true",
        spaceBetween: parseInt(el.getAttribute("data-space-between") || 20),
        loop: el.getAttribute("data-loop") === "true",
        speed: parseInt(el.getAttribute("data-speed") || 3000),
        allowTouchMove: el.getAttribute("data-allow-touch-move") === "true",
        grabCursor: el.getAttribute("data-grab-cursor") === "true",
        freeMode: el.getAttribute("data-free-mode") === "true",
        watchSlidesProgress: el.getAttribute("data-watch-slides-progress") === "true",
        autoplay:
          el.getAttribute("data-autoplay") === "false"
            ? false
            : {
                delay: parseInt(el.getAttribute("data-autoplay-delay") || 1),
                disableOnInteraction: el.getAttribute("data-autoplay-disable-interaction") === "true",
              },
      };
    }

    // Get options for the main Swiper
    let options = getSwiperOptions(element);
    options.navigation = { nextEl: nextButton, prevEl: prevButton };

    function decodeHTMLEntities(text) {
      let doc = new DOMParser().parseFromString(text, "text/html");
      return doc.documentElement.textContent;
    }

    let breakpointsAttr = element.getAttribute("data-breakpoints");

    if (breakpointsAttr) {
      try {
        let decodedBreakpoints = decodeHTMLEntities(breakpointsAttr);
        options.breakpoints = JSON.parse(decodedBreakpoints);
      } catch (e) {
        console.error("Invalid JSON in data-breakpoints:", e);
      }
    }

    // If thumbsElement exists, reuse the options and apply them
    if (thumbsElement) {
      options.thumbs = { swiper: new Swiper(thumbsElement, getSwiperOptions(thumbsElement)) };
    }

    new Swiper(element, options);
  });
});
