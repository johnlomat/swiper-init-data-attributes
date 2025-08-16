document.addEventListener("DOMContentLoaded", function () {
  // Find all Swiper elements
  const swiperElements = document.querySelectorAll(".swiper");

  // Store all swiper instances for potential external access
  window.swiperInstances = window.swiperInstances || {};

  /**
   * Utility functions
   */
  const utils = {
    // Decode HTML entities in breakpoints string
    decodeHTMLEntities(text) {
      if (!text) return null;
      const doc = new DOMParser().parseFromString(text, "text/html");
      return doc.documentElement.textContent;
    },

    // Try to parse JSON safely
    parseJSON(str) {
      try {
        return JSON.parse(str);
      } catch (e) {
        console.error("Invalid JSON:", e, str);
        return null;
      }
    },

    // Get a boolean value from a data attribute
    getBooleanAttribute(element, attribute, defaultValue = false) {
      const value = element.getAttribute(attribute);
      if (value === null) return defaultValue;
      return value === "true";
    },

    // Get a number value from a data attribute
    getNumberAttribute(element, attribute, defaultValue) {
      const value = element.getAttribute(attribute);
      if (value === null) return defaultValue;
      return parseInt(value, 10);
    },
  };

  /**
   * Initialize each Swiper element
   */
  swiperElements.forEach((element, index) => {
    // Skip already initialized swipers
    if (element.dataset.swiperInitialized) return;

    let swiperInstance = null;
    const uniqueId = element.id || `swiper-${index}`;

    /**
     * Get navigation elements
     */
    function getNavigationElements() {
      const prevSelector = element.getAttribute("data-nav-prev");
      const nextSelector = element.getAttribute("data-nav-next");

      // Find navigation buttons with smart fallbacks
      const prevButton = prevSelector ? document.querySelector(prevSelector) : element.nextElementSibling?.classList.contains("swiper-button-prev") ? element.nextElementSibling : element.parentElement?.querySelector(".swiper-button-prev");

      const nextButton = nextSelector ? document.querySelector(nextSelector) : prevButton?.nextElementSibling?.classList.contains("swiper-button-next") ? prevButton.nextElementSibling : element.parentElement?.querySelector(".swiper-button-next");

      return { prevButton, nextButton };
    }

    /**
     * Build Swiper configuration from data attributes
     */
    function buildSwiperConfig(el, isThumbs = false) {
      const { prevButton, nextButton } = getNavigationElements();

      // Core configuration
      const config = {
        // Basic settings
        slidesPerView: el.getAttribute("data-slides-per-view") || "auto",
        centeredSlides: utils.getBooleanAttribute(el, "data-centered"),
        spaceBetween: utils.getNumberAttribute(el, "data-space-between", 20),
        loop: utils.getBooleanAttribute(el, "data-loop"),
        speed: utils.getNumberAttribute(el, "data-speed", 300),

        // Interactive features
        allowTouchMove: utils.getBooleanAttribute(el, "data-allow-touch-move", true),
        grabCursor: utils.getBooleanAttribute(el, "data-grab-cursor"),
        freeMode: utils.getBooleanAttribute(el, "data-free-mode"),
        watchSlidesProgress: utils.getBooleanAttribute(el, "data-watch-slides-progress"),
      };

      // Autoplay settings
      if (el.getAttribute("data-autoplay") !== "false" && el.getAttribute("data-autoplay") !== null) {
        config.autoplay = {
          delay: utils.getNumberAttribute(el, "data-autoplay-delay", 3000),
          disableOnInteraction: utils.getBooleanAttribute(el, "data-autoplay-disable-interaction"),
        };
      }

      // Navigation (only add if not a thumbs slider or has specified nav buttons)
      if (!isThumbs || el.hasAttribute("data-nav-prev") || el.hasAttribute("data-nav-next")) {
        if (prevButton || nextButton) {
          config.navigation = {
            prevEl: prevButton,
            nextEl: nextButton,
          };
        }
      }

      // Pagination
      const paginationEl = el.parentElement?.querySelector(".swiper-pagination");
      if (paginationEl) {
        config.pagination = {
          el: paginationEl,
          clickable: true,
          type: el.getAttribute("data-pagination-type") || "bullets",
        };
      }

      // Scrollbar
      const scrollbarEl = el.parentElement?.querySelector(".swiper-scrollbar");
      if (scrollbarEl) {
        config.scrollbar = {
          el: scrollbarEl,
          hide: el.getAttribute("data-scrollbar-hide") === "true",
        };
      }

      // Process breakpoints configuration
      const breakpointsAttr = el.getAttribute("data-breakpoints");
      if (breakpointsAttr) {
        const decodedBreakpoints = utils.decodeHTMLEntities(breakpointsAttr);
        const parsedBreakpoints = utils.parseJSON(decodedBreakpoints);
        if (parsedBreakpoints) {
          config.breakpoints = parsedBreakpoints;
        }
      }

      return config;
    }

    /**
     * Initialize the Swiper instance
     */
    function initializeSwiper() {
      if (element.dataset.swiperInitialized) return;

      // Check for thumbs configuration
      const thumbsSelector = element.getAttribute("data-thumbs");
      const thumbsElement = thumbsSelector ? document.querySelector(thumbsSelector) : null;

      let mainConfig = buildSwiperConfig(element);

      // Initialize thumbs Swiper if needed
      if (thumbsElement) {
        const thumbsConfig = buildSwiperConfig(thumbsElement, true);
        const thumbsSwiper = new Swiper(thumbsElement, thumbsConfig);
        mainConfig.thumbs = { swiper: thumbsSwiper };

        // Store thumbs instance
        window.swiperInstances[`${uniqueId}-thumbs`] = thumbsSwiper;
      }

      // Create and store the Swiper instance
      swiperInstance = new Swiper(element, mainConfig);
      window.swiperInstances[uniqueId] = swiperInstance;

      // Mark as initialized
      element.dataset.swiperInitialized = "true";

      // Dispatch custom event
      element.dispatchEvent(
        new CustomEvent("swiperInitialized", {
          detail: { swiper: swiperInstance, config: mainConfig },
        })
      );
    }

    /**
     * Destroy the Swiper instance
     */
    function destroySwiper() {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
        delete window.swiperInstances[uniqueId];
        swiperInstance = null;
        delete element.dataset.swiperInitialized;

        // Dispatch custom event
        element.dispatchEvent(new CustomEvent("swiperDestroyed"));
      }
    }

    /**
     * Check if Swiper should be enabled or disabled based on viewport width
     */
    function checkResponsiveState() {
      const viewportWidth = window.innerWidth;
      const minWidth = utils.getNumberAttribute(element, "data-disable-swiper-min-width", null);
      const maxWidth = utils.getNumberAttribute(element, "data-disable-swiper-max-width", null);

      // Determine if Swiper should be disabled based on viewport constraints
      const shouldDisable =
        (minWidth !== null && maxWidth !== null && viewportWidth >= minWidth && viewportWidth <= maxWidth) ||
        (minWidth !== null && maxWidth === null && viewportWidth >= minWidth) ||
        (maxWidth !== null && minWidth === null && viewportWidth <= maxWidth);

      if (shouldDisable) {
        if (element.dataset.swiperInitialized) {
          destroySwiper();
        }
      } else {
        if (!element.dataset.swiperInitialized) {
          initializeSwiper();
        }
      }
    }

    // Initial state check
    checkResponsiveState();

    // Update on window resize with debounce
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkResponsiveState, 250);
    });

    // Expose API for external access
    element.swiperAPI = {
      init: initializeSwiper,
      destroy: destroySwiper,
      getInstance: () => swiperInstance,
    };
  });
});
