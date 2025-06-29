function validateProductForm(model, description, price, category) {
    if (!model || !description || !price || !category) {
        alert("Todos os campos são obrigatórios.");
        return false;
    }
    if (isNaN(price) || price <= 0) {
        alert("O preço deve ser um número positivo.");
        return false;
    }
    return true;
}

async function renderCatalog(filter = 'all') {
    const productList = document.getElementById("product-list");
    if (productList) {
        try {
            const response = await fetch('/api/products');
            let products = await response.json();
            if (filter !== 'all') {
                products = products.filter(product => product.category === filter);
            }
            productList.innerHTML = "";
            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.model}" class="product-image">
                    <h3>${product.model}</h3>
                    <p>${product.description}</p>
                    <p>€${product.price.toFixed(2)}</p>
                    <p>${product.category}</p>
                    <a href="product-detail.html?id=${product.id}" class="button">Ver Detalhes</a>
                `;
                productList.appendChild(productCard);
            });
        } catch (err) {
            alert("Erro ao carregar produtos: " + err.message);
        }
    }
}

async function renderProductDetail() {
    const productDetail = document.getElementById("product-detail");
    if (productDetail) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("id");
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();
            if (response.ok) {
                productDetail.innerHTML = `
                    <h2>${product.model}</h2>
                    <img src="${product.image}" alt="${product.model}" class="product-image">
                    <p>${product.description}</p>
                    <p><strong>Preço:</strong> €${product.price.toFixed(2)}</p>
                    <p><strong>Preço Sem IVA:</strong> €${product.priceWithoutVAT}</p>
                    <p><strong>IVA (23%):</strong> €${product.vat}</p>
                    <p><strong>Categoria:</strong> ${product.category}</p>
                `;
            } else {
                productDetail.innerHTML = "<p>Produto não encontrado.</p>";
            }
        } catch (err) {
            productDetail.innerHTML = "<p>Erro ao carregar produto.</p>";
        }
    }
}

async function renderAdminList() {
    const adminList = document.getElementById("admin-product-list");
    if (adminList) {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            adminList.innerHTML = "";
            products.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.model}</td>
                    <td>${product.description}</td>
                    <td>€${product.price.toFixed(2)}</td>
                    <td>€${product.priceWithoutVAT}</td>
                    <td>€${product.vat}</td>
                    <td>${product.category}</td>
                    <td>
                        <button class="edit-btn" data-id="${product.id}">Editar</button>
                        <button class="delete-btn" data-id="${product.id}">Apagar</button>
                    </td>
                `;
                adminList.appendChild(row);
            });

            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", async () => {
                    const id = button.dataset.id;
                    const response = await fetch(`/api/products/${id}`);
                    const product = await response.json();
                    document.getElementById("product-id").value = product.id;
                    document.getElementById("model").value = product.model;
                    document.getElementById("description").value = product.description;
                    document.getElementById("price").value = product.price.toFixed(2);
                    document.getElementById("image").value = product.image;
                    document.getElementById("category").value = product.category;
                    document.getElementById("product-form").classList.remove("hidden");
                });
            });

            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async () => {
                    if (confirm("Tem certeza que deseja apagar este produto?")) {
                        const response = await fetch(`/api/products/${button.dataset.id}`, { method: 'DELETE' });
                        const result = await response.json();
                        alert(result.message);
                        if (response.ok) renderAdminList();
                    }
                });
            });
        } catch (err) {
            alert("Erro ao carregar produtos: " + err.message);
        }
    }
}

