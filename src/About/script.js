document.addEventListener("DOMContentLoaded", function () {
  // Mobil Menü Toggle İşlemi
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      // Menüye 'active' class'ı ekleyip CSS ile gösterebilirsiniz
      // Basit bir toggle mantığı:
      if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
      } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "80px";
        navLinks.style.left = "0";
        navLinks.style.width = "100%";
        navLinks.style.backgroundColor = "white";
        navLinks.style.padding = "20px";
        navLinks.style.boxShadow = "0 5px 10px rgba(0,0,0,0.1)";
      }
    });
  }

  // İstatistik Sayacı Animasyonu (Sayfa aşağı kaydırıldığında sayılar artar)
  const stats = document.querySelectorAll(".stat-item h3");
  let hasAnimated = false;

  window.addEventListener("scroll", () => {
    const statsSection = document.querySelector(".stats-section");
    const sectionPos = statsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;

    if (sectionPos < screenPos && !hasAnimated) {
      stats.forEach((stat) => {
        const target = +stat.innerText.replace("+", ""); // + işaretini kaldır
        const increment = target / 50;

        let current = 0;
        const updateCount = () => {
          if (current < target) {
            current += increment;
            stat.innerText = Math.ceil(current) + "+";
            setTimeout(updateCount, 20);
          } else {
            stat.innerText = target + "+";
          }
        };
        updateCount();
      });
      hasAnimated = true;
    }
  });
});
