/* PAGE NAVIGATION */

function showPage(pageName) {
    const hero = document.getElementById('home');
    const detailSections = document.querySelectorAll('main > section.section');

    detailSections.forEach((section) => {
        section.classList.remove('active');
    });

    if (pageName === 'home') {
        hero.style.display = 'block';
    } else {
        hero.style.display = 'none';
        const page = document.getElementById(pageName);
        if (page) {
            page.classList.add('active');
        }
    }

    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });

    window.scrollTo(0, 0);
}

function addVenteProductToAchatGrid(product) {
    const buyGrid = document.getElementById('buyGrid');
    if (!buyGrid) {
        return;
    }

    const productId = `v-${Date.now()}`;
    const imageSrc = product.photoSrc || 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=900&q=80&auto=format&fit=crop';
    const safePrice = Number(product.price) || 0;

    const card = document.createElement('article');
    card.className = 'buy-card';
    card.dataset.id = productId;
    card.dataset.category = 'informatique';
    card.dataset.price = String(safePrice);
    card.dataset.popularity = '10';
    card.innerHTML = `
        <img class="buy-card-image" src="${imageSrc}" alt="${product.title}">
        <h4>${product.title}</h4>
        <span class="meta">${product.desc}</span>
        <div class="buy-card-foot"><strong class="market-price">${safePrice} EUR</strong><button class="btn btn-primary buy-add-cart" type="button">Ajouter</button></div>
    `;

    buyGrid.prepend(card);
    document.dispatchEvent(new Event('buy-grid-updated'));
}

function initStudentAccount() {
    const openLoginBtn = document.getElementById('openLoginBtn');
    const accountChip = document.getElementById('accountChip');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const accountAvatar = document.getElementById('accountAvatar');
    const accountName = document.getElementById('accountName');
    const accountEmail = document.getElementById('accountEmail');

    if (!openLoginBtn || !accountChip || !loginModal || !loginForm) {
        return;
    }

    const fallbackAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80&auto=format&fit=crop';

    function saveAccount(data) {
        localStorage.setItem('ynovStudentAccount', JSON.stringify(data));
    }

    function getAccount() {
        const raw = localStorage.getItem('ynovStudentAccount');
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    function renderAccount(data) {
        if (!data) {
            openLoginBtn.hidden = false;
            accountChip.hidden = true;
            return;
        }
        openLoginBtn.hidden = true;
        accountChip.hidden = false;
        accountName.textContent = `${data.name} - ${data.promo}`;
        accountEmail.textContent = data.email;
        accountAvatar.src = data.avatar || fallbackAvatar;
    }

    function closeLoginModal() {
        loginModal.hidden = true;
        loginModal.style.display = 'none';
        loginForm.reset();
        if (loginMessage) {
            loginMessage.textContent = '';
        }
    }

    openLoginBtn.addEventListener('click', () => {
        loginModal.hidden = false;
        loginModal.style.display = 'grid';
        document.getElementById('loginName').focus();
    });

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeLoginModal();
        });
    }

    loginModal.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeLoginModal();
        }
    });

    // Fallback delegation in case direct listeners are stale in cached JS.
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'closeLoginBtn') {
            event.preventDefault();
            closeLoginModal();
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('ynovStudentAccount');
            renderAccount(null);
        });
    }

    // Fallback: always allow closing modal with Escape.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !loginModal.hidden) {
            closeLoginModal();
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('loginName').value.trim();
        const email = document.getElementById('loginEmail').value.trim();
        const promo = document.getElementById('loginPromo').value.trim();
        const avatar = document.getElementById('loginAvatar').value.trim();

        if (!name || !email || !promo) {
            if (loginMessage) {
                loginMessage.textContent = 'Veuillez remplir toutes les informations obligatoires.';
            }
            return;
        }

        const data = { name, email, promo, avatar };
        saveAccount(data);
        renderAccount(data);
        closeLoginModal();
    });

    renderAccount(getAccount());
}

