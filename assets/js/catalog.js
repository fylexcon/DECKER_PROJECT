/* --- assets/js/catalog.js (DOUBLE PAGE MODE) --- */

document.addEventListener("DOMContentLoaded", async function () {
  const pdfPath = "../assets/documents/DECK-ER CATOLOG.pdf";
  const bookElement = document.getElementById("book");
  const loadingBar = document.getElementById("loading-bar");
  const pageInfo = document.getElementById("pageInfo");
  let pageFlip;

  try {
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    console.log(`Catalog Loaded: ${numPages} pages.`);

    // --- 1. SAYFALARI OLUŞTUR ---
    // Hız için scale 1.0 (Yeterli kalite)
    const renderScale = window.innerWidth < 768 ? 0.8 : 1.2;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: renderScale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Mobilde kenarları yumuşat
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const pageWrapper = document.createElement("div");
      pageWrapper.classList.add("page-wrapper");
      // Sayfa numarası eklemek istersen:
      // pageWrapper.innerHTML = `<span class="page-num">${i}</span>`;
      pageWrapper.appendChild(canvas);
      bookElement.appendChild(pageWrapper);
    }

    loadingBar.style.display = "none";

    // --- 2. KİTAP AYARLARI (ÇİFT SAYFA İÇİN GÜNCELLENDİ) ---
    const isMobile = window.innerWidth < 768;

    // Masaüstünde sayfa genişliğini biraz daha daraltalım ki ikisi yan yana sığsın
    const bookWidth = isMobile ? 350 : 450;
    const bookHeight = isMobile ? 500 : 640;

    pageFlip = new St.PageFlip(bookElement, {
      width: bookWidth,
      height: bookHeight,

      // ÖNEMLİ: Çift sayfa için boyut ayarı
      size: isMobile ? "fixed" : "stretch",

      minWidth: 300,
      maxWidth: 1000,
      minHeight: 400,
      maxHeight: 1200,

      showCover: true, // İlk sayfa kapak olsun (Tek görünür)
      maxShadowOpacity: 0.5,

      // !!! KRİTİK AYAR !!!
      // False yaparsak masaüstünde çift sayfa (landscape) zorlar
      usePortrait: isMobile ? true : false,

      mobileScrollSupport: false,
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page-wrapper"));

    // --- 3. KONTROLLER ---
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    function updateInfo() {
      // Çift sayfa modunda sayfa numaralarını göstermek için mantık
      // Örn: Kapak (0), 1-2, 3-4 diye gider.
      const current = pageFlip.getCurrentPageIndex() + 1;
      const total = pageFlip.getPageCount();

      if (current === 1) {
        pageInfo.innerText = `Cover`;
      } else {
        // Çift sayfa gösterimi
        pageInfo.innerText = `${current} - ${current + 1 > total ? total : current + 1} / ${total}`;
      }
    }

    btnPrev.addEventListener("click", () => {
      pageFlip.flipPrev();
    });
    btnNext.addEventListener("click", () => {
      pageFlip.flipNext();
    });

    pageFlip.on("flip", updateInfo);

    // Yüklendikten sonra bilgiyi güncelle
    setTimeout(updateInfo, 1000);
  } catch (error) {
    console.error("Catalog Error:", error);
    loadingBar.innerHTML = `
      <p style="color:#c0392b; font-weight:bold;">
        Catalog could not be loaded. <br>
        <a href="../assets/documents/DECK-ER CATOLOG.pdf" style="text-decoration:underline;">Click here to view PDF</a>
      </p>`;
  }
});
