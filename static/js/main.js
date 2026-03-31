import { initStudentAccount } from './auth.js';
import { initFeed } from './feed.js';
import { initNews } from './news.js';
import { initChat } from './chat.js';
import { initMarketplace } from './market.js';
import { initYmatch } from './ymatch.js';
import { initProfile } from './profile.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Demarrage des modules...");
    
    initStudentAccount();
    initFeed();
    initNews();
    initChat();
    initMarketplace();
    initYmatch();
    initProfile();
});

window.showPage = function(pageId) {
    // 1. Cacher toutes les sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // 2. Afficher la bonne section
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    // 3. Mettre a jour les liens du menu (le trait vert)
    document.querySelectorAll('.nav a').forEach(a => {
        if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(`'${pageId}'`)) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
};