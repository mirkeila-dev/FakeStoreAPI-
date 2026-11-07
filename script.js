
// ==========================================
// NOVASHOP - CONEXIÓN CON FAKESTOREAPI
// ==========================================

const API_URL = "https://fakestoreapi.com/products";

// ELEMENTOS DEL HTML
const productsContainer = document.getElementById("productsContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const resultsCount = document.getElementById("resultsCount");

const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

// VARIABLES PRINCIPALES
let products = [];
let cart = JSON.parse(localStorage.getItem("novaShopCart")) || [];

// ==========================================
// CARGAR PRODUCTOS DESDE LA API
// ==========================================

async function loadProducts() {
    loading.classList.remove("d-none");
    errorMessage.classList.add("d-none");
    productsContainer.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("No se pudieron obtener los productos.");
        }

        products = await response.json();

        loading.classList.add("d-none");

        loadCategories();
        renderProducts(products);
        applyFilters();

    } catch (error) {
        console.error("Error al cargar productos:", error);

        loading.classList.add("d-none");
        errorMessage.classList.remove("d-none");
    }
}

// ==========================================
// CARGAR CATEGORÍAS
// ==========================================

function loadCategories() {
    const categories = [...new Set(products.map(product => product.category))];

    categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';

    categories.forEach(category => {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}

// ==========================================
// FORMATEAR PRECIOS
// ==========================================

function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(price);
}

// ==========================================
// PROTEGER TEXTO HTML
// ==========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function renderProducts(list) {
    productsContainer.innerHTML = "";

    if (list.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-box-open fa-2x"></i>
                <h4 class="mt-3">No encontramos productos</h4>
                <p>Prueba con otra búsqueda o categoría.</p>
            </div>
        `;

        resultsCount.textContent = "No hay productos disponibles.";
        return;
    }

    list.forEach(product => {
        const rating = product.rating?.rate || 0;
        const stars = Math.round(rating);

        const starsHTML = Array.from({ length: 5 }, (_, index) => {
            return `<i class="${index < stars ? "fa-solid" : "fa-regular"} fa-star"></i>`;
        }).join("");

        const column = document.createElement("div");
        column.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

        column.innerHTML = `
            <div class="product-card">

                <div class="product-image">
                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.title)}"
                        loading="lazy">
                </div>

                <div class="product-info">

                    <div class="product-rating">
                        ${starsHTML}
                        <span>${rating.toFixed(1)} (${product.rating?.count || 0})</span>
                    </div>

                    <h3>${escapeHTML(product.title)}</h3>

                    <div class="product-price">
                        ${formatPrice(product.price)}
                    </div>

                    <div class="product-actions">

                        <button
                            class="details-btn"
                            data-action="details"
                            data-id="${product.id}">
                            Ver detalles
                        </button>

                        <button
                            class="add-cart-btn"
                            data-action="add"
                            data-id="${product.id}">
                            <i class="fa-solid fa-cart-plus"></i>
                            Agregar
                        </button>

                    </div>
                </div>
            </div>
        `;

        productsContainer.appendChild(column);
    });

    resultsCount.textContent =
        `Mostrando ${list.length} de ${products.length} productos.`;
}

// ==========================================
// BUSCADOR, FILTROS Y ORDENAMIENTO
// ==========================================

function applyFilters() {
    const search = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sort = sortFilter.value;

    let filtered = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
        filtered.sort((a, b) =>
            (b.rating?.rate || 0) - (a.rating?.rate || 0)
        );
    }

    renderProducts(filtered);
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);

// ==========================================
// VER DETALLES DEL PRODUCTO
// ==========================================

function showProductDetails(id) {
    const product = products.find(item => item.id === Number(id));

    if (!product) return;

    const modalContent = document.getElementById("productModalContent");

    modalContent.innerHTML = `
        <div class="modal-product">

            <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.title)}">

            <div>

                <div class="d-flex justify-content-between align-items-center">
                    <span class="product-category position-static">
                        ${escapeHTML(product.category)}
                    </span>

                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Cerrar">
                    </button>
                </div>

                <h3>${escapeHTML(product.title)}</h3>

                <div class="product-rating">
                    <i class="fa-solid fa-star"></i>
                    ${product.rating?.rate || 0}
                    <span>(${product.rating?.count || 0} valoraciones)</span>
                </div>

                <p>${escapeHTML(product.description)}</p>

                <div class="price">${formatPrice(product.price)}</div>

                <button
                    class="add-cart-btn w-100 mt-3 p-3"
                    data-action="add"
                    data-id="${product.id}">
                    <i class="fa-solid fa-cart-plus"></i>
                    Agregar al carrito
                </button>

            </div>
        </div>
    `;

    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("productModal")
    );

    modal.show();
}

// ==========================================
// AGREGAR PRODUCTOS AL CARRITO
// ==========================================

function addToCart(id) {
    const product = products.find(item => item.id === Number(id));

    if (!product) return;

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
}

// ==========================================
// GUARDAR CARRITO
// ==========================================

function saveCart() {
    localStorage.setItem("novaShopCart", JSON.stringify(cart));
}

// ==========================================
// MOSTRAR CARRITO
// ==========================================

function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Tu carrito está vacío.</p>
        `;
    }

    cart.forEach(item => {
        const element = document.createElement("div");

        element.className = "cart-item";

        element.innerHTML = `
            <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.title)}">

            <div class="cart-item-info">
                <h5>${escapeHTML(item.title)}</h5>
                <p>${formatPrice(item.price)} × ${item.quantity}</p>
            </div>

            <button
                class="remove-item"
                data-action="remove"
                data-id="${item.id}"
                title="Eliminar producto">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        cartItems.appendChild(element);
    });

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    saveCart();
}

// ==========================================
// ELIMINAR PRODUCTOS DEL CARRITO
// ==========================================

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== Number(id));

    saveCart();
    renderCart();
}

// ==========================================
// EVENTOS DE LOS PRODUCTOS Y CARRITO
// ==========================================

document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "details") {
        showProductDetails(id);
    }

    if (action === "add") {
        addToCart(id);
    }

    if (action === "remove") {
        removeFromCart(id);
    }
});

// ==========================================
// ABRIR Y CERRAR CARRITO
// ==========================================

function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ==========================================
// FINALIZAR COMPRA (DEMOSTRACIÓN)
// ==========================================

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega algún producto primero.");
        return;
    }

    alert(
        "¡Gracias por visitar NovaShop!\n\n" +
        "Esta es una demostración académica. " +
        "No se procesan pagos reales."
    );
});

// ==========================================
// MODO OSCURO Y CLARO
// ==========================================

function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");

    themeToggle.innerHTML = theme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    localStorage.setItem("novaShopTheme", theme);
}

const savedTheme = localStorage.getItem("novaShopTheme") || "light";

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark-mode")
        ? "light"
        : "dark";

    applyTheme(newTheme);
});

// ==========================================
// BOTÓN VOLVER ARRIBA
// ==========================================

window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ==========================================
// REINTENTAR CARGA
// ==========================================

document.getElementById("retryButton").addEventListener("click", loadProducts);

// ==========================================
// INICIAR NOVASHOP
// ==========================================

renderCart();
loadProducts();
