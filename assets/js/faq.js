/* --- assets/js/faq.js --- */

document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      // 1. Tıklanan öğenin durumunu kontrol et
      const isActive = item.classList.contains("active");

      // 2. (Opsiyonel) Diğer tüm açık soruları kapat (Akordeon Etkisi)
      // Eğer tek tek açık kalsın istersen bu bloğu silebilirsin.
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      // 3. Tıklanan öğeyi Aç/Kapat
      if (isActive) {
        item.classList.remove("active");
        item.querySelector(".faq-answer").style.maxHeight = null;
      } else {
        item.classList.add("active");
        const answer = item.querySelector(".faq-answer");
        // ScrollHeight ile içeriğin gerçek yüksekliğini alıp animasyonluyoruz
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});
