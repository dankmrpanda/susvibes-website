$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");

  });

  // ─── Carousel / Sliding Window Panel ───
  initCarousel('mitigation');
});

/**
 * Initialize a carousel by prefix ID.
 * Expects elements: #<prefix>-carousel, #<prefix>-track,
 *   #<prefix>-prev, #<prefix>-next, #<prefix>-dots
 */
function initCarousel(prefix) {
  const track = document.getElementById(prefix + '-track');
  const prevBtn = document.getElementById(prefix + '-prev');
  const nextBtn = document.getElementById(prefix + '-next');
  const dotsContainer = document.getElementById(prefix + '-dots');

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  const totalSlides = slides.length;
  let currentIndex = 0;

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentIndex = index;

    // Slide the track
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

    // Update dots
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentIndex);
    });

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
  }

  // Button clicks
  prevBtn.addEventListener('click', function () {
    goToSlide(currentIndex - 1);
  });
  nextBtn.addEventListener('click', function () {
    goToSlide(currentIndex + 1);
  });

  // Dot clicks
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goToSlide(parseInt(this.getAttribute('data-index'), 10));
    });
  });

  // Keyboard navigation (when carousel is in view)
  var carousel = document.getElementById(prefix + '-carousel');
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    }
  });

  // Touch / swipe support
  var touchStartX = 0;
  var touchEndX = 0;

  carousel.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex + 1); // swipe left → next
      } else {
        goToSlide(currentIndex - 1); // swipe right → prev
      }
    }
  }, { passive: true });

  // Initialize
  goToSlide(0);
}
