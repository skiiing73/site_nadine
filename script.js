document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 1. GESTION DE L'ACCORDÉON (FAQ)
    // ------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const contentId = header.getAttribute('data-target');
            const content = document.getElementById(contentId);
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Fermer l'accordéon s'il est déjà ouvert
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
                content.style.padding = '0'; // Réinitialiser le padding
            } else {
                // Fermer tous les autres accordéons (optionnel, pour une meilleure UX)
                document.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(otherHeader => {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    const otherContent = document.getElementById(otherHeader.getAttribute('data-target'));
                    otherContent.style.maxHeight = '0';
                    otherContent.style.padding = '0';
                });

                // Ouvrir l'accordéon cliqué
                header.setAttribute('aria-expanded', 'true');
                // max-height doit être une valeur supérieure à la hauteur réelle du contenu
                content.style.maxHeight = content.scrollHeight + 30 + 'px'; // +30 pour le padding
                content.style.padding = 'var(--space-sm) 0 var(--space-sm) 0'; 
            }
        });
    });

    // ------------------------------------
    // 2. SCROLL FLUIDE (si besoin)
    // ------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // S'assurer que le lien n'est pas un lien d'action (comme les boutons d'appel)
            if (this.getAttribute('href') !== "#") {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});