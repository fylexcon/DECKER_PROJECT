/* --- assets/js/news-slider.js --- */

document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".dual-slider-track");
  const slides = document.querySelectorAll(".dual-slide");
  const nextBtn = document.querySelector(".arrow-next");
  const prevBtn = document.querySelector(".arrow-prev");
  
  // Guard clause: if slider doesn't exist on page, stop
  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  // Function to determine how many items are visible based on screen width
  const getItemsPerView = () => (window.innerWidth < 768 ? 1 : 2);

  function updateSlider() {
    const itemsPerView = getItemsPerView();
    // Calculate percentage to move. 
    // If 2 items: move 50% per index. If 1 item: move 100% per index.
    const movePercentage = 100 / itemsPerView;
    track.style.transform = `translateX(-${currentIndex * movePercentage}%)`;
  }

  // Next Button Logic
  nextBtn.addEventListener("click", () => {
    const itemsPerView = getItemsPerView();
    const maxIndex = slides.length - itemsPerView;

    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to start
    }
    updateSlider();
  });

  // Prev Button Logic
  prevBtn.addEventListener("click", () => {
    const itemsPerView = getItemsPerView();
    const maxIndex = slides.length - itemsPerView;

    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex; // Loop to end
    }
    updateSlider();
  });

  // Handle Resize (Reset to 0 to avoid layout breaking)
  window.addEventListener("resize", () => {
    currentIndex = 0;
    updateSlider();
  });
});