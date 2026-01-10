document.addEventListener("DOMContentLoaded", function () {
  
  // ============================================
  // 1. GLOBAL: MOBİL MENÜ & HEADER
  // ============================================
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      
      const icon = mobileToggle.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });

    // Linke tıklayınca mobilde menüyü kapat
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            if(window.innerWidth < 992) {
                navLinks.classList.remove("active");
                mobileToggle.querySelector("i").className = "fas fa-bars";
            }
        });
    });
  }

  // ============================================
  // 2. GLOBAL: SCROLL REVEAL ANIMASYONU
  // ============================================
  const reveals = document.querySelectorAll(".reveal");
  
  const checkReveal = () => {
    const triggerBottom = (window.innerHeight / 5) * 4;
    reveals.forEach((reveal) => {
      const revealTop = reveal.getBoundingClientRect().top;
      if (revealTop < triggerBottom) {
        reveal.classList.add("active");
      }
    });
  };
  
  window.addEventListener("scroll", checkReveal);
  checkReveal(); // Sayfa yüklendiğinde de kontrol et

  // ============================================
  // 3. PAGE: HOME (HERO SLIDER)
  // ============================================
  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    let currentSlide = 0;
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    const showSlide = (index) => {
      slides.forEach(slide => {
        slide.classList.remove("active");
        const vid = slide.querySelector("video");
        if(vid) { vid.pause(); vid.currentTime = 0; }
      });

      if (index >= slides.length) currentSlide = 0;
      else if (index < 0) currentSlide = slides.length - 1;
      else currentSlide = index;

      slides[currentSlide].classList.add("active");
      const activeVid = slides[currentSlide].querySelector("video");
      if(activeVid) activeVid.play();
    };

    if(nextBtn) nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
    if(prevBtn) prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
    
    // Otomatik geçiş
    setInterval(() => showSlide(currentSlide + 1), 7000);
  }

  // ============================================
  // 4. PAGE: ABOUT (COUNTER)
  // ============================================
  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    const stats = document.querySelectorAll(".stat-item h3");
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        stats.forEach((stat) => {
          const target = +stat.innerText.replace("+", ""); 
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
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
  }

  // ============================================
  // 5. PAGE: ESTIMATE COST (QUOTE LOGIC)
  // ============================================
  // Bu fonksiyonları global scope'a atıyoruz ki HTML'den onclick ile erişilebilsin
  window.cart = [];
  
  window.addToQuote = function(id, productName) {
    const lenInput = document.getElementById(`len-${id}`);
    const widInput = document.getElementById(`wid-${id}`);
    
    if(!lenInput) return; // Hata önleme

    const length = parseFloat(lenInput.value);
    const width = parseFloat(widInput.value);

    if (!length || !width || length <= 0) {
      alert("Please enter valid dimensions.");
      return;
    }

    const area = length * width;
    window.cart.push({ id: Date.now(), prodId: id, name: productName, length, width, area });

    // Temizle ve Güncelle
    lenInput.value = "";
    widInput.value = "";
    renderQuoteCart();
    showToast("Item added to quote!");
  };

  window.removeFromQuote = function(cartId) {
    window.cart = window.cart.filter(item => item.id !== cartId);
    renderQuoteCart();
  };

  function renderQuoteCart() {
    const list = document.getElementById('quoteList');
    const totalEl = document.getElementById('totalArea');
    if(!list) return;

    list.innerHTML = "";
    let total = 0;

    if(window.cart.length === 0) {
        list.innerHTML = '<li class="empty-msg">No items added yet.</li>';
        totalEl.textContent = "0 sq ft";
        return;
    }

    window.cart.forEach(item => {
        total += item.area;
        const li = document.createElement('li');
        li.className = 'quote-item'; // CSS'de tanımladık
        li.style.display = 'flex'; li.style.justifyContent='space-between'; li.style.marginBottom='10px';
        li.innerHTML = `
            <div><strong>${item.name}</strong> <small>(${item.length}'x${item.width}')</small></div>
            <i class="fas fa-times" style="color:#c0392b; cursor:pointer;" onclick="removeFromQuote(${item.id})"></i>
        `;
        list.appendChild(li);
    });
    totalEl.textContent = total.toLocaleString() + " sq ft";
  }

  // ============================================
  // 6. PAGE: SAMPLES (SELECTION LOGIC)
  // ============================================
  window.selectedSamples = new Set();

  window.toggleSample = function(element) {
    const prodName = element.getAttribute('data-prodname');
    const colorName = element.getAttribute('data-color');
    const key = `${prodName}|${colorName}`;
    const parentCard = element.closest('.sample-card');

    if (window.selectedSamples.has(key)) {
        window.selectedSamples.delete(key);
        element.classList.remove('selected');
    } else {
        window.selectedSamples.add(key);
        element.classList.add('selected');
    }

    // Kart Efekti
    if(parentCard.querySelectorAll('.selected').length > 0) {
        parentCard.style.borderColor = 'var(--accent-color)';
    } else {
        parentCard.style.borderColor = '#eee';
    }
    
    updateSampleCart();
  };

  window.removeSample = function(key) {
     if(window.selectedSamples.has(key)) {
         window.selectedSamples.delete(key);
         // UI Update: İlgili swatch'ı bul ve seçimi kaldır
         const [pName, cName] = key.split('|');
         const swatches = document.querySelectorAll(`.color-swatch[data-prodname="${pName}"][data-color="${cName}"]`);
         swatches.forEach(s => s.classList.remove('selected'));
         updateSampleCart();
     }
  };

  function updateSampleCart() {
      const list = document.getElementById('selectedList');
      const input = document.getElementById('samplesData');
      if(!list) return;

      list.innerHTML = "";
      const arr = Array.from(window.selectedSamples);
      if(input) input.value = arr.join(',');

      if(arr.length === 0) {
          list.innerHTML = '<p class="empty-msg">No samples selected.</p>';
          return;
      }

      arr.forEach(item => {
          const [p, c] = item.split('|');
          const div = document.createElement('div');
          div.className = 'selected-item'; // CSS'de tanımlı
          div.innerHTML = `
            <span><strong>${p}</strong> - ${c}</span>
            <i class="fas fa-times" onclick="removeSample('${item}')" style="cursor:pointer; color:#c0392b;"></i>
          `;
          list.appendChild(div);
      });
  }
  
  // State/Town Logic (Eğer sayfada varsa)
  const stateSelect = document.getElementById("stateSelect");
  if(stateSelect) {
      // Not: Veri çok uzun olduğu için burada kısaltıldı. Cities.js olarak ayırabilirsin.
      const stateTownData = { 
          "Alabama": ["Birmingham", "Montgomery"], 
          "California": ["Los Angeles", "San Francisco"],
          "New York": ["New York", "Buffalo"],
          "Texas": ["Houston", "Dallas"]
          // ... Diğer şehirleri buraya ekle ...
      };
      
      Object.keys(stateTownData).forEach(st => {
          const op = document.createElement("option");
          op.value = st; op.innerText = st;
          stateSelect.appendChild(op);
      });

      stateSelect.addEventListener("change", function() {
          const townSelect = document.getElementById("townSelect");
          townSelect.innerHTML = '<option value="">Select Town</option>';
          const towns = stateTownData[this.value];
          if(towns) {
              towns.forEach(t => {
                  const op = document.createElement("option");
                  op.value = t; op.innerText = t;
                  townSelect.appendChild(op);
              });
              townSelect.disabled = false;
          } else {
              townSelect.disabled = true;
          }
      });
  }

  // ============================================
  // 7. UTILS: TOAST MESSAGE
  // ============================================
  function showToast(msg) {
      let toast = document.getElementById("toast");
      if(!toast) {
          toast = document.createElement("div");
          toast.id = "toast";
          toast.className = "toast";
          document.body.appendChild(toast);
      }
      toast.innerText = msg;
      toast.className = "toast show";
      setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
  }

  // ============================================
  // 1.1 GLOBAL: ACTIVE MENU LINK HIGHLIGHTER
  // ============================================
  // Tüm menü linklerini seç
  const currentUrl = window.location.href;
  const menuLinks = document.querySelectorAll('.nav-links a');

  menuLinks.forEach((link) => {
    // Eğer linkin gittiği adres, şu anki adresle eşleşiyorsa
    if (link.href === currentUrl) {
      link.classList.add('active');
    }
  });
});

