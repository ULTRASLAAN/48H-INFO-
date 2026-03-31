import { currentUser } from './auth.js';

export function initMarketplace() {
    const venteForm = document.getElementById('marketVenteForm');
    const buyGrid = document.getElementById('buyGrid');

    // 1. PUBLIER UNE ANNONCE
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
                alert("Annonce publiée !");
                venteForm.reset();
                window.showPage('achat');
                loadProducts();
            }
        };
    }

    // 2. CHARGER LES PRODUITS
    window.loadProducts = async () => {
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

        buyGrid.innerHTML = data.products.map(p => {
            // VÉRIFICATION DES DROITS SÉPARÉE
            const isSeller = currentUser && currentUser.id === p.seller_id;
            const isAdmin = currentUser && currentUser.role === 'admin';
            
            const canEdit = isSeller; // SEUL le vendeur peut modifier
            const canDelete = isSeller || isAdmin; // Vendeur OU Admin pour supprimer
            
            // Construction dynamique des boutons
            let controlButtons = '';
            if (canDelete) {
                controlButtons += `<div style="display:flex; gap:5px; margin-top:10px;">`;
                
                // On n'ajoute le bouton modifier QUE si c'est le vendeur
                if (canEdit) {
                    controlButtons += `
                        <button onclick="openEditProductModal(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.description.replace(/'/g, "\\'")}')" 
                                style="flex:1; background:#f0f2f5; border:1px solid #ddd; padding:8px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px;">Modifier</button>
                    `;
                }
                
                // Le bouton supprimer est là pour le vendeur OU l'admin
                controlButtons += `
                        <button onclick="deleteProduct(${p.id})" 
                                style="flex:1; background:#ffebeb; color:red; border:1px solid #ffcccc; padding:8px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px;">Supprimer</button>
                    </div>`;
            }

            return `
            <div class="panel" style="padding:0; overflow:hidden; position:relative;">
                ${isAdmin && !isSeller ? '<span style="position:absolute; top:10px; right:10px; background:red; color:white; font-size:10px; padding:2px 6px; border-radius:5px; font-weight:bold;">MODÉRATION</span>' : ''}
                <img src="/static/uploads/${p.image_url}" style="width:100%; height:180px; object-fit:cover; background:#eee;">
                <div style="padding:15px;">
                    <h4 style="margin:0">${p.title}</h4>
                    <p style="color:#28a745; font-weight:bold; font-size:18px; margin:5px 0;">${p.price} Euro</p>
                    <p style="font-size:12px; color:#666; height:40px; overflow:hidden;">${p.description}</p>
                    <small>Vendeur : ${p.prenom}</small>
                    
                    <button class="pill-btn" style="width:100%; margin-top:10px; padding:10px; font-size:14px; background:var(--ink); color:var(--brand);">💬 Contacter</button>
                    
                    ${controlButtons}
                </div>
            </div>`;
        }).join('');
    };

    // 3. SUPPRIMER UN PRODUIT
    window.deleteProduct = async (productId) => {
        if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
        
        const res = await fetch(`/api/products/${productId}?user_id=${currentUser.id}&user_role=${currentUser.role}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            loadProducts();
        } else {
            alert("Erreur lors de la suppression.");
        }
    };

    // 4. OUVRIR MODALE DE MODIFICATION
    window.openEditProductModal = (id, title, price, desc) => {
        document.getElementById('editProductId').value = id;
        document.getElementById('editProductTitle').value = title;
        document.getElementById('editProductPrice').value = price;
        document.getElementById('editProductDesc').value = desc;
        document.getElementById('editProductModal').style.display = 'flex';
    };

    // 5. SAUVEGARDER LA MODIFICATION
    window.saveProductEdit = async () => {
        const id = document.getElementById('editProductId').value;
        const data = {
            user_id: currentUser.id,
            user_role: currentUser.role, // Pas utile côté serveur maintenant qu'on a bloqué l'admin, mais on le laisse pour la forme
            title: document.getElementById('editProductTitle').value,
            price: document.getElementById('editProductPrice').value,
            description: document.getElementById('editProductDesc').value
        };

        const res = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (res.ok) {
            document.getElementById('editProductModal').style.display = 'none';
            loadProducts();
        } else {
            const errorData = await res.json();
            alert(errorData.erreur || "Erreur lors de la modification.");
        }
    };

    // Initialisation
    loadProducts();
}