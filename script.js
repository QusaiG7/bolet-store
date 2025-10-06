document.addEventListener("DOMContentLoaded", () => {
  const cartToggle = document.getElementById("cart-toggle");
  const cart = document.getElementById("cart");
  const closeCart = document.getElementById("close-cart");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkout = document.getElementById("checkout");
  const thankYouPopup = document.getElementById("thank-you-popup");
  const closePopup = document.getElementById("close-popup");
  const whatsappLink = document.getElementById("whatsapp-link");
  const toastContainer = document.getElementById("toast-container");

  const discountCodes = [
    { code: "BOLET10", percentage: 10 },
    { code: "WELCOME20", percentage: 20 },
    { code: "BS1", percentage: 10 }
  ];

  let appliedDiscount = 0;
  let discountUsed = false;

  let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

  function bindProducts() {
    document.querySelectorAll(".product").forEach(productDiv => {
      const id = parseInt(productDiv.getAttribute("data-id"));
      const name = productDiv.getAttribute("data-name");
      const price = parseFloat(productDiv.getAttribute("data-price"));

      const button = productDiv.querySelector(".add-to-cart");
      if (button) {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          cartData.push({ id, name, price });
          updateCartUI();
          showToast(`✔️ تم إضافة "${name}" للسلة`);
        });
      }
    });
  }

  function updateCartUI() {
    cartItems.innerHTML = "";
    let total = 0;
    cartData.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `${item.name} - ${item.price} درهم <button class="remove-item" data-index="${index}">❌</button>`;
      cartItems.appendChild(li);
      total += item.price;
    });

    if (appliedDiscount > 0) {
      cartTotal.textContent = `الإجمالي: ${total - appliedDiscount} درهم (خصم ${appliedDiscount} درهم)`;
    } else {
      cartTotal.textContent = `الإجمالي: ${total} درهم`;
    }

    cartToggle.textContent = `🛒 السلة${cartData.length > 0 ? ` (${cartData.length})` : ""}`;
    localStorage.setItem("cartData", JSON.stringify(cartData));

    renderPayPalButton();
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }, 10);
  }

  cartItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      cartData.splice(index, 1);
      updateCartUI();
      showToast(`🗑️ تم حذف العنصر من السلة`);
    }
  });

  cartToggle.addEventListener("click", () => cart.classList.toggle("open"));
  closeCart.addEventListener("click", () => cart.classList.remove("open"));

  document.getElementById("apply-discount").addEventListener("click", () => {
    if (discountUsed) return;

    const inputCode = document.getElementById("discount-code").value.trim().toUpperCase();
    const found = discountCodes.find(dc => dc.code.toUpperCase() === inputCode);

    if (found) {
      const totalBefore = cartData.reduce((sum, item) => sum + item.price, 0);
      appliedDiscount = (totalBefore * found.percentage) / 100;
      updateCartUI();
      document.getElementById("discount-message").textContent = `✔️ تم تطبيق الخصم ${found.percentage}%`;
      discountUsed = true;
      document.getElementById("apply-discount").disabled = true;
    } else {
      document.getElementById("discount-message").textContent = "❌ الكود غير صحيح";
    }
  });

  checkout.addEventListener("click", () => {
    if (cartData.length === 0) {
      showToast("❗️السلة فارغة");
      return;
    }
    thankYouPopup.classList.remove("hidden");

    const message = cartData.map((item, i) => `${i + 1}. ${item.name} - ${item.price} درهم`).join("\n");
    const total = cartData.reduce((sum, item) => sum + item.price, 0) - appliedDiscount;
    const finalMessage = `مرحبًا، أرغب بشراء المنتجات التالية:\n${message}\n\nالإجمالي: ${total} درهم`;

    whatsappLink.href = `https://wa.me/971507947709?text=${encodeURIComponent(finalMessage)}`;
  });

  closePopup.addEventListener("click", () => {
    thankYouPopup.classList.add("hidden");
    cartData = [];
    appliedDiscount = 0;
    discountUsed = false;
    document.getElementById("discount-code").value = "";
    document.getElementById("discount-message").textContent = "";
    document.getElementById("apply-discount").disabled = false;
    updateCartUI();
  });

function renderPayPalButton() {
  const total = cartData.reduce((sum, item) => sum + item.price, 0) - appliedDiscount;
  const container = document.getElementById("paypal-button-container");
  container.innerHTML = "";

  if (total <= 0 || !window.paypal) return; // تأكد من وجود paypal SDK

  paypal.Buttons({
    style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' },
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: { currency_code: "AED", value: total.toFixed(2) },
          description: cartData.map(item => item.name).join(", ")
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert(`✅ تم الدفع بنجاح بواسطة ${details.payer.name.given_name}`);
        cartData = [];
        appliedDiscount = 0;
        discountUsed = false;
        document.getElementById("discount-code").value = "";
        document.getElementById("discount-message").textContent = "";
        document.getElementById("apply-discount").disabled = false;
        updateCartUI();
      });
    }
  }).render("#paypal-button-container");
}

  }

  bindProducts();
  updateCartUI();
});

