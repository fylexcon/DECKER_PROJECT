/* --- assets/js/catalog.js (PROGRESSIVE RENDERING & SPEED OPTIMIZED) --- */

document.addEventListener("DOMContentLoaded", function () {
  const bookElement = document.getElementById("book");
  const loadingState = document.getElementById("loadingState");
  const pageCounter = document.getElementById("pageCounter");
  const prevBtn = document.getElementById("btnPrev");
  const nextBtn = document.getElementById("btnNext");

  // Zoom Elements
  const zoomInBtn = document.getElementById("btnZoomIn");
  const zoomOutBtn = document.getElementById("btnZoomOut");
  let currentZoom = 0.8;
  const zoomFactor = 0.85;

  let pageFlip = null;
  let pdfDoc = null;
  let canvasContexts = []; // Canvas referanslarını tutacağız

  // Başlat
  initCatalog();

  async function initCatalog() {
    try {
      const pdfPath = "../assets/documents/DECK-ER CATOLOG.pdf";
      const loadingTask = pdfjsLib.getDocument(pdfPath);
      pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      // HTML İSKELETİNİ OLUŞTUR (BOŞ SAYFALAR)
      bookElement.innerHTML = "";

      for (let i = 1; i <= numPages; i++) {
        const div = document.createElement("div");
        div.classList.add("page-wrapper");

        // Yükleniyor ikonu (Sayfa henüz render olmadıysa görünür)
        div.innerHTML = `
          <div class="page-loader">
            <i class="fas fa-circle-notch fa-spin"></i>
          </div>
          <canvas id="page-canvas-${i}" class="page-canvas"></canvas>
        `;

        bookElement.appendChild(div);
      }

      // KİTABI HEMEN BAŞLAT (Henüz boş ama olsun)
      createFlipBook();
      zoomOutBtn.click(); // Başlangıç zoom

      // --- AKILLI YÜKLEME STRATEJİSİ ---
      // 1. Önce sadece ilk 5 sayfayı yükle (Kapak + Giriş)
      // Böylece kullanıcı hemen kitabı görür.
      const priorityCount = 5;

      for (let i = 1; i <= Math.min(numPages, priorityCount); i++) {
        await renderPage(i);
      }

      // 2. Yükleme ekranını hemen gizle!
      loadingState.style.display = "none";

      // 3. Geri kalan sayfaları arkada sessizce yükle
      if (numPages > priorityCount) {
        renderRemainingPages(priorityCount + 1, numPages);
      }
    } catch (err) {
      console.error(err);
      loadingState.innerHTML = "<p style='color:red'>Error loading PDF.</p>";
    }
  }

  // --- TEK SAYFA RENDER FONKSİYONU ---
  async function renderPage(pageNum) {
    try {
      const page = await pdfDoc.getPage(pageNum);

      // Mobilde 1.5, PC'de 2.0 (Hız/Kalite Dengesi)
      const scale = window.innerWidth < 768 ? 1.5 : 2.0;
      const viewport = page.getViewport({ scale: scale });

      const canvas = document.getElementById(`page-canvas-${pageNum}`);
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render işlemi
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      // Yükleme ikonunu gizle, canvas'ı göster
      canvas.style.opacity = "1";
      const loader = canvas.parentElement.querySelector(".page-loader");
      if (loader) loader.style.display = "none";
    } catch (error) {
      console.error(`Page ${pageNum} render error:`, error);
    }
  }

  // --- ARKA PLAN YÜKLEME ---
  async function renderRemainingPages(start, end) {
    for (let i = start; i <= end; i++) {
      // UI donmasın diye her sayfada 50ms nefes aldır
      await new Promise((resolve) => setTimeout(resolve, 50));
      await renderPage(i);
    }
  }

  function createFlipBook() {
    const isMobile = window.innerWidth < 768;

    // Alan Hesaplama
    const container = document.querySelector(".viewer-body"); // Kapsayıcıyı al
    // Eğer container henüz oluşmadıysa window kullan
    const availW = container
      ? container.clientWidth - (isMobile ? 20 : 100)
      : window.innerWidth;
    const availH = container ? container.clientHeight - 20 : window.innerHeight;

    const aspectRatio = 0.707; // A4

    let bookH = availH;
    let bookW = bookH * aspectRatio;

    if (!isMobile) {
      if (bookW * 2 > availW) {
        bookW = availW / 2;
        bookH = bookW / aspectRatio;
      }
    } else {
      if (bookW > availW) {
        bookW = availW;
        bookH = bookW / aspectRatio;
      }
    }

    // FlipBook Ayarları
    pageFlip = new St.PageFlip(bookElement, {
      width: bookW,
      height: bookH,
      size: isMobile ? "fixed" : "stretch",
      minWidth: 100,
      maxWidth: 3000,
      minHeight: 100,
      maxHeight: 2000,
      showCover: true,
      maxShadowOpacity: 0.5,
      usePortrait: isMobile ? true : false,
      mobileScrollSupport: false,
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page-wrapper"));

    // Kontroller
    prevBtn.onclick = () => pageFlip.flipPrev();
    nextBtn.onclick = () => pageFlip.flipNext();

    // Sayfa Sayacı
    pageFlip.on("flip", (e) => {
      const current = e.data + 1;
      const total = pageFlip.getPageCount();
      if (current === 1) pageCounter.innerText = `Cover / ${total}`;
      else pageCounter.innerText = `Page ${current} of ${total}`;
    });

    // Zoom
    zoomInBtn.addEventListener("click", () => {
      if (currentZoom < 2) {
        currentZoom += 0.2;
        bookElement.style.transform = `scale(${currentZoom})`;
      }
    });

    zoomOutBtn.addEventListener("click", () => {
      if (currentZoom > 0.6) {
        currentZoom -= 0.2;
        bookElement.style.transform = `scale(${currentZoom})`;
      }
    });
  }

  // Resize
  window.addEventListener("resize", () => {
    // Performans için sadece sayfa yenileme yapmıyoruz,
    // CSS flex yapısı zaten çoğu şeyi hallediyor.
    // Çok büyük değişimlerde (yatay/dikey çevirme) reload gerekebilir.
  });
});
