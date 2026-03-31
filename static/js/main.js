import { initStudentAccount } from './auth.js';
import { initFeed } from './feed.js';
import { initNews } from './news.js';
import { initChat } from './chat.js';
import { initMarketplace } from './market.js';
import { initYmatch } from './ymatch.js';
import { initProfile } from './profile.js';

document.addEventListener('DOMContentLoaded', () => {
    initStudentAccount();
    initFeed();
    initNews();
    initChat();
    initMarketplace();
    initYmatch();
    initProfile();
});

// SYSTEME DE NOTIFICATIONS GLOBAL
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// SYSTEME DE CONFIRMATION GLOBAL
window.showConfirm = function(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmModal');
        const msgEl = document.getElementById('confirmMessage');
        const btnYes = document.getElementById('btnConfirmYes');
        const btnNo = document.getElementById('btnConfirmNo');

        if (!modal) return resolve(false);

        msgEl.innerText = message;
        modal.style.display = 'flex';

        btnYes.onclick = () => {
            modal.style.display = 'none';
            resolve(true);
        };

        btnNo.onclick = () => {
            modal.style.display = 'none';
            resolve(false);
        };
    });
};

window.showPage = function(pageId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav a').forEach(a => {
        if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(`'${pageId}'`)) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
};