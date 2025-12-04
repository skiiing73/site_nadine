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
document.addEventListener('DOMContentLoaded', () => {
    // ... (votre code existant pour l'accordéon et le scroll fluide) ...

    // ------------------------------------
    // 3. SMART HEADER (Apparaît au scroll-up)
    // ------------------------------------
    const header = document.querySelector('.main-header');
    if (header) { // S'assurer que l'élément existe
        let lastScrollTop = 0; // Stocker la position de défilement précédente
        const scrollThreshold = 50; // Distance minimale de défilement pour déclencher le masquage/affichage

        window.addEventListener('scroll', () => {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            // Logique de masquage : Scroll vers le bas (Down)
            if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight + scrollThreshold) {
                // Défilement vers le bas ET nous sommes au-delà de la zone supérieure
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } 
            
            // Logique d'affichage : Scroll vers le haut (Up)
            else if (currentScroll < lastScrollTop) {
                // Défilement vers le haut
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            } 
            
            // Logique d'affichage initial : Toujours visible en haut de la page
            else if (currentScroll <= scrollThreshold) {
                 header.classList.remove('scroll-down');
                 header.classList.add('scroll-up');
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Mettre à jour la dernière position
        });
        
        // Assurer que le header est visible au chargement de la page
        header.classList.add('scroll-up');
    }
});