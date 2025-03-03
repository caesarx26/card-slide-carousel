const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
const carouselItems = document.querySelector(".carousel-items");

// Track if we're currently in a scroll animation
let isScrolling = false;
// Add cool down timer for button presses
let lastClickTime = 0;
const clickCoolDown = 500; // ms between allowed button presses
const minimumSlideCount = 8; // Minimum number of original slides needed

// Clone slides for infinite scrolling
function setupInfiniteScroll() {
  // Get all original slides
  const originalSlides = Array.from(carouselItems.querySelectorAll(".carousel-slide"));
  let slideCount = originalSlides.length;

  // If we have fewer than the minimum required slides, create additional duplicates
  // before setting up infinite scrolling
  if (slideCount < minimumSlideCount) {
    // Calculate how many full sets of duplicates we need
    const duplicateSetsNeeded = Math.ceil(minimumSlideCount / slideCount) - 1;

    // Create the needed duplicates
    for (let setIndex = 0; setIndex < duplicateSetsNeeded; setIndex++) {
      for (let i = 0; i < slideCount; i++) {
        const duplicate = originalSlides[i].cloneNode(true);
        duplicate.classList.add("duplicate"); // Mark as duplicate (not a clone for infinite scrolling)
        carouselItems.appendChild(duplicate);
      }
    }

    // Update our list of "original" slides to include the duplicates
    originalSlides.length = 0; // Clear the array
    Array.from(carouselItems.querySelectorAll(".carousel-slide")).forEach(slide => {
      originalSlides.push(slide);
    });

    // Update slide count
    slideCount = originalSlides.length;
    console.log(`Expanded to ${slideCount} slides to meet minimum of ${minimumSlideCount}`);
  }

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
    }, 100); // Increased from 50ms to 100ms for more stability
  }

  // If we've scrolled to or before the beginning clones
  if (carouselItems.scrollLeft <= 0) {
    // Reset to the original slides (without animation)
    carouselItems.style.scrollBehavior = "auto";
    carouselItems.scrollLeft = totalOriginalWidth;
    setTimeout(() => {
      carouselItems.style.scrollBehavior = "smooth";
    }, 100); // Increased from 50ms to 100ms for more stability
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
      // Add a small delay before considering the scroll complete
      // This helps prevent stuttering and snap-backs
      setTimeout(() => {
        isScrolling = false;
        // After animation completes, check if we need to "loop"
        checkInfiniteScroll();
      }, 150); // Added delay after animation completes
    }
  }

  requestAnimationFrame(animationStep);
}

function handleScrollNext() {
  const now = Date.now();

  // Enforce cooldown between clicks
  if (isScrolling || now - lastClickTime < clickCoolDown) return;

  lastClickTime = now;

  const slides = carouselItems.querySelectorAll(".carousel-slide");
  const slideWidth = slides[0].offsetWidth;
  const gapWidth = parseInt(window.getComputedStyle(carouselItems).columnGap) || 0;
  const totalSlideWidth = slideWidth + gapWidth;

  // Increased animation duration for smoother transitions
  smoothScroll(carouselItems.scrollLeft + totalSlideWidth, 350); // Increased from 250ms to 350ms
}

function handleScrollPrev() {
  const now = Date.now();

  // Enforce cooldown between clicks
  if (isScrolling || now - lastClickTime < clickCoolDown) return;

  lastClickTime = now;

  const slides = carouselItems.querySelectorAll(".carousel-slide");
  const slideWidth = slides[0].offsetWidth;
  const gapWidth = parseInt(window.getComputedStyle(carouselItems).columnGap) || 0;
  const totalSlideWidth = slideWidth + gapWidth;

  // Increased animation duration for smoother transitions
  smoothScroll(carouselItems.scrollLeft - totalSlideWidth, 350); // Increased from 250ms to 350ms
}

// Use debounced scroll event listener to check infinite scroll during manual scrolling
let scrollTimeout;
carouselItems.addEventListener("scroll", () => {
  if (isScrolling) return;

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    checkInfiniteScroll();
  }, 100); // Debounced scroll check
});

// Initialize infinite scroll on page load
window.addEventListener("load", () => {
  setupInfiniteScroll();

  // Adjust on window resize with debounce
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resetScrollPosition();
    }, 200); // Debounced resize handler
  });
});

next.addEventListener("click", handleScrollNext);
prev.addEventListener("click", handleScrollPrev);

// Helper function for smooth easing
function easeOutQuad(t) {
  return t * (2 - t);
}