// Charge et affiche les articles depuis les fichiers Markdown du dossier /blog
async function loadBlogPosts() {
    const container = document.getElementById('blog-container');
    
    try {
    // Récupère l'index des articles généré automatiquement
    const response = await fetch('blog/index.json');
    
    if (!response.ok) {
        showEmpty(container);
        return;
    }

    const posts = await response.json();
    const published = posts
        .filter(p => p.published !== false)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (published.length === 0) {
        showEmpty(container);
        return;
    }

    container.className = 'blog-grid';
    container.innerHTML = published.map(post => buildCard(post)).join('');

    } catch (e) {
    showEmpty(container);
    }
}

function buildCard(post) {
    const date = new Date(post.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
    });

    const cover = post.cover_image
    ? `<img src="${post.cover_image}" alt="${post.title}" class="blog-card-cover">`
    : `<div class="blog-card-cover-placeholder"><i class="fas fa-heart"></i></div>`;

    return `
    <article class="blog-card">
        ${cover}
        <div class="blog-card-body">
        <p class="blog-card-date"><i class="fas fa-calendar-alt" style="margin-right:5px;"></i>${date}</p>
        <h2 class="blog-card-title">${post.title}</h2>
        <p class="blog-card-excerpt">${post.excerpt || ''}</p>
        <a href="/blog/${post.slug}.html" class="blog-card-link">
            Voir l'article <i class="fas fa-arrow-right"></i>
        </a>
        </div>
    </article>`;
}

function showEmpty(container) {
    container.className = 'blog-empty';
    container.innerHTML = `
    <p style="font-size:1.1rem; font-weight:600; color: var(--color-text-dark);">Les premiers articles arrivent bientôt</p>
    <p>Nadine partagera ici des ressources et des réflexions sur le deuil périnatal.</p>`;
}

loadBlogPosts();