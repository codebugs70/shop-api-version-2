// TODO: Select DOM element
const productList = document.querySelector(".product-list");
const cartIcon = document.querySelector(".cart-icon");
const modal = document.querySelector(".modal");
const cartList = document.querySelector(".cart-list");
const productCount = document.querySelector(".product-count");
const cartTotal = document.querySelector(".cart-total");
const checkoutBtn = document.querySelector(".checkout");
const filterDropdown = document.querySelector("#filter");
const searchBar = document.querySelector("#search-bar");

// ! i'm done. See yah later .... btw: shut the fuck up discord !!

// TODO: Config API
const configApi = "https://fakestoreapi.com/products";
let productData;
let cartStore = [];

// TODO: Fetch API
async function fetchProducts(category = "all") {
  try {
    let response;
    if (category === "all") {
      response = await fetch(configApi);
    } else if (category === "asc" || category === "desc") {
      response = await fetch(`${configApi}?sort=${category}`);
    } else {
      response = await fetch(`${configApi}/category/${category}`);
    }
    const data = await response.json();
    productData = data;
    renderProducts(productData);
  } catch (error) {
    console.log(error);
  }
}
fetchProducts();

// TODO: Fetch API get categories
async function fetchCategories() {
  try {
    const response = await fetch(`${configApi}/categories`);
    const data = await response.json();
    const newCategories = ["all", "asc", "desc", ...data];
    renderCategories(newCategories);
  } catch (error) {
    console.log(error);
  }
}
fetchCategories();

// TODO: Search products
searchBar.addEventListener("input", handleSearchProduct);
function handleSearchProduct(e) {
  const searchQuery = e.target.value;
  const filteredProducts = productData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  renderProducts(filteredProducts);
}

// TODO: Filter products category
filterDropdown.addEventListener("change", handleFilterCategory);
function handleFilterCategory() {
  const dropdownVal = filterDropdown.value;
  fetchProducts(dropdownVal);
}

// TODO: Render products from API
function renderProducts(products) {
  productList.innerHTML = "";
  if (!products) return;
  products.forEach((item, index) => {
    const template = `<li class="product-item">
    <div class="product-item-image">
      <img src="${item.image}" alt="" />
    </div>
    <div class="product-item-info">
      <span class="product-category">${item.category}</span>
      <h1>${item.title}</h1>
      <p>${item.description}</p>
      <span class="product-price">${item.price}$</span>
    </div>
    <div class="product-item-meta">
      <div class="group">
        <span>${item?.rating?.count}</span>
        <span><i class="fa-solid fa-user"></i></span>
      </div>
      <div class="group">
        <span>${item?.rating?.rate}</span>
        <span><i class="fa-solid fa-star"></i></span>
      </div>
    </div>
    <button onClick="handleAdd(${index})" class="add-product">add to cart</button>
  </li>`;
    productList.insertAdjacentHTML("beforeend", template);
  });
}

// TODO: Add products
function handleAdd(productIndex) {
  const productItem = productData[productIndex];
  const isExisteProduct = cartStore.find((item) => item.id === productItem.id);
  if (isExisteProduct) {
    isExisteProduct.quantity += 1;
  } else {
    productItem.quantity = 1;
    cartStore.push(productItem);
  }
  productCount.textContent = cartStore.length;
  renderCartItem();
}

// TODO: Increase quantity
function handleIncrease(productIndex) {
  cartStore = cartStore.map((item, index) =>
    index === productIndex ? { ...item, quantity: item.quantity + 1 } : item
  );
  renderCartItem();
}

// TODO: Decrease quantity
function handleDecrease(productIndex) {
  const productItem = cartStore[productIndex];
  if (productItem.quantity === 1) {
    cartStore = cartStore.filter((item) => item.id !== productItem.id);
  } else {
    cartStore = cartStore.map((item, index) =>
      index === productIndex ? { ...item, quantity: item.quantity - 1 } : item
    );
  }
  renderCartItem();
}

// TODO: alculate Money
function calculateMoney() {
  const total = cartStore.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  return total.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// TODO: Check out and clear cart
checkoutBtn.addEventListener("click", function () {
  cartStore = [];
  modal.style.display = "none";
  productCount.textContent = "0";
});

// TODO: Render product in cart
function renderCartItem() {
  cartList.innerHTML = "";
  cartStore.forEach((item, index) => {
    const template = `<li class="cart-item">
        <div class="cart-item-info">
          <div class="cart-image">
            <img src="${item.image}" alt="" />
          </div>
          <div class="col">
            <h1>${item.title}</h1>
            <span>${item.price}$</span>
          </div>
        </div>
        <div class="cart-item-action">
          <span onClick="handleDecrease(${index})">-</span>
          <small>${item.quantity}</small>
          <span onClick="handleIncrease(${index})">+</span>
        </div>
      </li>`;
    cartList.insertAdjacentHTML("beforeend", template);

    const total = calculateMoney();
    console.log(total);
    if (cartStore.length) {
      cartTotal.textContent = `Total: ${total}`;
    } else {
      cartTotal.textContent = `0$`;
    }
  });
}

// TODO: Render categories
function renderCategories(categories) {
  if (!categories) return;
  filterDropdown.innerHTML = "";
  categories.forEach((category) => {
    const template = `<option value="${category}">${category}</option>`;
    filterDropdown.insertAdjacentHTML("beforeend", template);
  });
}

// TODO: Open modal
cartIcon.addEventListener("click", function () {
  modal.style.display = "flex";
});

// TODO: Close modal
document.addEventListener("click", function (e) {
  if (e.target.matches(".modal-close") || e.target.matches(".modal-overlay")) {
    modal.style.display = "none";
  }
});
