const next = document.querySelector("#next");
const prev = document.querySelector("#prev");

function smoothScroll(cards, targetScroll, duration) {
  const start = cards.scrollLeft;
  const distance = targetScroll - start;
  let startTime = null;

  function animationStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); // Ensure it stops at 1 (100%)

    cards.scrollLeft = start + distance * easeOutQuad(progress);

    if (progress < 1) {
      requestAnimationFrame(animationStep);
    }
  }

  function easeOutQuad(t) {
    return t * (2 - t); // Eases out the animation (slower at the end)
  }

  requestAnimationFrame(animationStep);
}

function handleScrollNext() {
  const cards = document.querySelector(".card-content");
  const scrollAmount = window.innerWidth / 2 > 250 ? window.innerWidth / 2 : window.innerWidth - 150; // Larger scroll distance
  smoothScroll(cards, cards.scrollLeft + scrollAmount, 150); // 150ms duration (even faster)
}

function handleScrollPrev() {
  const cards = document.querySelector(".card-content");
  const scrollAmount = window.innerWidth / 2 > 250 ? window.innerWidth / 2 : window.innerWidth - 150; // Larger scroll distance
  smoothScroll(cards, cards.scrollLeft - scrollAmount, 150); // 150ms duration (even faster)
}

next.addEventListener("click", handleScrollNext);
prev.addEventListener("click", handleScrollPrev);
