(()=>{
    const unregisterLegacyServiceWorker = async () => {
        if (!('serviceWorker' in navigator)) return;

        const registrations = await navigator.serviceWorker.getRegistrations();
        const legacyRegistrations = registrations.filter(registration =>
            registration.active?.scriptURL.endsWith('/sw.js')
        );

        await Promise.all(
            legacyRegistrations.map(registration => registration.unregister())
        );
    };

    unregisterLegacyServiceWorker().catch(() => {});

// Database of all 17 models from references
let products = [];

const PRODUCT_EQUIPMENT = 'Подвесная система с креплением к потолку, цоколь E27, провод 1 м — длина регулируется. Рекомендуется использование филаментных ламп (как на фото) для создания максимально уютной атмосферы. Лампа приобретается отдельно.';

const PRODUCTS_API_URL = 'https://script.google.com/macros/s/AKfycbxfOdC6RjMtQWYf8VhDyIcsnqPjJQRWeXExkgbKHZopwf5yDQNK9QxGzFx-V0Gxayanug/exec';
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJEAHcwK6fR_Gy2NMLu8vHt9z_STkTb5FM6Q27ZqqSRBp_IZ2-277GOFR43Y_wLH44/exec';

const CART_STORAGE_KEY = 'lightStudioCart';
const PRODUCTS_CACHE_KEY = 'lightStudioProducts';
let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let lastCartTrigger = null;
let lastModalTrigger = null;
let successModalCloseTimer = null;

function getCachedProducts() {
    try {
        const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);

        if (!cached) {
            return null;
        }

        const data = JSON.parse(cached);

        return Array.isArray(data) ? data : null;
    } catch (error) {
        console.warn('Не удалось прочитать кэш каталога:', error);
        return null;
    }
}

function saveProductsToCache(data) {
    try {
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.warn('Не удалось сохранить кэш каталога:', error);
    }
}

async function loadProducts() {
    const cachedProducts = getCachedProducts();

    if (cachedProducts) {
        products = cachedProducts;
        updateCatalog();
    }

    try {
        const response = await fetch(`${PRODUCTS_API_URL}?action=products`);

        if (!response.ok) {
            throw new Error(`Не удалось загрузить каталог: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('API каталога вернул некорректный формат данных.');
        }

        products = data;
        saveProductsToCache(data);
        updateCatalog();
    } catch (error) {
        if (!cachedProducts) {
            throw error;
        }

        console.error('Не удалось обновить каталог, используется сохранённый кэш:', error);
    }
}

function findProduct(productId) {
    return products.find(product => product.id === productId);
}

function getProductGallery(product) {
    return product.gallery?.length ? product.gallery : [product.img];
}

function updateOverlayScrollLock() {
    const isOverlayOpen = Boolean(
        document.querySelector('.modal.active, .mobile-menu.open')
    );
    const isCartOpen = Boolean(
        document.querySelector('.cart-drawer.open')
    );

    document.documentElement.classList.toggle('overlay-open', isOverlayOpen);
    document.body.classList.toggle('overlay-open', isOverlayOpen);
    document.documentElement.classList.toggle('cart-scroll-lock', isCartOpen);
    document.body.classList.toggle('cart-scroll-lock', isCartOpen);
}

// Render catalog items
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
                    <div class="product-badge">${product.price >= 200 ? 'Premium' : 'Top Sale'}</div>
                    <div class="product-image-container">
                        <img src="${product.img}" alt="${product.title}" class="product-img" loading="lazy" decoding="async">
                    </div>
                    <div class="product-content">
                        <div class="product-header-info">
                            <div>
                                <div class="product-title">${product.title}</div>
                                <div class="product-subtitle">${product.subtitle}</div>
                            </div>
                            <div class="product-price">${product.price} BYN</div>
                        </div>
                        <div class="product-dimensions"><i class="fa-solid fa-ruler-combined"></i> ${product.size}</div>
                        <p class="product-desc">${product.desc}</p>
                        <div class="product-footer">
                            <button class="btn btn-primary btn-sm product-cart-btn" type="button" data-action="add-to-cart" data-product-id="${product.id}">В корзину</button>
                            <button class="btn btn-outline btn-sm" type="button" data-action="open-product" data-product-id="${product.id}">Подробнее</button>
                        </div>
                    </div>
                `;

        grid.appendChild(card);
    });
}

// Cart management functions
function addToCart(productId) {
    const product = findProduct(productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCart();
    openCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    cartItemsContainer.innerHTML = '';
    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalQty += item.qty;
        totalPrice += item.price * item.qty;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title} (${item.subtitle})</div>
                        <div class="cart-item-price">${item.price} BYN × ${item.qty}</div>
                        <div class="cart-quantity-controls" aria-label="Количество ${item.title}">
                            <button class="cart-quantity-btn" type="button" aria-label="Уменьшить количество ${item.title}" data-action="change-cart-quantity" data-product-id="${item.id}" data-delta="-1" ${item.qty === 1 ? 'disabled' : ''}><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
                            <span class="cart-quantity-value" aria-live="polite">${item.qty}</span>
                            <button class="cart-quantity-btn" type="button" aria-label="Увеличить количество ${item.title}" data-action="change-cart-quantity" data-product-id="${item.id}" data-delta="1"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
                        </div>
                    </div>
                    <button class="cart-remove-btn" type="button" aria-label="Удалить ${item.title} из корзины" data-action="remove-from-cart" data-product-id="${item.id}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
                `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartBadge.textContent = totalQty;
    cartTotalPrice.textContent = `${totalPrice} BYN`;
    renderOrderSummary();
    saveCart();
}

function changeCartQuantity(id, delta) {
    const item = cart.find(cartItem => cartItem.id === id);
    if (!item) return;

    item.qty = Math.max(1, item.qty + delta);
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.warn('Не удалось сохранить корзину:', error);
    }
}

function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');

        if (!Array.isArray(savedCart)) {
            cart = [];
            return;
        }

        cart = savedCart.filter(item => Number.isInteger(item.qty) && item.qty > 0);
        hydrateCart();
    } catch (error) {
        console.warn('Не удалось загрузить корзину:', error);
        cart = [];
    }
}

function hydrateCart() {
    if (!products.length) return;

    cart = cart.reduce((restoredCart, item) => {
        const product = findProduct(item.id);

        if (product) {
            restoredCart.push({ ...product, qty: item.qty });
        }

        return restoredCart;
    }, []);
}

function openCart() {
    lastCartTrigger = document.activeElement;
    const drawer = document.getElementById('cartDrawer');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.getElementById('openCartBtn').setAttribute('aria-expanded', 'true');
    updateOverlayScrollLock();
    requestAnimationFrame(() => document.getElementById('closeCartBtn').focus());
}

function closeCart() {
    const drawer = document.getElementById('cartDrawer');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.getElementById('openCartBtn').setAttribute('aria-expanded', 'false');
    updateOverlayScrollLock();
    if (lastCartTrigger && typeof lastCartTrigger.focus === 'function') {
        lastCartTrigger.focus();
    }
}

function checkoutFromCart() {
    if (cart.length === 0) {
        alert('Ваша корзина пуста');
        return;
    }

    closeCart();
    document.getElementById('contacts').scrollIntoView({ behavior: 'smooth' });
}

function renderOrderSummary() {
    const container = document.getElementById('orderCartSummaryContent');
    if (!container) return;

    if (cart.length === 0) {
        container.textContent = 'Корзина пуста. Добавьте светильник в корзину из каталога.';
        return;
    }

    const fragment = document.createDocumentFragment();
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;

        const row = document.createElement('div');
        row.className = 'order-cart-summary-row';

        const info = document.createElement('div');
        info.className = 'order-cart-summary-info';

        const title = document.createElement('span');
        title.className = 'order-cart-summary-title';
        title.textContent = item.title;
        info.appendChild(title);

        const price = document.createElement('span');
        price.className = 'order-cart-summary-price';
        price.textContent = item.price + ' BYN × ' + item.qty;
        info.appendChild(price);

        const controls = document.createElement('div');
        controls.className = 'order-cart-summary-controls';
        controls.setAttribute('aria-label', 'Управление количеством ' + item.title);

        const decreaseButton = document.createElement('button');
        decreaseButton.className = 'order-cart-summary-quantity-btn';
        decreaseButton.type = 'button';
        decreaseButton.setAttribute('aria-label', 'Уменьшить количество ' + item.title);
        decreaseButton.innerHTML = '<i class="fa-solid fa-minus" aria-hidden="true"></i>';
        decreaseButton.disabled = item.qty === 1;
        decreaseButton.addEventListener('click', () => changeCartQuantity(item.id, -1));
        controls.appendChild(decreaseButton);

        const quantity = document.createElement('span');
        quantity.className = 'order-cart-summary-quantity';
        quantity.setAttribute('aria-live', 'polite');
        quantity.textContent = String(item.qty);
        controls.appendChild(quantity);

        const increaseButton = document.createElement('button');
        increaseButton.className = 'order-cart-summary-quantity-btn';
        increaseButton.type = 'button';
        increaseButton.setAttribute('aria-label', 'Увеличить количество ' + item.title);
        increaseButton.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i>';
        increaseButton.addEventListener('click', () => changeCartQuantity(item.id, 1));
        controls.appendChild(increaseButton);

        const removeButton = document.createElement('button');
        removeButton.className = 'order-cart-summary-remove-btn';
        removeButton.type = 'button';
        removeButton.setAttribute('aria-label', 'Удалить ' + item.title + ' из заказа');
        removeButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
        removeButton.addEventListener('click', () => removeFromCart(item.id));
        controls.appendChild(removeButton);

        row.appendChild(info);
        row.appendChild(controls);
        fragment.appendChild(row);
    });

    const totalRow = document.createElement('div');
    totalRow.className = 'order-cart-summary-total';
    totalRow.textContent = 'Итого: ' + total + ' BYN';
    fragment.appendChild(totalRow);

    container.replaceChildren(fragment);
}
function openDialog(modal, focusSelector, trigger = document.activeElement) {
    lastModalTrigger = trigger;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    updateOverlayScrollLock();
    requestAnimationFrame(() => modal.querySelector(focusSelector)?.focus());
}

function closeDialog(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    updateOverlayScrollLock();

    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
        lastModalTrigger.focus();
    }
}

function openModal(trigger = document.activeElement) {
    openDialog(document.getElementById('successModal'), '.modal-close', trigger);
}

function closeModal() {
    window.clearTimeout(successModalCloseTimer);
    successModalCloseTimer = null;
    closeDialog(document.getElementById('successModal'));
}

function setProductModalImage(image, src, alt, modal) {
    const updateImageOrientation = () => {
        const isPortrait = image.naturalHeight > image.naturalWidth;
        const gallery = image.closest('.product-modal-gallery');

        modal.classList.toggle('is-portrait-image', isPortrait);
        gallery.classList.toggle('is-portrait-image', isPortrait);
    };

    image.onload = updateImageOrientation;
    image.src = src;
    image.alt = alt;
    const normalizedSrc = src.toLowerCase();
    image.classList.toggle('is-ceiling-image', normalizedSrc.includes('ceiling'));
    image.classList.toggle('is-sonata-desktop-image', normalizedSrc.includes('sonata-desktop'));
    image.classList.toggle('is-cascade-desktop-image', normalizedSrc.includes('cascade-desktop'));
    image.classList.toggle('is-prisma-desktop-image', normalizedSrc.includes('prisma-desktop'));

    if (image.complete) {
        updateImageOrientation();
    }
}

function openProductModal(productId, trigger = null) {
    const product = findProduct(productId);
    if (!product) return;

    lastModalTrigger = trigger || document.activeElement;
    const modal = document.getElementById('productModal');
    const image = document.getElementById('productModalImage');
    const counter = document.getElementById('productModalImageCounter');
    const gallery = getProductGallery(product);

    modal.dataset.productId = product.id;
    modal.dataset.galleryIndex = '0';
    document.getElementById('productModalTitle').textContent = product.title;
    document.getElementById('productModalSubtitle').textContent = product.subtitle;
    document.getElementById('productModalPrice').textContent = `${product.price} BYN`;
    document.getElementById('productModalType').textContent = product.type;
    document.getElementById('productModalSize').textContent = product.size;

    const equipmentUrl = document.getElementById('product-modal-equipment-url');
    const hasEquipmentUrl = typeof product.url === 'string' && product.url.trim() !== '';

    equipmentUrl.hidden = !hasEquipmentUrl;

    if (hasEquipmentUrl) {
        equipmentUrl.href = product.url;
    } else {
        equipmentUrl.removeAttribute('href');
    }

    document.getElementById('productModalEquipment').textContent = PRODUCT_EQUIPMENT;
    setProductModalImage(image, gallery[0], product.title, modal);
    counter.textContent = `1 / ${gallery.length}`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    updateOverlayScrollLock();

    requestAnimationFrame(() => modal.querySelector('.product-modal-close').focus());
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    updateOverlayScrollLock();
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
        lastModalTrigger.focus();
    }
}

function changeProductSlide(direction) {
    const modal = document.getElementById('productModal');
    const product = findProduct(modal.dataset.productId);
    if (!product) return;

    const gallery = getProductGallery(product);
    let index = Number(modal.dataset.galleryIndex || 0);
    index = (index + direction + gallery.length) % gallery.length;
    modal.dataset.galleryIndex = String(index);

    const image = document.getElementById('productModalImage');
    setProductModalImage(image, gallery[index], `${product.title} — фото ${index + 1}`, modal);
    document.getElementById('productModalImageCounter').textContent = `${index + 1} / ${gallery.length}`;
}

function addProductToCartFromModal() {
    const modal = document.getElementById('productModal');
    const productId = modal.dataset.productId;
    closeProductModal();
    addToCart(productId);
}

function openCertificateModal(trigger = document.activeElement) {
    openDialog(document.getElementById('certificateModal'), '.modal-close', trigger);
}

function closeCertificateModal() {
    closeDialog(document.getElementById('certificateModal'));
}

function trapDialogFocus(event) {
    if (event.key !== 'Tab') return;

    const dialog = document.querySelector(
        '#productModal.active, #certificateModal.active, #successModal.active, #cartDrawer.open'
    );
    if (!dialog) return;

    const focusable = Array.from(dialog.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

// Initialize event listeners
function updateCatalog() {
    const allModelsCount = document.getElementById('allModelsCount');

    if (allModelsCount) {
        allModelsCount.textContent = products.length;
    }

    const filtered = currentFilter === 'all'
        ? [...products]
        : products.filter(product => product.category === currentFilter);

    if (currentSort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
}

document.addEventListener('click', event => {
        const actionTarget = event.target.closest('[data-action]');
        if (!actionTarget) return;

        const action = actionTarget.dataset.action;

        switch (action) {
            case 'add-to-cart':
                addToCart(actionTarget.dataset.productId);
                break;
            case 'open-product':
                openProductModal(actionTarget.dataset.productId, actionTarget);
                break;
            case 'change-cart-quantity':
                changeCartQuantity(actionTarget.dataset.productId, Number(actionTarget.dataset.delta));
                break;
            case 'remove-from-cart':
                removeFromCart(actionTarget.dataset.productId);
                break;
            case 'open-certificate':
                openCertificateModal(actionTarget);
                break;
            case 'close-success-modal':
                closeModal();
                break;
            case 'close-product-modal':
                closeProductModal();
                break;
            case 'product-prev':
                changeProductSlide(-1);
                break;
            case 'product-next':
                changeProductSlide(1);
                break;
            case 'add-modal-cart':
                addProductToCartFromModal();
                break;
            case 'close-certificate':
                closeCertificateModal();
                break;
            default:
                break;
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCart();

    loadProducts()
        .then(() => {
            hydrateCart();
            updateCart();
        })
        .catch(error => {
            console.error('Ошибка загрузки каталога:', error);
        });

    // Cart listeners
    document.getElementById('openCartBtn').addEventListener('click', openCart);
    document.getElementById('closeCartBtn').addEventListener('click', closeCart);
    document.getElementById('checkoutCartBtn').addEventListener('click', checkoutFromCart);

    // Mobile navigation
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        updateOverlayScrollLock();
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    };
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) toggleMobileMenu();
    }));
    // Filter and sort controls
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentFilter = e.currentTarget.getAttribute('data-filter');
            updateCatalog();
        });
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        updateCatalog();
    });

    // Form validation
    const orderForm = document.getElementById('orderForm');
    const formName = document.getElementById('formName');
    const formPhone = document.getElementById('formPhone');
    const formSettlement = document.getElementById('formSettlement');
    const formDelivery = document.getElementById('formDelivery');
    const formComment = document.getElementById('formComment');

    const formFields = [
        formName,
        formPhone,
        formSettlement,
        formDelivery,
        formComment
    ];

    const setFieldError = (field, message) => {
        const errorElement = document.getElementById(field.id + 'Error');
        if (!errorElement) return;

        field.setCustomValidity(message);
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        field.classList.toggle('is-invalid', Boolean(message));
        errorElement.textContent = message;
    };

    const validateName = () => {
        const value = formName.value.trim();

        if (!value) {
            setFieldError(formName, 'Укажите ваше имя.');
            return false;
        }

        if (value.length < 2) {
            setFieldError(formName, 'Имя должно содержать минимум 2 символа.');
            return false;
        }

        if (!/^[\p{L}]+(?:[\s-][\p{L}]+)*$/u.test(value)) {
            setFieldError(formName, 'Имя должно содержать только буквы, пробелы или дефис.');
            return false;
        }

        setFieldError(formName, '');
        return true;
    };

    const validatePhone = () => {
        const value = formPhone.value.trim();
        const digits = value.replace(/\D/g, '');

        if (!value) {
            setFieldError(formPhone, 'Укажите номер телефона.');
            return false;
        }

        const isBelarusPhone = /^375(?:25|29|33|44)\d{7}$/.test(digits);
        const isRussiaPhone = /^7(?:9\d)\d{7}$/.test(digits);

        if (!isBelarusPhone && !isRussiaPhone) {
            setFieldError(formPhone, 'Введите корректный номер Беларуси (+375) или России (+7).');
            return false;
        }

        setFieldError(formPhone, '');
        return true;
    };

    const isMinskSettlement = (value) => {
        return value
            .trim()
            .toLocaleLowerCase('ru-RU')
            .replace(/ё/g, 'е')
            .replace(/[^а-я]/g, '') === 'минск';
    };

    const updateDeliveryOptions = () => {
        const isMinsk = isMinskSettlement(formSettlement.value);

        Array.from(formDelivery.options).forEach(option => {
            const isMinskDelivery = option.value === 'pickup-minsk' || option.value === 'minsk-yandex';

            if (isMinskDelivery) {
                option.disabled = !isMinsk;

                if (!isMinsk && formDelivery.value === option.value) {
                    formDelivery.value = '';
                    setFieldError(formDelivery, '');
                }
            }
        });
    };

    const validateSettlement = () => {
        const value = formSettlement.value.trim();

        if (!value) {
            setFieldError(formSettlement, 'Укажите населённый пункт.');
            return false;
        }

        if (value.length < 2) {
            setFieldError(formSettlement, 'Название должно содержать минимум 2 символа.');
            return false;
        }

        if (!/[\p{L}]/u.test(value) || !/^[\p{L}\p{N}\s.,'’()№-]+$/u.test(value)) {
            setFieldError(formSettlement, 'Укажите корректное название населённого пункта.');
            return false;
        }

        updateDeliveryOptions();
        setFieldError(formSettlement, '');
        return true;
    };

    const validateDelivery = () => {
        if (!formDelivery.value) {
            setFieldError(formDelivery, 'Выберите способ получения.');
            return false;
        }

        setFieldError(formDelivery, '');
        return true;
    };

    const validateComment = () => {
        const value = formComment.value.trim();

        if (value.length > 500) {
            setFieldError(formComment, 'Комментарий не должен превышать 500 символов.');
            return false;
        }

        setFieldError(formComment, '');
        return true;
    };

    const validateOrderForm = () => {
        const isValid = [
            validateName(),
            validatePhone(),
            validateSettlement(),
            validateDelivery(),
            validateComment()
        ].every(Boolean);

        if (!isValid) {
            const firstInvalidField = formFields.find(field => !field.checkValidity());
            firstInvalidField?.focus();
        }

        return isValid;
    };

    formName.addEventListener('input', validateName);
    formPhone.addEventListener('input', validatePhone);
    formSettlement.addEventListener('input', validateSettlement);
    formDelivery.addEventListener('change', validateDelivery);

    updateDeliveryOptions();
    formComment.addEventListener('input', validateComment);

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateOrderForm() || !orderForm.checkValidity()) {
            orderForm.reportValidity();
            return;
        }

        const submitButton = e.submitter || orderForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        const successModalTitle = document.getElementById('successModalTitle');
        const successModalMessage = document.querySelector('#successModal .modal-message');

        const payload = {
            name: formName.value.trim(),
            phone: formPhone.value.trim(),
            settlement: formSettlement.value.trim(),
            delivery: formDelivery.options[formDelivery.selectedIndex]?.textContent.trim() || formDelivery.value,
            comment: formComment.value.trim(),
            website: '',
            products: cart.map(item => ({
                title: item.title,
                quantity: item.qty,
                price: item.price
            }))
        };

        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: new URLSearchParams({
                    payload: JSON.stringify(payload)
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка отправки заявки.');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Не удалось отправить заявку.');
            }

            successModalTitle.textContent = 'Заявка отправлена';
            successModalMessage.textContent = 'Спасибо! Данные заявки отправлены менеджеру. Мы свяжемся с Вами для уточнения деталей.';
            openModal(submitButton);
            window.clearTimeout(successModalCloseTimer);
            successModalCloseTimer = window.setTimeout(() => {
                const successModal = document.getElementById('successModal');

                if (successModal.classList.contains('active')) {
                    closeModal();
                }
            }, 5000);
            orderForm.reset();
            cart = [];
            updateCart();
            updateDeliveryOptions();
        } catch (error) {
            console.error('Ошибка отправки заявки:', error);
            successModalTitle.textContent = 'Не удалось отправить заявку';
            successModalMessage.textContent = 'Произошла ошибка при отправке. Проверьте подключение к интернету и попробуйте ещё раз.';
            openModal(submitButton);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });

    document.getElementById('productModal').addEventListener('click', event => {
        if (event.target.id === 'productModal') {
            closeProductModal();
        }
    });

    document.getElementById('certificateModal').addEventListener('click', event => {
        if (event.target.id === 'certificateModal') {
            closeCertificateModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        trapDialogFocus(e);

        if (e.key === 'Escape') {
            const productModal = document.getElementById('productModal');
            if (productModal.classList.contains('active')) {
                closeProductModal();
                return;
            }

            const certificateModal = document.getElementById('certificateModal');
            if (certificateModal.classList.contains('active')) {
                closeCertificateModal();
                return;
            }

            const modal = document.getElementById('successModal');
            if (modal.classList.contains('active')) {
                closeModal();
                return;
            }

            const drawer = document.getElementById('cartDrawer');
            if (drawer.classList.contains('open')) {
                closeCart();
                return;
            }

            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu.classList.contains('open')) {
                document.getElementById('mobileMenuBtn').click();
            }
        }
    });
});
})();