/* --- assets/js/samples.js --- */

// 1. COLOR LIBRARY (Database of Textures)
// Using paths from your decking.css context
const colorLibrary = {
  antrasit: { name: "Anthracite", img: "../assets/images/get_inspired/DECK-RENK-ANTRASIT.jpg" },
  grey:     { name: "Grey",       img: "../assets/images/get_inspired/DECK-RENK-GRI.jpg" },
  wheat:    { name: "Wheat",      img: "../assets/images/get_inspired/DECK-RENK-KREM.jpg" },
  nut:      { name: "Nut Coffee", img: "../assets/images/get_inspired/DECK-RENK-KAHVE.jpg" },
  // Simulating extra colors for 8/12 options (Reusing images for demo purposes)
  teak:     { name: "Teak",       img: "../assets/images/get_inspired/joist1.jpg" }, 
  smoke:    { name: "Smoke",      img: "../assets/images/get_inspired/3 D EMBOSSED (1).webp" }, 
  charcoal: { name: "Charcoal",   img: "../assets/images/get_inspired/3 D EMBOSSED (2).webp" }, 
  cedar:    { name: "Cedar",      img: "../assets/images/get_inspired/DEEP EMBOSSED (1).webp" },
  ivory:    { name: "Ivory",      img: "../assets/images/get_inspired/DECK-RENK-KREM.jpg" },
  ebony:    { name: "Ebony",      img: "../assets/images/get_inspired/DECK-RENK-ANTRASIT.jpg" },
  oak:      { name: "Oak",        img: "../assets/images/get_inspired/DECK-RENK-KAHVE.jpg" },
  stone:    { name: "Stone",      img: "../assets/images/get_inspired/DECK-RENK-GRI.jpg" }
};

// 2. PRODUCTS DATA (Simulating PHP Loop)
// 'colors' array defines which keys from colorLibrary to show (4, 8, or 12)
const products = [
  {
    id: 1,
    name: "Classic Decking",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
    colors: ['antrasit', 'grey', 'wheat', 'nut'] // 4 Colors
  },
  {
    id: 2,
    name: "3D Embossed",
    img: "https://images.unsplash.com/photo-1621255502120-7f4115b02661?w=400",
    colors: ['antrasit', 'grey', 'wheat', 'nut', 'teak', 'smoke', 'charcoal', 'cedar'] // 8 Colors
  },
  {
    id: 3,
    name: "Co-Extrusion",
    img: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=400",
    colors: ['antrasit', 'grey', 'wheat', 'nut'] // 4 Colors
  },
  {
    id: 4,
    name: "Wall Panel (Fluted)",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    colors: ['antrasit', 'grey', 'wheat', 'nut', 'teak', 'smoke', 'charcoal', 'cedar', 'ivory', 'ebony', 'oak', 'stone'] // 12 Colors
  },
  {
    id: 5,
    name: "Exterior Cladding",
    img: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=400",
    colors: ['antrasit', 'grey', 'wheat', 'nut', 'teak', 'smoke'] // 6 Colors example
  },
  {
    id: 6,
    name: "Composite Fence",
    img: "https://images.unsplash.com/photo-1599690925058-943dd6a57500?w=400",
    colors: ['grey', 'wheat', 'nut', 'teak'] // 4 Colors
  },
];

// ... (State/Town Data kept same) ...
const stateTownData = {
  "Alabama": ["Birmingham", "Montgomery"],
  "California": ["Los Angeles", "San Francisco"],
  "Florida": ["Miami", "Orlando"],
  "New York": ["New York", "Buffalo"],
  "Texas": ["Houston", "Dallas"]
};

// 3. INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {
  
  // A. Build Product Grid
  const gridContainer = document.getElementById("productGrid");
  if (gridContainer) {
    products.forEach((prod) => {
      const card = document.createElement("div");
      card.className = "sample-card";

      // Generate Color Swatches based on product's specific color list
      let colorHtml = "";
      
      prod.colors.forEach((colorKey) => {
        const colorData = colorLibrary[colorKey];
        if (colorData) {
          // Note: using style="background-image" instead of background-color
          colorHtml += `<div class="color-swatch"
                             style="background-image: url('${colorData.img}')"
                             data-color="${colorData.name}"
                             data-product="${prod.id}"
                             data-prodname="${prod.name}"
                             onclick="toggleSample(this)"></div>`;
        }
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

  // B. State/Town Logic (Standard)
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

  // C. Form Submission
  const sampleForm = document.getElementById("sampleForm");
  if (sampleForm) {
    sampleForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (selectedSamples.size === 0) {
        alert("Please select at least one sample color.");
        return;
      }
      alert("Request sent successfully! We will ship " + selectedSamples.size + " samples.");
    });
  }
});

// 4. CART LOGIC
let selectedSamples = new Set();

function toggleSample(element) {
  const prodName = element.getAttribute("data-prodname");
  const colorName = element.getAttribute("data-color");
  const displayKey = `${prodName}|${colorName}`;

  if (selectedSamples.has(displayKey)) {
    selectedSamples.delete(displayKey);
    element.classList.remove("selected");
  } else {
    // Optional: Limit total samples (e.g., max 5)
    if (selectedSamples.size >= 5) {
        alert("You can select a maximum of 5 free samples.");
        return;
    }
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
    listContainer.innerHTML = '<p class="empty-msg">No samples selected yet.</p>';
    if (hiddenInput) hiddenInput.value = "";
    return;
  }

  const samplesArray = Array.from(selectedSamples);
  if (hiddenInput) hiddenInput.value = samplesArray.join(",");

  samplesArray.forEach((item) => {
    const [pName, cName] = item.split("|");
    
    // Find color image for the sidebar thumbnail
    let thumbUrl = "";
    // Reverse lookup for image based on color name (simplified for demo)
    for (const key in colorLibrary) {
        if(colorLibrary[key].name === cName) {
            thumbUrl = colorLibrary[key].img;
            break;
        }
    }

    const itemDiv = document.createElement("div");
    itemDiv.className = "selected-item";
    
    // Tiny thumbnail in cart
    const thumbImg = thumbUrl ? `<img src="${thumbUrl}" style="width:24px; height:24px; border-radius:50%; margin-right:10px; vertical-align:middle; border:1px solid #ccc;">` : '';

    itemDiv.innerHTML = `
        <div style="display:flex; align-items:center;">
            ${thumbImg}
            <span><strong>${pName}</strong> <small>(${cName})</small></span>
        </div>
        <i class="fas fa-times remove-item" onclick="removeSample('${item}')"></i>
    `;
    listContainer.appendChild(itemDiv);
  });
}

function removeSample(key) {
  if (selectedSamples.has(key)) {
    selectedSamples.delete(key);
    
    // Update UI Grid
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