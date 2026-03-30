import { initStudentAccount } from './auth.js';
import { initFeed } from './feed.js';
import { initChat } from './chat.js';
import { initMarketplacePages, initAchatStore } from './market.js';

function showPage(pageName) {
    const hero = document.getElementById('home');
    const detailSections = document.querySelectorAll('main > section.section');
    detailSections.forEach((section) => section.classList.remove('active'));

    if (pageName === 'home') {
        hero.style.display = 'block';
    } else {
        hero.style.display = 'none';
        const page = document.getElementById(pageName);
        if (page) page.classList.add('active');
    }

    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach((link) => link.classList.toggle('active', link.dataset.page === pageName));
    window.scrollTo(0, 0);
}

function initStatus() {
    const form = document.getElementById('statusForm');
    if(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const text = document.getElementById('statusInput').value.trim();
            if (text) {
                document.getElementById('statusBox').textContent = text;
                event.target.reset();
            }
        });
    }
}

function initGroups() {
    const form = document.getElementById('groupForm');
    if(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('groupName').value.trim();
            const goal = document.getElementById('groupGoal').value.trim();
            if (name && goal) {
                const card = document.createElement('div');
                card.className = 'group-item';
                card.innerHTML = `<h4>${name}</h4><span class="meta">${goal}</span>`;
                document.getElementById('groupList').prepend(card);
                event.target.reset();
            }
        });
    }
}

function initProfile() {
    const form = document.getElementById('profileForm');
    if(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('profileName').value.trim();
            const track = document.getElementById('profileTrack').value.trim();
            const bio = document.getElementById('profileBio').value.trim();
            if (name && track && bio) {
                const profile = document.createElement('div');
                profile.className = 'profile-item';
                profile.innerHTML = `<h4>${name} - ${track}</h4><span class="meta">${bio}</span>`;
                document.getElementById('profileList').prepend(profile);
                event.target.reset();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initStudentAccount();
    initFeed();
    initStatus();
    initChat();
    initGroups();
    initMarketplacePages();
    initAchatStore();
    initProfile();

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[data-page], .btn[data-page]');
        if (link) {
            event.preventDefault();
            const page = link.dataset.page;
            if (page) {
                showPage(page === 'home' ? 'home' : page);
            }
        }
    });

    const logo = document.querySelector('.logo');
    if (logo) logo.addEventListener('click', () => showPage('home'));

    showPage('home');
});