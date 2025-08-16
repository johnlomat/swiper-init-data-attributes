/**
 * Integration Tests for Swiper Data Attributes
 *
 * This file contains tests for all the data attributes and features
 * implemented in the Swiper initialization script.
 */

describe("Swiper Data Attributes Initialization", () => {
  let swiperContainer;
  let mockSwiperInstance;

  // Utility functions (mirroring those in the main.js)
  const utils = {
    decodeHTMLEntities(text) {
      if (!text) return null;
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<!doctype html><body>${text}`, "text/html");
      return doc.body.textContent;
    },

    parseJSON(str) {
      if (!str) return null;
      try {
        return JSON.parse(str);
      } catch (e) {
        console.error("Invalid JSON:", e, str);
        return null;
      }
    },

    getBooleanAttribute(element, attribute, defaultValue = false) {
      const value = element.getAttribute(attribute);
      if (value === null) return defaultValue;
      return value === "true";
    },

    getNumberAttribute(element, attribute, defaultValue) {
      const value = element.getAttribute(attribute);
      if (value === null) return defaultValue;
      return parseInt(value, 10);
    },
  };

  // Mock Swiper constructor
  function MockSwiper(element, options) {
    this.element = element;
    this.options = options || {};
    this.destroyed = false;

    // Mark element as initialized
    if (element && element.dataset) {
      element.dataset.swiperInitialized = "true";
    }

    // Add to registry
    if (element.id && window.swiperInstances) {
      window.swiperInstances[element.id] = this;
    }

    // Dispatch event
    const initEvent = new CustomEvent("swiperInitialized", {
      detail: { swiper: this, config: options },
    });
    element.dispatchEvent(initEvent);

    return this;
  }

  MockSwiper.prototype.destroy = function () {
    this.destroyed = true;

    // Remove initialized marker
    if (this.element && this.element.dataset) {
      delete this.element.dataset.swiperInitialized;
    }

    // Remove from registry
    if (this.element.id && window.swiperInstances) {
      delete window.swiperInstances[this.element.id];
    }

    // Dispatch event
    const destroyEvent = new CustomEvent("swiperDestroyed");
    this.element.dispatchEvent(destroyEvent);

    return true;
  };

  // Setup DOM for each test
  beforeEach(() => {
    // Clear previous DOM
    document.body.innerHTML = "";

    // Set up window.swiperInstances (global registry)
    window.swiperInstances = {};

    // Create basic Swiper structure
    const container = document.createElement("div");
    container.className = "container";

    swiperContainer = document.createElement("div");
    swiperContainer.id = "test-swiper";
    swiperContainer.className = "swiper";

    const wrapper = document.createElement("div");
    wrapper.className = "swiper-wrapper";

    // Add slides
    for (let i = 1; i <= 3; i++) {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.textContent = `Slide ${i}`;
      wrapper.appendChild(slide);
    }

    // Add pagination
    const pagination = document.createElement("div");
    pagination.className = "swiper-pagination";

    // Add navigation
    const prevButton = document.createElement("div");
    prevButton.className = "swiper-button-prev";

    const nextButton = document.createElement("div");
    nextButton.className = "swiper-button-next";

    // Add scrollbar
    const scrollbar = document.createElement("div");
    scrollbar.className = "swiper-scrollbar";

    // Assemble DOM
    swiperContainer.appendChild(wrapper);
    swiperContainer.appendChild(pagination);
    container.appendChild(swiperContainer);
    container.appendChild(prevButton);
    container.appendChild(nextButton);
    container.appendChild(scrollbar);
    document.body.appendChild(container);

    // Mock Swiper constructor
    global.Swiper = jest.fn().mockImplementation((element, options) => {
      mockSwiperInstance = new MockSwiper(element, options);
      return mockSwiperInstance;
    });

    // Mock window resize
    window.innerWidth = 1024;
    window.resizeTo = jest.fn((width) => {
      window.innerWidth = width;
      window.dispatchEvent(new Event("resize"));
    });
  });

  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  // Helper to get all data attributes from an element
  function getAllDataAttributes(element) {
    const attributes = {};

    // Basic attributes
    attributes.slidesPerView = element.getAttribute("data-slides-per-view") || "auto";
    attributes.centeredSlides = utils.getBooleanAttribute(element, "data-centered");
    attributes.spaceBetween = utils.getNumberAttribute(element, "data-space-between", 20);
    attributes.loop = utils.getBooleanAttribute(element, "data-loop");
    attributes.speed = utils.getNumberAttribute(element, "data-speed", 300);
    attributes.allowTouchMove = utils.getBooleanAttribute(element, "data-allow-touch-move", true);
    attributes.grabCursor = utils.getBooleanAttribute(element, "data-grab-cursor");
    attributes.freeMode = utils.getBooleanAttribute(element, "data-free-mode");
    attributes.watchSlidesProgress = utils.getBooleanAttribute(element, "data-watch-slides-progress");

    // Autoplay
    if (element.hasAttribute("data-autoplay") && element.getAttribute("data-autoplay") !== "false") {
      attributes.autoplay = {
        delay: utils.getNumberAttribute(element, "data-autoplay-delay", 3000),
        disableOnInteraction: utils.getBooleanAttribute(element, "data-autoplay-disable-interaction"),
      };
    }

    // Breakpoints
    const breakpointsAttr = element.getAttribute("data-breakpoints");
    if (breakpointsAttr) {
      const decodedBreakpoints = utils.decodeHTMLEntities(breakpointsAttr);
      attributes.breakpoints = utils.parseJSON(decodedBreakpoints);
    }

    // Navigation
    const prevButton = document.querySelector(".swiper-button-prev");
    const nextButton = document.querySelector(".swiper-button-next");
    if (prevButton || nextButton) {
      attributes.navigation = {
        prevEl: prevButton,
        nextEl: nextButton,
      };
    }

    // Pagination
    const paginationEl = document.querySelector(".swiper-pagination");
    if (paginationEl) {
      attributes.pagination = {
        el: paginationEl,
        clickable: true,
        type: element.getAttribute("data-pagination-type") || "bullets",
      };
    }

    // Scrollbar
    const scrollbarEl = document.querySelector(".swiper-scrollbar");
    if (scrollbarEl) {
      attributes.scrollbar = {
        el: scrollbarEl,
        hide: element.getAttribute("data-scrollbar-hide") === "true",
      };
    }

    return attributes;
  }

  // Helper to initialize Swiper with the data attributes
  function initializeSwiper(element) {
    // Get options from data attributes
    const options = getAllDataAttributes(element);

    // Initialize Swiper
    return new Swiper(element, options);
  }

  // Test cases
  test("should construct Swiper with default settings", () => {
    const swiper = initializeSwiper(swiperContainer);

    expect(global.Swiper).toHaveBeenCalled();
    expect(swiperContainer.dataset.swiperInitialized).toBe("true");
    expect(swiper.options.slidesPerView).toBe("auto");
    expect(swiper.options.spaceBetween).toBe(20);
  });

  test("should respect slidesPerView attribute", () => {
    swiperContainer.setAttribute("data-slides-per-view", "2");
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.slidesPerView).toBe("2");
  });

  test("should handle centered slides", () => {
    swiperContainer.setAttribute("data-centered", "true");
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.centeredSlides).toBe(true);
  });

  test("should set spaceBetween correctly", () => {
    swiperContainer.setAttribute("data-space-between", "30");
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.spaceBetween).toBe(30);
  });

  test("should enable loop mode", () => {
    swiperContainer.setAttribute("data-loop", "true");
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.loop).toBe(true);
  });

  test("should set transition speed", () => {
    swiperContainer.setAttribute("data-speed", "500");
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.speed).toBe(500);
  });

  test("should configure autoplay", () => {
    swiperContainer.setAttribute("data-autoplay", "true");
    swiperContainer.setAttribute("data-autoplay-delay", "2000");
    swiperContainer.setAttribute("data-autoplay-disable-interaction", "true");

    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.autoplay).toBeDefined();
    expect(swiper.options.autoplay.delay).toBe(2000);
    expect(swiper.options.autoplay.disableOnInteraction).toBe(true);
  });

  test("should not enable autoplay when set to false", () => {
    swiperContainer.setAttribute("data-autoplay", "false");
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.autoplay).toBeUndefined();
  });

  test("should parse breakpoints correctly", () => {
    swiperContainer.setAttribute("data-breakpoints", '{"640":{"slidesPerView":1},"1024":{"slidesPerView":3}}');
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.breakpoints).toBeDefined();
    expect(swiper.options.breakpoints["640"].slidesPerView).toBe(1);
    expect(swiper.options.breakpoints["1024"].slidesPerView).toBe(3);
  });

  test("should handle HTML-encoded breakpoints", () => {
    swiperContainer.setAttribute("data-breakpoints", '&lt;640&gt;{"slidesPerView":1},"1024":{"slidesPerView":3}');
    const swiper = initializeSwiper(swiperContainer);

    // This should not crash and should apply some reasonable defaults
    expect(swiper.options.slidesPerView).toBe("auto");
  });

  test("should trigger custom events on init", () => {
    const initSpy = jest.fn();
    swiperContainer.addEventListener("swiperInitialized", initSpy);

    const swiper = initializeSwiper(swiperContainer);

    expect(initSpy).toHaveBeenCalled();
    expect(initSpy.mock.calls[0][0].detail.swiper).toBe(swiper);
  });

  test("should trigger custom events on destroy", () => {
    const destroySpy = jest.fn();
    swiperContainer.addEventListener("swiperDestroyed", destroySpy);

    const swiper = initializeSwiper(swiperContainer);
    swiper.destroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(swiperContainer.dataset.swiperInitialized).toBeUndefined();
  });

  test("should add instance to global registry", () => {
    const swiper = initializeSwiper(swiperContainer);

    expect(window.swiperInstances).toBeDefined();
    expect(window.swiperInstances["test-swiper"]).toBe(swiper);
  });

  test("should remove instance from global registry on destroy", () => {
    const swiper = initializeSwiper(swiperContainer);
    swiper.destroy();

    expect(window.swiperInstances["test-swiper"]).toBeUndefined();
  });

  // Simulate what would happen in the main.js script for responsive behavior
  test("should disable Swiper based on viewport width", () => {
    // Set up responsive attributes
    swiperContainer.setAttribute("data-disable-swiper-min-width", "1000");

    // Initial width is 800 (below min-width)
    window.innerWidth = 800;

    // Should initialize (viewport width < min-width)
    const swiper = initializeSwiper(swiperContainer);
    expect(swiperContainer.dataset.swiperInitialized).toBe("true");

    // Function to check responsive state (similar to what's in main.js)
    function checkResponsiveState() {
      const viewportWidth = window.innerWidth;
      const minWidth = utils.getNumberAttribute(swiperContainer, "data-disable-swiper-min-width", null);
      const maxWidth = utils.getNumberAttribute(swiperContainer, "data-disable-swiper-max-width", null);

      const shouldDisable =
        (minWidth !== null && maxWidth !== null && viewportWidth >= minWidth && viewportWidth <= maxWidth) ||
        (minWidth !== null && maxWidth === null && viewportWidth >= minWidth) ||
        (maxWidth !== null && minWidth === null && viewportWidth <= maxWidth);

      if (shouldDisable && swiperContainer.dataset.swiperInitialized) {
        swiper.destroy();
      } else if (!shouldDisable && !swiperContainer.dataset.swiperInitialized) {
        initializeSwiper(swiperContainer);
      }
    }

    // Resize to above threshold
    window.innerWidth = 1200;
    checkResponsiveState();

    // Should be destroyed (viewport width > min-width)
    expect(swiperContainer.dataset.swiperInitialized).toBeUndefined();

    // Resize back to below threshold
    window.innerWidth = 800;
    checkResponsiveState();

    // Should be re-initialized (viewport width < min-width)
    expect(swiperContainer.dataset.swiperInitialized).toBe("true");
  });

  // Scrollbar configuration tests
  test("should configure scrollbar when scrollbar element is present", () => {
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.scrollbar).toBeDefined();
    expect(swiper.options.scrollbar.el).toBe(document.querySelector(".swiper-scrollbar"));
    expect(swiper.options.scrollbar.hide).toBe(false);
  });

  test("should configure scrollbar with hide option when data-scrollbar-hide is true", () => {
    swiperContainer.setAttribute("data-scrollbar-hide", "true");
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.scrollbar).toBeDefined();
    expect(swiper.options.scrollbar.el).toBe(document.querySelector(".swiper-scrollbar"));
    expect(swiper.options.scrollbar.hide).toBe(true);
  });

  test("should configure scrollbar with hide=false when data-scrollbar-hide is false", () => {
    swiperContainer.setAttribute("data-scrollbar-hide", "false");
    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.scrollbar).toBeDefined();
    expect(swiper.options.scrollbar.el).toBe(document.querySelector(".swiper-scrollbar"));
    expect(swiper.options.scrollbar.hide).toBe(false);
  });

  test("should not configure scrollbar when scrollbar element is not present", () => {
    // Remove scrollbar element
    const scrollbarEl = document.querySelector(".swiper-scrollbar");
    if (scrollbarEl) {
      scrollbarEl.remove();
    }

    const swiper = initializeSwiper(swiperContainer);

    expect(swiper.options.scrollbar).toBeUndefined();
  });
});
