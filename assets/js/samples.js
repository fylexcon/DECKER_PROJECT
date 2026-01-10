/* --- assets/js/samples.js --- */

// 1. VERİLER (DATA)
const colors = [
  { name: "Teak", hex: "#d2a373" },
  { name: "Grey", hex: "#808080" },
  { name: "Charcoal", hex: "#363636" },
  { name: "Walnut", hex: "#5d4037" },
  { name: "Oak", hex: "#c19a6b" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "Cedar", hex: "#a0522d" },
  { name: "Coffee", hex: "#4b3621" },
];

const products = [
  {
    id: 1,
    name: "Classic Decking",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
  },
  {
    id: 2,
    name: "3D Embossed",
    img: "https://images.unsplash.com/photo-1621255502120-7f4115b02661?w=400",
  },
  {
    id: 3,
    name: "Co-Extrusion",
    img: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=400",
  },
  {
    id: 4,
    name: "Marine Decking",
    img: "https://images.unsplash.com/photo-1599690925058-943dd6a57500?w=400",
  },
  {
    id: 5,
    name: "Wall Panel (Fluted)",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
  {
    id: 6,
    name: "Wall Panel (Flat)",
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
  },
  {
    id: 7,
    name: "Exterior Cladding",
    img: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=400",
  },
  {
    id: 8,
    name: "Composite Fence",
    img: "https://images.unsplash.com/photo-1599690925058-943dd6a57500?w=400",
  },
];

const stateTownData = {
  Alabama: [
    "Birmingham",
    "Montgomery",
    "Mobile",
    "Huntsville",
    "Tuscaloosa",
    "Hoover",
    "Dothan",
    "Auburn",
    "Decatur",
    "Madison",
    "Florence",
    "Gadsden",
  ],
  Alaska: ["Anchorage"],
  Arizona: [
    "Phoenix",
    "Tucson",
    "Mesa",
    "Chandler",
    "Glendale",
    "Scottsdale",
    "Gilbert",
    "Tempe",
    "Peoria",
    "Surprise",
    "Yuma",
    "Avondale",
    "Goodyear",
    "Flagstaff",
    "Buckeye",
    "Lake Havasu City",
    "Casa Grande",
    "Sierra Vista",
    "Maricopa",
    "Oro Valley",
    "Prescott",
    "Bullhead City",
    "Prescott Valley",
    "Marana",
    "Apache Junction",
  ],
  California: [
    "Los Angeles",
    "San Diego",
    "San Jose",
    "San Francisco",
    "Fresno",
    "Sacramento",
    "Long Beach",
    "Oakland",
    "Bakersfield",
    "Anaheim",
    "Santa Ana",
    "Riverside",
    "Stockton",
    "Chula Vista",
    "Irvine",
    "Fremont",
    "San Bernardino",
    "Modesto",
    "Fontana",
  ],
  Florida: [
    "Jacksonville",
    "Miami",
    "Tampa",
    "Orlando",
    "St. Petersburg",
    "Hialeah",
    "Tallahassee",
    "Fort Lauderdale",
    "Port St. Lucie",
    "Cape Coral",
  ],
  "New York": [
    "New York",
    "Buffalo",
    "Rochester",
    "Yonkers",
    "Syracuse",
    "Albany",
    "New Rochelle",
    "Mount Vernon",
    "Schenectady",
    "Utica",
  ],
  Texas: [
    "Houston",
    "San Antonio",
    "Dallas",
    "Austin",
    "Fort Worth",
    "El Paso",
    "Arlington",
    "Corpus Christi",
    "Plano",
    "Laredo",
  ],
  // ... Diğer eyaletler buraya eklenebilir (kısalık için kısalttım, tam listeyi kopyalayabilirsin)
  Washington: [
    "Seattle",
    "Spokane",
    "Tacoma",
    "Vancouver",
    "Bellevue",
    "Kent",
    "Everett",
  ],
};

// 2. SAYFA YÜKLENİNCE ÇALIŞACAKLAR
document.addEventListener("DOMContentLoaded", function () {
  // A. Ürün Izgarasını Oluştur
  const gridContainer = document.getElementById("productGrid");
  if (gridContainer) {
    products.forEach((prod) => {
      const card = document.createElement("div");
      card.className = "sample-card";

      let colorHtml = "";
      colors.forEach((col) => {
        colorHtml += `<div class="color-swatch"
                                   style="background-color: ${col.hex}"
                                   data-color="${col.name}"
                                   data-product="${prod.id}"
                                   data-prodname="${prod.name}"
                                   onclick="toggleSample(this)"></div>`;
      });

      card.innerHTML = `
                <img src="${prod.img}" alt="${prod.name}">
                <div class="sample-details">
                    <h4>${prod.name}</h4>
                    <div class="color-options">${colorHtml}</div>
                </div>
            `;
      gridContainer.appendChild(card);
    });
  }

  // B. Eyalet Seçimini Doldur
  const stateSelect = document.getElementById("stateSelect");
  const townSelect = document.getElementById("townSelect");

  if (stateSelect && townSelect) {
    Object.keys(stateTownData).forEach((state) => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateSelect.appendChild(option);
    });

    stateSelect.addEventListener("change", function () {
      townSelect.innerHTML = '<option value="">Select Town</option>';
      const towns = stateTownData[this.value];
      if (towns) {
        towns.forEach((town) => {
          const option = document.createElement("option");
          option.value = town;
          option.textContent = town;
          townSelect.appendChild(option);
        });
        townSelect.disabled = false;
      } else {
        townSelect.disabled = true;
      }
    });
  }

  // C. Form Gönderimi
  const sampleForm = document.getElementById("sampleForm");
  if (sampleForm) {
    sampleForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (selectedSamples.size === 0) {
        alert("Please select at least one sample color.");
        return;
      }
      alert(
        "Request sent! We will ship " +
          selectedSamples.size +
          " samples to you."
      );
      // Burada backend'e gönderme işlemi yapılır
    });
  }
});

