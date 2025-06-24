document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const categoryFilter = document.getElementById('category-filter');
    let products = JSON.parse(localStorage.getItem('products')) || [];

    function renderProducts(filter = 'all') {
        productList.innerHTML = products
            .filter(product => filter === 'all' || product.category === filter)
            .map((product, index) => `
                <li>
                    <span>${product.name} - €${product.price} - ${product.category}</span>
                    <button onclick="removeProduct(${index})">Remover</button>
                </li>
            `).join('');
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProduct = {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image').value,
            category: document.getElementById('product-category').value
        };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts(categoryFilter.value);
        productForm.reset();
        alert('Produto adicionado com sucesso!');
    });

    categoryFilter.addEventListener('change', () => {
        renderProducts(categoryFilter.value);
    });

    window.removeProduct = function(index) {
        if (confirm('Tem certeza que deseja remover este produto?')) {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts(categoryFilter.value);
        }
    };

    renderProducts();
});