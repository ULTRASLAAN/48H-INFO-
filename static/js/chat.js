export function initChat() {
    let currentChannel = 'entraide';
    const channels = document.querySelectorAll('#channels button');
    const chatList = document.getElementById('chatList');

    function renderChat() {
        chatList.innerHTML = '';
        if(typeof chatData !== 'undefined' && chatData[currentChannel]){
            chatData[currentChannel].forEach((msg) => {
                const row = document.createElement('div');
                row.className = 'chat-item';
                row.innerHTML = `<strong>${msg.author}</strong><span class="meta">${msg.text}</span>`;
                chatList.appendChild(row);
            });
        }
    }

    channels.forEach((button) => {
        button.addEventListener('click', () => {
            channels.forEach((b) => b.classList.remove('active'));
            button.classList.add('active');
            currentChannel = button.dataset.channel;
            renderChat();
        });
    });

    const chatForm = document.getElementById('chatForm');
    if(chatForm) {
        chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const author = document.getElementById('chatAuthor').value.trim();
            const text = document.getElementById('chatText').value.trim();
            if (author && text && chatData[currentChannel]) {
                chatData[currentChannel].push({ author, text });
                event.target.reset();
                renderChat();
            }
        });
    }
    renderChat();
}