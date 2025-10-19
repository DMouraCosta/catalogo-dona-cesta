/**
 * Arquivo: main.js
 * Descrição: Lógica principal para filtros, busca, renderização, carrinho e WhatsApp,
 * incluindo o Modal de Detalhes de Produtos (Stories/Card) e o LightBox de Imagem.
 *
 * AJUSTES REALIZADOS:
 * A. Ampliação de Imagem (Lightbox): Corrigido para exibição em tela cheia.
 * B. Detalhes do Item: Descrição convertida para lista (<ul>) no Modal de Detalhes.
 */

// --- CONFIGURAÇÃO ---
// ATENÇÃO: SUBSTITUA ESTE NÚMERO PELO NÚMERO REAL DA LOJA!
const WHATSAPP_NUMBER = "5589988227748";
const URL_BASE = "catalogo-donacestas.vercel.app";
const CART_STORAGE_KEY = "donaCestaCart"; // Chave para o Local Storage

// --- ESTADO DO CATÁLOGO ---
const productData = products; // Array de produtos do products.js
let filteredProducts = productData;
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
const applyFiltersButton = document.getElementById("apply-filters-btn");

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
const detailModalBody = document.getElementById("detail-modal-body");

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
            onclick="openProductDetailModal(${product.id})" 
            title="Clique para ver detalhes e descrição completa"
        >
        <div class="product-info">
            <div>
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 70)}...</p> </div>
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

  // Animação de entrada (mantido)
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

