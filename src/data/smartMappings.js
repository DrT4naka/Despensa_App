/* Smart emoji mappings - keywords → emojis para produtos personalizados.
   Quando o utilizador cria um produto novo, tentamos encontrar um emoji adequado. */

const EMOJI_KEYWORDS = [
  { keywords: ["arroz", "rice", "riz", "reis"], emoji: "🍚" },
  { keywords: ["massa", "pasta", "pâtes", "nudeln", "esparguete", "spaghetti", "fusilli", "penne", "macarrão"], emoji: "🍝" },
  { keywords: ["pão", "pan", "bread", "pain", "brot", "toast"], emoji: "🍞" },
  { keywords: ["croissant"], emoji: "🥐" },
  { keywords: ["bolo", "cake", "gâteau", "kuchen", "pastel", "torta"], emoji: "🍰" },
  { keywords: ["leite", "milk", "lait", "milch", "leche"], emoji: "🥛" },
  { keywords: ["queijo", "cheese", "fromage", "käse", "queso"], emoji: "🧀" },
  { keywords: ["manteiga", "butter", "beurre", "mantequilla"], emoji: "🧈" },
  { keywords: ["ovo", "egg", "œuf", "ei", "huevo"], emoji: "🥚" },
  { keywords: ["frango", "chicken", "poulet", "hähnchen", "pollo"], emoji: "🍗" },
  { keywords: ["carne", "meat", "viande", "fleisch", "beef", "bœuf", "porco", "pork", "porc"], emoji: "🥩" },
  { keywords: ["peixe", "fish", "poisson", "fisch", "pescado", "salmão", "salmon", "saumon", "lachs"], emoji: "🐟" },
  { keywords: ["camarão", "shrimp", "crevette", "garnelen", "camarón"], emoji: "🦐" },
  { keywords: ["banana"], emoji: "🍌" },
  { keywords: ["maçã", "apple", "pomme", "apfel", "manzana"], emoji: "🍎" },
  { keywords: ["laranja", "orange", "naranja"], emoji: "🍊" },
  { keywords: ["morango", "strawberry", "fraise", "erdbeere", "fresa"], emoji: "🍓" },
  { keywords: ["uva", "grape", "raisin", "traube"], emoji: "🍇" },
  { keywords: ["limão", "lemon", "citron", "zitrone", "limón"], emoji: "🍋" },
  { keywords: ["melancia", "watermelon", "pastèque", "wassermelone", "sandía"], emoji: "🍉" },
  { keywords: ["manga", "mango", "mangue"], emoji: "🥭" },
  { keywords: ["ananás", "abacaxi", "pineapple", "ananas", "piña"], emoji: "🍍" },
  { keywords: ["tomate", "tomato"], emoji: "🍅" },
  { keywords: ["cebola", "onion", "oignon", "zwiebel", "cebolla"], emoji: "🧅" },
  { keywords: ["alho", "garlic", "ail", "knoblauch", "ajo"], emoji: "🧄" },
  { keywords: ["batata", "potato", "pomme de terre", "kartoffel", "patata"], emoji: "🥔" },
  { keywords: ["cenoura", "carrot", "carotte", "karotte", "zanahoria"], emoji: "🥕" },
  { keywords: ["pepino", "cucumber", "concombre", "gurke"], emoji: "🥒" },
  { keywords: ["alface", "lettuce", "laitue", "salat", "lechuga", "espinafre", "spinach", "épinard", "spinat"], emoji: "🥬" },
  { keywords: ["brócolo", "broccoli", "brocoli", "brokkoli"], emoji: "🥦" },
  { keywords: ["cogumelo", "mushroom", "champignon", "pilz", "champiñón"], emoji: "🍄" },
  { keywords: ["pimento", "pepper", "poivron", "paprika", "pimiento"], emoji: "🫑" },
  { keywords: ["água", "water", "eau", "wasser", "agua"], emoji: "💧" },
  { keywords: ["café", "coffee", "kaffee"], emoji: "☕" },
  { keywords: ["chá", "tea", "thé", "tee", "té"], emoji: "🍵" },
  { keywords: ["cerveja", "beer", "bière", "bier", "cerveza"], emoji: "🍺" },
  { keywords: ["vinho", "wine", "vin", "wein", "vino"], emoji: "🍷" },
  { keywords: ["sumo", "juice", "jus", "saft", "zumo"], emoji: "🧃" },
  { keywords: ["refrigerante", "soda", "cola", "coca"], emoji: "🥤" },
  { keywords: ["chocolate"], emoji: "🍫" },
  { keywords: ["bolacha", "cookie", "biscuit", "galleta", "keks"], emoji: "🍪" },
  { keywords: ["cereal", "müsli", "granola"], emoji: "🥣" },
  { keywords: ["mel", "honey", "miel", "honig"], emoji: "🍯" },
  { keywords: ["compota", "jam", "confiture", "marmelade", "mermelada"], emoji: "🍯" },
  { keywords: ["azeite", "olive", "oliva"], emoji: "🫒" },
  { keywords: ["óleo", "oil", "huile", "öl", "aceite"], emoji: "🫗" },
  { keywords: ["vinagre", "vinegar", "vinaigre", "essig"], emoji: "🫙" },
  { keywords: ["sal", "salt", "sel", "salz"], emoji: "🧂" },
  { keywords: ["açúcar", "sugar", "sucre", "zucker", "azúcar"], emoji: "🍬" },
  { keywords: ["canela", "cinnamon", "cannelle", "zimt"], emoji: "🫕" },
  { keywords: ["sabonete", "soap", "savon", "seife", "jabón"], emoji: "🧼" },
  { keywords: ["shampoo", "shampooing", "champú"], emoji: "🧴" },
  { keywords: ["pasta dentes", "toothpaste", "dentifrice", "zahnpasta"], emoji: "🪥" },
  { keywords: ["papel", "toilet", "toilette", "higiénico"], emoji: "🧻" },
  { keywords: ["detergente", "lessive", "waschmittel", "lavavajillas"], emoji: "🫧" },
  { keywords: ["lixívia", "bleach", "javel", "bleichmittel", "lejía"], emoji: "🧹" },
  { keywords: ["saco", "bag", "sac", "beutel", "bolsa", "lixo", "trash"], emoji: "🗑️" },
  { keywords: ["gelado", "ice cream", "glace", "eis", "helado"], emoji: "🍨" },
  { keywords: ["pizza"], emoji: "🍕" },
  { keywords: ["salsicha", "sausage", "saucisse", "wurst", "salchicha"], emoji: "🌭" },
  { keywords: ["fiambre", "ham", "jambon", "schinken", "jamón"], emoji: "🥓" },
  { keywords: ["noodle", "ramen", "fideo"], emoji: "🍜" },
  { keywords: ["polvo", "octopus", "poulpe", "oktopus", "pulpo"], emoji: "🐙" },
  { keywords: ["sardinha", "sardine"], emoji: "🐟" },
  { keywords: ["bacalhau", "cod", "morue", "kabeljau", "bacalao"], emoji: "🐟" },
  { keywords: ["farinha", "flour", "farine", "mehl", "harina"], emoji: "🌾" },
  { keywords: ["pêra", "pear", "poire", "birne"], emoji: "🍐" },
  { keywords: ["iogurte", "yogurt", "yaourt", "joghurt", "yogur"], emoji: "🥛" },
  { keywords: ["ketchup"], emoji: "🍅" },
  { keywords: ["mostarda", "mustard", "moutarde", "senf"], emoji: "🟡" },
  { keywords: ["maionese", "mayonnaise", "mayonesa"], emoji: "🥚" },
];

export function findEmoji(name) {
  const lower = name.toLowerCase();
  for (const mapping of EMOJI_KEYWORDS) {
    for (const kw of mapping.keywords) {
      if (lower.includes(kw)) return mapping.emoji;
    }
  }
  return "📦"; // fallback
}

export default EMOJI_KEYWORDS;
