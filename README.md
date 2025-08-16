# Swiper Initialization Data Attributes

Transform your sliders with zero JavaScript — just sprinkle in some data attributes and watch the magic happen! ✨

> **Note:** This library is specifically tested with Swiper.js version 11.2.4. Compatibility with other versions is not guaranteed.

## Demo

Check out a live demo of the Swiper configuration here: [CodePen Demo](https://codepen.io/jedl1503/pen/pvobJbz)

## Usage

Add the relevant `data-` attributes to your Swiper HTML element to configure the behavior dynamically.

```html
<div
  class="swiper"
  data-slides-per-view="3"
  data-space-between="20"
  data-loop="true"
  data-speed="1000"
  data-autoplay="true"
  data-autoplay-delay="3000"
  data-nav-prev="#prevButton"
  data-nav-next="#nextButton"
  data-thumbs="#thumbSlider"
  data-scrollbar-hide="false"
  data-breakpoints="&amp;#123;&amp;quot;640&amp;quot;:&amp;#123;&amp;quot;slidesPerView&amp;quot;:1&amp;#125;,&amp;quot;1024&amp;quot;:&amp;#123;&amp;quot;slidesPerView&amp;quot;:3&amp;#125;&amp;#125;"
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
  <!-- Pagination element (optional) -->
  <div class="swiper-pagination"></div>
  <!-- Scrollbar element (optional) -->
  <div class="swiper-scrollbar"></div>
</div>
```

---

## Data Attributes Reference

| `Attribute`                         | `Description`                                       | `Default` |
| ----------------------------------- | --------------------------------------------------- | --------- |
| `data-slides-per-view`              | Number of slides visible at a time.                 | `auto`    |
| `data-centered`                     | Center slides within the viewport.                  | `false`   |
| `data-space-between`                | Space between slides (in pixels).                   | `20`      |
| `data-loop`                         | Enables infinite loop mode.                         | `false`   |
| `data-speed`                        | Transition speed in milliseconds.                   | `3000`    |
| `data-allow-touch-move`             | Enables touch interactions.                         | `true`    |
| `data-grab-cursor`                  | Changes cursor to a grab icon.                      | `false`   |
| `data-free-mode`                    | Enables free mode scrolling.                        | `false`   |
| `data-watch-slides-progress`        | Tracks slides progress for effects.                 | `false`   |
| `data-autoplay`                     | Enables autoplay.                                   | `false`   |
| `data-autoplay-delay`               | Autoplay delay in milliseconds.                     | `1`       |
| `data-autoplay-disable-interaction` | Stops autoplay on user interaction.                 | `false`   |
| `data-nav-prev`                     | Selector for previous button navigation.            | `null`    |
| `data-nav-next`                     | Selector for next button navigation.                | `null`    |
| `data-thumbs`                       | Selector for thumbs slider.                         | `null`    |
| `data-pagination-type`              | Type of pagination (bullets, fraction, progressbar) | `bullets` |
| `data-scrollbar-hide`               | Hides the scrollbar when not in use.                | `false`   |
| `data-breakpoints`                  | Responsive settings (see example below).            | `{}`      |
| `data-disable-swiper-min-width`     | Disables Swiper at screen widths above this value.  | `null`    |
| `data-disable-swiper-max-width`     | Disables Swiper at screen widths below this value.  | `null`    |

---

## Breakpoints Formatting

Use the `data-breakpoints` attribute to define different configurations based on screen width. Since HTML attributes cannot contain raw JSON, you must encode it using HTML entities.

### Using FreeFormatter to Convert JSON to HTML Entities

1. **Go to FreeFormatter's HTML Escape Tool**:

   - Visit [https://www.freeformatter.com/html-escape.html](https://www.freeformatter.com/html-escape.html)

2. **Enter Your JSON**:

   - Format your JSON breakpoints object first:

   ```json
   {
     "640": { "slidesPerView": 1 },
     "1024": { "slidesPerView": 3 }
   }
   ```

   - Paste this into the input field on FreeFormatter

3. **Convert to HTML Entities**:

   - Select the "Escape HTML" option
   - Click the "Format HTML" button

4. **Copy the Result**:

   - The output will be encoded as HTML entities, looking something like:

   ```
   {&quot;640&quot;:{&quot;slidesPerView&quot;:1},&quot;1024&quot;:{&quot;slidesPerView&quot;:3}}
   ```

5. **Use in Your HTML**:
   - Add the encoded string to your Swiper element:
   ```html
   <div class="swiper" data-breakpoints='{"640":{"slidesPerView":1},"1024":{"slidesPerView":3}}'></div>
   ```

### Decoded JSON Equivalent

The encoded attribute above is equivalent to this JSON structure:

```json
{
  "640": { "slidesPerView": 1 },
  "1024": { "slidesPerView": 3 }
}
```

The script's `decodeHTMLEntities` function will automatically convert the HTML entities back to valid JSON when initializing the Swiper.

---

## Disable Swiper Based on Screen Width

| Condition                                                                                  | Effect                                       |
| ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Only `data-disable-swiper-min-width="320"` is set                                          | Swiper is destroyed at `320px` and above.    |
| Only `data-disable-swiper-max-width="780"` is set                                          | Swiper is destroyed at `780px` and below.    |
| Both `data-disable-swiper-min-width="320"` & `data-disable-swiper-max-width="780"` are set | Swiper is destroyed between `320px - 780px`. |
| Neither attribute is set                                                                   | Swiper initializes normally.                 |

---

## JavaScript API

Each Swiper element gets a `swiperAPI` object with the following methods:

```javascript
// Get direct access to the element's API
const slider = document.querySelector(".swiper");

// Access the Swiper instance
const swiperInstance = slider.swiperAPI.getInstance();

// Manually initialize (if it was destroyed)
slider.swiperAPI.init();

// Manually destroy
slider.swiperAPI.destroy();
```

## Global Registry

All Swiper instances are automatically stored in a global registry for easy access:

```javascript
// Access any Swiper instance by its ID or auto-generated identifier
const mainSlider = window.swiperInstances["my-slider"];
const thumbsSlider = window.swiperInstances["my-slider-thumbs"];

// If you have multiple sliders without IDs
const firstSlider = window.swiperInstances["swiper-0"];
```

## Custom Events

The script triggers custom events that you can listen for:

```javascript
// Listen for initialization
document.querySelector(".swiper").addEventListener("swiperInitialized", (event) => {
  // Access the swiper instance and configuration
  const { swiper, config } = event.detail;
  console.log("Swiper initialized with config:", config);
});

// Listen for destruction
document.querySelector(".swiper").addEventListener("swiperDestroyed", () => {
  console.log("Swiper was destroyed");
});
```

---

## Advanced Features

### Pagination Support

To enable pagination, simply add a `.swiper-pagination` element inside your Swiper container:

```html
<div class="swiper">
  <div class="swiper-wrapper">
    <!-- slides here -->
  </div>
  <div class="swiper-pagination"></div>
</div>
```

Configure the pagination type with the `data-pagination-type` attribute:

- `bullets` (default) - Show dots for each slide
- `fraction` - Show current slide number / total slides
- `progressbar` - Show a progress bar

### Scrollbar Support

To enable a scrollbar, simply add a `.swiper-scrollbar` element inside your Swiper container or its parent:

```html
<div class="swiper">
  <div class="swiper-wrapper">
    <!-- slides here -->
  </div>
  <div class="swiper-scrollbar"></div>
</div>
```

Configure the scrollbar behavior with the `data-scrollbar-hide` attribute:

- `false` (default) - Scrollbar remains visible
- `true` - Scrollbar hides when not in use

Example with hidden scrollbar:

```html
<div class="swiper" data-scrollbar-hide="true">
  <div class="swiper-wrapper">
    <!-- slides here -->
  </div>
  <div class="swiper-scrollbar"></div>
</div>
```

### Performance Optimizations

The script includes several performance enhancements:

1. **Debounced Resize Events** - Window resize events are debounced by 250ms to prevent excessive calculations
2. **Lazy Initialization** - Swiper instances are only created when needed based on viewport constraints
3. **Smart Selector Fallbacks** - Navigation buttons are detected automatically when possible

---

## Testing

This library includes comprehensive automated tests to ensure all data attributes and features work correctly with Swiper.js v11.2.4.

### Running Tests Locally

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode during development
npm run test:watch
```

### Continuous Integration

Automated testing is set up with GitHub Actions. Every push and pull request triggers automated tests to ensure code quality and stability.

The test suite verifies:

- All data attributes function correctly
- Responsive behavior works as expected
- JavaScript API methods operate properly
- Custom events trigger at appropriate times
- Global registry correctly stores and manages instances

[![Test Status](https://github.com/johnlomat/swiper-init-data-attributes/actions/workflows/test.yml/badge.svg)](https://github.com/johnlomat/swiper-init-data-attributes/actions)

---

## Notes

- Make sure to properly encode JSON objects when using `data-breakpoints`.

  - To encode your JSON for HTML attributes, use [FreeFormatter's HTML Escape tool](https://www.freeformatter.com/html-escape.html)
  - Steps to encode breakpoints:
    1. Format your JSON breakpoints: `{"640":{"slidesPerView":1},"1024":{"slidesPerView":3}}`
    2. Paste into the HTML Escape tool
    3. Click "Escape HTML"
    4. Copy the encoded result (e.g., `{&quot;640&quot;:{&quot;slidesPerView&quot;:1},&quot;1024&quot;:{&quot;slidesPerView&quot;:3}} `)
    5. Use in your HTML: `data-breakpoints="{&quot;640&quot;:{&quot;slidesPerView&quot;:1},&quot;1024&quot;:{&quot;slidesPerView&quot;:3}}"`

- Use `data-thumbs` to enable a thumbnail navigation Swiper.
- Ensure `data-nav-prev` and `data-nav-next` selectors point to valid elements.
- For pagination, add a `.swiper-pagination` element inside or after your swiper.
- The script automatically handles responsive behavior based on `data-disable-swiper-*` attributes.

🚀 **Happy coding!**
