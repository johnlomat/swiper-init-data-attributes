document.addEventListener("DOMContentLoaded", function () {
  const swipers = document.querySelectorAll(".swiper");

  swipers.forEach((element) => {
    if (element.dataset.swiperInitialized) return;

    let swiperInstance = null; // Store Swiper instance

    function initializeSwiper() {
      if (element.dataset.swiperInitialized) return;

      let prevSelector = element.getAttribute("data-nav-prev");
      let nextSelector = element.getAttribute("data-nav-next");

      let prevButton = prevSelector ? document.querySelector(prevSelector) : element.nextElementSibling?.classList.contains("swiper-button-prev") ? element.nextElementSibling : element.parentElement?.querySelector(".swiper-button-prev");

      let nextButton = nextSelector ? document.querySelector(nextSelector) : prevButton?.nextElementSibling?.classList.contains("swiper-button-next") ? prevButton.nextElementSibling : element.parentElement?.querySelector(".swiper-button-next");

      let thumbsElement = document.querySelector(element.getAttribute("data-thumbs"));

      function getSwiperOptions(el, isThumbs = false) {
        let options = {
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
            el.getAttribute("data-autoplay") === "false" || el.getAttribute("data-autoplay") === null
              ? false
              : {
                  delay: parseInt(el.getAttribute("data-autoplay-delay") || 1),
                  disableOnInteraction: el.getAttribute("data-autoplay-disable-interaction") === "true",
                },
        };

        if (!isThumbs || el.hasAttribute("data-nav-prev") || el.hasAttribute("data-nav-next")) {
          options.navigation = {
            nextEl: nextButton,
            prevEl: prevButton,
          };
        }

        return options;
      }

      let options = getSwiperOptions(element);

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

      // Initialize thumbs Swiper before the main Swiper
      if (thumbsElement) {
        let thumbsOptions = getSwiperOptions(thumbsElement, true);
        let thumbsSwiper = new Swiper(thumbsElement, thumbsOptions);
        options.thumbs = { swiper: thumbsSwiper };
      }

      swiperInstance = new Swiper(element, options);
      element.dataset.swiperInitialized = "true";
    }

    function destroySwiper() {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
        delete element.dataset.swiperInitialized;
      }
    }

    function checkSwiperState() {
      let viewportWidth = window.innerWidth;
      let minWidth = element.hasAttribute("data-disable-swiper-min-width") ? parseInt(element.getAttribute("data-disable-swiper-min-width")) : null;
      let maxWidth = element.hasAttribute("data-disable-swiper-max-width") ? parseInt(element.getAttribute("data-disable-swiper-max-width")) : null;

      // Destroy Swiper if within the disabled range
      if (
        (minWidth !== null && maxWidth !== null && viewportWidth >= minWidth && viewportWidth <= maxWidth) || // Within min-max range
        (minWidth !== null && viewportWidth >= minWidth) || // Only min-width set, disable at min and above
        (maxWidth !== null && viewportWidth <= maxWidth) // Only max-width set, disable at max and below
      ) {
        destroySwiper();
      } else {
        initializeSwiper();
      }
    }

    checkSwiperState();
    window.addEventListener("resize", checkSwiperState);
  });
});
