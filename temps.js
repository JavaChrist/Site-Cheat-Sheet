let data = {
    categories: [
        {
            id: "html",
            name: "HTML",
            page: "html.html",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
            className: "html"
        },
        {
            id: "css",
            name: "CSS",
            page: "css.html",
            logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
            className: "css"
        },
        {
            id: "javascript",
            name: "JavaScript",
            page: "javascript.html",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
            className: "javascript"
        }
        // Ajoute d'autres catégories ici
    ]
};

// Initialisation du site
function initializeApp() {
    generateCategoryLinks();
    handleCategoryFormSubmit();
}

// Générer les liens pour chaque catégorie sur la page d'accueil
function generateCategoryLinks() {
    const categoryMenu = document.getElementById('category-menu');
    categoryMenu.innerHTML = '';

    data.categories.forEach(category => {
        const a = document.createElement('a');
        a.href = category.page;
        a.classList.add('category-card', category.className);

        const img = document.createElement('img');
        img.src = category.logo;
        img.alt = `${category.name} Logo`;

        const h3 = document.createElement('h3');
        h3.textContent = category.name;

        a.appendChild(img);
        a.appendChild(h3);
        categoryMenu.appendChild(a);
    });
}

// Gérer la soumission du formulaire pour ajouter une nouvelle catégorie
function handleCategoryFormSubmit() {
    const categoryForm = document.getElementById('category-form');
    categoryForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newCategoryName = document.getElementById('new-category-name').value.trim();

        if (newCategoryName) {
            const newCategoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
            const newCategoryPage = `${newCategoryId}.html`;

            // Vérifier si l'ID existe déjà
            if (!data.categories.find(cat => cat.id === newCategoryId)) {
                const className = newCategoryId;
                const logo = prompt("Entrez l'URL du logo pour cette catégorie (par exemple, un lien vers une image SVG) :");

                // Ajouter la nouvelle catégorie
                data.categories.push({
                    id: newCategoryId,
                    name: newCategoryName,
                    page: newCategoryPage,
                    logo: logo,
                    className: className
                });

                // Rafraîchir les liens des catégories
                generateCategoryLinks();

                // Réinitialiser le formulaire
                categoryForm.reset();
            } else {
                alert('Une catégorie avec ce nom existe déjà.');
            }
        }
    });
}

// Initialiser l'application
initializeApp();
