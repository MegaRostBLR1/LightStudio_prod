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
const products = [
    {
        id: 'manhattan',
        title: 'MANHATTAN',
        subtitle: 'Манхэттен НП',
        price: 85,
        size: '56 × 15 см',
        category: 'universal',
        type: 'Потолочный/настольный светильник',
        desc: 'Вертикальные ламели Manhattan дают тонкие тёплые тени и делают свет живым. Хорош для серии над столом, барной стойкой или камерной зоной кафе.',
        img: './static/images/manhattan/manhattan.webp',
        gallery: ['./static/images/manhattan/manhattan-desktop.webp', './static/images/manhattan/manhattan-ceiling.webp'],
        url: 'https://www.instagram.com/p/DdOxPJUgG-b/'
    },
    {
        id: 'lotus',
        title: 'LOTUS',
        subtitle: 'Лотос НП',
        price: 85,
        size: '25 × 27 см',
        category: 'universal',
        type: 'Потолочный/настольный светильник',
        desc: 'Lotus мягко раскрывает свет и рисует деликатные тени на стенах. Форма добавляет интерьеру спокойствие, уют и лёгкий природный акцент.',
        img: './static/images/lotus/lotus.webp',
        gallery: ['./static/images/lotus/lotus-desktop.webp', './static/images/lotus/lotus-ceiling.webp'],
        url: 'https://www.instagram.com/p/DdWcwBtAG8C/'
    },
    {
        id: 'onyx',
        title: 'ONYX',
        subtitle: 'Оникс НП',
        price: 85,
        size: '25 × 22 см',
        category: 'universal',
        type: 'Потолочный/настольный светильник',
        desc: 'Onyx даёт компактный, но выразительный световой рисунок. Ламели создают атмосферные тени, а дерево добавляет пространству тепло.',
        img: './static/images/onyx/onyx.webp',
        gallery: ['./static/images/onyx/onyx-desktop.webp', './static/images/onyx/onyx-ceiling.webp'],
        url: 'https://www.instagram.com/p/DdJxunLgonG/'
    },
    {
        id: 'sonata',
        title: 'SONATA',
        subtitle: 'Соната НП',
        price: 85,
        size: '25 × 24 см',
        category: 'universal',
        type: 'Потолочный/настольный светильник',
        desc: 'Sonata строит красивую графику света за счёт геометрии ламелей. В группе особенно эффектно смотрится над кухней, баром или ресторанными столиками.',
        img: './static/images/sonata/sonata.webp',
        gallery: ['./static/images/sonata/sonata-desktop.webp', './static/images/sonata/sonata-ceiling.webp'],
        url: 'https://www.instagram.com/p/DdJxunLgonG/'
    },
    {
        id: 'cascade',
        title: 'CASCADE',
        subtitle: 'Каскад НП',
        price: 125,
        size: '36 × 15 см',
        category: 'universal',
        type: 'Потолочный/настольный светильник',
        desc: 'Cascade подчёркивает высоту пространства и даёт вытянутые ритмичные тени. Лёгкая форма красиво работает как одиночно, так и в нескольких повторах.',
        img: './static/images/cascade/cascade.webp',
        gallery: ['./static/images/cascade/cascade-desktop.webp', './static/images/cascade/cascade-ceiling.webp'],
        url: 'https://www.instagram.com/p/DcjHgX_MD6A/'
    },
    {
        id: 'prisma',
        title: 'PRISMA',
        subtitle: 'Призма НП',
        price: 125,
        size: '25 × 28 см',
        category: 'universal',
        type: 'Потолочный/настольный светильник',
        desc: 'Prisma создаёт игру граней, света и теней. Деревянный каркас добавляет глубину, а ламели формируют выразительный рисунок в интерьере.',
        img: './static/images/prisma/prisma.webp',
        gallery: ['./static/images/prisma/prisma-desktop.webp', './static/images/prisma/prisma-ceiling.webp'],
        url: 'https://www.instagram.com/p/DdT-kJ-Aw6O/'
    },
    {
        id: 'grace',
        title: 'GRACE',
        subtitle: 'Грация',
        price: 205,
        size: '40 × 40 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Grace смотрится мягко и скульптурно, а свет через ламели даёт красивые спокойные тени. Для обеденной зоны, гостиной, веранды или уютного кафе.',
        img: './static/images/grace/grace.webp',
        gallery: ['./static/images/grace/grace-ceiling.webp', './static/images/grace/grace-ceiling-2.webp'],
        url: 'https://www.instagram.com/p/DdBZwhsOntM/'
    },
    {
        id: 'bastion',
        title: 'BASTION',
        subtitle: 'Бастион',
        price: 150,
        size: '47 × 24 см',
        category: 'universal',
        type: 'Потолочный/настольный/напольный',
        desc: 'Bastion выделяется высокой тонкой силуэтностью и глубокими тенями от ламелей. Может быть потолочным акцентом, настольным объектом или напольным светильником.',
        img: './static/images/bastion/bastion.webp',
        gallery: ['./static/images/bastion/bastion-desktop.webp', './static/images/bastion/bastion-ceiling.webp'],
        url: 'https://www.instagram.com/p/DdJgtOTudXr/'
    },
    {
        id: 'orbit',
        title: 'ORBIT',
        subtitle: 'Орбита',
        price: 155,
        size: '20 × 40 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Orbit раскрывает свет широкой горизонтальной формой. Ламели дают мягкие тени на поверхности и создают уютную атмосферу над столом или в гостиной.',
        img: './static/images/orbit/orbit.webp',
        gallery: ['./static/images/orbit/orbit-ceiling.webp', './static/images/orbit/orbit-ceiling-2.webp'],
        url: 'https://www.instagram.com/p/DclzLBqyudp/'
    },
    {
        id: 'orbit2',
        title: 'ORBIT № 2',
        subtitle: 'Орбита № 2',
        price: 205,
        size: '20 × 60–61 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Orbit № 2 — крупный световой акцент для просторных зон. Широкая форма и тени от ламелей красиво собирают композицию над большим столом.',
        img: './static/images/orbit2/orbit2.webp',
        gallery: ['./static/images/orbit2/orbit2-ceiling.webp', './static/images/orbit2/orbit2-ceiling-2.webp']
    },
    {
        id: 'pantheon',
        title: 'PANTHEON',
        subtitle: 'Пантеон',
        price: 180,
        size: '32 × 32 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Pantheon напоминает архитектурный купол и создаёт благородную игру теней. Модель подчёркивает входные зоны, коридоры, столовые и гостиные.',
        img: './static/images/pantheon/pantheon.webp',
        gallery: ['./static/images/pantheon/pantheon-ceiling.webp', './static/images/pantheon/pantheon-ceiling-2.webp'],
        url: 'https://www.instagram.com/p/Dc_Y1S2pQcM/'
    },
    {
        id: 'element5',
        title: '5 ELEMENT',
        subtitle: '5 Элемент П',
        price: 125,
        size: '25 × 25 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: '5 Element — чистая геометрия и аккуратный световой акцент. Ламели дают красивые тени, поэтому модель особенно хорошо смотрится в коридорах и у входа.',
        img: './static/images/element5/element5.webp',
        gallery: ['./static/images/element5/element5-ceiling.webp', './static/images/element5/element5-ceiling-2.webp'],
        url: 'https://www.instagram.com/p/Dc3Of-hOFux/'
    },
    {
        id: 'sphere',
        title: 'SPHERE',
        subtitle: 'Сфера',
        price: 125,
        size: '30 × 30 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Sphere создаёт мягкий круглый ореол света и спокойную игру теней. Подходит для интерьеров, где важны форма, тепло и премиальный уют.',
        img: './static/images/sphere/sphere.webp',
        gallery: ['./static/images/sphere/sphere-ceiling.webp', './static/images/sphere/sphere-ceiling-2.webp'],
        url: 'https://www.instagram.com/p/DcyewvNgj-F/'
    },
    {
        id: 'coliseum',
        title: 'COLISEUM',
        subtitle: 'Колизей',
        price: 205,
        size: '16 × 38 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Coliseum — низкая широкая модель для столов и зон отдыха. Ламели подчёркивают горизонталь пространства и дают выразительные атмосферные тени.',
        img: './static/images/coliseum/coliseum.webp',
        gallery: ['./static/images/coliseum/coliseum-ceiling.webp', './static/images/coliseum/coliseum-ceiling-2.webp'],
        url: 'https://www.instagram.com/p/DdEUQuoOOpE/'
    },
    {
        id: 'babylon',
        title: 'BABYLON',
        subtitle: 'Вавилон',
        price: 205,
        size: '20 × 39 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Babylon строится на многослойной форме и плотном ритме деталей. Свет проходит через ламели и создаёт глубокие тени, добавляя интерьеру объём.',
        img: './static/images/babylon/babylon.webp',
        gallery: ['./static/images/babylon/babylon-ceiling.webp', './static/images/babylon/babylon-ceiling-2.webp'],
        url: 'https://www.instagram.com/p/DdHDQLxgN4C/'
    },
    {
        id: 'umbrella',
        title: 'UMBRELLA',
        subtitle: 'Амбрелла',
        price: 205,
        size: '37 × 40 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Umbrella — это не просто источник света, а современный арт-объект. Сложная 3D-конструкция из деревянных граней отдаленно напоминает купол зонта (отсюда и название), приглашая свет мягко рассеиваться сквозь слои. Стильное решение для тех, кто ценит нестандартный предметный дизайн.',
        img: './static/images/umbrella/umbrella.webp',
        gallery: ['./static/images/umbrella/umbrella-ceiling.webp'],
        url: 'https://www.instagram.com/p/DdY0Jp_uD7c/'
    },
    {
        id: 'musa',
        title: 'MUSA',
        subtitle: 'Муза',
        price: 450,
        size: '24 × 48 см',
        category: 'pendant',
        type: 'Потолочный светильник',
        desc: 'Musa — искусство, которое говорит без слов. Этот светильник выполнялся по индивидуальному заказу одной из студий красоты и получился настолько авторским, что стал частью ассортимента. Это не просто светильник, а центральный арт-объект, который превращает обычный интерьер в галерею современного искусства.',
        img: './static/images/musa/musa.webp',
        gallery: ['./static/images/musa/musa-ceiling.webp', './static/images/musa/musa-ceiling-2.webp'],
        url: 'https://www.instagram.com/p/DdgDTm6uPSQ/'
    }
];

