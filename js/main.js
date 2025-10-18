/**
 * Arquivo: main.js
 * Descrição: Lógica principal para filtros, busca, renderização, carrinho e WhatsApp,
 * incluindo o novo Modal de Detalhes de Produtos (Stories) e o LightBox de Imagem.
 *
 * NOVIDADE: Persistência do Carrinho via Local Storage.
 */

// --- CONFIGURAÇÃO ---
// ATENÇÃO: SUBSTITUA ESTE NÚMERO PELO NÚMERO REAL DA LOJA!
const WHATSAPP_NUMBER = "5589988227748";
const URL_BASE = "catalogo-donacestas.vercel.app";
const CART_STORAGE_KEY = "donaCestaCart"; // Chave para o Local Storage

// --- ESTADO DO CATÁLOGO ---
const productData = products; // Array de produtos do products.js
let filteredProducts = productData;
// O carrinho será inicializado por loadCartFromLocalStorage()
let cart = []; // Armazena objetos { id, quantity, price, name, image }

// --- ELEMENTOS DOM ---
const catalogGrid = document.getElementById("catalog-grid");
const highlightsList = document.getElementById("highlights-list");
const searchBar = document.getElementById("search-bar");
const categoryFilter = document.getElementById("category-filter");
const priceRange = document.getElementById("price-range");
const maxPriceValue = document.getElementById("max-price-value");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const clearFiltersButton = document.getElementById("clear-filters");
const activeFiltersBadges = document.getElementById("active-filters-badges");

// --- MODAIS ---
const cartModal = document.getElementById("cart-modal");
const productDetailModal = document.getElementById("product-detail-modal");
const imageLightboxModal = document.getElementById("image-lightbox-modal");

// --- ELEMENTOS DO CARRINHO ---
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const closeCartModal = document.getElementById("close-cart-modal");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartSubtotalPrice = document.getElementById("cart-subtotal-price");
const cartTotalItems = document.getElementById("cart-total-items");
const checkoutWhatsappBtn = document.getElementById("checkout-whatsapp-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const closeProductDetailModal = document.getElementById(
  "close-product-detail-modal"
);

// --- ELEMENTOS DO LIGHTBOX ---
const closeImageLightboxModal = document.getElementById(
  "close-image-lightbox-modal"
);
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-modal-title");

// --- FUNÇÕES DE UTILIDADE ---

const formatPrice = (price) => {
  if (typeof price !== "number") return "R$ 0,00";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getProductById = (id) => {
  // Garante que o ID é tratado como número para a busca
  return productData.find((p) => p.id === parseInt(id));
};

// --- FUNÇÕES DE PERSISTÊNCIA (LOCAL STORAGE) ---

/** Salva o estado atual do carrinho no Local Storage. */
const saveCartToLocalStorage = () => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem(CART_STORAGE_KEY, serializedCart);
  } catch (error) {
    console.error("Erro ao salvar carrinho no Local Storage:", error);
  }
};

/** Carrega o carrinho do Local Storage, se existir. */
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (serializedCart === null) {
      return [];
    }
    // Garante que a estrutura é válida (array)
    return JSON.parse(serializedCart);
  } catch (error) {
    console.error("Erro ao carregar carrinho do Local Storage:", error);
    return [];
  }
};

// --- FUNÇÕES DE RENDERIZAÇÃO ---

