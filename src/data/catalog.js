/* Catálogo de produtos pré-definidos organizados por categoria.
   Cada produto tem: id, nomes (multi-idioma), emoji, categoria, unidade padrão,
   e consumo estimado (dias por unidade). */

const CATALOG = {
  /* ── Arroz / Massa ── */
  arroz_branco:      { emoji: "🍚", cat: "arroz_massa", unit: "kg",  defaultDays: 90,  names: { PT: "Arroz Branco",       ES: "Arroz Blanco",       EN: "White Rice",         FR: "Riz Blanc",          DE: "Weißer Reis" } },
  arroz_integral:    { emoji: "🍘", cat: "arroz_massa", unit: "kg",  defaultDays: 90,  names: { PT: "Arroz Integral",     ES: "Arroz Integral",     EN: "Brown Rice",         FR: "Riz Complet",        DE: "Vollkornreis" } },
  massa_esparguete:  { emoji: "🍝", cat: "arroz_massa", unit: "kg",  defaultDays: 180, names: { PT: "Esparguete",         ES: "Espagueti",          EN: "Spaghetti",          FR: "Spaghetti",          DE: "Spaghetti" } },
  massa_fusilli:     { emoji: "🍝", cat: "arroz_massa", unit: "kg",  defaultDays: 180, names: { PT: "Fusilli",            ES: "Fusilli",            EN: "Fusilli",            FR: "Fusilli",            DE: "Fusilli" } },
  massa_penne:       { emoji: "🍝", cat: "arroz_massa", unit: "kg",  defaultDays: 180, names: { PT: "Penne",              ES: "Penne",              EN: "Penne",              FR: "Penne",              DE: "Penne" } },
  couscous:          { emoji: "🥘", cat: "arroz_massa", unit: "kg",  defaultDays: 180, names: { PT: "Couscous",           ES: "Cuscus",             EN: "Couscous",           FR: "Couscous",           DE: "Couscous" } },
  noodles:           { emoji: "🍜", cat: "arroz_massa", unit: "un",  defaultDays: 180, names: { PT: "Noodles",            ES: "Fideos",             EN: "Noodles",            FR: "Nouilles",           DE: "Nudeln" } },

  /* ── Óleos / Temperos ── */
  azeite:            { emoji: "🫒", cat: "azeites", unit: "L",   defaultDays: 180, names: { PT: "Azeite",              ES: "Aceite de Oliva",    EN: "Olive Oil",          FR: "Huile d'Olive",      DE: "Olivenöl" } },
  oleo_girassol:     { emoji: "🌻", cat: "azeites", unit: "L",   defaultDays: 120, names: { PT: "Óleo de Girassol",   ES: "Aceite de Girasol",  EN: "Sunflower Oil",      FR: "Huile de Tournesol", DE: "Sonnenblumenöl" } },
  oleo_cozinha:      { emoji: "🫗", cat: "azeites", unit: "L",   defaultDays: 120, names: { PT: "Óleo de Cozinha",    ES: "Aceite de Cocina",   EN: "Cooking Oil",        FR: "Huile de Cuisine",   DE: "Speiseöl" } },
  vinagre:           { emoji: "🫙", cat: "azeites", unit: "L",   defaultDays: 360, names: { PT: "Vinagre",             ES: "Vinagre",            EN: "Vinegar",            FR: "Vinaigre",           DE: "Essig" } },
  sal:               { emoji: "🧂", cat: "azeites", unit: "kg",  defaultDays: 360, names: { PT: "Sal",                 ES: "Sal",                EN: "Salt",               FR: "Sel",                DE: "Salz" } },
  pimenta:           { emoji: "🌶️", cat: "azeites", unit: "un",  defaultDays: 180, names: { PT: "Pimenta",             ES: "Pimienta",           EN: "Pepper",             FR: "Poivre",             DE: "Pfeffer" } },
  acucar:            { emoji: "🍬", cat: "azeites", unit: "kg",  defaultDays: 180, names: { PT: "Açúcar",              ES: "Azúcar",             EN: "Sugar",              FR: "Sucre",              DE: "Zucker" } },
  canela:            { emoji: "🫕", cat: "azeites", unit: "un",  defaultDays: 360, names: { PT: "Canela",              ES: "Canela",             EN: "Cinnamon",           FR: "Cannelle",           DE: "Zimt" } },
  oregaos:           { emoji: "🌿", cat: "azeites", unit: "un",  defaultDays: 360, names: { PT: "Orégãos",             ES: "Orégano",            EN: "Oregano",            FR: "Origan",             DE: "Oregano" } },
  alho:              { emoji: "🧄", cat: "azeites", unit: "un",  defaultDays: 14,  names: { PT: "Alho",                ES: "Ajo",                EN: "Garlic",             FR: "Ail",                DE: "Knoblauch" } },

  /* ── Bebidas ── */
  agua:              { emoji: "💧", cat: "bebidas", unit: "L",   defaultDays: 30,  names: { PT: "Água",                ES: "Agua",               EN: "Water",              FR: "Eau",                DE: "Wasser" } },
  sumo_laranja:      { emoji: "🍊", cat: "bebidas", unit: "L",   defaultDays: 7,   names: { PT: "Sumo de Laranja",    ES: "Zumo de Naranja",    EN: "Orange Juice",       FR: "Jus d'Orange",       DE: "Orangensaft" } },
  coca_cola:         { emoji: "🥤", cat: "bebidas", unit: "L",   defaultDays: 7,   names: { PT: "Coca-Cola",           ES: "Coca-Cola",          EN: "Coca-Cola",          FR: "Coca-Cola",          DE: "Coca-Cola" } },
  cerveja:           { emoji: "🍺", cat: "bebidas", unit: "un",  defaultDays: 7,   names: { PT: "Cerveja",             ES: "Cerveza",            EN: "Beer",               FR: "Bière",              DE: "Bier" } },
  vinho:             { emoji: "🍷", cat: "bebidas", unit: "L",   defaultDays: 14,  names: { PT: "Vinho",               ES: "Vino",               EN: "Wine",               FR: "Vin",                DE: "Wein" } },
  cafe:              { emoji: "☕", cat: "bebidas", unit: "un",  defaultDays: 30,  names: { PT: "Café",                ES: "Café",               EN: "Coffee",             FR: "Café",               DE: "Kaffee" } },
  cha:               { emoji: "🍵", cat: "bebidas", unit: "un",  defaultDays: 60,  names: { PT: "Chá",                 ES: "Té",                 EN: "Tea",                FR: "Thé",                DE: "Tee" } },
  leite:             { emoji: "🥛", cat: "bebidas", unit: "L",   defaultDays: 3,   names: { PT: "Leite",               ES: "Leche",              EN: "Milk",               FR: "Lait",               DE: "Milch" } },

  /* ── Congelados ── */
  legumes_cong:      { emoji: "🥦", cat: "congelados", unit: "kg", defaultDays: 90,  names: { PT: "Legumes Congelados", ES: "Verduras Congeladas", EN: "Frozen Vegetables", FR: "Légumes Surgelés",   DE: "TK-Gemüse" } },
  peixe_cong:        { emoji: "🐟", cat: "congelados", unit: "kg", defaultDays: 90,  names: { PT: "Peixe Congelado",    ES: "Pescado Congelado",  EN: "Frozen Fish",        FR: "Poisson Surgelé",    DE: "TK-Fisch" } },
  pizza_cong:        { emoji: "🍕", cat: "congelados", unit: "un", defaultDays: 60,  names: { PT: "Pizza Congelada",    ES: "Pizza Congelada",    EN: "Frozen Pizza",       FR: "Pizza Surgelée",     DE: "TK-Pizza" } },
  gelado:            { emoji: "🍨", cat: "congelados", unit: "un", defaultDays: 30,  names: { PT: "Gelado",              ES: "Helado",             EN: "Ice Cream",          FR: "Glace",              DE: "Eis" } },
  batata_frita_cong: { emoji: "🍟", cat: "congelados", unit: "kg", defaultDays: 90,  names: { PT: "Batata Frita Cong.", ES: "Patatas Congeladas", EN: "Frozen Fries",       FR: "Frites Surgelées",   DE: "TK-Pommes" } },

  /* ── Conservas ── */
  atum:              { emoji: "🐟", cat: "conservas", unit: "un", defaultDays: 360, names: { PT: "Atum em Lata",       ES: "Atún en Lata",       EN: "Canned Tuna",        FR: "Thon en Boîte",      DE: "Thunfisch Dose" } },
  feijao_lata:       { emoji: "🫘", cat: "conservas", unit: "un", defaultDays: 360, names: { PT: "Feijão em Lata",     ES: "Frijoles en Lata",   EN: "Canned Beans",       FR: "Haricots en Boîte",  DE: "Bohnen Dose" } },
  milho_lata:        { emoji: "🌽", cat: "conservas", unit: "un", defaultDays: 360, names: { PT: "Milho em Lata",      ES: "Maíz en Lata",       EN: "Canned Corn",        FR: "Maïs en Boîte",      DE: "Mais Dose" } },
  tomate_pelado:     { emoji: "🍅", cat: "conservas", unit: "un", defaultDays: 360, names: { PT: "Tomate Pelado",      ES: "Tomate Pelado",      EN: "Peeled Tomatoes",    FR: "Tomates Pelées",     DE: "Geschälte Tomaten" } },
  ervilhas_lata:     { emoji: "🟢", cat: "conservas", unit: "un", defaultDays: 360, names: { PT: "Ervilhas em Lata",   ES: "Guisantes en Lata",  EN: "Canned Peas",        FR: "Petits Pois",        DE: "Erbsen Dose" } },

  /* ── Doces / Snacks ── */
  chocolate:         { emoji: "🍫", cat: "doces", unit: "un",  defaultDays: 14,  names: { PT: "Chocolate",            ES: "Chocolate",          EN: "Chocolate",          FR: "Chocolat",           DE: "Schokolade" } },
  bolachas:          { emoji: "🍪", cat: "doces", unit: "un",  defaultDays: 14,  names: { PT: "Bolachas",             ES: "Galletas",           EN: "Cookies",            FR: "Biscuits",           DE: "Kekse" } },
  batatas_fritas:    { emoji: "🥔", cat: "doces", unit: "un",  defaultDays: 7,   names: { PT: "Batatas Fritas",      ES: "Patatas Fritas",     EN: "Chips",              FR: "Chips",              DE: "Chips" } },
  cereais:           { emoji: "🥣", cat: "doces", unit: "un",  defaultDays: 14,  names: { PT: "Cereais",              ES: "Cereales",           EN: "Cereal",             FR: "Céréales",           DE: "Müsli" } },
  compota:           { emoji: "🍯", cat: "doces", unit: "un",  defaultDays: 60,  names: { PT: "Compota",              ES: "Mermelada",          EN: "Jam",                FR: "Confiture",          DE: "Marmelade" } },
  mel:               { emoji: "🍯", cat: "doces", unit: "un",  defaultDays: 360, names: { PT: "Mel",                  ES: "Miel",               EN: "Honey",              FR: "Miel",               DE: "Honig" } },

  /* ── Fruta ── */
  banana:            { emoji: "🍌", cat: "fruta", unit: "un",  defaultDays: 5,   names: { PT: "Banana",               ES: "Plátano",            EN: "Banana",             FR: "Banane",             DE: "Banane" } },
  maca:              { emoji: "🍎", cat: "fruta", unit: "un",  defaultDays: 7,   names: { PT: "Maçã",                 ES: "Manzana",            EN: "Apple",              FR: "Pomme",              DE: "Apfel" } },
  laranja:           { emoji: "🍊", cat: "fruta", unit: "un",  defaultDays: 7,   names: { PT: "Laranja",              ES: "Naranja",            EN: "Orange",             FR: "Orange",             DE: "Orange" } },
  morango:           { emoji: "🍓", cat: "fruta", unit: "un",  defaultDays: 3,   names: { PT: "Morango",              ES: "Fresa",              EN: "Strawberry",         FR: "Fraise",             DE: "Erdbeere" } },
  uva:               { emoji: "🍇", cat: "fruta", unit: "un",  defaultDays: 5,   names: { PT: "Uva",                  ES: "Uva",               EN: "Grapes",             FR: "Raisin",             DE: "Traube" } },
  pera:              { emoji: "🍐", cat: "fruta", unit: "un",  defaultDays: 7,   names: { PT: "Pêra",                 ES: "Pera",               EN: "Pear",               FR: "Poire",              DE: "Birne" } },
  limao:             { emoji: "🍋", cat: "fruta", unit: "un",  defaultDays: 14,  names: { PT: "Limão",                ES: "Limón",              EN: "Lemon",              FR: "Citron",             DE: "Zitrone" } },
  manga:             { emoji: "🥭", cat: "fruta", unit: "un",  defaultDays: 5,   names: { PT: "Manga",                ES: "Mango",              EN: "Mango",              FR: "Mangue",             DE: "Mango" } },
  abacaxi:           { emoji: "🍍", cat: "fruta", unit: "un",  defaultDays: 5,   names: { PT: "Ananás",               ES: "Piña",               EN: "Pineapple",          FR: "Ananas",             DE: "Ananas" } },
  melancia:          { emoji: "🍉", cat: "fruta", unit: "un",  defaultDays: 5,   names: { PT: "Melancia",             ES: "Sandía",             EN: "Watermelon",         FR: "Pastèque",           DE: "Wassermelone" } },

  /* ── Higiene ── */
  sabonete:          { emoji: "🧼", cat: "higiene", unit: "un",  defaultDays: 30,  names: { PT: "Sabonete",            ES: "Jabón",              EN: "Soap",               FR: "Savon",              DE: "Seife" } },
  shampoo:           { emoji: "🧴", cat: "higiene", unit: "un",  defaultDays: 30,  names: { PT: "Shampoo",             ES: "Champú",             EN: "Shampoo",            FR: "Shampooing",         DE: "Shampoo" } },
  pasta_dentes:      { emoji: "🪥", cat: "higiene", unit: "un",  defaultDays: 30,  names: { PT: "Pasta de Dentes",    ES: "Pasta de Dientes",   EN: "Toothpaste",         FR: "Dentifrice",         DE: "Zahnpasta" } },
  papel_higienico:   { emoji: "🧻", cat: "higiene", unit: "un",  defaultDays: 7,   names: { PT: "Papel Higiénico",    ES: "Papel Higiénico",    EN: "Toilet Paper",       FR: "Papier Toilette",    DE: "Toilettenpapier" } },
  desodorizante:     { emoji: "🫧", cat: "higiene", unit: "un",  defaultDays: 30,  names: { PT: "Desodorizante",      ES: "Desodorante",        EN: "Deodorant",          FR: "Déodorant",          DE: "Deodorant" } },

  /* ── Laticínios ── */
  iogurte:           { emoji: "🥛", cat: "laticinios", unit: "un", defaultDays: 7,   names: { PT: "Iogurte",           ES: "Yogur",              EN: "Yogurt",             FR: "Yaourt",             DE: "Joghurt" } },
  queijo:            { emoji: "🧀", cat: "laticinios", unit: "un", defaultDays: 14,  names: { PT: "Queijo",            ES: "Queso",              EN: "Cheese",             FR: "Fromage",            DE: "Käse" } },
  manteiga:          { emoji: "🧈", cat: "laticinios", unit: "un", defaultDays: 30,  names: { PT: "Manteiga",          ES: "Mantequilla",        EN: "Butter",             FR: "Beurre",             DE: "Butter" } },
  nata:              { emoji: "🥛", cat: "laticinios", unit: "un", defaultDays: 5,   names: { PT: "Nata",               ES: "Nata",               EN: "Cream",              FR: "Crème",              DE: "Sahne" } },
  ovos:              { emoji: "🥚", cat: "laticinios", unit: "un", defaultDays: 14,  names: { PT: "Ovos",               ES: "Huevos",             EN: "Eggs",               FR: "Œufs",               DE: "Eier" } },

  /* ── Limpeza ── */
  detergente_roupa:  { emoji: "🫧", cat: "limpeza", unit: "un", defaultDays: 30,   names: { PT: "Detergente Roupa",   ES: "Detergente Ropa",    EN: "Laundry Detergent",  FR: "Lessive",            DE: "Waschmittel" } },
  detergente_louca:  { emoji: "🍽️", cat: "limpeza", unit: "un", defaultDays: 14,   names: { PT: "Detergente Louça",   ES: "Lavavajillas",       EN: "Dish Soap",          FR: "Liquide Vaisselle",  DE: "Spülmittel" } },
  lixivia:           { emoji: "🧹", cat: "limpeza", unit: "L",  defaultDays: 30,   names: { PT: "Lixívia",             ES: "Lejía",              EN: "Bleach",             FR: "Javel",              DE: "Bleichmittel" } },
  sacos_lixo:        { emoji: "🗑️", cat: "limpeza", unit: "un", defaultDays: 30,   names: { PT: "Sacos do Lixo",      ES: "Bolsas de Basura",   EN: "Trash Bags",         FR: "Sacs Poubelle",      DE: "Müllbeutel" } },
  limpa_vidros:      { emoji: "🪟", cat: "limpeza", unit: "un", defaultDays: 60,   names: { PT: "Limpa Vidros",       ES: "Limpiacristales",    EN: "Glass Cleaner",      FR: "Nettoyant Vitres",   DE: "Glasreiniger" } },

  /* ── Padaria / Pastelaria ── */
  pao:               { emoji: "🍞", cat: "padaria_pastelaria", unit: "un", defaultDays: 2,  names: { PT: "Pão",                ES: "Pan",                EN: "Bread",              FR: "Pain",               DE: "Brot" } },
  pao_forma:         { emoji: "🍞", cat: "padaria_pastelaria", unit: "un", defaultDays: 7,  names: { PT: "Pão de Forma",      ES: "Pan de Molde",       EN: "Sliced Bread",       FR: "Pain de Mie",        DE: "Toastbrot" } },
  croissant:         { emoji: "🥐", cat: "padaria_pastelaria", unit: "un", defaultDays: 2,  names: { PT: "Croissant",          ES: "Croissant",          EN: "Croissant",          FR: "Croissant",          DE: "Croissant" } },
  bolo:              { emoji: "🍰", cat: "padaria_pastelaria", unit: "un", defaultDays: 3,  names: { PT: "Bolo",               ES: "Pastel",             EN: "Cake",               FR: "Gâteau",             DE: "Kuchen" } },
  farinha:           { emoji: "🌾", cat: "padaria_pastelaria", unit: "kg", defaultDays: 180, names: { PT: "Farinha",            ES: "Harina",             EN: "Flour",              FR: "Farine",             DE: "Mehl" } },

  /* ── Peixaria ── */
  salmao:            { emoji: "🐟", cat: "peixaria", unit: "kg", defaultDays: 2,   names: { PT: "Salmão",              ES: "Salmón",             EN: "Salmon",             FR: "Saumon",             DE: "Lachs" } },
  bacalhau:          { emoji: "🐟", cat: "peixaria", unit: "kg", defaultDays: 5,   names: { PT: "Bacalhau",            ES: "Bacalao",            EN: "Codfish",            FR: "Morue",              DE: "Kabeljau" } },
  camarao:           { emoji: "🦐", cat: "peixaria", unit: "kg", defaultDays: 2,   names: { PT: "Camarão",             ES: "Camarón",            EN: "Shrimp",             FR: "Crevette",           DE: "Garnelen" } },
  polvo:             { emoji: "🐙", cat: "peixaria", unit: "kg", defaultDays: 2,   names: { PT: "Polvo",               ES: "Pulpo",              EN: "Octopus",            FR: "Poulpe",             DE: "Oktopus" } },
  sardinha:          { emoji: "🐟", cat: "peixaria", unit: "kg", defaultDays: 1,   names: { PT: "Sardinha",            ES: "Sardina",            EN: "Sardine",            FR: "Sardine",            DE: "Sardine" } },

  /* ── Talho ── */
  frango:            { emoji: "🍗", cat: "talho", unit: "kg", defaultDays: 2,    names: { PT: "Frango",               ES: "Pollo",              EN: "Chicken",            FR: "Poulet",             DE: "Hähnchen" } },
  carne_vaca:        { emoji: "🥩", cat: "talho", unit: "kg", defaultDays: 2,    names: { PT: "Carne de Vaca",       ES: "Carne de Res",       EN: "Beef",               FR: "Bœuf",               DE: "Rindfleisch" } },
  carne_porco:       { emoji: "🥓", cat: "talho", unit: "kg", defaultDays: 2,    names: { PT: "Carne de Porco",     ES: "Cerdo",              EN: "Pork",               FR: "Porc",               DE: "Schweinefleisch" } },
  fiambre:           { emoji: "🥓", cat: "talho", unit: "un", defaultDays: 7,    names: { PT: "Fiambre",              ES: "Jamón",              EN: "Ham",                FR: "Jambon",             DE: "Schinken" } },
  salsicha:          { emoji: "🌭", cat: "talho", unit: "un", defaultDays: 5,    names: { PT: "Salsicha",             ES: "Salchicha",          EN: "Sausage",            FR: "Saucisse",           DE: "Wurst" } },
  carne_picada:      { emoji: "🥩", cat: "talho", unit: "kg", defaultDays: 1,    names: { PT: "Carne Picada",        ES: "Carne Molida",       EN: "Ground Meat",        FR: "Viande Hachée",      DE: "Hackfleisch" } },

  /* ── Vegetais ── */
  tomate:            { emoji: "🍅", cat: "vegetais", unit: "un", defaultDays: 5,  names: { PT: "Tomate",               ES: "Tomate",             EN: "Tomato",             FR: "Tomate",             DE: "Tomate" } },
  cebola:            { emoji: "🧅", cat: "vegetais", unit: "un", defaultDays: 14, names: { PT: "Cebola",               ES: "Cebolla",            EN: "Onion",              FR: "Oignon",             DE: "Zwiebel" } },
  batata:            { emoji: "🥔", cat: "vegetais", unit: "kg", defaultDays: 21, names: { PT: "Batata",               ES: "Patata",             EN: "Potato",             FR: "Pomme de Terre",     DE: "Kartoffel" } },
  cenoura:           { emoji: "🥕", cat: "vegetais", unit: "un", defaultDays: 14, names: { PT: "Cenoura",              ES: "Zanahoria",          EN: "Carrot",             FR: "Carotte",            DE: "Karotte" } },
  alface:            { emoji: "🥬", cat: "vegetais", unit: "un", defaultDays: 5,  names: { PT: "Alface",               ES: "Lechuga",            EN: "Lettuce",            FR: "Laitue",             DE: "Salat" } },
  pepino:            { emoji: "🥒", cat: "vegetais", unit: "un", defaultDays: 7,  names: { PT: "Pepino",               ES: "Pepino",             EN: "Cucumber",           FR: "Concombre",          DE: "Gurke" } },
  pimento:           { emoji: "🫑", cat: "vegetais", unit: "un", defaultDays: 7,  names: { PT: "Pimento",              ES: "Pimiento",           EN: "Bell Pepper",        FR: "Poivron",            DE: "Paprika" } },
  brocolo:           { emoji: "🥦", cat: "vegetais", unit: "un", defaultDays: 5,  names: { PT: "Brócolo",              ES: "Brócoli",            EN: "Broccoli",           FR: "Brocoli",            DE: "Brokkoli" } },
  espinafre:         { emoji: "🥬", cat: "vegetais", unit: "un", defaultDays: 3,  names: { PT: "Espinafre",            ES: "Espinaca",           EN: "Spinach",            FR: "Épinard",            DE: "Spinat" } },
  cogumelo:          { emoji: "🍄", cat: "vegetais", unit: "un", defaultDays: 5,  names: { PT: "Cogumelo",             ES: "Champiñón",          EN: "Mushroom",           FR: "Champignon",         DE: "Pilz" } },

  /* ── Outros ── */
  ketchup:           { emoji: "🍅", cat: "outros", unit: "un", defaultDays: 60,  names: { PT: "Ketchup",              ES: "Ketchup",            EN: "Ketchup",            FR: "Ketchup",            DE: "Ketchup" } },
  mostarda:          { emoji: "🟡", cat: "outros", unit: "un", defaultDays: 60,  names: { PT: "Mostarda",             ES: "Mostaza",            EN: "Mustard",            FR: "Moutarde",           DE: "Senf" } },
  maionese:          { emoji: "🥚", cat: "outros", unit: "un", defaultDays: 30,  names: { PT: "Maionese",             ES: "Mayonesa",           EN: "Mayonnaise",         FR: "Mayonnaise",         DE: "Mayonnaise" } },
  molho_soja:        { emoji: "🫗", cat: "outros", unit: "un", defaultDays: 180, names: { PT: "Molho de Soja",       ES: "Salsa de Soja",      EN: "Soy Sauce",          FR: "Sauce Soja",         DE: "Sojasauce" } },
};

export default CATALOG;
