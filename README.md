# Card Slider Component

This is a responsive and reusable carousel component built with pure HTML, CSS, and JavaScript. It allows for infinite scrolling and smooth transitions between slides.

## Features

- **Infinite Scroll**: Continuously loops through slides without resetting.
- **Responsive Design**: Adapts to different screen sizes using CSS.
- **Auto-Duplication**: If fewer than 8 slides are provided, the component duplicates slides until there are at least 8 to ensure smooth looping.
- **Container Structure**: All slides are wrapped inside a `carousel-items` `div` for better organization and styling.
- **Slide Structure**: Each slide is contained within a `<div class="carousel-slide">` element.
- **Navigation Buttons**: 
  - The **previous** button has an `id` of `prev`.
  - The **next** button has an `id` of `next`.
- **Customizable**: Easily adaptable for different use cases by modifying styles or behavior.

## Usage

Include the necessary HTML, CSS, and JavaScript files in your project and structure your slides within the `carousel-items` div:

```html
<div class="slider">
  <button id="prev">Previous</button>
  <div class="carousel-items">
    <div class="carousel-slide">Slide 1</div>
    <div class="carousel-slide">Slide 2</div>
    <div class="carousel-slide">Slide 3</div>
    <div class="carousel-slide">Slide 4</div>
    <!-- Additional slides -->
  </div>
  <button id="next">Next</button>
</div>
```

## JavaScript Functionality

Ensure the JavaScript logic handles infinite scrolling and slide duplication when there are fewer than 8 slides.

```js
const carouselItems = document.querySelector(".carousel-items");
const slides = Array.from(carouselItems.children);

// Duplicate slides if there are fewer than 8
while (slides.length < 8) {
  slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    carouselItems.appendChild(clone);
  });
  slides.push(...Array.from(carouselItems.children).slice(-slides.length));
}
```

## Styling

Customize the styling in your CSS file:

```css
.slider {
  overflow: hidden;
  width: 100%;
}

.carousel-items {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  flex: 0 0 auto;
  width: 100%;
}

#prev, #next {
  cursor: pointer;
}
```

## License

MIT License

