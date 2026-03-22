const fs = require('fs');
const path = require('path');

// Lecture simple du front-matter YAML sans dépendance externe
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const yamlStr = match[1];
  const body = match[2];
  const data = {};

  yamlStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    // Retire les guillemets éventuels
    val = val.replace(/^["']|["']$/g, '');
    // Booléens
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    data[key] = val;
  });

  return { data, body };
}

const blogDir = path.join(__dirname, 'blog');
const outputDir = path.join(__dirname, 'blog');

// Crée le dossier blog s'il n'existe pas
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
  console.log('Dossier /blog créé.');
}

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

if (files.length === 0) {
  // Génère un index vide
  fs.writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify([]));
  console.log('Aucun article trouvé. Index vide généré.');
  process.exit(0);
}

const index = [];

// Template HTML pour chaque article
function buildArticlePage(data, htmlContent, slug) {
  const date = data.date
    ? new Date(data.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title} | Nadine Rochereau</title>
  <meta name="description" content="${(data.excerpt || '').replace(/"/g, '&quot;')}">
  <link rel="icon" type="image/png" href="/img/favicon.png">
  <link rel="canonical" href="https://www.nadine-rochereau.fr/blog/${slug}.html" />
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    .article-hero {
      background-color: var(--color-secondary);
      padding: 60px var(--space-md) 40px;
      text-align: center;
    }
    .article-hero h1 {
      font-size: 2.2rem;
      max-width: 800px;
      margin: 0 auto var(--space-sm);
    }
    .article-meta {
      color: var(--color-primary);
      font-size: 0.95rem;
      font-weight: 500;
    }
    .article-cover {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      border-radius: var(--border-radius-card);
      margin-bottom: var(--space-md);
    }
    .article-body {
      max-width: 780px;
      margin: var(--space-lg) auto;
      padding: 0 var(--space-md);
    }
    .article-content {
      background: var(--color-background-main);
      border-radius: var(--border-radius-card);
      padding: var(--space-lg);
      box-shadow: 0 5px 20px rgba(0,0,0,0.06);
      line-height: 1.9;
    }
    .article-content h2 { font-size: 1.6rem; margin-top: var(--space-md); text-align: left; }
    .article-content h3 { font-size: 1.3rem; margin-top: var(--space-md); text-align: left; }
    .article-content p { margin-bottom: var(--space-sm); color: var(--color-text-light); }
    .article-content ul, .article-content ol { padding-left: 1.5rem; margin-bottom: var(--space-sm); }
    .article-content li { margin-bottom: 8px; color: var(--color-text-light); }
    .article-content blockquote {
      border-left: 4px solid var(--color-primary);
      padding-left: var(--space-sm);
      margin: var(--space-md) 0;
      font-style: italic;
    }
    .article-content img { max-width: 100%; border-radius: var(--border-radius-card); }
    .article-footer {
      margin-top: var(--space-lg);
      padding-top: var(--space-md);
      border-top: 1px solid #eee;
      text-align: center;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
      margin-bottom: var(--space-md);
      font-size: 0.95rem;
    }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>

  <header class="main-header scroll-up">
    <div class="logo-container">
      <img src="/img/logo.png" alt="Logo Les Couleurs de la Vie Nadine Rochereau" class="logo-image">
      <div class="logo-text">
        <p>Les Couleurs de la Vie</p>
        <p>Nadine Rochereau</p>
      </div>
    </div>
    <nav class="main-nav">
      <ul>
        <li><a href="/">Accueil</a></li>
        <li><a href="/#apropos">À propos</a></li>
        <li><a href="/#offres">Accompagnement</a></li>
        <li><a href="/#details-individuel">Parcours</a></li>
        <li><a href="/#faq">FAQ</a></li>
        <li><a href="/blog.html" style="color: var(--color-primary);">Blog</a></li>
      </ul>
    </nav>
    <div class="header_button">
      <a href="https://calendly.com/nadine-rochereau2/30min" class="btn-primary">Réserver un appel</a>
      <a href="https://www.linkedin.com/in/nadine-rochereau-3229ab363/" class="btn-linkedin" aria-label="LinkedIn">
        <i class="fab fa-linkedin"></i>
      </a>
    </div>
  </header>

  <main>
    <section class="article-hero">
      <a href="/blog.html" class="back-link"><i class="fas fa-arrow-left"></i> Retour au blog</a>
      <h1>${data.title}</h1>
      ${date ? `<p class="article-meta"><i class="fas fa-calendar-alt" style="margin-right:5px;"></i>${date}</p>` : ''}
    </section>

    <div class="article-body">
      ${data.cover_image ? `<img src="${data.cover_image}" alt="${data.title}" class="article-cover">` : ''}
      <div class="article-content">
        ${htmlContent}
      </div>
      <div class="article-footer">
        <p style="font-size:1.1rem; color: var(--color-text-dark); font-weight:600;">Cet article vous a touché·e ?</p>
        <a href="https://calendly.com/nadine-rochereau2/30min" class="btn-primary" style="margin-top:10px;">Réserver un appel découverte gratuit</a>
        <br><br>
        <a href="/blog.html" class="back-link"><i class="fas fa-arrow-left"></i> Voir tous les articles</a>
      </div>
    </div>
  </main>

  <footer>
    <div class="footer-container">
      <div class="footer-col footer-info">
        <h3>Informations</h3>
        <ul>
          <li><a href="/">Accueil</a></li>
          <li><a href="/#apropos">À propos</a></li>
          <li><a href="/blog.html">Blog</a></li>
        </ul>
      </div>
      <div class="footer-col footer-contact">
        <h3>Contact</h3>
        <p><a href="mailto:nadine.rochereau2@gmail.com">nadine.rochereau2@gmail.com</a></p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Les Couleurs de la Vie - Nadine Rochereau.</p>
    </div>
  </footer>

  <script src="/script.js"></script>
</body>
</html>`;
}

// Traitement simplifié du Markdown vers HTML
function simpleMarkdownToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hublp])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[23]>)/g, '$1')
    .replace(/(<\/h[23]>)<\/p>/g, '$1');
}

files.forEach(file => {
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const { data, body } = parseFrontMatter(raw);

  // Ajoute à l'index
  index.push({
    slug,
    title: data.title || 'Sans titre',
    date: data.date || '',
    excerpt: data.excerpt || '',
    cover_image: data.cover_image || null,
    published: data.published !== false,
  });

  // Génère la page HTML de l'article
  const htmlContent = simpleMarkdownToHtml(body);
  const articleHtml = buildArticlePage(data, htmlContent, slug);
  fs.writeFileSync(path.join(outputDir, `${slug}.html`), articleHtml);
  console.log(`✓ Article généré : ${slug}.html`);
});

// Écrit l'index JSON
fs.writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify(index, null, 2));
console.log(`✓ index.json généré avec ${index.length} article(s).`);
