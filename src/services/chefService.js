/**
 * Serviço Chef IA - gera receitas com base nos produtos da despensa.
 * Usa receitas pré-definidas inteligentes quando não há API.
 * Quando tiveres uma API key OpenAI, podes trocar pela versão com IA real.
 */

const RECIPE_TEMPLATES = {
  PT: [
    {
      name: "Massa com Frango e Legumes",
      time: "30 min",
      ingredients: (pantry) => filterAvailable(pantry, [
        { name: "Massa", qty: 250, unit: "g" },
        { name: "Frango", qty: 200, unit: "g" },
        { name: "Azeite", qty: 2, unit: "colheres" },
        { name: "Alho", qty: 2, unit: "dentes" },
        { name: "Sal", qty: 0, unit: "q.b." },
        { name: "Pimenta", qty: 0, unit: "q.b." },
      ]),
      steps: [
        "Cozer a massa em água com sal conforme instruções da embalagem.",
        "Cortar o frango em cubos e temperar com sal e pimenta.",
        "Aquecer o azeite numa frigideira e refogar o alho picado.",
        "Juntar o frango e cozinhar até dourar.",
        "Adicionar os legumes disponíveis e saltear 5 minutos.",
        "Misturar a massa escorrida e servir.",
      ],
      tags: ["frango", "massa", "chicken", "pasta"]
    },
    {
      name: "Arroz de Tomate",
      time: "25 min",
      ingredients: (pantry) => filterAvailable(pantry, [
        { name: "Arroz", qty: 200, unit: "g" },
        { name: "Tomate", qty: 3, unit: "un" },
        { name: "Cebola", qty: 1, unit: "un" },
        { name: "Azeite", qty: 2, unit: "colheres" },
        { name: "Alho", qty: 1, unit: "dente" },
        { name: "Sal", qty: 0, unit: "q.b." },
      ]),
      steps: [
        "Picar a cebola e o alho finamente.",
        "Refogar em azeite até a cebola ficar translúcida.",
        "Ralar os tomates e juntar ao refogado.",
        "Deixar apurar 5 minutos.",
        "Adicionar o arroz e o dobro de água.",
        "Cozinhar em lume brando 15-18 minutos.",
      ],
      tags: ["arroz", "tomate", "rice", "tomato"]
    },
    {
      name: "Omelete Simples",
      time: "10 min",
      ingredients: (pantry) => filterAvailable(pantry, [
        { name: "Ovos", qty: 3, unit: "un" },
        { name: "Queijo", qty: 30, unit: "g" },
        { name: "Fiambre", qty: 2, unit: "fatias" },
        { name: "Sal", qty: 0, unit: "q.b." },
        { name: "Manteiga", qty: 1, unit: "colher" },
      ]),
      steps: [
        "Bater os ovos num recipiente com um pouco de sal.",
        "Derreter a manteiga numa frigideira antiaderente.",
        "Verter os ovos batidos na frigideira.",
        "Quando começar a solidificar, adicionar o queijo e fiambre.",
        "Dobrar ao meio e servir.",
      ],
      tags: ["ovos", "omelete", "eggs", "omelette"]
    },
    {
      name: "Salada Fresca",
      time: "10 min",
      ingredients: (pantry) => filterAvailable(pantry, [
        { name: "Alface", qty: 1, unit: "un" },
        { name: "Tomate", qty: 2, unit: "un" },
        { name: "Pepino", qty: 1, unit: "un" },
        { name: "Cebola", qty: 0.5, unit: "un" },
        { name: "Azeite", qty: 2, unit: "colheres" },
        { name: "Vinagre", qty: 1, unit: "colher" },
        { name: "Sal", qty: 0, unit: "q.b." },
      ]),
      steps: [
        "Lavar bem todos os vegetais.",
        "Cortar a alface em tiras, o tomate em quartos, o pepino em rodelas.",
        "Picar a cebola finamente.",
        "Juntar tudo numa saladeira.",
        "Temperar com azeite, vinagre e sal.",
      ],
      tags: ["salada", "alface", "salad", "lettuce"]
    },
    {
      name: "Sopa de Legumes",
      time: "35 min",
      ingredients: (pantry) => filterAvailable(pantry, [
        { name: "Batata", qty: 2, unit: "un" },
        { name: "Cenoura", qty: 2, unit: "un" },
        { name: "Cebola", qty: 1, unit: "un" },
        { name: "Alho", qty: 1, unit: "dente" },
        { name: "Azeite", qty: 1, unit: "colher" },
        { name: "Sal", qty: 0, unit: "q.b." },
      ]),
      steps: [
        "Descascar e cortar todos os vegetais em pedaços.",
        "Refogar a cebola e o alho em azeite.",
        "Juntar os restantes legumes e cobrir com água.",
        "Cozinhar 25 minutos ou até ficarem macios.",
        "Triturar com a varinha mágica.",
        "Retificar o sal e servir.",
      ],
      tags: ["sopa", "legumes", "soup", "vegetables"]
    },
    {
      name: "Sandwich de Fiambre e Queijo",
      time: "5 min",
      ingredients: (pantry) => filterAvailable(pantry, [
        { name: "Pão de Forma", qty: 2, unit: "fatias" },
        { name: "Fiambre", qty: 2, unit: "fatias" },
        { name: "Queijo", qty: 2, unit: "fatias" },
        { name: "Manteiga", qty: 1, unit: "colher" },
      ]),
      steps: [
        "Barrar o pão com manteiga.",
        "Colocar as fatias de fiambre e queijo.",
        "Fechar a sandwich.",
        "Opcional: tostar na tostadeira ou frigideira.",
      ],
      tags: ["sandwich", "pão", "fiambre", "bread"]
    },
  ]
};

function filterAvailable(pantryItems, ingredients) {
  return ingredients; // Return all — the UI will show what's needed
}

/**
 * Gera uma receita com base nos produtos disponíveis na despensa
 */
export function generateRecipe(pantryItems, servings, lang, dietaryRestrictions = []) {
  return new Promise((resolve) => {
    // Simula tempo de "pensamento" do chef
    setTimeout(() => {
      const templates = RECIPE_TEMPLATES.PT; // Use PT as base
      
      // Pick a random recipe
      const recipe = templates[Math.floor(Math.random() * templates.length)];
      
      // Adjust quantities based on servings
      const adjustedIngredients = recipe.ingredients(pantryItems).map(ing => ({
        ...ing,
        qty: ing.unit === "q.b." ? 0 : Math.round(ing.qty * servings / 2 * 10) / 10
      }));

      resolve({
        name: recipe.name,
        time: recipe.time,
        servings,
        ingredients: adjustedIngredients,
        steps: recipe.steps,
        dietaryNotes: dietaryRestrictions.length > 0
          ? `Nota: verifique restrições alimentares (${dietaryRestrictions.join(", ")}).`
          : null
      });
    }, 1500 + Math.random() * 1000);
  });
}

/**
 * "Traduz" receita - por agora apenas retorna a mesma
 * Com API real, traduziria via IA
 */
export function translateRecipe(recipe, targetLang) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recipe); // Retorna sem traduzir por agora
    }, 500);
  });
}
