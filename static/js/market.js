import { currentUser } from './auth.js';

export function initMarketplace() {
    const venteForm = document.getElementById('marketVenteForm');
    const buyGrid = document.getElementById('buyGrid');

    if (venteForm) {
        venteForm.onsubmit = async (e) => {
            e.preventDefault();
            if (!currentUser) return alert("Connectez-vous pour vendre.");

            const formData = new FormData();
            formData.append('title', document.getElementById('marketVenteTitle').value);
            formData.append('price', document.getElementById('marketVentePrice').value);
            formData.append('description', document.getElementById('marketVenteDesc').value);
            formData.append('seller_id', currentUser.id);
            formData.append('image', document.getElementById('marketVenteImg').files[0]);

            const res = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                alert("Annonce publiee !");
                venteForm.reset();
                window.showPage('achat');
                loadProducts();
            }
        };
    }

    async function loadProducts() {
        if (!buyGrid) return;
        const res = await fetch('/api/products');
        const data = await res.json();

        if (data.products.length === 0) {
            buyGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px; background: #f9f9f9; border-radius: 15px;">
                    <p style="color: #999;">Aucun objet en vente pour le moment.</p>
                    <button class="btn btn-primary" onclick="showPage('vente')">Vendre un objet</button>
                </div>`;
            return;
        }

        buyGrid.innerHTML = data.products.map(p => `
            <div class="panel" style="padding:0; overflow:hidden;">
                <img src="/static/uploads/${p.image_url}" style="width:100%; height:180px; object-fit:cover; background:#eee;">
                <div style="padding:15px;">
                    <h4 style="margin:0">${p.title}</h4>
                    <p style="color:#28a745; font-weight:bold; font-size:18px; margin:5px 0;">${p.price} Euro</p>
                    <p style="font-size:12px; color:#666; height:40px; overflow:hidden;">${p.description}</p>
                    <small>Vendeur : ${p.prenom}</small>
                    <button class="btn btn-primary" style="width:100%; margin-top:10px;">Contacter</button>
                </div>
            </div>
        `).join('');
    }
    loadProducts();
}