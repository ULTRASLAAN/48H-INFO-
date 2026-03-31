import { currentUser } from './auth.js';
export function initChat() {
    const chatForm = document.getElementById('chatForm');
    const chatText = document.getElementById('chatText');
    const chatList = document.getElementById('chatList');
    const btnSend = document.getElementById('btnChatSend');
    // ACTIVER LE CHAT
    if (currentUser) {
        if (chatText) chatText.disabled = false;
        if (btnSend) btnSend.disabled = false;
        if (chatText) chatText.placeholder = "Écrire dans #général...";
    }
    // CHARGER LES MESSAGES
    async function loadMessages() {
        if (!chatList) return;
        try {
            const res = await fetch('/api/chat/general');
            const data = await res.json();
            chatList.innerHTML = data.messages.map(m => {
                const isMe = currentUser && m.sender_id === currentUser.id;
                return `
                    <div style="display: flex; flex-direction: column; align-items: ${isMe ? 'flex-end' : 'flex-start'}; margin-bottom: 12px;">
                        <small style="color: #999; font-size: 11px; margin: 0 5px;">${m.sender_name}</small>
                        <div style="background: ${isMe ? '#00ff99' : '#fff'}; color: #000; padding: 12px 16px; border-radius: 18px; border: ${isMe ? 'none' : '1px solid #eee'}; max-width: 70%; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-size: 14px;">
                            ${m.content}
                        </div>
                    </div>`;
            }).join('');
            chatList.scrollTop = chatList.scrollHeight;
        } catch (e) { console.error("Erreur chargement chat:", e); }
    }
    // ENVOYER LE MESSAGE
    if (chatForm) {
        chatForm.onsubmit = async (e) => {
            e.preventDefault();
            const msg = chatText.value.trim();
            if (!msg || !currentUser) {
                console.log("Envoi impossible: message vide ou non connecté");
                return;
            }
            console.log("Envoi du message par:", currentUser.prenom);
            try {
                const res = await fetch('/api/chat/general', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sender_id: currentUser.id,
                        content: msg
                    })
                });
                if (res.ok) {
                    chatText.value = '';
                    loadMessages();
                } else {
                    const errorData = await res.json();
                    alert("Erreur: " + errorData.erreur);
                }
            } catch (err) { console.error("Erreur envoi message:", err); }
        };
    }
    // DÉMARRAGE
    loadMessages();
    setInterval(loadMessages, 3000); // Rafraîchir toutes les 3s
}