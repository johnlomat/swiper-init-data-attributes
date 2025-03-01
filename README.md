# Swiper Initialization Data Attributes

This documentation provides an overview of the available data attributes used for initializing Swiper sliders dynamically.

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
  data-breakpoints="&amp;#123;&amp;quot;640&amp;quot;:&amp;#123;&amp;quot;slidesPerView&amp;quot;:1&amp;#125;,&amp;quot;1024&amp;quot;:&amp;#123;&amp;quot;slidesPerView&amp;quot;:3&amp;#125;&amp;#125;"
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
</div>
```

---

## Data Attributes Reference

| Attribute                           | Description                                        | Default |
| ----------------------------------- | -------------------------------------------------- | ------- |
| `data-slides-per-view`              | Number of slides visible at a time.                | `auto`  |
| `data-centered`                     | Center slides within the viewport.                 | `false` |
| `data-space-between`                | Space between slides (in pixels).                  | `20`    |
| `data-loop`                         | Enables infinite loop mode.                        | `false` |
| `data-speed`                        | Transition speed in milliseconds.                  | `3000`  |
| `data-allow-touch-move`             | Enables touch interactions.                        | `true`  |
| `data-grab-cursor`                  | Changes cursor to a grab icon.                     | `false` |
| `data-free-mode`                    | Enables free mode scrolling.                       | `false` |
| `data-watch-slides-progress`        | Tracks slides progress for effects.                | `false` |
| `data-autoplay`                     | Enables autoplay.                                  | `false` |
| `data-autoplay-delay`               | Autoplay delay in milliseconds.                    | `1`     |
| `data-autoplay-disable-interaction` | Stops autoplay on user interaction.                | `false` |
| `data-nav-prev`                     | Selector for previous button navigation.           | `null`  |
| `data-nav-next`                     | Selector for next button navigation.               | `null`  |
| `data-thumbs`                       | Selector for thumbs slider.                        | `null`  |
| `data-breakpoints`                  | Responsive settings (see example below).           | `{}`    |
| `data-disable-swiper-min-width`     | Disables Swiper at screen widths above this value. | `null`  |
| `data-disable-swiper-max-width`     | Disables Swiper at screen widths below this value. | `null`  |

---

## Breakpoints Formatting

Use the `data-breakpoints` attribute to define different configurations based on screen width. Since attributes cannot contain raw JSON, you must encode it using HTML entities.

### Example

```html
<div class="swiper" data-breakpoints="&amp;#123;&amp;quot;640&amp;quot;:&amp;#123;&amp;quot;slidesPerView&amp;quot;:1&amp;#125;,&amp;quot;1024&amp;quot;:&amp;#123;&amp;quot;slidesPerView&amp;quot;:3&amp;#125;&amp;#125;"></div>
```

### Decoded JSON Equivalent

```json
{
  "640": { "slidesPerView": 1 },
  "1024": { "slidesPerView": 3 }
}
```

---

## Disable Swiper Based on Screen Width

| Condition                                                                                  | Effect                                       |
| ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Only `data-disable-swiper-min-width="320"` is set                                          | Swiper is destroyed at `320px` and above.    |
| Only `data-disable-swiper-max-width="780"` is set                                          | Swiper is destroyed at `780px` and below.    |
| Both `data-disable-swiper-min-width="320"` & `data-disable-swiper-max-width="780"` are set | Swiper is destroyed between `320px - 780px`. |
| Neither attribute is set                                                                   | Swiper initializes normally.                 |

---

## Notes

- Make sure to properly encode JSON objects when using `data-breakpoints`.
- Use `data-thumbs` to enable a thumbnail navigation Swiper.
- Ensure `data-nav-prev` and `data-nav-next` selectors point to valid elements.

🚀 **Happy coding!**
