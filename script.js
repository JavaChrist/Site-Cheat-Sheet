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
        },
        {
            id: "react",
            name: "React",
            page: "react.html",
            logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
            className: "react"
        }
    ]
};

// Fonction pour gérer l'ajout de contenu à la catégorie et sa sauvegarde dans localStorage
function handleContentFormSubmit() {
    const contentForm = document.getElementById('content-form');
    if (contentForm) { // Vérifie que le formulaire existe (pour éviter les erreurs sur la page d'accueil)
        contentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const code = document.getElementById('code').value.trim();

            // Créer un objet pour le nouveau contenu
            const newContent = {
                title: title,
                description: description,
                code: code
            };

            // Récupérer les données existantes dans localStorage
            const categoryId = document.body.getAttribute('data-category-id');
            let storedContent = JSON.parse(localStorage.getItem(`${categoryId}Content`)) || [];
            storedContent.push(newContent);

            // Mettre à jour le localStorage
            localStorage.setItem(`${categoryId}Content`, JSON.stringify(storedContent));

            // Afficher le nouveau contenu
            addContentToPage(newContent, storedContent.length - 1);

            // Réinitialiser le formulaire
            contentForm.reset();

            // Appliquer Prism.js à nouveau pour le nouveau contenu
            Prism.highlightAll();
        });
    }
}

// Fonction pour ajouter le contenu à la page
function addContentToPage(content, index) {
    const section = document.createElement('section');
    const h2 = document.createElement('h2');
    h2.textContent = content.title;
    const p = document.createElement('p');
    p.textContent = content.description;

    // Ajouter le bloc de code avec la bonne classe de coloration syntaxique
    const pre = document.createElement('pre');
    const codeElement = document.createElement('code');

    const categoryId = document.body.getAttribute('data-category-id');
    if (categoryId === "javascript") {
        codeElement.classList.add('language-js'); // Classe pour JavaScript
    } else if (categoryId === "css") {
        codeElement.classList.add('language-css'); // Classe pour CSS
    } else {
        codeElement.classList.add('language-html'); // Par défaut, classe pour HTML
    }

    codeElement.textContent = content.code;
    pre.appendChild(codeElement);

    // Ajouter les boutons "Modifier" et "Supprimer"
    const editButton = document.createElement('button');
    editButton.textContent = "Modifier";
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => editContent(index));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Supprimer";
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteContent(index));

    section.appendChild(h2);
    section.appendChild(p);
    if (content.code) section.appendChild(pre);
    section.appendChild(editButton);
    section.appendChild(deleteButton);

    // Ajouter la section au contenu affiché
    document.getElementById('content').appendChild(section);

    // Appliquer Prism.js pour colorer le code dynamique
    Prism.highlightAll();
}

// Fonction pour éditer le contenu
function editContent(index) {
    const categoryId = document.body.getAttribute('data-category-id');
    let storedContent = JSON.parse(localStorage.getItem(`${categoryId}Content`)) || [];

    // Charger les données dans le formulaire pour les modifier
    const contentToEdit = storedContent[index];
    document.getElementById('title').value = contentToEdit.title;
    document.getElementById('description').value = contentToEdit.description;
    document.getElementById('code').value = contentToEdit.code;

    // Supprimer l'ancien contenu
    storedContent.splice(index, 1);
    localStorage.setItem(`${categoryId}Content`, JSON.stringify(storedContent));

    // Réafficher les contenus mis à jour
    refreshContent();
}

// Fonction pour supprimer le contenu
function deleteContent(index) {
    const categoryId = document.body.getAttribute('data-category-id');
    let storedContent = JSON.parse(localStorage.getItem(`${categoryId}Content`)) || [];

    // Supprimer l'élément à l'index donné
    storedContent.splice(index, 1);
    localStorage.setItem(`${categoryId}Content`, JSON.stringify(storedContent));

    // Réafficher les contenus mis à jour
    refreshContent();
}

// Fonction pour rafraîchir l'affichage des contenus
function refreshContent() {
    document.getElementById('content').innerHTML = ''; // Vider le contenu affiché
    loadSavedContent(); // Recharger les contenus depuis le localStorage
}

// Charger les données sauvegardées depuis localStorage au chargement de la page
function loadSavedContent() {
    const categoryId = document.body.getAttribute('data-category-id');
    if (categoryId) {
        const storedContent = JSON.parse(localStorage.getItem(`${categoryId}Content`)) || [];
        storedContent.forEach((content, index) => addContentToPage(content, index));
    }
}

// Fonction pour effectuer une recherche globale
function performSearch(query) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Vider les résultats précédents
    const searchResultsSection = document.getElementById('search-results');
    searchResultsSection.style.display = 'block'; // Afficher la section des résultats

    let resultsFound = false;

    data.categories.forEach(category => {
        const storedContent = JSON.parse(localStorage.getItem(`${category.id}Content`)) || [];
        storedContent.forEach(content => {
            if (
                content.title.toLowerCase().includes(query.toLowerCase()) ||
                content.description.toLowerCase().includes(query.toLowerCase()) ||
                content.code.toLowerCase().includes(query.toLowerCase())
            ) {
                resultsFound = true;

                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');

                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = `Catégorie : ${category.name}`;

                const contentTitle = document.createElement('h4');
                contentTitle.textContent = content.title;

                const contentDescription = document.createElement('p');
                contentDescription.textContent = content.description;

                const pre = document.createElement('pre');
                const codeElement = document.createElement('code');

                if (category.id === "javascript") {
                    codeElement.classList.add('language-js');
                } else if (category.id === "css") {
                    codeElement.classList.add('language-css');
                } else {
                    codeElement.classList.add('language-html');
                }

                codeElement.textContent = content.code;
                pre.appendChild(codeElement);

                resultItem.appendChild(categoryTitle);
                resultItem.appendChild(contentTitle);
                resultItem.appendChild(contentDescription);
                resultItem.appendChild(pre);

                resultsContainer.appendChild(resultItem);
            }
        });
    });

    if (!resultsFound) {
        const noResults = document.createElement('p');
        noResults.textContent = "Aucun résultat trouvé pour votre recherche.";
        resultsContainer.appendChild(noResults);
    }

    Prism.highlightAll(); // Réappliquer Prism.js pour la coloration syntaxique
}

// Initialisation de la recherche
function initializeSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

// Initialisation de la page des catégories
function initializePage() {
    loadSavedContent(); // Charger le contenu sauvegardé
    handleContentFormSubmit(); // Gérer la soumission du formulaire
}

// Générer les liens pour chaque catégorie sur la page d'accueil avec logos
function generateCategoryLinks() {
    const categoryMenu = document.getElementById('category-menu');
    if (categoryMenu) { // Vérifie si l'élément existe avant de le manipuler
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
}

// Gérer la soumission du formulaire pour ajouter une nouvelle catégorie
function handleCategoryFormSubmit() {
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) { // Vérifie que le formulaire existe (pour éviter les erreurs sur les pages de catégories)
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
}

// Initialisation globale
function initializeApp() {
    generateCategoryLinks(); // Générer les catégories
    handleCategoryFormSubmit(); // Gérer le formulaire de catégories
    initializeSearch(); // Initialiser la recherche
}

// Appeler l'initialisation des pages spécifiques et de l'accueil
initializePage();
initializeApp();