/** Cria o card HTML de um produto (Catálogo) */
const createProductCard = (product) => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("data-id", product.id);

  const imageSrc = `images/${product.image}`;
  const placeholderSrc = `https://via.placeholder.com/280x220?text=${product.name.substring(
    0,
    15
  )}`;

  card.innerHTML = `
        <img 
            src="${imageSrc}" 
            alt="${product.name}" 
            onerror="this.onerror=null;this.src='${placeholderSrc}'" 
            onclick="openImageLightbox('${imageSrc}', '${product.name}')"
        >
        <div class="product-info">
            <div>
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 70)}...</p>
            </div>
            <div class="card-footer">
                <p class="price">${formatPrice(product.price)}</p>
                <button class="btn btn-primary add-to-cart-btn" data-id="${
                  product.id
                }">
                    <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;

  // Animação de entrada (apenas em desktop para performance)
  if (window.innerWidth > 992) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("show");
            }, 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(card);
  } else {
    card.classList.add("show");
  }

  return card;
};

/** Renderiza a lista de produtos na grade principal */
const renderProducts = (productsToRender) => {
  if (!catalogGrid) return;
  catalogGrid.innerHTML = "";

  if (productsToRender.length === 0) {
    catalogGrid.innerHTML =
      '<p class="no-products">Nenhum produto encontrado com os filtros aplicados.</p>';
    return;
  }

  productsToRender.forEach((product) => {
    catalogGrid.appendChild(createProductCard(product));
  });
};

/** Renderiza a seção de Destaques (Stories) */
const renderHighlights = () => {
  if (!highlightsList) return;
  highlightsList.innerHTML = "";

  // Limita a 8 produtos para não sobrecarregar o visual
  const highlights = productData.filter((p) => p.isFeatured).slice(0, 8);

  highlights.forEach((product) => {
    const item = document.createElement("div");
    item.className = "highlight-item";
    item.setAttribute("data-id", product.id);
    item.addEventListener("click", () => openProductDetailModal(product));

    item.innerHTML = `
            <div class="highlight-circle">
                <div class="highlight-circle-inner">
                    <img src="images/${product.image}" alt="${
      product.name
    }" onerror="this.onerror=null;this.src='https://via.placeholder.com/80x80?text=Flower'">
                </div>
            </div>
            <span>${product.name.split(" ").slice(0, 2).join(" ")}</span>
        `;
    highlightsList.appendChild(item);
  });
};

// --- MODAIS E INTERAÇÃO STORIES ---

/** Abre o modal de visualização detalhada do produto */
const openProductDetailModal = (product) => {
  if (!productDetailModal || !detailModalBody) return;

  detailModalBody.innerHTML = `
        <img src="images/${product.image}" alt="${
    product.name
  }" onerror="this.onerror=null;this.src='https://via.placeholder.com/450x300?text=${
    product.name
  }'">
        <div class="detail-text-area">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p class="detail-price">${formatPrice(product.price)}</p>
            <button class="btn btn-whatsapp detail-whatsapp-btn" data-id="${
              product.id
            }" onclick="directWhatsAppOrder(${product.id})">
                <i class="fab fa-whatsapp"></i> Pedir pelo WhatsApp
            </button>
        </div>
    `;

  productDetailModal.classList.add("open");
  productDetailModal.setAttribute("aria-hidden", "false");
};

/** Abre o modal LightBox com a imagem ampliada */
window.openImageLightbox = (imageSrc, title) => {
  if (!imageLightboxModal || !lightboxImage || !lightboxTitle) return;

  lightboxImage.src = imageSrc;
  lightboxTitle.textContent = title;

  imageLightboxModal.classList.add("open");
  imageLightboxModal.setAttribute("aria-hidden", "false");
};

/** Fecha um modal específico */
const closeModal = (modalElement) => {
  if (modalElement) {
    modalElement.classList.remove("open");
    modalElement.setAttribute("aria-hidden", "true");
  }
};

// --- LÓGICA DO WHATSAPP ---

/** Envio direto do modal de Detalhes (usado nos Destaques) */
window.directWhatsAppOrder = (productId) => {
  const product = getProductById(productId);
  if (!product) return;

  const message = encodeURIComponent(
    `Olá! Gostaria de pedir o seguinte produto (Visto nos Destaques):\n\n` +
      `*Produto:* ${product.name}\n` +
      `*Categoria:* ${product.category}\n` +
      `*Preço:* ${formatPrice(product.price)}\n\n` +
      `*Link do Catálogo:* ${URL_BASE}\n\n` +
      `Por favor, poderia informar a disponibilidade e o prazo de entrega.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(waLink, "_blank");
};

// --- LÓGICA DO CARRINHO ---

