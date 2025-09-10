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

  // ✅ قائمة أكواد الخصم مع نسبها
  const discountCodes = [
    { code: "BOLET10", percentage: 10 },
    { code: "SAVE20", percentage: 20 },
    { code: "Frindshep50", percentage: 50 }
  ];

  let appliedDiscount = 0;
  let discountUsed = false; // يمنع إعادة الاستخدام

  // بيانات المنتجات (موجودة لو تحب تضيف تلقائي مستقبلاً)
  const productsData = [
    { id: 1, name: "ميدالية كلب", price: 15, image: "https://i.postimg.cc/qRTVGPcQ/2025-08-01-225224.png" },
    { id: 2, name: "ميدالية ثعلب", price: 15, image: "https://i.postimg.cc/MTWVVGLD/2025-08-01-223945.png" },
    { id: 3, name: "ستاند هاتف قطة", price: 15, image: "https://i.postimg.cc/sgXL9Vk3/cf250c78-d243-4c2e-8296-60b9d181fd13.png" },
    { id: 4, name: "ميدلية حرف", price: 20, image: "https://i.postimg.cc/bYVVYXGM/2025-08-01-225452.png" },
    { id: 5, name: "ميدالية قطة", price: 15, image: "https://i.postimg.cc/jq6NvyTh/2025-08-01-231111.png" },
    { id: 6, name: "تخصيص", price: 35, image: "" },
    { id: 7, name: "ميدالية اسم", price: 29, image: "https://i.postimg.cc/wjqQC78Z/2025-08-07-224236.png" }
  ];

  // تحميل السلة من localStorage
  let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

  // ✅ ربط المنتجات الجاهزة في HTML بدل ما نفرغها
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

  // تحديث واجهة السلة
  function updateCartUI() {
    cartItems.innerHTML = "";
    let total = 0;
    cartData.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `${item.name} - ${item.price} درهم <button class="remove-item" data-index="${index}">❌</button>`;
      cartItems.appendChild(li);
      total += item.price;
    });

    // تطبيق الخصم إذا موجود
    if (appliedDiscount > 0) {
      cartTotal.textContent = `الإجمالي: ${total - appliedDiscount} درهم (خصم ${appliedDiscount} درهم)`;
    } else {
      cartTotal.textContent = `الإجمالي: ${total} درهم`;
    }

    cartToggle.textContent = `🛒 السلة${cartData.length > 0 ? ` (${cartData.length})` : ""}`;
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }

  // توست
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

  // حذف من السلة
  cartItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      cartData.splice(index, 1);
      updateCartUI();
      showToast(`🗑️ تم حذف العنصر من السلة`);
    }
  });

  // فتح/إغلاق السلة
  cartToggle.addEventListener("click", () => cart.classList.toggle("open"));
  closeCart.addEventListener("click", () => cart.classList.remove("open"));

  // ✅ تطبيق أكواد الخصم
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

  // إتمام الطلب
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

  // إغلاق النافذة المنبثقة
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

  // ✅ تفعيل المنتجات وتحديث السلة
  bindProducts();
  updateCartUI();
});
