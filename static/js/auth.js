import { API_URL, authState, setCurrentUser } from './api.js';

export function initStudentAccount() {
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

    function renderAccount(user) {
        if (!user) {
            openLoginBtn.hidden = false;
            accountChip.hidden = true;
            return;
        }
        openLoginBtn.hidden = true;
        accountChip.hidden = false;
        accountName.textContent = user.cursus ? `Etudiant - ${user.cursus}` : "Etudiant";
        accountEmail.textContent = user.email;
        accountAvatar.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80&auto=format&fit=crop';
    }

    function closeLoginModal() {
        loginModal.hidden = true;
        loginModal.style.display = 'none';
        loginForm.reset();
        if (loginMessage) loginMessage.textContent = '';
    }

    openLoginBtn.addEventListener('click', () => {
        loginModal.hidden = false;
        loginModal.style.display = 'grid';
    });

    if (closeLoginBtn) closeLoginBtn.addEventListener('click', (e) => { e.preventDefault(); closeLoginModal(); });
    if (logoutBtn) logoutBtn.addEventListener('click', () => { setCurrentUser(null); renderAccount(null); });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                setCurrentUser({ id: data.id || 1, email: data.email, cursus: data.cursus });
                renderAccount(authState.currentUser);
                closeLoginModal();
            } else {
                loginMessage.textContent = data.erreur || "Erreur de connexion";
            }
        } catch (e) {
            loginMessage.textContent = "Serveur inaccessible.";
        }
    });
}