const PRODUCT_EQUIPMENT = 'Подвесная система с креплением к потолку, цоколь E27, провод 1 м — длина регулируется. Рекомендуется использование филаментных ламп (как на фото) для создания максимально уютной атмосферы. Лампа приобретается отдельно.';

const CART_STORAGE_KEY = 'lightStudioCart';
let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let lastCartTrigger = null;
let lastModalTrigger = null;

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
    const product = products.find(p => p.id === productId);
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
        if (!Array.isArray(savedCart)) return;

        cart = savedCart.filter(item => {
            const product = products.find(p => p.id === item.id);
            return product && Number.isInteger(item.qty) && item.qty > 0;
        }).map(item => {
            const product = products.find(p => p.id === item.id);
            return { ...product, qty: item.qty };
        });
    } catch (error) {
        console.warn('Не удалось загрузить корзину:', error);
        cart = [];
    }
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
function openModal() {
    lastModalTrigger = document.activeElement;
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    updateOverlayScrollLock();
    requestAnimationFrame(() => modal.querySelector('.modal-close').focus());
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    updateOverlayScrollLock();
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
        lastModalTrigger.focus();
    }
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
    const product = products.find(item => item.id === productId);
    if (!product) return;

    lastModalTrigger = trigger || document.activeElement;
    const modal = document.getElementById('productModal');
    const image = document.getElementById('productModalImage');
    const counter = document.getElementById('productModalImageCounter');
    const gallery = product.gallery || [product.img, product.img];

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
    const product = products.find(item => item.id === modal.dataset.productId);
    if (!product) return;

    const gallery = product.gallery || [product.img, product.img];
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

function openCertificateModal() {
    lastModalTrigger = document.activeElement;
    const modal = document.getElementById('certificateModal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    updateOverlayScrollLock();

    requestAnimationFrame(() => modal.querySelector('.modal-close').focus());
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    updateOverlayScrollLock();

    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
        lastModalTrigger.focus();
    }
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
                openCertificateModal();
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
    updateCatalog();
    updateCart();

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

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateOrderForm() || !orderForm.checkValidity()) {
            orderForm.reportValidity();
            return;
        }

        lastModalTrigger = e.submitter || document.querySelector('#orderForm button[type="submit"]');
        openModal();
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