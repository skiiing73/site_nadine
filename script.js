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
                content.style.padding = '0';
            } else {
                // Fermer tous les autres accordéons
                document.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(otherHeader => {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    const otherContent = document.getElementById(otherHeader.getAttribute('data-target'));
                    otherContent.style.maxHeight = '0';
                    otherContent.style.padding = '0';
                });

                // Ouvrir l'accordéon cliqué
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 30 + 'px';
                content.style.padding = 'var(--space-sm) 0 var(--space-sm) 0'; 
            }
        });
    });

    // ------------------------------------
    // 2. SCROLL FLUIDE
    // ------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    // ------------------------------------
    // 3. SMART HEADER (Apparaît au scroll-up)
    // ------------------------------------
    const header = document.querySelector('.main-header');
    if (header) { // S'assurer que l'élément existe
        let lastScrollTop = 0; 
        const scrollThreshold = 50;

        window.addEventListener('scroll', () => {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight + scrollThreshold) {
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } 
            
            else if (currentScroll < lastScrollTop) {
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            } 
            
            else if (currentScroll <= scrollThreshold) {
                 header.classList.remove('scroll-down');
                 header.classList.add('scroll-up');
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
        });
                header.classList.add('scroll-up');
    }
});