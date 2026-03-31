export let currentUser = null;

/**
 * Initialise toute la logique d'authentification et de session
 */
export function initStudentAccount() {
    const loginModal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLoginBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const btnLogout = document.getElementById('btnLogout');

    // VERIFICATION DES NOTIFICATIONS EN ATTENTE APRES RECHARGEMENT
    const pendingToast = localStorage.getItem('pendingToast');
    if (pendingToast) {
        const { message, type } = JSON.parse(pendingToast);
        // On attend que le DOM soit completement pret avant d'afficher
        setTimeout(() => {
            if (window.showToast) window.showToast(message, type);
        }, 300);
        localStorage.removeItem('pendingToast');
    }

    // 1. VERIFICATION DE LA SESSION (RESTER CONNECTE)
    const savedUser = localStorage.getItem('userSession');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUI(currentUser);
    }

    // 2. OUVERTURE DE LA MODALE
    if (openBtn) {
        openBtn.onclick = () => {
            loginModal.style.display = 'flex';
        };
    }

    // 3. LOGIQUE DE CONNEXION
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    // On prepare la notification pour le prochain chargement
                    localStorage.setItem('pendingToast', JSON.stringify({
                        message: "Connexion reussie",
                        type: "success"
                    }));
                    saveSession(data.user);
                } else {
                    window.showToast(data.erreur || "Identifiants incorrects", "error");
                }
            } catch (err) {
                console.error("Erreur login:", err);
                window.showToast("Erreur de connexion au serveur", "error");
            }
        };
    }

    // 4. LOGIQUE D'INSCRIPTION
    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const newUser = {
                prenom: document.getElementById('regPrenom').value,
                nom: document.getElementById('regNom').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPass').value,
                cursus: "Etudiant Ynov"
            };
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });
                if (res.ok) {
                    window.showToast("Compte cree avec succes. Connectez-vous maintenant.");
                    registerForm.reset();
                } else {
                    const data = await res.json();
                    window.showToast(data.erreur || "Erreur lors de l'inscription", "error");
                }
            } catch (err) {
                console.error("Erreur register:", err);
                window.showToast("Erreur lors de l'inscription", "error");
            }
        };
    }

    // 5. LOGIQUE DE DECONNEXION
    if (btnLogout) {
        btnLogout.onclick = () => {
            localStorage.setItem('pendingToast', JSON.stringify({
                message: "Vous avez ete deconnecte",
                type: "info"
            }));
            localStorage.removeItem('userSession');
            window.location.reload();
        };
    }
}

/**
 * Sauvegarde l'utilisateur en local et recharge la page
 */
function saveSession(user) {
    currentUser = user;
    localStorage.setItem('userSession', JSON.stringify(user));
    // Le rechargement est necessaire pour initialiser les modules dependants (Chat, Profile, etc.)
    window.location.reload();
}

/**
 * Met a jour les elements visuels de la page selon l'utilisateur
 */
function updateUI(user) {
    document.body.classList.add('logged-in');
    
    // Mise a jour du Header
    const nameEl = document.getElementById('accountName');
    const chip = document.getElementById('accountChip');
    const openBtn = document.getElementById('openLoginBtn');
    
    if (nameEl) nameEl.textContent = user.prenom;
    if (chip) chip.style.display = 'flex';
    if (openBtn) openBtn.style.display = 'none';
    
    // Affichage du formulaire de publication (Feed)
    const postForm = document.getElementById('postForm');
    if (postForm) postForm.style.display = 'block';
    
    // Activation des champs de Chat
    const chatText = document.getElementById('chatText');
    const btnChatSend = document.getElementById('btnChatSend');
    if (chatText) {
        chatText.disabled = false;
        chatText.placeholder = "Ecrire un message...";
    }
    if (btnChatSend) btnChatSend.disabled = false;
    
    // Pre-remplissage du formulaire de profil
    const editPrenom = document.getElementById('editPrenom');
    const editNom = document.getElementById('editNom');
    const editCursus = document.getElementById('editCursus');
    const editBio = document.getElementById('editBio');
    
    if (editPrenom) editPrenom.value = user.prenom || "";
    if (editNom) editNom.value = user.nom || "";
    if (editCursus) editCursus.value = user.cursus || "";
    if (editBio) editBio.value = user.bio || "";
}