// 3. SEPET / SEÇİM MANTIĞI (Global scope'ta olması gerekebilir veya event listener ile bağlanmalı)
let selectedSamples = new Set();

function toggleSample(element) {
  const prodName = element.getAttribute("data-prodname");
  const colorName = element.getAttribute("data-color");
  const displayKey = `${prodName}|${colorName}`;

  if (selectedSamples.has(displayKey)) {
    selectedSamples.delete(displayKey);
    element.classList.remove("selected");
  } else {
    selectedSamples.add(displayKey);
    element.classList.add("selected");
  }
  updateCartDisplay();
}

function updateCartDisplay() {
  const listContainer = document.getElementById("selectedList");
  const hiddenInput = document.getElementById("samplesData");

  listContainer.innerHTML = "";

  if (selectedSamples.size === 0) {
    listContainer.innerHTML =
      '<p class="empty-msg">No samples selected yet.</p>';
    if (hiddenInput) hiddenInput.value = "";
    return;
  }

  const samplesArray = Array.from(selectedSamples);
  if (hiddenInput) hiddenInput.value = samplesArray.join(",");

  samplesArray.forEach((item) => {
    const [pName, cName] = item.split("|");
    const colObj = colors.find((c) => c.name === cName);

    const itemDiv = document.createElement("div");
    itemDiv.className = "selected-item";
    itemDiv.style.borderLeftColor = colObj ? colObj.hex : "#333";

    itemDiv.innerHTML = `
            <div><strong>${pName}</strong> <small>(${cName})</small></div>
            <i class="fas fa-times remove-item" onclick="removeSample('${item}')"></i>
        `;
    listContainer.appendChild(itemDiv);
  });
}

function removeSample(key) {
  if (selectedSamples.has(key)) {
    selectedSamples.delete(key);
    const [pName, cName] = key.split("|");
    const swatches = document.querySelectorAll(".color-swatch");
    swatches.forEach((sw) => {
      if (
        sw.getAttribute("data-prodname") === pName &&
        sw.getAttribute("data-color") === cName
      ) {
        sw.classList.remove("selected");
      }
    });
    updateCartDisplay();
  }
}