const updateCartUI = () => {
  if (!cartItemsContainer || !cartCount) return;

  // 1. Renderiza e calcula totais
  cartItemsContainer.innerHTML = "";
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 2. Atualiza contadores
  cartCount.textContent = totalItems;
  cartTotalItems.textContent = totalItems;
  cartSubtotalPrice.textContent = formatPrice(subtotal);

  // 3. Habilita/Desabilita botões
  const isEmpty = totalItems === 0;
  if (checkoutWhatsappBtn) checkoutWhatsappBtn.disabled = isEmpty;
  if (clearCartBtn) clearCartBtn.disabled = isEmpty;

  // 4. Salva no Local Storage
  saveCartToLocalStorage();

  // 5. Renderiza itens ou mensagem de carrinho vazio
  if (isEmpty) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
    return;
  }

  cart.forEach((item) => {
    const imageSrc = `images/${item.image}`;
    const placeholderSrc = `https://via.placeholder.com/50x50?text=Item`;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${imageSrc}" alt="${
      item.name
    }" class="cart-item-image" onerror="this.onerror=null;this.src='${placeholderSrc}'">
                <div>
                    <strong>${item.name}</strong>
                    <span>${formatPrice(item.price)} / un.</span>
                </div>
            </div>
            <div class="item-quantity-control">
                <button data-id="${
                  item.id
                }" data-action="decrease"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button data-id="${
                  item.id
                }" data-action="increase"><i class="fas fa-plus"></i></button>
                <button data-id="${
                  item.id
                }" data-action="remove"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    cartItemsContainer.appendChild(itemElement);
  });
};

const addToCart = (productId) => {
  const id = parseInt(productId);
  const product = getProductById(id);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // Inclusão da imagem no objeto do carrinho
    cart.push({
      id: id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  }

  updateCartUI();
};

const handleCartAction = (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  const productId = parseInt(target.getAttribute("data-id"));
  const action = target.getAttribute("data-action");
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex === -1) return;

  switch (action) {
    case "increase":
      cart[itemIndex].quantity += 1;
      break;
    case "decrease":
      cart[itemIndex].quantity -= 1;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
      break;
    case "remove":
      cart.splice(itemIndex, 1);
      break;
    default:
      return;
  }

  updateCartUI();
};

const prepareCartWhatsAppMessage = () => {
  if (cart.length === 0) return;

  let message = `Olá! Gostaria de fazer o seguinte pedido (Total de ${cartTotalItems.textContent} itens):\n\n`;
  let subtotal = 0;

  cart.forEach((item) => {
    const totalItem = item.price * item.quantity;
    subtotal += totalItem;
    message += `*Item:* ${item.name} (x${item.quantity})\n`;
    message += `  Preço Unitário: ${formatPrice(item.price)}\n\n`;
  });

  message += `*SUBTOTAL GERAL:* ${formatPrice(subtotal)}\n\n`;
  message += `*Link do Catálogo:* ${URL_BASE}\n\n`;
  message += `Por favor, poderia informar o valor do frete, disponibilidade e o prazo de entrega.`;

  const encodedMessage = encodeURIComponent(message);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(waLink, "_blank");
};

// --- LÓGICA DOS FILTROS ---

const updateFilterBadges = () => {
  if (!activeFiltersBadges) return;
  activeFiltersBadges.innerHTML = "";

  const searchTerm = searchBar.value.trim();
  const selectedCategory = categoryFilter.value;
  const maxPrice = parseFloat(priceRange.value);
  const maxGlobalPrice = parseFloat(priceRange.max);

  // 1. Badge de Busca
  if (searchTerm) {
    const badge = document.createElement("span");
    badge.className = "filter-badge";
    badge.textContent = `Busca: "${searchTerm}"`;
    badge.setAttribute("data-filter-type", "search");
    badge.innerHTML += ' <i class="fas fa-times-circle"></i>';
    activeFiltersBadges.appendChild(badge);
  }

  // 2. Badge de Categoria
  if (selectedCategory !== "todos") {
    const badge = document.createElement("span");
    badge.className = "filter-badge";
    badge.textContent = `Categoria: ${selectedCategory}`;
    badge.setAttribute("data-filter-type", "category");
    badge.innerHTML += ' <i class="fas fa-times-circle"></i>';
    activeFiltersBadges.appendChild(badge);
  }

  // 3. Badge de Preço
  if (maxPrice < maxGlobalPrice) {
    const badge = document.createElement("span");
    badge.className = "filter-badge";
    badge.textContent = `Preço Máx: ${formatPrice(maxPrice)}`;
    badge.setAttribute("data-filter-type", "price");
    badge.innerHTML += ' <i class="fas fa-times-circle"></i>';
    activeFiltersBadges.appendChild(badge);
  }

  // Adicionar listener para remover filtro ao clicar no badge
  activeFiltersBadges.querySelectorAll(".filter-badge").forEach((badge) => {
    badge.addEventListener("click", () => {
      const type = badge.getAttribute("data-filter-type");
      if (type === "search") searchBar.value = "";
      if (type === "category") categoryFilter.value = "todos";
      if (type === "price") {
        priceRange.value = maxGlobalPrice;
        maxPriceValue.textContent = formatPrice(maxGlobalPrice);
      }
      applyFilters();
    });
  });
};

