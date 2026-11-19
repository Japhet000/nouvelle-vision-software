// ==========================================
// NOUVELLE VISION SOFTWARE
// Catalogue connecté à Supabase via Render
// ==========================================

const API_BASE_URL = window.NV_CONFIG?.apiBaseUrl || 
    "https://nouvelle-vision-software.onrender.com";

const grid = document.getElementById("productGrid");

// Vérification du catalogue
if (!grid) {
    console.error("Product grid not found");
}

// Traduction des catégories
function normalizeCategory(category) {
    const value = String(category || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    if (["retail", "commerce de detail", "commerce", "vente"].includes(value)) {
        return "retail";
    }

    if (["management", "gestion", "hospitality"].includes(value)) {
        return "management";
    }

    if (["business", "entreprise"].includes(value)) {
        return "business";
    }

    return value;
}

// Traduction des types
function getProductType(category) {
    const cat = normalizeCategory(category);

    const types = {
        retail: "Retail",
        management: "Management",
        business: "Business"
    };

    return types[cat] || "Software";
}

// Sécurisation du texte affiché
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Formatage des prix
function formatPrice(cents) {
    const amount = Number(cents || 0) / 100;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
    }).format(amount);
}

// Création des cartes
function renderProducts(products, filter = "all") {

    if (!grid) return;

    const filteredProducts = products.filter(product => {
        return filter === "all" ||
            normalizeCategory(product.category) === filter;
    });

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <p class="product-message">
                No software found in this category.
            </p>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => {

        const name = escapeHTML(product.name);
        const description = escapeHTML(product.description);
        const icon = escapeHTML(product.icon || "▦");
        const type = escapeHTML(getProductType(product.category));

        const price = formatPrice(product.license_price_cents);

        return `
            <article class="product-card">

                <div class="product-icon">
                    ${icon}
                </div>

                <small>${type.toUpperCase()}</small>

                <h3>${name}</h3>

                <p>${description}</p>

                <div class="product-meta">

                    <div>
                        <strong>${price}</strong>
                        <br>
                        <small>Indicative license price</small>
                    </div>

                    <a href="mailto:sales@nouvellevisionsoftware.com?subject=${encodeURIComponent("Enquiry: " + product.name)}">
                        Enquire →
                    </a>

                </div>

            </article>
        `;

    }).join("");
}

// Chargement des produits depuis Render
async function loadProducts() {

    if (!grid) return;

    grid.innerHTML = `
        <p class="product-message">
            Loading software products...
        </p>
    `;

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/products`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result.products)) {
            throw new Error("Invalid products response");
        }

        const products = result.products;

        if (products.length === 0) {
            grid.innerHTML = `
                <p class="product-message">
                    No products available at the moment.
                </p>
            `;
            return;
        }

        // Affichage initial
        renderProducts(products);

        // Gestion des filtres
        document.querySelectorAll(".filter").forEach(button => {

            button.addEventListener("click", () => {

                document.querySelectorAll(".filter").forEach(btn => {
                    btn.classList.remove("active");
                });

                button.classList.add("active");

                renderProducts(
                    products,
                    button.dataset.filter
                );

            });

        });

        console.log(
            `${products.length} products loaded successfully`
        );

    } catch (error) {

        console.error("Product loading error:", error);

        grid.innerHTML = `
            <p class="product-message">
                Unable to load products. Please try again later.
            </p>
        `;

    }
}

// Année actuelle
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Démarrage
loadProducts();
