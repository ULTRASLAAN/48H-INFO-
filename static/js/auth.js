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
    // 1. VERIFICATION DE LA SESSION (RESTER CONNECTÉ)
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
                    saveSession(data.user);
                    loginModal.style.display = 'none';
                } else {
                    alert(data.erreur || "Identifiants incorrects");
                }
            } catch (err) {
                console.error("Erreur login:", err);
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
                cursus: "Étudiant Ynov"
            };
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });
                if (res.ok) {
                    alert("Compte créé ! Connectez-vous maintenant.");
                    registerForm.reset();
                } else {
                    const data = await res.json();
                    alert(data.erreur || "Erreur lors de l'inscription");
                }
            } catch (err) {
                console.error("Erreur register:", err);
            }
        };
    }
    // 5. LOGIQUE DE DÉCONNEXION
    if (btnLogout) {
        btnLogout.onclick = () => {
            localStorage.removeItem('userSession');
            window.location.reload();
        };
    }
}
/**
 * Sauvegarde l'utilisateur en local et met à jour l'UI
 */
function saveSession(user) {
    currentUser = user;
    localStorage.setItem('userSession', JSON.stringify(user));
    updateUI(user);
    // On recharge pour activer les scripts de chat qui dépendent de currentUser
    window.location.reload();
}
/**
 * Met à jour les éléments visuels de la page selon l'utilisateur
 */
function updateUI(user) {
    document.body.classList.add('logged-in');
    // Header
    const nameEl = document.getElementById('accountName');
    const chip = document.getElementById('accountChip');
    const openBtn = document.getElementById('openLoginBtn');
    if (nameEl) nameEl.textContent = user.prenom;
    if (chip) chip.style.display = 'flex';
    if (openBtn) openBtn.style.display = 'none';
    // Formulaire de post (Accueil)
    const postForm = document.getElementById('postForm');
    if (postForm) postForm.style.display = 'block';
    // Déblocage du Chat
    const chatText = document.getElementById('chatText');
    const btnChatSend = document.getElementById('btnChatSend');
    if (chatText) {
        chatText.disabled = false;
        chatText.placeholder = "Écrire un message...";
    }
    if (btnChatSend) btnChatSend.disabled = false;
    // Remplissage auto du profil
    const editPrenom = document.getElementById('editPrenom');
    const editNom = document.getElementById('editNom');
    const editCursus = document.getElementById('editCursus');
    const editBio = document.getElementById('editBio');
    if (editPrenom) editPrenom.value = user.prenom || "";
    if (editNom) editNom.value = user.nom || "";
    if (editCursus) editCursus.value = user.cursus || "";
    if (editBio) editBio.value = user.bio || "";
}