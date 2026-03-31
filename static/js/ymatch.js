import { API_URL, authState } from './api.js';

export async function initYmatch() {
    const jobList = document.getElementById('jobList');
    const jobSearch = document.getElementById('jobSearch');
    const cursusFilter = document.getElementById('jobCursusFilter');

    async function loadJobs() {
        try {
            const res = await fetch(`${API_URL}/jobs`);
            const data = await res.json();
            renderJobs(data.jobs || []);
        } catch (e) {
            console.error("Erreur Ymatch:", e);
        }
    }

    function renderJobs(jobs) {
        if (!jobList) return;
        jobList.innerHTML = jobs.map(job => `
            <div class="panel" style="padding:20px; border-left: 5px solid #007bff;">
                <h4 style="margin:0;">${job.title}</h4>
                <strong style="color:#666;">${job.company}</strong>
                <p style="font-size:14px; margin:10px 0;">${job.description}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="tag">${job.target_cursus || 'Tous cursus'}</span>
                    <button class="btn btn-primary btn-sm" onclick="alert('Candidature envoyée !')">Postuler</button>
                </div>
            </div>
        `).join('');
    }

    // Lancement
    loadJobs();
}