async function renderSuggestions() {
    const suggestionList = document.getElementById("suggestion-list");
    if (suggestionList) {
        try {
            const response = await fetch('/api/suggestions');
            const suggestions = await response.json();
            suggestionList.innerHTML = "";
            suggestions.forEach(suggestion => {
                const suggestionDiv = document.createElement("div");
                suggestionDiv.innerHTML = `
                    <h3>${suggestion.category}</h3>
                    <p>${suggestion.text}</p>
                    <p><strong>Data:</strong> ${new Date(suggestion.date).toLocaleDateString()}</p>
                    ${suggestion.response ? `<h4>Resposta:</h4><p>${suggestion.response}</p>` : ""}
                `;
                suggestionList.appendChild(suggestionDiv);
            });
        } catch (err) {
            alert("Erro ao carregar sugestões: " + err.message);
        }
    }
}

if (document.getElementById("suggestion-form")) {
    const form = document.getElementById("suggestion-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const category = document.getElementById("category").value;
        const text = document.getElementById("suggestion").value;
        if (category && text) {
            try {
                const response = await fetch('/api/suggestions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category, text })
                });
                const result = await response.json();
                alert(result.message);
                if (response.ok) {
                    form.reset();
                    renderSuggestions();
                }
            } catch (err) {
                alert("Erro ao enviar sugestão: " + err.message);
            }
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });
}

if (document.getElementById("suggestion-list")) {
    renderSuggestions();
}