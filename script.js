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

  // إعدادات الخصم
  const validDiscountCode = "BOLET10"; // الكود
  const discountPercentage = 10; // نسبة الخصم %
  let appliedDiscount = 0;
  let discountUsed = false;

  // عناصر إدخال الخصم
  const discountCodeInput = document.getElementById("discount-code");
  const applyDiscountBtn = document.getElementById("apply-discount");
  const discountMessage = document.getElementById("discount-message");

  // بيانات المنتجات
  const productsData = [
    {
      id: 1,
      name: "ميدالية كلب",
      price: 15,
      description: "ميدالية أنيقة لكلبك مع تصميم مميز.",
      image: "https://i.postimg.cc/qRTVGPcQ/2025-08-01-225224.png"
    },
    {
      id: 2,
      name: "ميدالية ثعلب",
      price: 15,
      description: "ميدالية ذات تصميم جميل على شكل ثعلب.",
      image: "https://i.postimg.cc/MTWVVGLD/2025-08-01-223945.png"
    },
    {
      id: 3,
      name: "ستاند هاتف قطة",
      price: 15,
      description: "ستاند هاتف عملي وجميل بشكل قطة لطيفة.",
      image: "https://i.postimg.cc/sgXL9Vk3/cf250c78-d243-4c2e-8296-60b9d181fd13.png"
    },
    {
      id: 4,
      name: "ميدلية حرف",
      price: 20,
      description: "ميدالية بتصميم حرف مميز مع خيارات ألوان متعددة.",
      image: "https://i.postimg.cc/bYVVYXGM/2025-08-01-225452.png"
    },
    {
      id: 5,
      name: "ميدالية قطة",
      price: 15,
      description: "ميدالية على شكل قطة، جميلة وناعمة.",
      image: "https://i.postimg.cc/jq6NvyTh/2025-08-01-231111.png"
    },
    {
      id: 6,
      name: "تخصيص",
      price: 35,
      description: "خصص مجسمك.",
    }
  ];

  // تحميل السلة من localStorage
  let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

  // عرض المنتجات
  function displayProducts() {
    const productsContainer = document.querySelector(".products");
    productsContainer.innerHTML = "";

    productsData.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.setAttribute("data-id", product.id);
      productDiv.setAttribute("data-name", product.name);
      productDiv.setAttribute("data-price", product.price);

      productDiv.innerHTML = `
        <a href="product.html?id=${product.id}" style="text-decoration:none; color: inherit;">
          <img src="${product.image}" alt="${product.name}" />
          <h2>${product.name}</h2>
          <p>${product.price} درهم</p>
        </a>
        <button class="add-to-cart">أضف للسلة</button>
      `;

      productsContainer.appendChild(productDiv);
    });

    // أزرار الإضافة للسلة
    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const productDiv = button.closest(".product");
        const id = parseInt(productDiv.getAttribute("data-id"));
        const product = productsData.find(p => p.id === id);
        if (!product) return;

        cartData.push({ id: product.id, name: product.name, price: product.price });
        updateCartUI();
        showToast(`✔️ تم إضافة "${product.name}" للسلة`);
      });
    });
  }

  // تحديث واجهة السلة
  function updateCartUI() {
    cartItems.innerHTML = "";
    let total = 0;
    cartData.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} - ${item.price} درهم
        <button class="remove-item" data-index="${index}">❌</button>
      `;
      cartItems.appendChild(li);
      total += item.price;
    });

    // تطبيق الخصم
    if (appliedDiscount > 0) {
      const discountAmount = (total * appliedDiscount).toFixed(2);
      const newTotal = (total - discountAmount).toFixed(2);
      cartTotal.textContent = `الإجمالي: ${total} درهم (بعد الخصم: ${newTotal} درهم)`;
    } else {
      cartTotal.textContent = `الإجمالي: ${total} درهم`;
    }

    cartToggle.textContent = `🛒 السلة${cartData.length > 0 ? ` (${cartData.length})` : ""}`;
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }

  // تطبيق كود الخصم
  applyDiscountBtn.addEventListener("click", () => {
    if (discountUsed) {
      discountMessage.textContent = "❌ الكود استُخدم بالفعل.";
      return;
    }

    const code = discountCodeInput.value.trim();
    if (code === validDiscountCode) {
      appliedDiscount = discountPercentage / 100;
      discountUsed = true;
      discountMessage.textContent = `✔️ تم تطبيق خصم ${discountPercentage}%`;
      applyDiscountBtn.disabled = true;
    } else {
      discountMessage.textContent = "❌ كود غير صالح";
    }
    updateCartUI();
  });

  // إظهار رسالة توست
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

  // حذف عنصر من السلة
  cartItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      const removedName = cartData[index].name;
      cartData.splice(index, 1);
      updateCartUI();
      showToast(`🗑️ تم حذف "${removedName}" من السلة`);
    }
  });

  // فتح/إغلاق السلة
  cartToggle.addEventListener("click", () => {
    cart.classList.toggle("open");
  });

  closeCart.addEventListener("click", () => {
    cart.classList.remove("open");
  });

  // إتمام الطلب
  checkout.addEventListener("click", () => {
    if (cartData.length === 0) {
      showToast("❗️السلة فارغة");
      return;
    }

    thankYouPopup.classList.remove("hidden");

    const message = cartData
      .map((item, i) => `${i + 1}. ${item.name} - ${item.price} درهم`)
      .join("\n");
    const total = cartData.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = appliedDiscount > 0 ? total - (total * appliedDiscount) : total;

    const finalMessage = `مرحبًا، أرغب بشراء المنتجات التالية:\n${message}\n\nالإجمالي: ${finalTotal} درهم`;
    whatsappLink.href = `https://wa.me/971507947709?text=${encodeURIComponent(finalMessage)}`;
  });

  // إغلاق النافذة المنبثقة
  closePopup.addEventListener("click", () => {
    thankYouPopup.classList.add("hidden");
    cartData = [];

    appliedDiscount = 0;
    discountUsed = false;
    discountCodeInput.value = "";
    discountMessage.textContent = "";
    applyDiscountBtn.disabled = false;

    updateCartUI();
  });

  // تشغيل أولي
  displayProducts();
  updateCartUI();
});
