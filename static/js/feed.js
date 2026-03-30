import { API_URL, authState } from './api.js';

export async function loadFeedPosts() {
    try {
        const res = await fetch(`${API_URL}/feed`);
        const data = await res.json();
        const feedList = document.getElementById('feedList');
        feedList.innerHTML = '';
        
        data.posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'feed-item';
            div.dataset.type = "campus";
            div.innerHTML = `${post.content}<span class="meta">Auteur ID: ${post.user_id} - ${new Date(post.created_at).toLocaleString()}</span>`;
            feedList.appendChild(div);
        });
    } catch (e) {}
}

export function initFeed() {
    loadFeedPosts(); 

    document.getElementById('postForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!authState.currentUser) { alert("Veuillez vous connecter d'abord !"); return; }
        
        const message = document.getElementById('postMessage').value.trim();
        if (!message) return;

        try {
            await fetch(`${API_URL}/feed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: authState.currentUser.id, content: message })
            });
            event.target.reset();
            loadFeedPosts(); 
        } catch (e) {}
    });

    const feedTabs = document.querySelectorAll('#feed .tab');
    const feedList = document.getElementById('feedList');

    feedTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            feedTabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            Array.from(feedList.children).forEach((item) => {
                item.style.display = filter === 'all' || item.dataset.type === filter ? 'block' : 'none';
            });
        });
    });
}