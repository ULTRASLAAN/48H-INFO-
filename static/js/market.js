import { API_URL, authState } from './api.js';

export async function loadMarketProducts() {
    try {
        const res = await fetch(`${API_URL}/market`);
        const data = await res.json();
        const marketListVente = document.getElementById('marketListVente');
        if(!marketListVente) return;
        marketListVente.innerHTML = '';

        data.products.forEach(prod => {
            const div = document.createElement('div');
            div.className = 'market-item';
            div.innerHTML = `<span class="market-kind vente">Vente</span><h4>${prod.title}</h4><span class="meta">${prod.description}</span><span class="market-price">${prod.price} EUR</span>`;
            marketListVente.appendChild(div);
        });
    } catch (e) {}
}

export function initMarketplacePages() {
    loadMarketProducts();

    const form = document.getElementById('marketVenteForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!authState.currentUser) { alert("Veuillez vous connecter !"); return; }

        const title = document.getElementById('marketVenteTitle').value.trim();
        const price = document.getElementById('marketVentePrice').value.trim();
        const desc = document.getElementById('marketVenteDesc').value.trim();

        try {
            await fetch(`${API_URL}/market`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seller_id: authState.currentUser.id, title: title, description: desc, price: parseFloat(price) })
            });
            event.target.reset();
            loadMarketProducts();
        } catch (e) {}
    });
}

export function initAchatStore() {
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

    if (!buyGrid) return;

    const cart = new Map();

    function getCards() { return Array.from(buyGrid.querySelectorAll('.buy-card')); }

    function updatePriceLabel() { buyMaxPriceValue.textContent = `${buyMaxPrice.value} EUR`; }

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
            if (sort === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
            if (sort === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
            return Number(b.dataset.popularity) - Number(a.dataset.popularity);
        });

        cards.forEach((card) => card.style.display = 'none');
        const fragment = document.createDocumentFragment();
        visibleCards.forEach((card) => { card.style.display = 'block'; fragment.appendChild(card); });
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
        if (!button) return;
        buyCheckoutMessage.textContent = '';
        buyBankForm.hidden = true;
        const card = button.closest('.buy-card');
        const id = card.dataset.id;
        const title = card.querySelector('h4').textContent;
        const price = Number(card.dataset.price);
        const current = cart.get(id);
        if (current) current.qty += 1;
        else cart.set(id, { id, title, price, qty: 1 });
        renderCart();
    });

    buyCartList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-remove-id]');
        if (!removeBtn) return;
        buyCheckoutMessage.textContent = '';
        buyBankForm.hidden = true;
        const id = removeBtn.dataset.removeId;
        const current = cart.get(id);
        if (!current) return;
        current.qty -= 1;
        if (current.qty <= 0) cart.delete(id);
        renderCart();
    });

    if(buyBankForm) {
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
    }

    [buySearch, buyCategory, buySort, buyMaxPrice].forEach((control) => {
        if(control) {
            control.addEventListener('input', () => { updatePriceLabel(); applyFilters(); });
            control.addEventListener('change', () => { updatePriceLabel(); applyFilters(); });
        }
    });

    document.addEventListener('buy-grid-updated', () => applyFilters());
    if(buyMaxPrice) updatePriceLabel();
    applyFilters();
    renderCart();
}