/* FEED MODULE */
function initFeed() {
    const feedTabs = document.querySelectorAll('#feed .tab');
    const feedList = document.getElementById('feedList');

    feedTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            feedTabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            Array.from(feedList.children).forEach((item) => {
                item.style.display = filter === 'all' || item.dataset.type === filter ? 'block' : 'none';
            });
        });
    });

    document.getElementById('postForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const author = document.getElementById('postAuthor').value.trim();
        const type = document.getElementById('postType').value;
        const message = document.getElementById('postMessage').value.trim();
        if (!author || !message) {
            return;
        }
        const post = document.createElement('div');
        post.className = 'feed-item';
        post.dataset.type = type;
        post.innerHTML = `${message}<span class="meta">${author} - a l'instant</span>`;
        feedList.prepend(post);
        event.target.reset();
    });
}

/* STATUS MODULE */
function initStatus() {
    document.getElementById('statusForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const text = document.getElementById('statusInput').value.trim();
        if (!text) {
            return;
        }
        document.getElementById('statusBox').textContent = text;
        event.target.reset();
    });
}

/* CHAT MODULE */
function initChat() {
    let currentChannel = 'entraide';
    const channels = document.querySelectorAll('#channels button');
    const chatList = document.getElementById('chatList');

    function renderChat() {
        chatList.innerHTML = '';
        chatData[currentChannel].forEach((msg) => {
            const row = document.createElement('div');
            row.className = 'chat-item';
            row.innerHTML = `<strong>${msg.author}</strong><span class="meta">${msg.text}</span>`;
            chatList.appendChild(row);
        });
    }

    channels.forEach((button) => {
        button.addEventListener('click', () => {
            channels.forEach((b) => b.classList.remove('active'));
            button.classList.add('active');
            currentChannel = button.dataset.channel;
            renderChat();
        });
    });

    document.getElementById('chatForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const author = document.getElementById('chatAuthor').value.trim();
        const text = document.getElementById('chatText').value.trim();
        if (!author || !text) {
            return;
        }
        chatData[currentChannel].push({ author, text });
        event.target.reset();
        renderChat();
    });

    renderChat();
}

/* GROUP MODULE */
function initGroups() {
    document.getElementById('groupForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('groupName').value.trim();
        const goal = document.getElementById('groupGoal').value.trim();
        if (!name || !goal) {
            return;
        }
        const card = document.createElement('div');
        card.className = 'group-item';
        card.innerHTML = `<h4>${name}</h4><span class="meta">${goal}</span>`;
        document.getElementById('groupList').prepend(card);
        event.target.reset();
    });
}

/* MARKETPLACE MODULE */
function initMarketSection(config) {
    const form = document.getElementById(config.formId);
    const list = document.getElementById(config.listId);
    if (!form || !list) {
        return;
    }

    list.addEventListener('click', (event) => {
        const item = event.target.closest('.market-item');
        if (!item) {
            return;
        }
        item.classList.toggle('selected');
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById(config.titleId).value.trim();
        const price = document.getElementById(config.priceId).value.trim();
        const photoInput = document.getElementById(config.photoId);
        const desc = document.getElementById(config.descId).value.trim();
        if (!title || !price || !desc) {
            return;
        }

        function appendMarketItem(photoSrc) {
            const item = document.createElement('div');
            item.className = 'market-item';
            item.dataset.marketType = config.type;
            const photoHtml = photoSrc ? `<img class="market-photo" src="${photoSrc}" alt="Photo du produit ${title}">` : '';
            item.innerHTML = `${photoHtml}<span class="market-kind ${config.type}">${config.label}</span><h4>${title}</h4><span class="meta">${desc}</span><span class="market-price">${price} EUR</span>`;
            list.prepend(item);

            if (config.type === 'vente') {
                addVenteProductToAchatGrid({
                    title,
                    desc,
                    price,
                    photoSrc
                });
            }

            event.target.reset();
        }

        const photoFile = photoInput.files && photoInput.files[0] ? photoInput.files[0] : null;
        if (photoFile) {
            const reader = new FileReader();
            reader.onload = () => appendMarketItem(reader.result);
            reader.readAsDataURL(photoFile);
            return;
        }

        appendMarketItem('');
    });
}

