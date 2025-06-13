class Suggestion {
  constructor(id, category, text) {
    this.id = id;
    this.category = category;
    this.text = text;
    this.responses = [];
  }
}

class ForumManager {
  constructor() {
    this.suggestions = [
      new Suggestion(1, "Novos Modelos", "Gostaria de ver bicicletas elétricas no catálogo."),
      new Suggestion(2, "Feedback sobre Produtos", "A MountainX é excelente para trilhos!"),
    ];
  }

  addSuggestion(suggestion) {
    this.suggestions.push(suggestion);
  }

  addResponse(suggestionId, response) {
    const suggestion = this.suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      suggestion.responses.push(response);
    }
  }
}

const forumManager = new ForumManager();

function renderSuggestions() {
  const suggestionList = document.getElementById("suggestion-list");
  if (suggestionList) {
    suggestionList.innerHTML = "";
    forumManager.suggestions.forEach(suggestion => {
      const suggestionDiv = document.createElement("div");
      suggestionDiv.innerHTML = `
        <h3>${suggestion.category}</h3>
        <p>${suggestion.text}</p>
        ${suggestion.responses.length ? `<h4>Respostas:</h4><ul>${suggestion.responses.map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
      `;
      suggestionList.appendChild(suggestionDiv);
    });
  }
}

if (document.getElementById("suggestion-form")) {
  const form = document.getElementById("suggestion-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const category = document.getElementById("category").value;
    const text = document.getElementById("suggestion").value;
    if (category && text) {
      const suggestion = new Suggestion(forumManager.suggestions.length + 1, category, text);
      forumManager.addSuggestion(suggestion);
      form.reset();
      renderSuggestions();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  });
}

if (document.getElementById("suggestion-list")) {
  renderSuggestions();
}