async function renderAdminSuggestions() {
    const suggestionList = document.getElementById("admin-suggestion-list");
    if (suggestionList) {
        try {
            const response = await fetch('/api/suggestions');
            const suggestions = await response.json();
            suggestionList.innerHTML = "";
            suggestions.forEach(suggestion => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <h3>${suggestion.category}</h3>
                    <p>${suggestion.text}</p>
                    <p><strong>Data:</strong> ${new Date(suggestion.date).toLocaleDateString()}</p>
                    <p><strong>Resposta:</strong> ${suggestion.response || 'Sem resposta'}</p>
                    <textarea class="response-text" data-id="${suggestion.id}" placeholder="Escreva uma resposta"></textarea>
                    <button class="respond-btn" data-id="${suggestion.id}">Responder</button>
                    <button class="delete-btn" data-id="${suggestion.id}">Apagar</button>
                `;
                suggestionList.appendChild(div);
            });

            document.querySelectorAll(".respond-btn").forEach(button => {
                button.addEventListener("click", async () => {
                    const id = button.dataset.id;
                    const responseText = document.querySelector(`textarea[data-id="${id}"]`).value;
                    if (responseText) {
                        const response = await fetch(`/api/suggestions/${id}/response`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ response: responseText })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (response.ok) renderAdminSuggestions();
                    } else {
                        alert("A resposta não pode estar vazia.");
                    }
                });
            });

            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async () => {
                    if (confirm("Tem certeza que deseja apagar esta sugestão?")) {
                        const response = await fetch(`/api/suggestions/${button.dataset.id}`, { method: 'DELETE' });
                        const result = await response.json();
                        alert(result.message);
                        if (response.ok) renderAdminSuggestions();
                    }
                });
            });
        } catch (err) {
            alert("Erro ao carregar sugestões: " + err.message);
        }
    }
}

async function checkAuth() {
    const loginSection = document.getElementById("login-section");
    const adminContent = document.getElementById("admin-content");
    const logoutBtn = document.getElementById("logout-btn");
    try {
        const response = await fetch('/api/auth/check');
        const result = await response.json();
        if (result.authenticated) {
            loginSection.classList.add("hidden");
            adminContent.classList.remove("hidden");
            logoutBtn.classList.remove("hidden");
            renderAdminList();
            renderAdminSuggestions();
        } else {
            loginSection.classList.remove("hidden");
            adminContent.classList.add("hidden");
            logoutBtn.classList.add("hidden");
        }
    } catch (err) {
        alert("Erro ao verificar autenticação: " + err.message);
    }
}

if (document.getElementById("login-form")) {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            alert(result.message);
            if (response.ok) {
                checkAuth();
            }
        } catch (err) {
            alert("Erro ao fazer login: " + err.message);
        }
    });
}

if (document.getElementById("logout-btn")) {
    document.getElementById("logout-btn").addEventListener("click", async () => {
        try {
            const response = await fetch('/api/auth/logout');
            const result = await response.json();
            alert(result.message);
            checkAuth();
        } catch (err) {
            alert("Erro ao fazer logout: " + err.message);
        }
    });
}

if (document.getElementById("product-form-element")) {
    const form = document.getElementById("product-form-element");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("product-id").value;
        const model = document.getElementById("model").value;
        const description = document.getElementById("description").value;
        const price = parseFloat(document.getElementById("price").value);
        const image = document.getElementById("image").value || "images/product-placeholder.jpg";
        const category = document.getElementById("category").value;

        if (validateProductForm(model, description, price, category)) {
            try {
                const method = id ? 'PUT' : 'POST';
                const url = id ? `/api/products/${id}` : '/api/products';
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model, description, price, image, category })
                });
                const result = await response.json();
                alert(result.message);
                if (response.ok) {
                    form.reset();
                    document.getElementById("product-id").value = "";
                    document.getElementById("product-form").classList.add("hidden");
                    renderAdminList();
                }
            } catch (err) {
                alert("Erro ao salvar produto: " + err.message);
            }
        }
    });

    document.getElementById("add-product-btn").addEventListener("click", () => {
        document.getElementById("product-form").classList.remove("hidden");
        form.reset();
        document.getElementById("product-id").value = "";
    });

    document.getElementById("cancel-btn").addEventListener("click", () => {
        document.getElementById("product-form").classList.add("hidden");
        form.reset();
    });
}

if (document.getElementById("product-list")) {
    renderCatalog();
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
        categoryFilter.addEventListener("change", () => {
            renderCatalog(categoryFilter.value);
        });
    }
}

if (document.getElementById("product-detail")) {
    renderProductDetail();
}

if (document.getElementById("admin-product-list") || document.getElementById("admin-suggestion-list")) {
    checkAuth();
}