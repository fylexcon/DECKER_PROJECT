/* --- assets/js/main.js (GÜNCEL) --- */

document.addEventListener("DOMContentLoaded", function () {
  // --- 1. HEADER & FOOTER YÜKLEME ---
  const isPagesFolder = window.location.pathname.includes("/pages/");
  const pathPrefix = isPagesFolder ? "../" : "";

  async function loadComponent(placeholderId, filePath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    try {
      const response = await fetch(pathPrefix + "components/" + filePath);
      if (!response.ok) throw new Error("Yükleme hatası");
      let html = await response.text();

      // Link düzeltmeleri
      if (isPagesFolder) {
        html = html
          .replace(/href="index\.html"/g, 'href="../index.html"')
          .replace(/href="pages\//g, 'href="')
          .replace(/src="assets\//g, 'src="../assets/')
          .replace(/href="assets\//g, 'href="../assets/');
      }
      placeholder.innerHTML = html;

      if (filePath === "header.html") initHeaderLogic();
    } catch (err) {
      console.error(err);
    }
  }

  loadComponent("header-placeholder", "header.html");
  loadComponent("footer-placeholder", "footer.html");

  // --- 2. HEADER MANTIĞI (Sticky & Mobil) ---
  function initHeaderLogic() {
    const header = document.getElementById("main-header");
    const topBar = document.querySelector(".top-bar");
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links");

    // Sticky Header
    window.addEventListener("scroll", () => {
      const topHeight = topBar ? topBar.offsetHeight : 0;
      if (window.scrollY > topHeight) {
        header.style.position = "fixed";
        header.style.top = "0";
        header.style.width = "100%";
      } else {
        header.style.position = "sticky"; // CSS'teki varsayılan
      }
    });

    // Mobil Menü
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        // Basit mobil stil (Gerekirse CSS'te .nav-links.active { ... } tanımlanmalı)
        if (navLinks.classList.contains("active")) {
          navLinks.style.display = "flex";
          navLinks.style.flexDirection = "column";
          navLinks.style.position = "absolute";
          navLinks.style.top = "80px";
          navLinks.style.left = "0";
          navLinks.style.background = "#fff";
          navLinks.style.width = "100%";
          navLinks.style.padding = "20px";
        } else {
          navLinks.style.display = ""; // CSS'e dön
        }
      });
    }
  }

  // --- 3. HERO SLIDER (Ana Sayfa) ---
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (slides.length > 0) {
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((s) => s.classList.remove("active"));
      // Videoyu sıfırla
      const video = slides[currentSlide].querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }

      if (index >= slides.length) currentSlide = 0;
      else if (index < 0) currentSlide = slides.length - 1;
      else currentSlide = index;

      slides[currentSlide].classList.add("active");
      const newVideo = slides[currentSlide].querySelector("video");
      if (newVideo) newVideo.play();
    }

    if (nextBtn)
      nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
    if (prevBtn)
      prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));

    // Otomatik Geçiş (7sn)
    setInterval(() => showSlide(currentSlide + 1), 7000);
  }

  // --- 4. NEWS SLIDER (Responsive Mantık) ---
  const newsTrack = document.querySelector(".news-track");
  const newsCards = document.querySelectorAll(".news-card");
  const nextNewsBtn = document.querySelector(".next-news");
  const prevNewsBtn = document.querySelector(".prev-news");

  if (newsTrack && newsCards.length > 0) {
    let newsIndex = 0;

    // Ekranda kaç kart göründüğünü hesapla
    function getVisibleCards() {
      if (window.innerWidth >= 992) return 3; // Masaüstü
      if (window.innerWidth >= 768) return 2; // Tablet
      return 1; // Mobil
    }

    function updateNewsSlider() {
      const visibleCards = getVisibleCards();
      const cardWidth = newsCards[0].offsetWidth;
      const gap = 30; // CSS gap değeri
      const moveAmount = (cardWidth + gap) * newsIndex;
      newsTrack.style.transform = `translateX(-${moveAmount}px)`;
    }

    if (nextNewsBtn) {
      nextNewsBtn.addEventListener("click", () => {
        const visibleCards = getVisibleCards();
        // Kaydırılacak kart var mı?
        if (newsIndex < newsCards.length - visibleCards) {
          newsIndex++;
        } else {
          newsIndex = 0; // Başa dön
        }
        updateNewsSlider();
      });
    }

    if (prevNewsBtn) {
      prevNewsBtn.addEventListener("click", () => {
        if (newsIndex > 0) {
          newsIndex--;
        }
        updateNewsSlider();
      });
    }

    // Ekran boyutu değişirse slider'ı düzelt
    window.addEventListener("resize", updateNewsSlider);
  }
});
