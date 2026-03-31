import { currentUser } from './auth.js';

/**
 * Initialisation du fil d'actualite
 */
export function initFeed() {
    const postForm = document.getElementById('postForm');
    const feedList = document.getElementById('feedList');

    // 1. Charger les messages existants au demarrage
    loadPosts();

    // 2. Verifier si on doit afficher le formulaire de publication
    // (Utile si on arrive sur la page en etant deja connecte via localStorage)
    if (currentUser && postForm) {
        postForm.style.display = 'block';
    }

    // 3. Gestion de l'envoi d'un nouveau post
    if (postForm) {
        postForm.onsubmit = async (e) => {
            e.preventDefault();

            // Securite : On verifie qu'Armand est bien connecte
            if (!currentUser) {
                alert("Vous devez etre connecte pour publier.");
                return;
            }

            const content = document.getElementById('postMessage').value.trim();
            if (!content) return;

            try {
                const res = await fetch('/api/feed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: currentUser.id,
                        content: content
                    })
                });

                if (res.ok) {
                    // On vide le champ texte
                    document.getElementById('postMessage').value = '';
                    // On recharge la liste pour voir le nouveau message en haut
                    loadPosts();
                } else {
                    const data = await res.json();
                    alert("Erreur : " + (data.erreur || "Impossible de publier"));
                }
            } catch (err) {
                console.error("Erreur reseau feed:", err);
            }
        };
    }
}

/**
 * Recupere les posts depuis la base de donnees et les affiche
 */
async function loadPosts() {
    const feedList = document.getElementById('feedList');
    if (!feedList) return;

    try {
        const res = await fetch('/api/feed');
        const data = await res.json();

        if (!data.posts || data.posts.length === 0) {
            feedList.innerHTML = '<p style="text-align:center; color:#999;">Aucun message pour le moment.</p>';
            return;
        }

        // On genere le HTML pour chaque post
        feedList.innerHTML = data.posts.map(post => `
            <div class="panel" style="padding:20px; margin-bottom:15px; border-left: 5px solid #00ff99; background: #fff;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:35px; height:35px; background:#f0f2f5; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px; color:#555;">
                            ${post.author_name.charAt(0).toUpperCase()}
                        </div>
                        <strong style="color:#333;">${post.author_name}</strong>
                    </div>
                    <span style="font-size:11px; color:#aaa;">
                        ${formatDate(post.created_at)}
                    </span>
                </div>
                <p style="margin:0; line-height:1.5; color:#444; white-space: pre-wrap;">${post.content}</p>
            </div>
        `).join('');

    } catch (err) {
        console.error("Erreur lors du chargement du fil d'actualite:", err);
        feedList.innerHTML = '<p style="color:red;">Erreur de chargement du fil.</p>';
    }
}

/**
 * Utilitaire pour formater la date proprement
 */
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}