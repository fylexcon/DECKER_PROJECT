/* --- assets/js/catalog.js --- */

document.addEventListener("DOMContentLoaded", function () {
  const bookElement = document.getElementById("book");
  const loadingState = document.getElementById("loadingState");
  const pageCounter = document.getElementById("pageCounter");
  const prevBtn = document.getElementById("btnPrev");
  const nextBtn = document.getElementById("btnNext");

  let pageFlip = null;
  let pdfDoc = null;

  // 1. Start Loading Immediately
  initCatalog();

  async function initCatalog() {
    try {
      // PDF Path (Ensure this matches your file structure exactly)
      // Note: Kept the filename typo "CATOLOG" as per your file list
      const pdfPath = "../assets/documents/DECK-ER CATOLOG.pdf";

      const loadingTask = pdfjsLib.getDocument(pdfPath);
      pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      // Higher scale for crisp text
      const scale = window.innerWidth < 768 ? 1.5 : 2.0;

      bookElement.innerHTML = ""; // Clear container

      // Render all pages to Canvas
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Force CSS to fill parent
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        const div = document.createElement("div");
        div.classList.add("page-wrapper");
        div.appendChild(canvas);
        bookElement.appendChild(div);
      }

      // PDF Loaded, Hide Spinner & Init Flip
      loadingState.style.display = "none";
      createFlipBook();

    } catch (err) {
      console.error("Error loading catalog:", err);
      loadingState.innerHTML = "<p style='color:#e74c3c'>Failed to load catalog.<br>Please try downloading the PDF instead.</p>";
    }
  }

  function createFlipBook() {
    const isMobile = window.innerWidth < 992; // Tablet/Mobile treated as single page

    // Dynamic Sizing Calculation
    // We want the book to fit nicely in the view minus header/footer/padding
    const headerOffset = 100; // Approx header height
    const paddingOffset = 140; // Controls + margins
    const availableHeight = window.innerHeight - headerOffset - paddingOffset;
    
    // Standard A4 aspect ratio (1 / 1.414 = ~0.707)
    const aspectRatio = 0.707; 

    // Calculate height based on screen, maxing out at reasonable limits
    let bookHeight = Math.min(Math.max(availableHeight, 400), 800);
    let bookWidth = bookHeight * aspectRatio;

    // Mobile adjustment
    if (isMobile) {
        // Use width as constraint on mobile
        const screenW = window.innerWidth - 40;
        if (bookWidth > screenW) {
            bookWidth = screenW;
            bookHeight = bookWidth / aspectRatio;
        }
    }

    pageFlip = new St.PageFlip(bookElement, {
      width: bookWidth,
      height: bookHeight,
      
      // Auto-size configuration
      size: isMobile ? "fixed" : "stretch",
      
      // Display Mode
      usePortrait: isMobile, // Single page on mobile
      showCover: true,
      
      minWidth: 200,
      maxWidth: 1000,
      minHeight: 300,
      maxHeight: 1200,
      
      maxShadowOpacity: 0.5,
      mobileScrollSupport: false // Prevent page scroll conflict
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page-wrapper"));

    // Event Listeners
    prevBtn.addEventListener("click", () => pageFlip.flipPrev());
    nextBtn.addEventListener("click", () => pageFlip.flipNext());

    // Update Counter
    pageFlip.on("flip", (e) => {
      const current = e.data + 1; // 0-based index
      const total = pageFlip.getPageCount();
      pageCounter.innerText = `Page ${current} of ${total}`;
    });
    
    // Set initial counter
    pageCounter.innerText = `Page 1 of ${pageFlip.getPageCount()}`;
  }
});