function initMarketplacePages() {
    initMarketSection({
        formId: 'marketVenteForm',
        listId: 'marketListVente',
        titleId: 'marketVenteTitle',
        priceId: 'marketVentePrice',
        photoId: 'marketVentePhoto',
        descId: 'marketVenteDesc',
        type: 'vente',
        label: 'Vente'
    });

}

function initAchatStore() {
    const buyGrid = document.getElementById('buyGrid');
    const buySearch = document.getElementById('buySearch');
    const buyCategory = document.getElementById('buyCategory');
    const buySort = document.getElementById('buySort');
    const buyMaxPrice = document.getElementById('buyMaxPrice');
    const buyMaxPriceValue = document.getElementById('buyMaxPriceValue');
    const buyResultsTitle = document.getElementById('buyResultsTitle');
    const buyCartCount = document.getElementById('buyCartCount');
    const buyCartList = document.getElementById('buyCartList');
    const buyCartTotal = document.getElementById('buyCartTotal');
    const buyCheckoutMessage = document.getElementById('buyCheckoutMessage');
    const buyBankForm = document.getElementById('buyBankForm');

    if (!buyGrid) {
        return;
    }

    const cart = new Map();

    function getCards() {
        return Array.from(buyGrid.querySelectorAll('.buy-card'));
    }

    function updatePriceLabel() {
        buyMaxPriceValue.textContent = `${buyMaxPrice.value} EUR`;
    }

    function applyFilters() {
        const query = buySearch.value.trim().toLowerCase();
        const category = buyCategory.value;
        const maxPrice = Number(buyMaxPrice.value);
        const sort = buySort.value;

        const cards = getCards();
        const visibleCards = cards.filter((card) => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const text = card.querySelector('.meta').textContent.toLowerCase();
            const price = Number(card.dataset.price);
            const inQuery = !query || title.includes(query) || text.includes(query);
            const inCategory = category === 'all' || card.dataset.category === category;
            const inPrice = price <= maxPrice;
            return inQuery && inCategory && inPrice;
        });

        visibleCards.sort((a, b) => {
            if (sort === 'price-asc') {
                return Number(a.dataset.price) - Number(b.dataset.price);
            }
            if (sort === 'price-desc') {
                return Number(b.dataset.price) - Number(a.dataset.price);
            }
            return Number(b.dataset.popularity) - Number(a.dataset.popularity);
        });

        cards.forEach((card) => {
            card.style.display = 'none';
        });

        const fragment = document.createDocumentFragment();
        visibleCards.forEach((card) => {
            card.style.display = 'block';
            fragment.appendChild(card);
        });
        buyGrid.appendChild(fragment);
        buyResultsTitle.textContent = `Resultats: ${visibleCards.length} produit${visibleCards.length > 1 ? 's' : ''}`;
    }

    function renderCart() {
        const entries = Array.from(cart.values());
        if (entries.length === 0) {
            buyCartList.innerHTML = '<p class="meta">Votre panier est vide.</p>';
            buyCartTotal.textContent = '0 EUR';
            buyCartCount.textContent = 'Panier: 0';
            buyCheckoutMessage.textContent = '';
            buyBankForm.hidden = true;
            return;
        }

        let totalQty = 0;
        let totalPrice = 0;
        buyCartList.innerHTML = '';

        entries.forEach((item) => {
            totalQty += item.qty;
            totalPrice += item.qty * item.price;
            const row = document.createElement('div');
            row.className = 'buy-cart-item';
            row.innerHTML = `<strong>${item.title}</strong><span class="meta">${item.qty} x ${item.price} EUR</span><button class="btn btn-light buy-remove-item" type="button" data-remove-id="${item.id}">Retirer</button>`;
            buyCartList.appendChild(row);
        });

        buyCartTotal.textContent = `${totalPrice} EUR`;
        buyCartCount.textContent = `Panier: ${totalQty}`;
        buyCheckoutMessage.textContent = 'Entrez vos donnees bancaires pour payer les produits.';
        buyBankForm.hidden = false;
    }

    buyGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.buy-add-cart');
        if (!button) {
            return;
        }
        buyCheckoutMessage.textContent = '';
        buyBankForm.hidden = true;
        const card = button.closest('.buy-card');
        const id = card.dataset.id;
        const title = card.querySelector('h4').textContent;
        const price = Number(card.dataset.price);
        const current = cart.get(id);
        if (current) {
            current.qty += 1;
        } else {
            cart.set(id, { id, title, price, qty: 1 });
        }
        renderCart();
    });

    buyCartList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-remove-id]');
        if (!removeBtn) {
            return;
        }
        buyCheckoutMessage.textContent = '';
        buyBankForm.hidden = true;
        const id = removeBtn.dataset.removeId;
        const current = cart.get(id);
        if (!current) {
            return;
        }
        current.qty -= 1;
        if (current.qty <= 0) {
            cart.delete(id);
        }
        renderCart();
    });

    buyBankForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const cardName = document.getElementById('buyCardName').value.trim();
        const cardNumberRaw = document.getElementById('buyCardNumber').value.replace(/\s+/g, '');
        const cardExpiry = document.getElementById('buyCardExpiry').value.trim();
        const cardCvc = document.getElementById('buyCardCvc').value.trim();

        const cardOk = /^\d{16}$/.test(cardNumberRaw);
        const expiryOk = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry);
        const cvcOk = /^\d{3,4}$/.test(cardCvc);

        if (!cardName || !cardOk || !expiryOk || !cvcOk) {
            buyCheckoutMessage.textContent = 'Donnees bancaires invalides. Verifiez les champs.';
            return;
        }

        cart.clear();
        renderCart();
        buyBankForm.reset();
        buyCheckoutMessage.textContent = 'Paiement valide. Merci pour votre achat.';
    });

    [buySearch, buyCategory, buySort, buyMaxPrice].forEach((control) => {
        control.addEventListener('input', () => {
            updatePriceLabel();
            applyFilters();
        });
        control.addEventListener('change', () => {
            updatePriceLabel();
            applyFilters();
        });
    });

    document.addEventListener('buy-grid-updated', () => {
        applyFilters();
    });

    updatePriceLabel();
    applyFilters();
    renderCart();
}

/* PROFILE MODULE */
function initProfile() {
    document.getElementById('profileForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('profileName').value.trim();
        const track = document.getElementById('profileTrack').value.trim();
        const bio = document.getElementById('profileBio').value.trim();
        if (!name || !track || !bio) {
            return;
        }
        const profile = document.createElement('div');
        profile.className = 'profile-item';
        profile.innerHTML = `<h4>${name} - ${track}</h4><span class="meta">${bio}</span>`;
        document.getElementById('profileList').prepend(profile);
        event.target.reset();
    });
}

/* INIT ALL */
document.addEventListener('DOMContentLoaded', () => {
    initStudentAccount();
    initFeed();
    initStatus();
    initChat();
    initGroups();
    initMarketplacePages();
    initAchatStore();
    initProfile();

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[data-page], .btn[data-page]');
        if (!link) {
            return;
        }
        event.preventDefault();
        const page = link.dataset.page;
        if (page) {
            if (page === 'home') {
                showPage('home');
                return;
            }
            showPage(page);
        }
    });

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            showPage('home');
        });
    }

    showPage('home');
});
