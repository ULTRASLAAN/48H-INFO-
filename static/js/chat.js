import { currentUser } from './auth.js';

let lastMessageId = 0; 
let currentGroupId = 0;
let currentReceiverId = null;
let pollInterval = 2000;
let chatTimer = null;

export function initChat() {
    const chatList = document.getElementById('chatList');
    const chatForm = document.getElementById('chatForm');
    const chatText = document.getElementById('chatText');
    const btnSend = document.getElementById('btnChatSend');
    const chatHeader = document.getElementById('chatHeader');
    const contactList = document.getElementById('contactList');
    const groupsList = document.getElementById('groupsList');
    
    // GESTION DU CSS ACTIF
    function setActiveChannel(targetElement) {
        document.querySelectorAll('.channel-item').forEach(el => {
            el.style.background = '#f0f2f5';
            el.style.borderColor = '#ddd';
            el.style.color = 'var(--ink)';
        });
        if (targetElement) {
            targetElement.style.background = 'rgba(0, 255, 156, 0.08)';
            targetElement.style.borderColor = '#00ff99';
            targetElement.style.color = '#000';
        }
    }

    // FONCTION DE BASCULE DE SALON
    window.switchChat = (element, groupId, receiverId, displayName) => {
        setActiveChannel(element);
        currentGroupId = groupId;
        currentReceiverId = receiverId;
        lastMessageId = 0;
        
        if (chatList) chatList.innerHTML = '';
        if (chatHeader) chatHeader.innerText = receiverId ? `Privé : ${displayName}` : `# ${displayName}`;
        if (chatText) chatText.placeholder = `Écrire à ${displayName}...`;
        
        clearTimeout(chatTimer);
        loadMessages();
    };

    // RENDRE LE GÉNÉRAL CLIQUABLE 
    const btnGeneral = document.getElementById('btnGeneralChat');
    if (btnGeneral) {
        btnGeneral.classList.add('channel-item');
        btnGeneral.onclick = function() {
            switchChat(this, 0, null, 'Chat Général');
        };
    }

    // CHARGER LA LISTE DES AMIS 
    async function loadMyFriends() {
        if (!currentUser || !contactList) return;
        try {
            const res = await fetch(`/api/friends/list?user_id=${currentUser.id}`);
            const data = await res.json();
            if (data.friends) {
                contactList.innerHTML = data.friends.map(f => `
                    <div class="channel-item" onclick="switchChat(this, null, ${f.id}, '${f.prenom} ${f.nom}')" 
                         style="padding:10px; border-radius:10px; border:1px solid #ddd; background:#f0f2f5; font-size:13px; font-weight:bold; cursor:pointer; margin-bottom:5px; transition:0.2s;">
                        ${f.prenom} ${f.nom}
                    </div>
                `).join('');
            }
        } catch(e) { console.error(e); }
    }

    // CHARGER LA LISTE DES GROUPES (Avec clic)
    async function loadMyGroups() {
        if (!currentUser || !groupsList) return;
        try {
            const res = await fetch(`/api/groups?user_id=${currentUser.id}`);
            const data = await res.json();
            if (data.groups) {
                groupsList.innerHTML = data.groups.map(g => `
                    <div class="channel-item" onclick="switchChat(this, ${g.id}, null, '${g.name}')" 
                         style="background:#f0f2f5; padding:10px; border-radius:10px; border:1px solid #ddd; cursor:pointer; font-weight:bold; font-size:13px; margin-bottom:5px; transition:0.2s;">
                        ${g.name}
                    </div>
                `).join('');
            }
        } catch (e) { console.error(e); }
    }

    // CHARGEMENT DES MESSAGES (Privé ou Groupe)
    async function loadMessages() {
        if (!chatList || !currentUser) return;
        try {
            const queryParams = new URLSearchParams({
                user_id: currentUser.id,
                last_id: lastMessageId
            });
            if (currentReceiverId) queryParams.append('receiver_id', currentReceiverId);
            else queryParams.append('group_id', currentGroupId);

            const res = await fetch(`/api/chat/messages?${queryParams.toString()}`);
            const data = await res.json();
            
            if (data.messages && data.messages.length > 0) {
                const isAtBottom = chatList.scrollHeight - chatList.scrollTop <= chatList.clientHeight + 50;
                data.messages.forEach(m => {
                    const isMe = m.sender_id === currentUser.id;
                    const html = `
                        <div style="display: flex; flex-direction: column; align-items: ${isMe ? 'flex-end' : 'flex-start'}; margin-bottom: 12px;">
                            <small style="color: #999; font-size: 11px; margin: 0 5px;">${m.sender_name}</small>
                            <div style="background: ${isMe ? 'var(--brand)' : 'var(--bg)'}; color: var(--ink); padding: 12px 18px; border-radius: 18px; border: ${isMe ? 'none' : '1px solid var(--line)'}; max-width: 75%; font-size: 14px;">
                                ${m.content}
                            </div>
                        </div>`;
                    chatList.insertAdjacentHTML('beforeend', html);
                    if (m.id > lastMessageId) lastMessageId = m.id;
                });
                if (isAtBottom) chatList.scrollTop = chatList.scrollHeight;
                
                pollInterval = 2000; 
            } else {
                pollInterval = Math.min(pollInterval + 2000, 15000); 
            }
        } catch (e) { console.error("Erreur chat:", e); }
        
        chatTimer = setTimeout(loadMessages, pollInterval);
    }

    // ENVOI D'UN MESSAGE
    if (chatForm) {
        chatForm.onsubmit = async (e) => {
            e.preventDefault();
            const content = chatText.value.trim();
            if (!content || !currentUser) return;
            
            const payload = { sender_id: currentUser.id, content: content };
            if (currentReceiverId) payload.receiver_id = currentReceiverId;
            else payload.group_id = currentGroupId;

            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                chatText.value = '';
                clearTimeout(chatTimer);
                loadMessages();
            }
        };
    }

    const btnAddFriend = document.getElementById('btnAddFriend');
    const btnCreateGroup = document.getElementById('btnCreateGroup');
    const btnConfirmAddFriend = document.getElementById('btnConfirmAddFriend');
    const btnConfirmCreateGroup = document.getElementById('btnConfirmCreateGroup');
    const area = document.getElementById('friendRequestsArea');
    const list = document.getElementById('requestsList');

    if (currentUser && chatText && btnSend) {
        chatText.disabled = false;
        btnSend.disabled = false;
    }

    if (btnAddFriend) btnAddFriend.onclick = () => document.getElementById('friendModal').style.display = 'flex';
    
    if (btnCreateGroup) {
        btnCreateGroup.onclick = async () => {
            document.getElementById('groupModal').style.display = 'flex';
            const checklist = document.getElementById('groupFriendsChecklist');
            try {
                const res = await fetch(`/api/friends/list?user_id=${currentUser.id}`);
                const data = await res.json();
                if (checklist && data.friends) {
                    checklist.innerHTML = data.friends.map(f => `
                        <label style="display:flex; align-items:center; gap:10px; padding:5px 0; font-size:13px; cursor:pointer;">
                            <input type="checkbox" class="friend-checkbox" value="${f.id}"> ${f.prenom} ${f.nom}
                        </label>
                    `).join('');
                }
            } catch (e) {}
        };
    }

    if (btnConfirmAddFriend) {
        btnConfirmAddFriend.onclick = async () => {
            const email = document.getElementById('friendEmail').value.trim();
            if (!email) return;
            await fetch('/api/friends/request', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ user_id: currentUser.id, friend_email: email })
            });
            document.getElementById('friendModal').style.display = 'none';
        };
    }

    if (btnConfirmCreateGroup) {
        btnConfirmCreateGroup.onclick = async () => {
            const name = document.getElementById('groupNameInput').value.trim();
            const friends = Array.from(document.querySelectorAll('.friend-checkbox:checked')).map(cb => cb.value);
            if (!name) return;
            await fetch('/api/groups/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ user_id: currentUser.id, name: name, friend_ids: friends })
            });
            document.getElementById('groupModal').style.display = 'none';
            loadMyGroups();
        };
    }

    if (chatList) chatList.innerHTML = '';
    loadMyFriends();
    loadMyGroups();
    loadMessages();
    
    if (btnGeneral) setActiveChannel(btnGeneral);
}