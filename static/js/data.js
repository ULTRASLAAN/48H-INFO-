// Store data for chat channels
const chatData = {
    entraide: [
        { author: 'Nadia', text: 'Quelqu un a les notes de stat inferentielle ?' },
        { author: 'Ilyes', text: 'Oui je partage le resume dans 10 min.' }
    ],
    logement: [
        { author: 'Mehdi', text: 'Studio dispo a 8 min du campus, MP si interesse.' }
    ],
    job: [
        { author: 'Sami', text: 'Startup cherche dev front 2 jours/semaine.' }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { chatData };
}
