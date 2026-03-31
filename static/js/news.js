export async function initNews() {
    const newsList = document.getElementById('newsList');
    if (!newsList) return;

    try {
        const res = await fetch('/api/news');
        const data = await res.json();
        
        // On s'adapte au format de ton backend (soit data.news soit data directement)
        const news = data.news || data;

        newsList.innerHTML = news.map(item => `
            <div class="news-item-box">
                <h4 style="margin: 0; font-size: 14px;">${item.title}</h4>
                <p style="margin: 5px 0 0; font-size: 12px; line-height:1.4;">${item.content}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error("Erreur News:", err);
    }
}