/** Renderiza a lista de produtos na grade principal (mantido) */
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

  const highlights = productData.filter((p) => p.isFeatured).slice(0, 8);

  highlights.forEach((product) => {
    const item = document.createElement("div");
    item.className = "highlight-item";
    item.setAttribute("data-id", product.id);
    item.addEventListener("click", () => openProductDetailModal(product.id));

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

// --- FUNÇÕES DE FILTRAGEM ---

/** Gera os badges (chips) dos filtros ativos (mantido) */
const renderActiveFilters = (search, category, price) => {
  if (!activeFiltersBadges) return;
  activeFiltersBadges.innerHTML = "";

  if (search) {
    activeFiltersBadges.innerHTML += `<span class="filter-badge">Busca: ${search}</span>`;
  }
  if (category && category !== "todos") {
    activeFiltersBadges.innerHTML += `<span class="filter-badge">Categoria: ${category}</span>`;
  }
  if (price < parseInt(priceRange.max)) {
    activeFiltersBadges.innerHTML += `<span class="filter-badge">Max: ${formatPrice(
      price
    )}</span>`;
  }

  clearFiltersButton.style.display =
    search ||
    (category && category !== "todos") ||
    price < parseInt(priceRange.max)
      ? "block"
      : "none";
};

/** Lógica principal de filtragem e renderização (Chamada pelo botão 'Aplicar Filtros') */
const applyFiltersAndRender = () => {
  const searchTerm = normalizeText(searchBar.value);
  const selectedCategory = categoryFilter.value;
  const maxPrice = parseFloat(priceRange.value);

  const filtered = productData.filter((product) => {
    // 1. Filtro por Busca
    const matchesSearch =
      !searchTerm ||
      normalizeText(product.name).includes(searchTerm) ||
      normalizeText(product.description).includes(searchTerm) ||
      normalizeText(product.tags).includes(searchTerm);

    // 2. Filtro por Categoria
    const matchesCategory =
      selectedCategory === "todos" || product.category === selectedCategory;

    // 3. Filtro por Preço
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  filteredProducts = filtered;
  renderProducts(filteredProducts);
  renderActiveFilters(searchBar.value, selectedCategory, maxPrice);
};

/** Limpa os campos de filtro e aplica a renderização (mantido) */
const clearFilters = () => {
  searchBar.value = "";
  categoryFilter.value = "todos";
  priceRange.value = priceRange.max;
  maxPriceValue.textContent = formatPrice(parseInt(priceRange.max));
  applyFiltersAndRender();
  // Fecha a sidebar em mobile
  sidebar.classList.remove("open");
};

/** Manipula a mudança de preço no range (apenas visual, filtro é no botão) (mantido) */
const handlePriceRangeChange = () => {
  maxPriceValue.textContent = formatPrice(parseFloat(priceRange.value));
};

// --- MODAIS E INTERAÇÃO STORIES ---

/** * Função Auxiliar: Converte a string de descrição em uma lista HTML (<ul>)
 * Se a string for simples (menos de 3 itens/vírgulas), retorna como <p>
 * AJUSTE B: Implementação da formatação da descrição em lista.
 */
const formatDescriptionAsList = (description) => {
  // Tenta dividir por vírgula seguida de espaço, ponto e vírgula seguido de espaço, ou " e ".
  const items = description
    .split(/, |; | e /)
    .filter((item) => item.trim() !== "");

  // Se a descrição for muito curta ou não tiver divisões claras (menos de 3 itens), retorna como um parágrafo
  if (items.length <= 2) {
    return `<p>${description}</p>`;
  }

  // Cria a lista <ul>
  let listHtml = '<ul class="detail-list">';
  items.forEach((item) => {
    listHtml += `<li>${item.trim()}</li>`;
  });
  listHtml += "</ul>";

  return listHtml;
};

/** Abre o modal de visualização detalhada do produto (Aceita ID) */
const openProductDetailModal = (productId) => {
  const product = getProductById(productId);
  if (!product || !productDetailModal || !detailModalBody) return;

  const imageSrc = `images/${product.image}`;
  const placeholderSrc = `https://via.placeholder.com/450x300?text=${product.name}`;

  // AJUSTE B: Formata a descrição em lista
  const formattedDescription = formatDescriptionAsList(product.description);

  detailModalBody.innerHTML = `
        <img 
            src="${imageSrc}" 
            alt="${product.name}" 
            onerror="this.onerror=null;this.src='${placeholderSrc}'"
            onclick="openImageLightbox('${imageSrc}', '${product.name}')"
            title="Clique para ampliar a imagem"
        >
        <div class="detail-text-area">
            <h2 id="detail-modal-title">${product.name}</h2>
            
            ${formattedDescription} <p class="detail-price">${formatPrice(
    product.price
  )}</p>
            
            <div class="detail-actions">
                <button class="btn btn-whatsapp" data-id="${
                  product.id
                }" onclick="directWhatsAppOrder(${product.id})">
                    <i class="fab fa-whatsapp"></i> Pedir pelo WhatsApp
                </button>
                <button class="btn btn-primary" data-id="${
                  product.id
                }" onclick="addToCart(${
    product.id
  }); closeModal(productDetailModal);">
                    <i class="fas fa-cart-plus"></i> Adicionar
                </button>
            </div>
        </div>
    `;

  productDetailModal.classList.add("open");
  productDetailModal.setAttribute("aria-hidden", "false");

  // Fecha a sidebar em mobile, se estiver aberta
  if (sidebar && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
  }
};

/** * Abre o modal LightBox com a imagem ampliada em tela cheia.
 * AJUSTE A: Garantido pela estrutura do modal e CSS, esta função apenas popula e abre.
 */
window.openImageLightbox = (imageSrc, title) => {
  if (!imageLightboxModal || !lightboxImage || !lightboxTitle) return;

  lightboxImage.src = imageSrc;
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;

  imageLightboxModal.classList.add("open");
  imageLightboxModal.setAttribute("aria-hidden", "false");

  // NÃƒO FECHA o modal de detalhes, apenas o coloca por baixo (o lightbox tem z-index maior).
  // Apenas garante que não ocorra sobreposição de scroll.
  document.body.style.overflow = "hidden";
};

/** Fecha um modal específico (mantido) */
const closeModal = (modalElement) => {
  if (modalElement) {
    modalElement.classList.remove("open");
    modalElement.setAttribute("aria-hidden", "true");

    // Libera o scroll do body apenas se todos os modais de tela cheia estiverem fechados
    if (
      !cartModal.classList.contains("open") &&
      !productDetailModal.classList.contains("open") &&
      !imageLightboxModal.classList.contains("open")
    ) {
      document.body.style.overflow = "";
    }
  }
};

// --- LÓGICA DO WHATSAPP (mantido) ---

/** Envio direto do modal de Detalhes (usado nos Destaques) (mantido) */
window.directWhatsAppOrder = (productId) => {
  const product = getProductById(productId);
  if (!product) return;

  const message = encodeURIComponent(
    `Olá! Gostaria de pedir o seguinte produto:\n\n` +
      `*Produto:* ${product.name}\n` +
      `*Categoria:* ${product.category}\n` +
      `*Preço:* ${formatPrice(product.price)}\n\n` +
      `*Descrição:* ${product.description}\n\n` +
      `*Link do Catálogo:* ${URL_BASE}\n\n` +
      `Por favor, poderia informar a disponibilidade e o prazo de entrega.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(waLink, "_blank");
};

/** Lógica para gerar a mensagem de checkout do carrinho (mantido) */
const generateCartMessage = () => {
  let message = `Olá! Gostaria de fazer o seguinte pedido do catálogo:\n\n*ITENS DO PEDIDO:*\n`;
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    message += `${index + 1}. ${item.quantity}x ${item.name} (${formatPrice(
      item.price
    )} cada)\n`;
  });

  message += `\n*TOTAL:* ${formatPrice(subtotal)}\n\n`;
  message += `Agradeço o seu pedido! Por favor, informe a forma de pagamento e entrega.`;

  return message;
};

// --- LÓGICA DO CARRINHO (mantido) ---

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
                }" data-action="decrease" title="Diminuir"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button data-id="${
                  item.id
                }" data-action="increase" title="Aumentar"><i class="fas fa-plus"></i></button>
                <button data-id="${
                  item.id
                }" data-action="remove" title="Remover"><i class="fas fa-trash-alt"></i></button>
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

  const id = parseInt(target.getAttribute("data-id"));
  const action = target.getAttribute("data-action");
  const existingItem = cart.find((item) => item.id === id);

  if (!existingItem) return;

  switch (action) {
    case "increase":
      existingItem.quantity += 1;
      break;
    case "decrease":
      existingItem.quantity -= 1;
      if (existingItem.quantity <= 0) {
        cart = cart.filter((item) => item.id !== id);
      }
      break;
    case "remove":
      cart = cart.filter((item) => item.id !== id);
      break;
  }

  updateCartUI();
};

// --- INICIALIZAÇÃO E EVENTOS ---

/** Inicializa os event listeners */
const setupEventListeners = () => {
  // Toggle Sidebar (Menu Mobile)
  if (menuToggle)
    menuToggle.addEventListener("click", () => sidebar.classList.add("open"));
  if (closeSidebarBtn)
    closeSidebarBtn.addEventListener("click", () =>
      sidebar.classList.remove("open")
    );

  // Toggle Carrinho
  if (cartToggleBtn)
    cartToggleBtn.addEventListener("click", () => {
      cartModal.classList.add("open");
      document.body.style.overflow = "hidden"; // Bloqueia scroll do body
    });
  if (closeCartModal)
    closeCartModal.addEventListener("click", () => closeModal(cartModal));

  // Fechar Modal de Detalhes
  if (closeProductDetailModal)
    closeProductDetailModal.addEventListener("click", () =>
      closeModal(productDetailModal)
    );

  // Fechar Lightbox
  if (closeImageLightboxModal)
    closeImageLightboxModal.addEventListener("click", () =>
      closeModal(imageLightboxModal)
    );

  // Lógica do Range de Preço (Mudança visual imediata, filtro manual)
  if (priceRange) priceRange.addEventListener("input", handlePriceRangeChange);

  // Event Listener para o botão Aplicar Filtros (mantido)
  if (applyFiltersButton)
    applyFiltersButton.addEventListener("click", () => {
      applyFiltersAndRender();
      // Fecha a sidebar em mobile após aplicar
      sidebar.classList.remove("open");
    });

  // Limpar Filtros (mantido)
  if (clearFiltersButton)
    clearFiltersButton.addEventListener("click", clearFilters);

  // Checkout para WhatsApp (mantido)
  if (checkoutWhatsappBtn) {
    checkoutWhatsappBtn.addEventListener("click", () => {
      const message = generateCartMessage();
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;
      window.open(waLink, "_blank");
      closeModal(cartModal);
    });
  }

  // Limpar Carrinho (mantido)
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      updateCartUI();
    });
  }

  // Fechar modais ao clicar fora (mantido)
  [cartModal, productDetailModal, imageLightboxModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // 5. Adicionar ao Carrinho (Catálogo) (mantido)
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

  // 6. Manipulação de Itens no Carrinho (Modal) (mantido)
  if (cartItemsContainer)
    cartItemsContainer.addEventListener("click", handleCartAction);

  // Evento para o link do footer 'Meu Carrinho' (mantido)
  const openCartLink = document.getElementById("open-cart-link");
  if (openCartLink) {
    openCartLink.addEventListener("click", (e) => {
      e.preventDefault();
      cartModal.classList.add("open");
      document.body.style.overflow = "hidden"; // Bloqueia scroll do body
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Carrega o carrinho do Local Storage
  cart = loadCartFromLocalStorage();

  // 2. Inicializa o layout e eventos
  setupEventListeners();

  // 3. Inicializa os Destaques
  renderHighlights();

  // 4. Renderização inicial do catálogo, aplicando filtros vazios
  applyFiltersAndRender();

  // 5. Atualiza o estado visual do carrinho
  updateCartUI();
});
