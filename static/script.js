document.addEventListener("DOMContentLoaded", () => {
    // Fonction de vérification sécurisée
    const getElement = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Élément #${id} introuvable`);
            return null;
        }
        return element;
    };

    // Récupération des éléments avec vérification
    const elements = {
        fileInput: getElement('file'),
        analyzeBtn: getElement('analyze-btn'),
        refreshBtn: getElement('refresh-btn'),
        resultSection: getElement('result')
    };

    // Vérification finale
    if (Object.values(elements).some(el => el === null)) {
        console.error("Éléments manquants - arrêt de l'initialisation");
        return;
    }

    // Initialisation des événements
    elements.fileInput.addEventListener('change', () => {
        elements.analyzeBtn.disabled = !elements.fileInput.files.length;
    });

    elements.analyzeBtn.addEventListener('click', async () => {
        // Votre code d'analyse ici
    });

    elements.refreshBtn.addEventListener('click', () => {
        // Votre code de rafraîchissement ici
    });

    console.log("Application initialisée avec succès");
});
