/* --- assets/js/estimate.js --- */

// Sepet Durumu
let cart = [];

// Ürün Ekleme Fonksiyonu
function addToQuote(id, productName) {
  // İlgili ürünün inputlarını ID'sine göre bul
  const lenInput = document.getElementById(`len-${id}`);
  const widInput = document.getElementById(`wid-${id}`);

  const length = parseFloat(lenInput.value);
  const width = parseFloat(widInput.value);

  if (!length || !width || length <= 0 || width <= 0) {
    alert("Please enter valid Length and Width in feet.");
    return;
  }

  const area = length * width;

  cart.push({
    id: Date.now(), // Sepet öğesi için benzersiz ID
    prodId: id,
    name: productName,
    length: length,
    width: width,
    area: area,
  });

  // Inputları temizle
  lenInput.value = "";
  widInput.value = "";

  // Sepeti güncelle
  renderCart();
}

// Ürün Silme Fonksiyonu
function removeFromQuote(cartItemId) {
  cart = cart.filter((item) => item.id !== cartItemId);
  renderCart();
}

// Sepeti Ekrana Çizme Fonksiyonu
function renderCart() {
  const list = document.getElementById("quoteList");
  const totalAreaEl = document.getElementById("totalArea");

  list.innerHTML = "";
  let totalArea = 0;

  if (cart.length === 0) {
    list.innerHTML = '<li class="empty-cart-msg">No items added yet.</li>';
    totalAreaEl.textContent = "0 sq ft";
    return;
  }

  cart.forEach((item) => {
    totalArea += item.area;
    const li = document.createElement("li");
    li.className = "quote-item";
    li.innerHTML = `
      <div class="quote-item-info">
        <strong>${item.name}</strong>
        <span class="quote-item-dims">
          ${item.length}' x ${item.width}' (${item.area} sq ft)
        </span>
      </div>
      <i class="fas fa-times remove-btn" onclick="removeFromQuote(${item.id})"></i>
    `;
    list.appendChild(li);
  });

  totalAreaEl.textContent = totalArea.toLocaleString("en-US") + " sq ft";
}

// Form Gönderme İşlemi
const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  quoteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Please add products to your list first.");
      return;
    }
    // Gelecekte buraya Backend bağlantısı (PHP/API) eklenebilir.
    console.log("Gönderilen Sepet Verisi:", cart);
    alert(
      "Your request has been received! We will email you a pricing proposal shortly."
    );

    // Formu sıfırla
    cart = [];
    renderCart();
    quoteForm.reset();
  });
}
