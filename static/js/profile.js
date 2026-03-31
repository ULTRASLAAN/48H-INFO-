import { currentUser } from './auth.js';

export function initProfile() {
    // Les conteneurs des etats
    const viewState = document.getElementById('profileViewState');
    const editState = document.getElementById('profileEditForm');
    
    // Les boutons de bascule
    const btnSwitchToEdit = document.getElementById('btnSwitchToEdit');
    const btnCancelEdit = document.getElementById('btnCancelEdit');

    // Les elements de la vue (Lecture)
    const viewFullName = document.getElementById('viewFullName');
    const viewCursus = document.getElementById('viewCursus');
    const viewBio = document.getElementById('viewBio');
    const viewSkills = document.getElementById('viewSkills');

    // Les inputs de l'edition
    const editPrenom = document.getElementById('editPrenom');
    const editNom = document.getElementById('editNom');
    const editCursus = document.getElementById('editCursus');
    const editBio = document.getElementById('editBio');
    const editSkills = document.getElementById('editSkills');
    
    // IA
    const btnScanCV = document.getElementById('btnScanCV');
    const editCV = document.getElementById('editCV');

    // 1. FONCTION POUR METTRE A JOUR L'AFFICHAGE LECTURE
    function updateView() {
        if (!currentUser) return;
        
        viewFullName.textContent = `${currentUser.prenom || ''} ${currentUser.nom || ''}`;
        viewCursus.textContent = currentUser.cursus || 'Etudiant Ynov';
        viewBio.textContent = currentUser.bio || "Aucune bio renseignee.";
        
        if (currentUser.skills) {
            const rawSkills = currentUser.skills.replace(/-/g, '').split(/,|\n/).map(s => s.trim()).filter(s => s.length > 0);
            viewSkills.innerHTML = rawSkills.map(skill => 
                `<span style="background:var(--brand); color:var(--ink); padding:4px 10px; border-radius:50px; font-size:12px; font-weight:bold;">${skill}</span>`
            ).join('');
        } else {
            viewSkills.innerHTML = '<span style="color:var(--soft); font-size:12px;">Aucune competence scannee.</span>';
        }

        editPrenom.value = currentUser.prenom || '';
        editNom.value = currentUser.nom || '';
        editCursus.value = currentUser.cursus || '';
        editBio.value = currentUser.bio || '';
        editSkills.value = currentUser.skills || '';
    }

    // 2. BASCULES D'ETAT
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
                    window.showToast("Profil mis a jour avec succes");
                } else {
                    window.showToast("Erreur lors de la mise a jour", "error");
                }
            } catch (err) { 
                console.error("Erreur de mise a jour:", err);
                window.showToast("Erreur de connexion au serveur", "error");
            }
        };
    }

    // 4. SCAN DU CV VIA GEMINI
    if (btnScanCV && editCV) {
        btnScanCV.onclick = async () => {
            if (!editCV.files.length) {
                window.showToast("Veuillez selectionner un CV.", "error");
                return;
            }
            
            const file = editCV.files[0];
            const reader = new FileReader();

            reader.onload = async (e) => {
                const base64Data = e.target.result.split(',')[1];
                btnScanCV.innerHTML = "Analyse Gemini en cours...";
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
                        btnScanCV.innerHTML = "CV Analyse avec succes";
                        window.showToast("Analyse du CV terminee");
                    } else {
                        window.showToast("Erreur IA: " + data.erreur, "error");
                        btnScanCV.innerHTML = "Scanner mon CV avec Gemini";
                    }
                } catch (err) { 
                    console.error(err);
                    window.showToast("Erreur lors de la communication avec l'IA", "error");
                } finally { 
                    btnScanCV.disabled = false; 
                }
            };
            reader.readAsDataURL(file);
        };
    }

    if (currentUser) updateView();
}