/* --- assets/js/catalog.js (PERFECT FIT) --- */

document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("openBookBtn");
  const closeBtn = document.getElementById("closeBookBtn");
  const modal = document.getElementById("catalogModal");
  const bookElement = document.getElementById("book");
  const loadingBar = document.getElementById("loadingBar");
  const pageCounter = document.getElementById("pageCounter");
  const prevBtn = document.getElementById("btnPrev");
  const nextBtn = document.getElementById("btnNext");

  let pageFlip = null;
  let pdfDoc = null;
  let isLoaded = false;

  // --- MODAL İŞLEMLERİ ---
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (!isLoaded) loadCatalog();
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  });

  // --- PDF YÜKLEME ---
  async function loadCatalog() {
    try {
      loadingBar.style.display = "block";
      const pdfPath = "../assets/documents/DECK-ER CATOLOG.pdf";

      const loadingTask = pdfjsLib.getDocument(pdfPath);
      pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      // Netlik için Scale 2.0 (Mobilde 1.5)
      const scale = window.innerWidth < 768 ? 1.5 : 2.0;

      bookElement.innerHTML = ""; // Temizle

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // CSS ile %100 doldur
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        const div = document.createElement("div");
        div.classList.add("page-wrapper");
        div.appendChild(canvas);
        bookElement.appendChild(div);
      }

      loadingBar.style.display = "none";
      initFlipBook();
      isLoaded = true;
    } catch (err) {
      console.error(err);
      loadingBar.innerHTML = "<p style='color:#fff'>Error loading PDF.</p>";
    }
  }

  // --- KİTAP BOYUTLANDIRMA (MAGIC FORMULA) ---
  function initFlipBook() {
    const isMobile = window.innerWidth < 768;

    // Ekranın kullanılabilir alanını al (Toolbarlar hariç)
    // Üst(60) + Alt(40) = 100px. Biz güvenli pay olarak 120px düşelim.
    const availH = window.innerHeight - 120;
    const availW = window.innerWidth - (isMobile ? 20 : 100);

    // PDF A4 Oranı (0.707)
    const aspectRatio = 0.707;

    // Yükseklik = Mevcut alanın %90'ı (Taşmayı önlemek için kritik hamle)
    let bookH = availH * 0.95;
    let bookW = bookH * aspectRatio;

    // Genişlik kontrolü (Ekrana sığmıyorsa küçült)
    if (!isMobile) {
      // Masaüstü (Çift Sayfa)
      if (bookW * 2 > availW) {
        bookW = (availW / 2) * 0.95; // Genişliğe göre ayarla
        bookH = bookW / aspectRatio;
      }
    } else {
      // Mobil (Tek Sayfa)
      if (bookW > availW) {
        bookW = availW * 0.95;
        bookH = bookW / aspectRatio;
      }
    }

    pageFlip = new St.PageFlip(bookElement, {
      width: bookW,
      height: bookH,
      size: isMobile ? "fixed" : "stretch",
      minWidth: 200,
      maxWidth: 2500,
      minHeight: 300,
      maxHeight: 2500,
      showCover: true,
      maxShadowOpacity: 0.5,
      usePortrait: isMobile ? true : false,
      mobileScrollSupport: false,
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page-wrapper"));

    // Kontroller
    prevBtn.onclick = () => pageFlip.flipPrev();
    nextBtn.onclick = () => pageFlip.flipNext();

    pageFlip.on("flip", (e) => {
      const current = e.data + 1;
      const total = pageFlip.getPageCount();
      // Basit sayfa gösterimi
      pageCounter.innerText = `Page ${current} of ${total}`;
    });
  }
});
