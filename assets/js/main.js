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
  const newsWrapper = document.querySelector(".news-slider-wrapper"); // Wrapper for hover detection

  if (newsTrack && newsCards.length > 0) {
    let newsIndex = 0;
    let autoPlayInterval; // Variable to store the timer

    function getVisibleCards() {
      if (window.innerWidth >= 992) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function updateNewsSlider() {
      const visibleCards = getVisibleCards();
      const cardWidth = newsCards[0].offsetWidth;
      const gap = 40; // Must match CSS gap
      const moveAmount = (cardWidth + gap) * newsIndex;
      newsTrack.style.transform = `translateX(-${moveAmount}px)`;
    }

    // Helper function to move to next slide
    function moveNext() {
      const visibleCards = getVisibleCards();
      if (newsIndex < newsCards.length - visibleCards) {
        newsIndex++;
      } else {
        newsIndex = 0; // Loop back to the start
      }
      updateNewsSlider();
    }

    // --- Auto Play Logic ---
    function startAutoPlay() {
      stopAutoPlay(); // Clear any existing timer first
      // Change slide every 3000ms (3 seconds)
      autoPlayInterval = setInterval(moveNext, 3000); 
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    // Start auto-play when page loads
    startAutoPlay();

    // --- Hover Events (Stop on Mouse Enter, Resume on Leave) ---
    if (newsWrapper) {
      newsWrapper.addEventListener("mouseenter", stopAutoPlay);
      newsWrapper.addEventListener("mouseleave", startAutoPlay);
    }

    // --- Button Events ---
    if (nextNewsBtn) {
      nextNewsBtn.addEventListener("click", () => {
        moveNext();
        // Reset timer on manual interaction
        stopAutoPlay(); 
        startAutoPlay();
      });
    }

    if (prevNewsBtn) {
      prevNewsBtn.addEventListener("click", () => {
        if (newsIndex > 0) {
          newsIndex--;
        }
        updateNewsSlider();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    window.addEventListener("resize", updateNewsSlider);
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // --- 1. COMPONENT YÜKLEME (HEADER & FOOTER) ---
  const isPagesFolder = window.location.pathnxame.includes("/pages/");
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

      // Header yüklendiyse, header fonksiyonlarını başlat
      if (filePath === "header.html") {
        initHeaderLogic();
        initLanguageLogic(); // Çeviri mantığını başlat
      }
    } catch (err) {
      console.error(err);
    }
  }

  loadComponent("header-placeholder", "header.html");
  loadComponent("footer-placeholder", "footer.html");

  // --- 2. HEADER FONKSİYONLARI ---
  function initHeaderLogic() {
    const header = document.getElementById("main-header");
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links"); // Masaüstü
    // Mobil menü yapısı için basit bir toggle (Geliştirilebilir)

    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        // Basitçe class ekle/çıkar. CSS ile .nav-links.active { display: flex... } yapılabilir
        // Şimdilik basit JS ile aç kapa yapıyoruz:
        if (navLinks.style.display === "flex") {
          navLinks.style.display = ""; // CSS default'una dön
        } else {
          navLinks.style.display = "flex";
          navLinks.style.flexDirection = "column";
          navLinks.style.position = "absolute";
          navLinks.style.top = "100px";
          navLinks.style.left = "0";
          navLinks.style.width = "100%";
          navLinks.style.background = "white";
          navLinks.style.padding = "20px";
          navLinks.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        }
      });
    }
  }

  // --- 3. DİL DEĞİŞTİRME MANTIĞI ---
  const translations = {
    en: {
      menu_products: "PRODUCTS",
      menu_resource: "RESOURCE",
      menu_about: "ABOUT US",
      menu_contact: "CONTACT",
      menu_faq: "FAQ",
    },
    es: {
      menu_products: "PRODUCTOS",
      menu_resource: "RECURSOS",
      menu_about: "SOBRE NOSOTROS",
      menu_contact: "CONTACTO",
      menu_faq: "PREGUNTAS",
    },
  };

  function initLanguageLogic() {
    const langBtns = document.querySelectorAll(".lang-btn");

    langBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        // Aktif sınıfını güncelle
        langBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedLang = btn.getAttribute("data-lang");
        translatePage(selectedLang);
      });
    });
  }

  function translatePage(lang) {
    const elementsToTranslate = document.querySelectorAll("[data-key]");

    elementsToTranslate.forEach((el) => {
      const key = el.getAttribute("data-key");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    console.log("Language switched to:", lang);
  }

  // --- 4. HERO SLIDER ---
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (slides.length > 0) {
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((s) => s.classList.remove("active"));
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
    setInterval(() => showSlide(currentSlide + 1), 7000);
  }

  // --- 5. NEWS SLIDER ---
  const newsTrack = document.querySelector(".news-track");
  const newsWrapper = document.querySelector(".news-slider-wrapper");
  const nextNewsBtn = document.querySelector(".next-news");
  const prevNewsBtn = document.querySelector(".prev-news");

  if (newsTrack) {
    // 1. Hide manual buttons (not needed for continuous flow)
    if(nextNewsBtn) nextNewsBtn.style.display = "none";
    if(prevNewsBtn) prevNewsBtn.style.display = "none";

    // 2. Clone content to create a seamless loop
    // We duplicate the inner HTML so when the first set scrolls out, the second set is visible.
    const originalContent = newsTrack.innerHTML;
    newsTrack.innerHTML += originalContent;

    // 3. Add the class that triggers the CSS animation
    newsTrack.classList.add("continuous-scroll");

    // 4. Pause on Hover
    if (newsWrapper) {
      newsWrapper.addEventListener("mouseenter", () => {
        newsTrack.style.animationPlayState = "paused";
      });
      newsWrapper.addEventListener("mouseleave", () => {
        newsTrack.style.animationPlayState = "running";
      });
    }
  }
});
