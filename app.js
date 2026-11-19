(() => {
  "use strict";

  const API_BASE_URL = (window.NV_CONFIG?.apiBaseUrl || "").replace(/\/+$/, "");
  const grid = document.getElementById("productGrid");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();
  if (!grid) return;

  const categoryAliases = {
    business: "business", entreprise: "business",
    retail: "retail", commerce: "retail", hospitality: "retail", restaurant: "retail",
    management: "management", gestion: "management", education: "management"
  };

  function normalizeCategory(value) {
    const key = String(value || "").trim().toLowerCase();
    return categoryAliases[key] || "management";
  }

  function money(cents) {
    const amount = Number(cents);
    if (!Number.isFinite(amount)) return "Contact us";
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 2
    }).format(amount / 100);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function render(products, filter = "all") {
    const visible = products.filter(product =>
      filter === "all" || normalizeCategory(product.category) === filter
    );

    if (!visible.length) {
      grid.innerHTML = '<p class="products-message">No products found in this category.</p>';
      return;
    }

    grid.innerHTML = visible.map(product => {
      const name = escapeHTML(product.name);
      const description = escapeHTML(product.description);
      const icon = escapeHTML(product.icon || "▦");
      const category = normalizeCategory(product.category);
      const monthly = money(product.monthly_price_cents);
      const license = money(product.license_price_cents);
      const subject = encodeURIComponent("Product enquiry: " + (product.name || "Software"));

      return `
        <article class="product-card">
          <div class="product-icon">${icon}</div>
          <small>${escapeHTML(category.toUpperCase())}</small>
          <h3>${name}</h3>
          <p>${description}</p>
          <div class="product-meta">
            <div>
              <strong>${monthly}</strong><br><small>per month</small>
              <br><strong>${license}</strong><br><small>one-time license</small>
            </div>
            <a href="mailto:sales@nouvellevisionsoftware.com?subject=${subject}">Enquire →</a>
          </div>
        </article>`;
    }).join("");
  }

  async function loadProducts() {
    grid.innerHTML = '<p class="products-message">Loading products...</p>';

    if (!API_BASE_URL) {
      grid.innerHTML = '<p class="products-message">The product service is not configured yet.</p>';
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) throw new Error(`API request failed (${response.status})`);

      const result = await response.json();
      if (!Array.isArray(result.products)) {
        throw new Error("Unexpected product data received from the API.");
      }

      window.NV_PRODUCTS = result.products;
      render(result.products);

      document.querySelectorAll(".filter").forEach(button => {
        button.addEventListener("click", () => {
          document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
          button.classList.add("active");
          render(result.products, button.dataset.filter || "all");
        });
      });
    } catch (error) {
      console.error("Unable to load Nouvelle Vision products:", error);
      grid.innerHTML = `
        <p class="products-message">
          We couldn't load the products right now. Please refresh the page or contact our team.
        </p>`;
    }
  }

  loadProducts();
})();
