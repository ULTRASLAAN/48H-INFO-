import { currentUser } from './auth.js';

export function initProfile() {
    // Les conteneurs des états
    const viewState = document.getElementById('profileViewState');
    const editState = document.getElementById('profileEditForm');
    
    // Les boutons de bascule
    const btnSwitchToEdit = document.getElementById('btnSwitchToEdit');
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    const btnLogout = document.getElementById('btnLogout');

    // Les éléments de la vue (Lecture)
    const viewFullName = document.getElementById('viewFullName');
    const viewCursus = document.getElementById('viewCursus');
    const viewBio = document.getElementById('viewBio');
    const viewSkills = document.getElementById('viewSkills');

    // Les inputs de l'édition
    const editPrenom = document.getElementById('editPrenom');
    const editNom = document.getElementById('editNom');
    const editCursus = document.getElementById('editCursus');
    const editBio = document.getElementById('editBio');
    const editSkills = document.getElementById('editSkills');
    
    // IA
    const btnScanCV = document.getElementById('btnScanCV');
    const editCV = document.getElementById('editCV');

    // 1. FONCTION POUR METTRE À JOUR L'AFFICHAGE LECTURE
    function updateView() {
        if (!currentUser) return;
        
        viewFullName.textContent = `${currentUser.prenom || ''} ${currentUser.nom || ''}`;
        viewCursus.textContent = currentUser.cursus || 'Étudiant Ynov';
        viewBio.textContent = currentUser.bio || "Aucune bio renseignée.";
        
        if (currentUser.skills) {
            const rawSkills = currentUser.skills.replace(/-/g, '').split(/,|\n/).map(s => s.trim()).filter(s => s.length > 0);
            viewSkills.innerHTML = rawSkills.map(skill => 
                `<span style="background:var(--brand); color:var(--ink); padding:4px 10px; border-radius:50px; font-size:12px; font-weight:bold;">${skill}</span>`
            ).join('');
        } else {
            viewSkills.innerHTML = '<span style="color:var(--soft); font-size:12px;">Aucune compétence scannée.</span>';
        }

        editPrenom.value = currentUser.prenom || '';
        editNom.value = currentUser.nom || '';
        editCursus.value = currentUser.cursus || '';
        editBio.value = currentUser.bio || '';
        editSkills.value = currentUser.skills || '';
    }

    // 2. BASCULES D'ÉTAT
    if (btnSwitchToEdit) {
        btnSwitchToEdit.onclick = () => {
            viewState.style.display = 'none';
            editState.style.display = 'grid';
        };
    }
    if (btnCancelEdit) {
        btnCancelEdit.onclick = () => {
            editState.style.display = 'none';
            viewState.style.display = 'block';
            updateView();
        };
    }

    // 3. SAUVEGARDE DU PROFIL
    if (editState) {
        editState.onsubmit = async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            let formattedSkills = editSkills.value;
            if (formattedSkills && !formattedSkills.includes('- ')) {
                formattedSkills = formattedSkills.split(',').map(s => `- ${s.trim()}`).join('\n');
            }

            const updatedData = {
                id: currentUser.id,
                prenom: editPrenom.value,
                nom: editNom.value,
                cursus: editCursus.value,
                bio: editBio.value,
                skills: formattedSkills
            };

            try {
                const res = await fetch('/api/profile/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                });
                
                if (res.ok) {
                    Object.assign(currentUser, updatedData);
                    localStorage.setItem('userSession', JSON.stringify(currentUser));
                    
                    editState.style.display = 'none';
                    viewState.style.display = 'block';
                    updateView();
                    
                    document.getElementById('accountName').textContent = currentUser.prenom;
                } else {
                    alert("Erreur lors de la mise à jour");
                }
            } catch (err) { console.error("Erreur de mise à jour:", err); }
        };
    }

    // 4. SCAN DU CV VIA GEMINI
    if (btnScanCV && editCV) {
        btnScanCV.onclick = async () => {
            if (!editCV.files.length) return alert("Veuillez sélectionner un CV.");
            
            const file = editCV.files[0];
            const reader = new FileReader();

            reader.onload = async (e) => {
                const base64Data = e.target.result.split(',')[1];
                btnScanCV.innerHTML = "⏳ Analyse Gemini en cours...";
                btnScanCV.disabled = true;

                try {
                    const res = await fetch('/api/ai/scan-cv', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ file_b64: base64Data, mime_type: file.type || "application/pdf" })
                    });
                    const data = await res.json();
                    
                    if (res.ok) {
                        const formattedList = data.skills.split(',').map(s => `- ${s.trim()}`).join('\n');
                        if (editSkills) editSkills.value = formattedList;
                        btnScanCV.innerHTML = "✅ CV Analysé avec succès !";
                    } else {
                        alert("Erreur IA: " + data.erreur);
                        btnScanCV.innerHTML = "✨ Scanner mon CV avec Gemini";
                    }
                } catch (err) { console.error(err); } 
                finally { btnScanCV.disabled = false; }
            };
            reader.readAsDataURL(file);
        };
    }

    if (currentUser) updateView();
}