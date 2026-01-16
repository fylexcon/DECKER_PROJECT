/* --- assets/js/about.js --- */

document.addEventListener("DOMContentLoaded", function () {
  // İstatistik Sayacı Animasyonu
  const stats = document.querySelectorAll(".stat-item h3");
  const statsSection = document.querySelector(".stats-section");
  let hasAnimated = false;

  if (stats.length > 0 && statsSection) {
    function startCounter() {
      const sectionPos = statsSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight / 1.3;

      if (sectionPos < screenPos && !hasAnimated) {
        stats.forEach((stat) => {
          // Örn: "500+" içindeki 500'ü al
          const target = +stat.innerText.replace(/\D/g, "");
          const increment = target / 100; // Hız ayarı

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
    }

    // Scroll olayını dinle
    window.addEventListener("scroll", startCounter);
    // Sayfa yüklendiğinde görünüyorsa hemen başlat
    startCounter();
  }
});