const applyFilters = () => {
  const searchTerm = normalizeText(searchBar.value.trim());
  const selectedCategory = categoryFilter.value;
  const maxPrice = parseFloat(priceRange.value);

  filteredProducts = productData.filter((product) => {
    const nameMatch = normalizeText(product.name).includes(searchTerm);
    const tagsMatch = normalizeText(product.tags || "").includes(searchTerm);
    const categoryMatch =
      selectedCategory === "todos" || product.category === selectedCategory;
    const priceMatch = product.price <= maxPrice;

    return (nameMatch || tagsMatch) && categoryMatch && priceMatch;
  });

  updateFilterBadges();
  renderProducts(filteredProducts);
  // Em mobile, fecha a sidebar após aplicar filtros
  if (window.innerWidth <= 992) {
    closeModal(sidebar);
  }
};

const initFilters = () => {
  if (!priceRange || !searchBar || !categoryFilter) return;

  const initialMaxPrice = Math.ceil(
    Math.max(...productData.map((p) => p.price))
  );
  priceRange.max = initialMaxPrice;
  priceRange.value = initialMaxPrice;
  maxPriceValue.textContent = formatPrice(initialMaxPrice);

  searchBar.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  priceRange.addEventListener("input", () => {
    const currentPrice = parseFloat(priceRange.value);
    maxPriceValue.textContent = formatPrice(currentPrice);
    applyFilters();
  });

  clearFiltersButton.addEventListener("click", () => {
    searchBar.value = "";
    categoryFilter.value = "todos";
    priceRange.value = initialMaxPrice;
    maxPriceValue.textContent = formatPrice(initialMaxPrice);
    applyFilters();
  });
};

// --- INICIALIZAÇÃO E LISTENERS GERAIS ---

const setupEventListeners = () => {
  // 1. Sidebar/Filtros (Mobile Toggle)
  if (menuToggle && sidebar)
    menuToggle.addEventListener("click", () => sidebar.classList.add("open"));
  if (closeSidebarBtn)
    closeSidebarBtn.addEventListener("click", () => closeModal(sidebar));

  // 2. Carrinho Modal
  if (cartToggleBtn)
    cartToggleBtn.addEventListener("click", () => {
      cartModal.classList.add("open");
      cartModal.setAttribute("aria-hidden", "false");
      updateCartUI();
    });
  if (closeCartModal)
    closeCartModal.addEventListener("click", () => closeModal(cartModal));
  if (checkoutWhatsappBtn)
    checkoutWhatsappBtn.addEventListener("click", prepareCartWhatsAppMessage);
  if (clearCartBtn)
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      updateCartUI();
    });

  // 3. Detalhes do Produto Modal (Stories)
  if (closeProductDetailModal)
    closeProductDetailModal.addEventListener("click", () =>
      closeModal(productDetailModal)
    );

  // 4. LightBox Modal
  if (closeImageLightboxModal)
    closeImageLightboxModal.addEventListener("click", () =>
      closeModal(imageLightboxModal)
    );

  // Fechar modais ao clicar no fundo
  [cartModal, productDetailModal, imageLightboxModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // 5. Adicionar ao Carrinho (Catálogo)
  if (catalogGrid) {
    catalogGrid.addEventListener("click", (event) => {
      const target = event.target.closest(".add-to-cart-btn");
      if (target) {
        const productId = target.getAttribute("data-id");
        addToCart(productId);

        // Feedback visual
        target.textContent = "Adicionado!";
        target.disabled = true;
        setTimeout(() => {
          target.innerHTML =
            '<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho';
          target.disabled = false;
        }, 800);
      }
    });
  }

  // 6. Manipulação de Itens no Carrinho (Modal)
  if (cartItemsContainer)
    cartItemsContainer.addEventListener("click", handleCartAction);
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Carrega o carrinho do Local Storage
  cart = loadCartFromLocalStorage();

  // 2. Inicializa o layout e eventos
  setupEventListeners();

  // 3. Inicializa os filtros
  initFilters();

  // 4. Renderiza a seção de Destaques (Stories)
  renderHighlights();

  // 5. Renderiza o Catálogo principal
  renderProducts(productData);

  // 6. Atualiza a UI do carrinho com os dados carregados
  updateCartUI();
});
