const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
const carouselItems = document.querySelector(".carousel-items");

// Track if we're currently in a scroll animation
let isScrolling = false;

// Clone slides for infinite scrolling
function setupInfiniteScroll() {
  // Get all original slides
  const originalSlides = Array.from(carouselItems.querySelectorAll(".carousel-slide"));
  const slideCount = originalSlides.length;

  // Clone all slides to create proper infinite scrolling
  // For the END clones (append at the end in the same order)
  originalSlides.forEach(slide => {
    const endClone = slide.cloneNode(true);
    endClone.classList.add("clone");
    carouselItems.appendChild(endClone);
  });

  // For the BEGINNING clones (prepend at the beginning in REVERSE order)
  // This is crucial for the correct visual sequence when scrolling backwards
  for (let i = slideCount - 1; i >= 0; i--) {
    const startClone = originalSlides[i].cloneNode(true);
    startClone.classList.add("clone");
    carouselItems.insertBefore(startClone, carouselItems.firstChild);
  }

  // Set initial scroll position to skip the prepended clones
  resetScrollPosition();
}

function resetScrollPosition() {
  // Get the width of a single slide
  const slides = carouselItems.querySelectorAll(".carousel-slide");
  const originalSlideCount = slides.length / 3; // Total slides ÷ 3 (original + 2 sets of clones)

  // Calculate width of one slide set (all original slides)
  const slideWidth = slides[0].offsetWidth;
  const gapWidth = parseInt(window.getComputedStyle(carouselItems).columnGap) || 0;
  const totalSlideWidth = slideWidth + gapWidth;

  // Set initial scroll position to the first set of original slides (after the first set of clones)
  carouselItems.scrollLeft = originalSlideCount * totalSlideWidth;
}

function checkInfiniteScroll() {
  if (isScrolling) return; // Don't check during animations

  const slides = carouselItems.querySelectorAll(".carousel-slide");
  const originalSlideCount = slides.length / 3; // Total slides ÷ 3 (original + 2 sets of clones)

  const slideWidth = slides[0].offsetWidth;
  const gapWidth = parseInt(window.getComputedStyle(carouselItems).columnGap) || 0;
  const totalSlideWidth = slideWidth + gapWidth;

  const totalOriginalWidth = originalSlideCount * totalSlideWidth;

  // If we've scrolled to or past the end clones
  if (carouselItems.scrollLeft >= totalOriginalWidth * 2) {
    // Reset to the original slides (without animation)
    carouselItems.style.scrollBehavior = "auto";
    carouselItems.scrollLeft = totalOriginalWidth;
    setTimeout(() => {
      carouselItems.style.scrollBehavior = "smooth";
    }, 50);
  }

  // If we've scrolled to or before the beginning clones
  if (carouselItems.scrollLeft <= 0) {
    // Reset to the original slides (without animation)
    carouselItems.style.scrollBehavior = "auto";
    carouselItems.scrollLeft = totalOriginalWidth;
    setTimeout(() => {
      carouselItems.style.scrollBehavior = "smooth";
    }, 50);
  }
}

function smoothScroll(targetScroll, duration) {
  isScrolling = true;

  const start = carouselItems.scrollLeft;
  const distance = targetScroll - start;
  let startTime = null;

  function animationStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    carouselItems.scrollLeft = start + distance * easeOutQuad(progress);

    if (progress < 1) {
      requestAnimationFrame(animationStep);
    } else {
      isScrolling = false;
      // After animation completes, check if we need to "loop"
      checkInfiniteScroll();
    }
  }

  requestAnimationFrame(animationStep);
}

function handleScrollNext() {
  if (isScrolling) return; // Prevent multiple clicks during animation

  const slides = carouselItems.querySelectorAll(".carousel-slide");
  const slideWidth = slides[0].offsetWidth;
  const gapWidth = parseInt(window.getComputedStyle(carouselItems).columnGap) || 0;
  const totalSlideWidth = slideWidth + gapWidth;

  // Scroll by one slide width
  smoothScroll(carouselItems.scrollLeft + totalSlideWidth, 250);
}

function handleScrollPrev() {
  if (isScrolling) return; // Prevent multiple clicks during animation

  const slides = carouselItems.querySelectorAll(".carousel-slide");
  const slideWidth = slides[0].offsetWidth;
  const gapWidth = parseInt(window.getComputedStyle(carouselItems).columnGap) || 0;
  const totalSlideWidth = slideWidth + gapWidth;

  // Scroll by one slide width
  smoothScroll(carouselItems.scrollLeft - totalSlideWidth, 250);
}

// Add scroll event listener to check infinite scroll during manual scrolling
carouselItems.addEventListener("scroll", () => {
  if (!isScrolling) {
    // Use requestAnimationFrame to avoid excessive checks during scrolling
    requestAnimationFrame(() => {
      checkInfiniteScroll();
    });
  }
});

// Initialize infinite scroll on page load
window.addEventListener("load", () => {
  setupInfiniteScroll();

  // Adjust on window resize
  window.addEventListener("resize", () => {
    resetScrollPosition();
  });
});

next.addEventListener("click", handleScrollNext);
prev.addEventListener("click", handleScrollPrev);

// Helper function for smooth easing
function easeOutQuad(t) {
  return t * (2 - t);
}