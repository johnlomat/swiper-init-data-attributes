document.addEventListener("DOMContentLoaded", function() {
  const swiperElements = document.querySelectorAll(".swiper");
  
  window.swiperInstances = window.swiperInstances || {};
  
  const utils = {
    decodeHTMLEntities(text) {
      if (!text) return null;
      const doc = new DOMParser().parseFromString(text, "text/html");
      return doc.documentElement.textContent;
    },
    
    parseJSON(str) {
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
    }
  };
  
  swiperElements.forEach((element, index) => {
    if (element.dataset.swiperInitialized) return;
    
    let swiperInstance = null;
    const uniqueId = element.id || `swiper-${index}`;
    
    function getNavigationElements() {
      const prevSelector = element.getAttribute("data-nav-prev");
      const nextSelector = element.getAttribute("data-nav-next");
      
      const prevButton = prevSelector 
        ? document.querySelector(prevSelector) 
        : (element.nextElementSibling?.classList.contains("swiper-button-prev") 
          ? element.nextElementSibling 
          : element.parentElement?.querySelector(".swiper-button-prev"));
      
      const nextButton = nextSelector 
        ? document.querySelector(nextSelector) 
        : (prevButton?.nextElementSibling?.classList.contains("swiper-button-next") 
          ? prevButton.nextElementSibling 
          : element.parentElement?.querySelector(".swiper-button-next"));
          
      return { prevButton, nextButton };
    }
    
    function buildSwiperConfig(el, isThumbs = false) {
      const { prevButton, nextButton } = getNavigationElements();
      
      const config = {
        slidesPerView: el.getAttribute("data-slides-per-view") || "auto",
        centeredSlides: utils.getBooleanAttribute(el, "data-centered"),
        spaceBetween: utils.getNumberAttribute(el, "data-space-between", 20),
        loop: utils.getBooleanAttribute(el, "data-loop"),
        speed: utils.getNumberAttribute(el, "data-speed", 300),
        allowTouchMove: utils.getBooleanAttribute(el, "data-allow-touch-move", true),
        grabCursor: utils.getBooleanAttribute(el, "data-grab-cursor"),
        freeMode: utils.getBooleanAttribute(el, "data-free-mode"),
        watchSlidesProgress: utils.getBooleanAttribute(el, "data-watch-slides-progress")
      };
      
      if (el.getAttribute("data-autoplay") !== "false" && el.getAttribute("data-autoplay") !== null) {
        config.autoplay = {
          delay: utils.getNumberAttribute(el, "data-autoplay-delay", 3000),
          disableOnInteraction: utils.getBooleanAttribute(el, "data-autoplay-disable-interaction")
        };
      }
      
      if (!isThumbs || el.hasAttribute("data-nav-prev") || el.hasAttribute("data-nav-next")) {
        if (prevButton || nextButton) {
          config.navigation = {
            prevEl: prevButton,
            nextEl: nextButton
          };
        }
      }
      
      const paginationEl = el.parentElement?.querySelector('.swiper-pagination');
      if (paginationEl) {
        config.pagination = {
          el: paginationEl,
          clickable: true,
          type: el.getAttribute("data-pagination-type") || "bullets"
        };
      }
      
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
    
    function initializeSwiper() {
      if (element.dataset.swiperInitialized) return;
      
      const thumbsSelector = element.getAttribute("data-thumbs");
      const thumbsElement = thumbsSelector ? document.querySelector(thumbsSelector) : null;
      
      let mainConfig = buildSwiperConfig(element);
      
      if (thumbsElement) {
        const thumbsConfig = buildSwiperConfig(thumbsElement, true);
        const thumbsSwiper = new Swiper(thumbsElement, thumbsConfig);
        mainConfig.thumbs = { swiper: thumbsSwiper };
        window.swiperInstances[`${uniqueId}-thumbs`] = thumbsSwiper;
      }
      
      swiperInstance = new Swiper(element, mainConfig);
      window.swiperInstances[uniqueId] = swiperInstance;
      element.dataset.swiperInitialized = "true";
      
      element.dispatchEvent(new CustomEvent('swiperInitialized', { 
        detail: { swiper: swiperInstance, config: mainConfig }
      }));
    }
    
    function destroySwiper() {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
        delete window.swiperInstances[uniqueId];
        swiperInstance = null;
        delete element.dataset.swiperInitialized;
        
        element.dispatchEvent(new CustomEvent('swiperDestroyed'));
      }
    }
    
    function checkResponsiveState() {
      const viewportWidth = window.innerWidth;
      const minWidth = utils.getNumberAttribute(element, "data-disable-swiper-min-width", null);
      const maxWidth = utils.getNumberAttribute(element, "data-disable-swiper-max-width", null);
      
      const shouldDisable = (
        (minWidth !== null && maxWidth !== null && viewportWidth >= minWidth && viewportWidth <= maxWidth) || 
        (minWidth !== null && maxWidth === null && viewportWidth >= minWidth) || 
        (maxWidth !== null && minWidth === null && viewportWidth <= maxWidth)
      );
      
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
    
    checkResponsiveState();
    
    let resizeTimer;
    window.addEventListener("resize", function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkResponsiveState, 250);
    });
    
    element.swiperAPI = {
      init: initializeSwiper,
      destroy: destroySwiper,
      getInstance: () => swiperInstance
    };
  });
});
