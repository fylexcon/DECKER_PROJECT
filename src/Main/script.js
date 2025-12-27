document.addEventListener("DOMContentLoaded", function () {
  // --- STICKY HEADER ---
  const header = document.getElementById("main-header");
  const topBarHeight = document.querySelector(".top-bar").offsetHeight;

  window.addEventListener("scroll", () => {
    if (window.scrollY > topBarHeight) {
      header.classList.add("scrolled");
      header.style.top = "0";
    } else {
      header.classList.remove("scrolled");
      header.style.top = "40px"; // Top bar yüksekliği kadar
    }
  });

  // --- SCROLL REVEAL (Kaydırdıkça efekt) ---
  const reveals = document.querySelectorAll(".reveal");
  function checkReveal() {
    const triggerBottom = (window.innerHeight / 5) * 4;
    reveals.forEach((reveal) => {
      const revealTop = reveal.getBoundingClientRect().top;
      if (revealTop < triggerBottom) {
        reveal.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", checkReveal);
  checkReveal();

  // --- SLIDER ---
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide) => {
      slide.classList.remove("active");
      const video = slide.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    const activeSlide = slides[currentSlide];
    activeSlide.classList.add("active");
    const activeVideo = activeSlide.querySelector("video");
    if (activeVideo) activeVideo.play();
  }

  if (nextBtn)
    nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
  if (prevBtn)
    prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 7000);

  // --- MOBİL MENÜ ---
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
      } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "80px";
        navLinks.style.left = "0";
        navLinks.style.width = "100%";
        navLinks.style.background = "#fff";
        navLinks.style.padding = "20px";
        navLinks.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
      }
    });
  }
});
