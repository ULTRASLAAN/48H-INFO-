import { currentUser } from './auth.js';

export function initMarketplace() {
    const venteForm = document.getElementById('marketVenteForm');
    const buyGrid = document.getElementById('buyGrid');

    // 1. PUBLIER UNE ANNONCE
    if (venteForm) {
        venteForm.onsubmit = async (e) => {
            e.preventDefault();
            if (!currentUser) {
                window.showToast("Connectez-vous pour vendre.", "error");
                return;
            }

            const formData = new FormData();
            formData.append('title', document.getElementById('marketVenteTitle').value);
            formData.append('price', document.getElementById('marketVentePrice').value);
            formData.append('description', document.getElementById('marketVenteDesc').value);
            formData.append('seller_id', currentUser.id);
            formData.append('image', document.getElementById('marketVenteImg').files[0]);

            try {
                const res = await fetch('/api/products', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    window.showToast("Annonce publiee !");
                    venteForm.reset();
                    window.showPage('achat');
                    loadProducts();
                } else {
                    window.showToast("Erreur lors de la publication.", "error");
                }
            } catch (err) {
                console.error(err);
                window.showToast("Erreur de connexion.", "error");
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
            const isSeller = currentUser && currentUser.id === p.seller_id;
            const isAdmin = currentUser && currentUser.role === 'admin';
            
            const canEdit = isSeller; 
            const canDelete = isSeller || isAdmin; 
            
            let controlButtons = '';
            if (canDelete) {
                controlButtons += `<div style="display:flex; gap:5px; margin-top:10px;">`;
                
                if (canEdit) {
                    controlButtons += `
                        <button onclick="openEditProductModal(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.description.replace(/'/g, "\\'")}')" 
                                style="flex:1; background:#f0f2f5; border:1px solid #ddd; padding:8px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px;">Modifier</button>
                    `;
                }
                
                controlButtons += `
                        <button onclick="deleteProduct(${p.id})" 
                                style="flex:1; background:#ffebeb; color:red; border:1px solid #ffcccc; padding:8px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px;">Supprimer</button>
                    </div>`;
            }

            return `
            <div class="panel" style="padding:0; overflow:hidden; position:relative;">
                ${isAdmin && !isSeller ? '<span style="position:absolute; top:10px; right:10px; background:red; color:white; font-size:10px; padding:2px 6px; border-radius:5px; font-weight:bold;">MODERATION</span>' : ''}
                <img src="/static/uploads/${p.image_url}" style="width:100%; height:180px; object-fit:cover; background:#eee;">
                <div style="padding:15px;">
                    <h4 style="margin:0">${p.title}</h4>
                    <p style="color:#28a745; font-weight:bold; font-size:18px; margin:5px 0;">${p.price} Euro</p>
                    <p style="font-size:12px; color:#666; height:40px; overflow:hidden;">${p.description}</p>
                    <small>Vendeur : ${p.prenom}</small>
                    
                    <button class="pill-btn" style="width:100%; margin-top:10px; padding:10px; font-size:14px; background:var(--ink); color:var(--brand);" onclick="window.showToast('Fonctionnalite bientot disponible', 'info')">Contacter</button>
                    
                    ${controlButtons}
                </div>
            </div>`;
        }).join('');
    };

    // 3. SUPPRIMER UN PRODUIT
    window.deleteProduct = async (productId) => {
        const confirmed = await window.showConfirm("Voulez-vous vraiment supprimer cette annonce ?");
        if (!confirmed) return;
        
        const res = await fetch(`/api/products/${productId}?user_id=${currentUser.id}&user_role=${currentUser.role}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            window.showToast("Annonce supprimee.");
            loadProducts();
        } else {
            window.showToast("Erreur lors de la suppression.", "error");
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
            user_role: currentUser.role, 
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
            window.showToast("Annonce mise a jour !");
            loadProducts();
        } else {
            const errorData = await res.json();
            window.showToast(errorData.erreur || "Erreur lors de la modification.", "error");
        }
    };

    // Initialisation
    loadProducts();
}