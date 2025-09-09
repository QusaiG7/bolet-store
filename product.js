document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById("product-details");
  const addToCartBtn = document.getElementById("add-to-cart");
  const colorSelect = document.getElementById("color-select");
  const commentInput = document.getElementById("comment-input");

  // بيانات المنتجات (نفسها مثل products.js)
  const productsData = [
    {
      id: 1,
      name: "ميدالية كلب",
      price: 15,
      description: "ميدالية أنيقة لكلب مع تصميم مميز.",
      image: "https://i.postimg.cc/qRTVGPcQ/2025-08-01-225224.png",
      colors: ["أبيض", "أزرق", "أحمر"]
    },
    {
      id: 2,
      name: "ميدالية ثعلب",
      price: 15,
      description: "ميدالية ذات تصميم جميل على شكل ثعلب.",
      image: "https://i.postimg.cc/MTWVVGLD/2025-08-01-223945.png",
      colors: ["أبيض", "أحمر", "أزرق"]
    },
    {
      id: 3,
      name: "ستاند هاتف قطة",
      price: 15,
      description: "ستاند هاتف عملي وجميل بشكل قطة لطيفة.",
      image: "https://i.postimg.cc/sgXL9Vk3/cf250c78-d243-4c2e-8296-60b9d181fd13.png",
      colors: ["أزرق", "أحمر", "أبيض" ,"أسود" ,"ملون"]
    },
    {
      id: 4,
      name: "ميدلية حرف",
      price: 20,
      description: "ميدالية بتصميم حرف مميز مع خيارات ألوان متعددة.",
      image: "https://i.postimg.cc/bYVVYXGM/2025-08-01-225452.png",
      colors: ["أزرق و أحمر", "أزرق و أسود", "أزرق و أبيض" ,"أحمر و أسود" ,"أحمر و أبيض" ,"أسود و أبيض"]
    },
    {
      id: 5,
      name: "ميدالية قطة",
      price: 15,
      description: "ميدالية على شكل قطة، جميلة وناعمة.",
      image: "https://i.postimg.cc/jq6NvyTh/2025-08-01-231111.png",
      colors: ["أزرق", "أحمر", "أبيض"]
    }
    {
      id: 7,
      name: "ميدلية اسم",
      price: 29,
      description: "ميدالية بتصميم اسمك المميز مع خيارات ألوان متعددة.",
      image: "https://i.postimg.cc/wjqQC78Z/2025-08-07-224236.png",
      colors: ["أزرق و أحمر", "أزرق و أسود", "أزرق و أبيض" ,"أحمر و أسود" ,"أحمر و أبيض" ,"أسود و أبيض"]
    }
  ];

  // جلب id المنتج من الرابط
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  // البحث عن المنتج المناسب
  const product = productsData.find(p => p.id === productId);

  if (!product) {
    productContainer.innerHTML = "<p>عذراً، المنتج غير موجود.</p>";
    addToCartBtn.disabled = true;
    return;
  }

  // عرض بيانات المنتج
  productContainer.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <h2>${product.name}</h2>
    <p>السعر: ${product.price} درهم</p>
    <p>${product.description}</p>
    <label for="color-select">اختر اللون:</label>
    <select id="color-select">
      ${product.colors.map(color => `<option value="${color}">${color}</option>`).join("")}
    </select>

    <label for="comment-input">تعليقك:</label>
    <textarea id="comment-input" placeholder="اكتب تعليقك هنا..." rows="4"></textarea>
  `;

  // استمع لزر الإضافة للسلة
  addToCartBtn.addEventListener("click", () => {
    const selectedColor = document.getElementById("color-select").value;
    const comment = document.getElementById("comment-input").value.trim();

    // تحميل السلة من localStorage أو إنشاء جديدة
    let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

    // إضافة المنتج مع اللون والتعليق للسلة
    cartData.push({
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      comment: comment
    });

    localStorage.setItem("cartData", JSON.stringify(cartData));

    alert(`✔️ تم إضافة "${product.name}" باللون "${selectedColor}" إلى السلة!`);
  });
});


