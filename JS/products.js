class Product {
    constructor(id, model, description, price, image) {
        this.id = id;
        this.model = model;
        this.description = description;
        this.price = parseFloat(price);
        this.image = image;
        this.priceWithoutVAT = this.calculatePriceWithoutVAT();
        this.vat = this.calculateVAT();
    }

    calculatePriceWithoutVAT() {
        return (this.price / 1.06).toFixed(2);
    }

    calculateVAT() {
        return (this.price - this.priceWithoutVAT).toFixed(2);
    }
}

class ProductManager {
    constructor() {
        this.products = [
            new Product(1, "MountainX", "Bicicleta para trilhos com suspensão total", 700.00, "images/bike.jpg"),
            new Product(2, "SpeedLine", "Bicicleta de corrida com quadro em carbono", 1200.00, "images/bike10.jpg"),
            new Product(3, "UrbanGlide", "Bicicleta urbana leve e confortável", 450.00, "images/bike3.jpg"),
            new Product(4, "TrailBlazer", "Bicicleta de montanha robusta para trilhos exigentes", 850.00, "images/bike5.jpg"),
            new Product(5, "CitySprint", "Bicicleta de cidade com design elegante", 500.00, "images/bike8.jpg"),
            new Product(6, "ElectroVolt", "Bicicleta elétrica com autonomia de 60 km", 1500.00, "images/last.jpg"),
        ];
    }

    addProduct(product) {
        this.products.push(product);
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = updatedProduct;
        }
    }

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getAllProducts() {
        return this.products;
    }
}

const productManager = new ProductManager();

function validateProductForm(model, description, price) {
    if (!model || !description || !price) {
        alert("Todos os campos são obrigatórios.");
        return false;
    }
    if (isNaN(price) || price <= 0) {
        alert("O preço deve ser um número positivo.");
        return false;
    }
    return true;
}

function renderCatalog() {
    const productList = document.getElementById("product-list");
    if (productList) {
        productList.innerHTML = "";
        productManager.getAllProducts().forEach(product => {
            const productCard = document.createElement("div");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.model}" class="product-image">
                <h3>${product.model}</h3>
                <p>${product.description}</p>
                <p>€${product.price.toFixed(2)}</p>
                <a href="product-detail.html?id=${product.id}" class="button">Ver Detalhes</a>
            `;
            productList.appendChild(productCard);
        });
    }
}

function renderProductDetail() {
    const productDetail = document.getElementById("product-detail");
    if (productDetail) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get("id"));
        const product = productManager.getProductById(productId);
        if (product) {
            productDetail.innerHTML = `
                <h2>${product.model}</h2>
                <img src="${product.image}" alt="${product.model}" class="product-image">
                <p>${product.description}</p>
                <p><strong>Preço:</strong> €${product.price.toFixed(2)}</p>
                <p><strong>Preço Sem IVA:</strong> €${product.priceWithoutVAT}</p>
                <p><strong>IVA (6%):</strong> €${product.vat}</p>
            `;
        } else {
            productDetail.innerHTML = "<p>Produto não encontrado.</p>";
        }
    }
}

function renderAdminList() {
    const adminList = document.getElementById("admin-product-list");
    if (adminList) {
        adminList.innerHTML = "";
        productManager.getAllProducts().forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.model}</td>
                <td>${product.description}</td>
                <td>€${product.price.toFixed(2)}</td>
                <td>€${product.priceWithoutVAT}</td>
                <td>€${product.vat}</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}">Editar</button>
                    <button class="delete-btn" data-id="${product.id}">Apagar</button>
                </td>
            `;
            adminList.appendChild(row);
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => {
                const id = parseInt(button.dataset.id);
                const product = productManager.getProductById(id);
                document.getElementById("product-id").value = product.id;
                document.getElementById("model").value = product.model;
                document.getElementById("description").value = product.description;
                document.getElementById("price").value = product.price.toFixed(2);
                document.getElementById("product-form").classList.remove("hidden");
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                if (confirm("Tem certeza que deseja apagar este produto?")) {
                    productManager.deleteProduct(parseInt(button.dataset.id));
                    renderAdminList();
                }
            });
        });
    }
}

if (document.getElementById("product-form-element")) {
    const form = document.getElementById("product-form-element");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("product-id").value ? parseInt(document.getElementById("product-id").value) : null;
        const model = document.getElementById("model").value;
        const description = document.getElementById("description").value;
        const price = parseFloat(document.getElementById("price").value);
        // Imagem padrão para novos produtos, substituir por upload no futuro
        const image = "images/product-placeholder.jpg";

        if (validateProductForm(model, description, price)) {
            const product = new Product(id || productManager.getAllProducts().length + 1, model, description, price, image);
            if (id) {
                productManager.updateProduct(id, product);
            } else {
                productManager.addProduct(product);
            }
            form.reset();
            document.getElementById("product-id").value = "";
            document.getElementById("product-form").classList.add("hidden");
            renderAdminList();
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
}

if (document.getElementById("product-detail")) {
    renderProductDetail();
}

if (document.getElementById("admin-product-list")) {
    renderAdminList();
}