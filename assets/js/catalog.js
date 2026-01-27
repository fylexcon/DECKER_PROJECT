/* --- assets/js/catalog.js (MAXIMIZED) --- */

document.addEventListener("DOMContentLoaded", function () {
  const bookElement = document.getElementById("book");
  const loadingState = document.getElementById("loadingState");
  const pageCounter = document.getElementById("pageCounter");
  const prevBtn = document.getElementById("btnPrev");
  const nextBtn = document.getElementById("btnNext");

  // Zoom Elements
  const zoomInBtn = document.getElementById("btnZoomIn");
  const zoomOutBtn = document.getElementById("btnZoomOut");
  let currentZoom = 1;

  let pageFlip = null;
  let pdfDoc = null;

  // Başlat
  initCatalog();

  async function initCatalog() {
    try {
      const pdfPath = "../assets/documents/DECK-ER CATOLOG.pdf";
      const loadingTask = pdfjsLib.getDocument(pdfPath);
      pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      // HIZLI AÇILMASI İÇİN OPTİMİZE EDİLMİŞ SCALE
      // Mobilde 1.5, Masaüstünde 2.0 (Yüksek kalite ama kasmayan seviye)
      const scale = window.innerWidth < 768 ? 1.5 : 2.0;

      bookElement.innerHTML = "";

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // CSS: %100 doldur
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        const div = document.createElement("div");
        div.classList.add("page-wrapper");
        div.appendChild(canvas);
        bookElement.appendChild(div);
      }

      loadingState.style.display = "none";
      createFlipBook();
    } catch (err) {
      console.error(err);
      loadingState.innerHTML = "<p style='color:red'>Error loading PDF.</p>";
    }
  }

  function createFlipBook() {
    const isMobile = window.innerWidth < 768;

    // --- AKILLI BOYUTLANDIRMA ---
    // Ekranın kullanılabilir alanını al.
    // 60px TopBar + 50px BottomBar + 20px Padding = 130px
    const availH = window.innerHeight - 130;
    const availW = window.innerWidth - (isMobile ? 20 : 100); // Yan oklara pay

    const aspectRatio = 0.707; // A4 Oranı

    // Yükseklik = Mevcut alanın tamamı
    let bookH = availH;
    let bookW = bookH * aspectRatio;

    // Eğer genişlik ekrana sığmıyorsa, genişliğe göre küçült
    if (!isMobile) {
      // Masaüstü (Çift Sayfa)
      if (bookW * 2 > availW) {
        bookW = availW / 2;
        bookH = bookW / aspectRatio;
      }
    } else {
      // Mobil (Tek Sayfa)
      if (bookW > availW) {
        bookW = availW;
        bookH = bookW / aspectRatio;
      }
    }

    pageFlip = new St.PageFlip(bookElement, {
      width: bookW,
      height: bookH,
      size: isMobile ? "fixed" : "stretch",
      minWidth: 200,
      maxWidth: 3000,
      minHeight: 300,
      maxHeight: 3000,
      showCover: true,
      maxShadowOpacity: 0.5,
      usePortrait: isMobile ? true : false,
      mobileScrollSupport: false,
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page-wrapper"));

    // Kontroller
    prevBtn.addEventListener("click", () => pageFlip.flipPrev());
    nextBtn.addEventListener("click", () => pageFlip.flipNext());

    pageFlip.on("flip", (e) => {
      const current = e.data + 1;
      const total = pageFlip.getPageCount();
      pageCounter.innerText = `${current} / ${total}`;
    });

    // Zoom Mantığı
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

  // Ekran boyutu değişirse sayfayı yenile (Boyutları sıfırdan hesaplasın)
  window.addEventListener("resize", () => {
    // Performans için debounce eklenebilir ama basitçe:
    location.reload();
  });
});
