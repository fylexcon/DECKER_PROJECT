/* --- assets/js/gallery.js --- */

document.addEventListener("DOMContentLoaded", function () {
  // 1. AYARLAR
  // HTML dosyası "pages" klasöründe olduğu için "../" ile çıkıyoruz
  const imagePath = "../assets/images/get_inspired/";
  const itemsPerPage = 6; // Her tıklamada kaç resim yüklenecek

  // 2. RESİM LİSTESİ (Dosya isimleri)
  const imageList = [
    "2.jpg",
    "3.png",
    "4.jpeg",
    "5.jpg",
    "6.png",
    "7.jpeg",
    "8.jpg",
    "9.png",
    "10.jpeg",
    "11.jpg",
    "12.png",
    "13.jpeg",
    "14.jpg",
    "15.png",
    "16.jpeg",
    "17.jpg",
    "18.png",
    "19.jpeg",
    "20.jpg",
    "21.jpeg",
    "22.jpg",
    "23.jpeg",
    "24.jpg",
    "25.jpeg",
    "26.jpg",
    "27.jpeg",
    "28.jpg",
    "29.jpeg",
    "30.jpg",
    "31.jpeg",
    "32.jpg",
    "33.jpg",
    "34.jpg",
    "35.jpg",
    "36.jpg",
    "37.jpg",
    "38.jpg",
    "39.jpg",
    "40.jpeg",
    "41.jpg",
    "42.jpg",
    "43.JPG",
    "44.jpg", // Not: 43.JPG büyük harf
    "45.jpg",
    "46.jpg",
  ];

  // 3. MANTIK
  let currentIndex = 0;
  const galleryGrid = document.getElementById("galleryGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  // Eğer sayfada galeri grid'i yoksa (başka sayfadaysak) kodu çalıştırma
  if (!galleryGrid) return;

  function loadImages() {
    const maxIndex = Math.min(currentIndex + itemsPerPage, imageList.length);

    for (let i = currentIndex; i < maxIndex; i++) {
      const filename = imageList[i];

      // HTML Elemanlarını Oluştur
      const itemDiv = document.createElement("div");
      itemDiv.className = "gallery-item";

      // Hata durumunda (resim yoksa) kullanıcıya gösterme
      itemDiv.innerHTML = `
          <img src="${imagePath}${filename}"
               alt="Project Inspiration"
               loading="lazy"
               onerror="this.parentElement.style.display='none';">
          <div class="gallery-overlay"></div>
        `;

      galleryGrid.appendChild(itemDiv);
    }

    currentIndex = maxIndex;

    // Listenin sonuna geldiysek butonu gizle
    if (currentIndex >= imageList.length) {
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
    }
  }

  // Başlangıç Yüklemesi
  if (imageList.length > 0) {
    loadImages();
  } else {
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
  }

  // Buton Tıklama Olayı
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadImages);
  }
});
