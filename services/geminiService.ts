import { GoogleGenAI } from "@google/genai";
import { Recipe, Language } from '../types';

// NOTE: In a real environment, use process.env.API_KEY
// The system instruction assumes the key is available.
const apiKey = process.env.API_KEY || "dummy_key"; 

const ai = new GoogleGenAI({ apiKey });

export const generateRecipe = async (
  pantryItems: string,
  mealName: string,
  lang: Language,
  dietaryRestrictions: string[]
): Promise<Recipe | null> => {
  try {
    const dietaryString = dietaryRestrictions.length > 0 
      ? `Consider these dietary restrictions strictly: ${dietaryRestrictions.join(', ')}.` 
      : '';

    const prompt = `
      Act as a professional Chef AI speaking ${lang}. 
      Create a recipe for "${mealName}".
      ${dietaryString}
      Use these pantry items if suitable: ${pantryItems}. Priority to using existing stock.
      
      Return ONLY a JSON object with this exact schema (no markdown formatting):
      {
        "title": "string",
        "ingredients": [
          {"id": "string (keep original ID if from pantry, else generate one)", "name": "string", "amount": number, "unit": "string (use 'q.b.' for salt/spices)", "missing": boolean}
        ],
        "steps": ["string"],
        "time": number (minutes),
        "baseServings": number,
        "calories": number
      }
      Important: For salt, pepper, or spices, use unit 'q.b.' and amount 0.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest', // Using latest flash model as per guidelines
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Recipe;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const detectProductInfo = async (productName: string): Promise<{ icon: string, category: string }> => {
  const lower = productName.toLowerCase();
  
  const mappings = [
    // --- VESTUÁRIO ---
    { keywords: ['meia', 'peúga'], icon: '🧦', cat: 'outros' },
    { keywords: ['sapato', 'ténis', 'sapatilha', 'bota', 'chinelo', 'sandália'], icon: '👟', cat: 'outros' },
    { keywords: ['camisa', 't-shirt', 'top', 'polo', 'blusa'], icon: '👕', cat: 'outros' },
    { keywords: ['calça', 'jeans', 'calção', 'legging'], icon: '👖', cat: 'outros' },
    { keywords: ['casaco', 'blusão', 'camisola', 'sweat', 'sobretudo', 'cardigan'], icon: '🧥', cat: 'outros' },
    { keywords: ['vestido', 'saia'], icon: '👗', cat: 'outros' },
    { keywords: ['cueca', 'boxer', 'soutien', 'biquini', 'fato de banho', 'lingerie'], icon: '👙', cat: 'outros' },
    { keywords: ['pijama', 'roupão'], icon: '🛌', cat: 'outros' },
    { keywords: ['cachecol', 'luva', 'gorro', 'boné', 'chapéu'], icon: '🧣', cat: 'outros' },
    { keywords: ['gravata', 'fato'], icon: '👔', cat: 'outros' },

    // --- CASA / ELETRÓNICA / ESCRITÓRIO ---
    { keywords: ['pilha', 'bateria', 'carregador'], icon: '🔋', cat: 'outros' },
    { keywords: ['lâmpada', 'lampada', 'luz', 'led'], icon: '💡', cat: 'outros' },
    { keywords: ['vela'], icon: '🕯️', cat: 'outros' },
    { keywords: ['livro', 'caderno', 'agenda', 'jornal', 'revista'], icon: '📚', cat: 'outros' },
    { keywords: ['caneta', 'lápis', 'marcador', 'esferográfica'], icon: '🖊️', cat: 'outros' },
    { keywords: ['tesoura', 'cola', 'fita cola'], icon: '✂️', cat: 'outros' },
    { keywords: ['ferramenta', 'martelo', 'chave', 'prego'], icon: '🛠️', cat: 'outros' },

    // --- FARMÁCIA ---
    { keywords: ['ben-u-ron', 'brufen', 'aspirina', 'comprimido', 'medicamento', 'xarope', 'vitamina', 'suplemento'], icon: '💊', cat: 'higiene' },
    { keywords: ['penso', 'ligadura', 'betadine', 'álcool', 'água oxigenada'], icon: '🩹', cat: 'higiene' },
    { keywords: ['termómetro', 'termometro', 'febre'], icon: '🌡️', cat: 'higiene' },
    { keywords: ['preservativo'], icon: '🛡️', cat: 'higiene' },

    // --- FRUTA ---
    { keywords: ['pêra', 'pera'], icon: '🍐', cat: 'fruta' },
    { keywords: ['maçã', 'maca'], icon: '🍎', cat: 'fruta' },
    { keywords: ['banana'], icon: '🍌', cat: 'fruta' },
    { keywords: ['laranja', 'tangerina', 'clementina', 'toranja', 'citrino'], icon: '🍊', cat: 'fruta' },
    { keywords: ['limão', 'limao', 'lima'], icon: '🍋', cat: 'fruta' },
    { keywords: ['uva'], icon: '🍇', cat: 'fruta' },
    { keywords: ['morango', 'framboesa', 'mirtilo', 'amora', 'frutos vermelhos'], icon: '🍓', cat: 'fruta' },
    { keywords: ['melancia'], icon: '🍉', cat: 'fruta' },
    { keywords: ['melão', 'meloa'], icon: '🍈', cat: 'fruta' },
    { keywords: ['pêssego', 'pessego', 'nectarina', 'alperce'], icon: '🍑', cat: 'fruta' },
    { keywords: ['ananás', 'ananas', 'abacaxi'], icon: '🍍', cat: 'fruta' },
    { keywords: ['kiwi'], icon: '🥝', cat: 'fruta' },
    { keywords: ['cereja'], icon: '🍒', cat: 'fruta' },
    { keywords: ['manga'], icon: '🥭', cat: 'fruta' },
    { keywords: ['abacate'], icon: '🥑', cat: 'fruta' },
    { keywords: ['coco'], icon: '🥥', cat: 'fruta' },

    // --- VEGETAIS ---
    { keywords: ['batata', 'batata doce'], icon: '🥔', cat: 'vegetais' },
    { keywords: ['cenoura'], icon: '🥕', cat: 'vegetais' },
    { keywords: ['cebola', 'chalota'], icon: '🧅', cat: 'vegetais' },
    { keywords: ['alho', 'alho francês'], icon: '🧄', cat: 'vegetais' },
    { keywords: ['tomate'], icon: '🍅', cat: 'vegetais' },
    { keywords: ['alface', 'salada', 'rúcula', 'agrião', 'espinafre'], icon: '🥬', cat: 'vegetais' },
    { keywords: ['brócolo', 'brocolos', 'couve', 'repolho'], icon: '🥦', cat: 'vegetais' },
    { keywords: ['pepino'], icon: '🥒', cat: 'vegetais' },
    { keywords: ['pimento', 'pimentão'], icon: '🫑', cat: 'vegetais' },
    { keywords: ['milho'], icon: '🌽', cat: 'vegetais' },
    { keywords: ['cogumelo'], icon: '🍄', cat: 'vegetais' },
    { keywords: ['beringela'], icon: '🍆', cat: 'vegetais' },
    { keywords: ['abóbora', 'abobora'], icon: '🎃', cat: 'vegetais' },

    // --- CARNE ---
    { keywords: ['frango', 'peru', 'pato', 'asa', 'coxa', 'peito'], icon: '🍗', cat: 'talho' },
    { keywords: ['bife', 'vaca', 'novilho', 'vitela', 'carne', 'hambúrguer', 'hamburguer'], icon: '🥩', cat: 'talho' },
    { keywords: ['porco', 'lombo', 'costeleta', 'febra', 'entremeada', 'rojões'], icon: '🐖', cat: 'talho' },
    { keywords: ['salsicha', 'chouriço', 'bacon', 'presunto', 'fiambre', 'salame'], icon: '🥓', cat: 'talho' },

    // --- PEIXE ---
    { keywords: ['peixe', 'pescada', 'bacalhau', 'salmão', 'dourada', 'robalo'], icon: '🐟', cat: 'peixaria' },
    { keywords: ['camarão', 'gambas', 'lagosta', 'caranguejo', 'marisco'], icon: '🦐', cat: 'peixaria' },
    { keywords: ['lula', 'polvo', 'choco'], icon: '🦑', cat: 'peixaria' },
    { keywords: ['atum', 'sardinha', 'cavala', 'conserva'], icon: '🥫', cat: 'conservas' },
    { keywords: ['sushi'], icon: '🍣', cat: 'peixaria' },

    // --- PADARIA / PASTELARIA ---
    { keywords: ['pão', 'pao', 'baguete', 'carcaça', 'bijou', 'broa', 'padaria'], icon: '🥖', cat: 'padaria_pastelaria' },
    { keywords: ['pão de forma', 'tosta'], icon: '🍞', cat: 'padaria_pastelaria' },
    { keywords: ['croissant', 'folhado'], icon: '🥐', cat: 'padaria_pastelaria' },
    { keywords: ['bolo', 'pastel', 'torta'], icon: '🍰', cat: 'doces' },
    { keywords: ['bolacha', 'biscoito', 'cookie'], icon: '🍪', cat: 'padaria_pastelaria' },
    { keywords: ['farinha', 'fermento', 'maizena'], icon: '🌾', cat: 'padaria_pastelaria' },

    // --- ARROZ / MASSA / GRÃOS ---
    { keywords: ['arroz'], icon: '🍚', cat: 'arroz_massa' },
    { keywords: ['massa', 'esparguete', 'macarrão', 'fusilli', 'penne', 'tagliatelle', 'lasanha'], icon: '🍝', cat: 'arroz_massa' },
    { keywords: ['feijão', 'feijao', 'grão', 'grao', 'lentilhas'], icon: '🫘', cat: 'arroz_massa' },
    { keywords: ['cereal', 'cereais', 'aveia', 'granola', 'muesli', 'nestum'], icon: '🥣', cat: 'padaria_pastelaria' },

    // --- LATICÍNIOS / OVOS ---
    { keywords: ['leite'], icon: '🥛', cat: 'laticinios' },
    { keywords: ['queijo', 'requeijão', 'mozzarella'], icon: '🧀', cat: 'laticinios' },
    { keywords: ['manteiga', 'margarina', 'planta'], icon: '🧈', cat: 'laticinios' },
    { keywords: ['ovo', 'ovos'], icon: '🥚', cat: 'laticinios' },
    { keywords: ['iogurte', 'skyr', 'kefir'], icon: '🍦', cat: 'laticinios' },
    { keywords: ['nata', 'natas'], icon: '🥛', cat: 'laticinios' },

    // --- CONGELADOS ---
    { keywords: ['gelado'], icon: '🍦', cat: 'congelados' },
    { keywords: ['pizza'], icon: '🍕', cat: 'congelados' },
    { keywords: ['gelo'], icon: '🧊', cat: 'congelados' },

    // --- BEBIDAS ---
    { keywords: ['água', 'agua'], icon: '💧', cat: 'bebidas' },
    { keywords: ['vinho'], icon: '🍷', cat: 'bebidas' },
    { keywords: ['cerveja', 'fino', 'super bock', 'sagres'], icon: '🍺', cat: 'bebidas' },
    { keywords: ['sumo', 'néctar', 'refrigerante', 'coca-cola', 'pepsi', 'fanta', '7up', 'ice tea'], icon: '🥤', cat: 'bebidas' },
    { keywords: ['café', 'cafe', 'cápsulas'], icon: '☕', cat: 'bebidas' },
    { keywords: ['chá', 'infusão'], icon: '🍵', cat: 'bebidas' },
    { keywords: ['champanhe', 'espumante'], icon: '🍾', cat: 'bebidas' },
    { keywords: ['cocktail', 'licor'], icon: '🍸', cat: 'bebidas' },

    // --- TEMPEROS / ÓLEOS ---
    { keywords: ['azeite'], icon: '🫒', cat: 'azeites' },
    { keywords: ['óleo', 'oleo'], icon: '🌻', cat: 'azeites' },
    { keywords: ['vinagre'], icon: '🍶', cat: 'azeites' },
    { keywords: ['sal'], icon: '🧂', cat: 'azeites' },
    { keywords: ['pimenta', 'regãos', 'cominhos', 'caril', 'canela', 'tempero'], icon: '🌶️', cat: 'azeites' },
    { keywords: ['molho', 'maionese', 'ketchup', 'mostarda', 'polpa'], icon: '🥫', cat: 'azeites' },

    // --- DOCES / SNACKS ---
    { keywords: ['chocolate', 'nutella'], icon: '🍫', cat: 'doces' },
    { keywords: ['gomas', 'rebuçados', 'chupa'], icon: '🍬', cat: 'doces' },
    { keywords: ['pipocas'], icon: '🍿', cat: 'doces' },
    { keywords: ['batata frita', 'doritos', 'ruffles', 'snack'], icon: '🥔', cat: 'doces' },
    { keywords: ['mel', 'compota', 'geleia'], icon: '🍯', cat: 'doces' },
    { keywords: ['açúcar', 'acucar', 'adocante'], icon: '🧂', cat: 'doces' },

    // --- LIMPEZA ---
    { keywords: ['detergente', 'loiça', 'louça', 'fairy'], icon: '🧼', cat: 'limpeza' },
    { keywords: ['roupa', 'amaciador', 'lixívia', 'vanish', 'persil', 'skip', 'ariel', 'sabão'], icon: '🧺', cat: 'limpeza' },
    { keywords: ['limpa', 'vidros', 'chão', 'multiusos', 'ajax', 'cif'], icon: '🪟', cat: 'limpeza' },
    { keywords: ['esponja', 'pano', 'esfregão'], icon: '🧽', cat: 'limpeza' },
    { keywords: ['vassoura', 'esfregona', 'pá', 'aspirador'], icon: '🧹', cat: 'limpeza' },
    { keywords: ['saco', 'lixo'], icon: '🗑️', cat: 'limpeza' },
    { keywords: ['papel alumínio', 'prata', 'película', 'aderente'], icon: '🗞️', cat: 'limpeza' },

    // --- HIGIENE ---
    { keywords: ['papel hig', 'papel higiénico'], icon: '🧻', cat: 'higiene' },
    { keywords: ['champô', 'shampoo', 'condicionador', 'máscara cabelo'], icon: '🧴', cat: 'higiene' },
    { keywords: ['sabonete', 'gel de banho', 'gel duche'], icon: '🧼', cat: 'higiene' },
    { keywords: ['pasta', 'dentes', 'elixir', 'fio dental'], icon: '🪥', cat: 'higiene' },
    { keywords: ['creme', 'hidratante', 'protetor solar', 'loção', 'body'], icon: '🧴', cat: 'higiene' },
    { keywords: ['desodorizante', 'perfume', 'colónia'], icon: '🌸', cat: 'higiene' },
    { keywords: ['lâmina', 'gillette', 'espuma barba'], icon: '🪒', cat: 'higiene' },
    { keywords: ['penso', 'tampão', 'higiene íntima'], icon: '🩸', cat: 'higiene' },
    { keywords: ['fralda', 'toalhitas', 'bebé'], icon: '👶', cat: 'higiene' },

    // --- ANIMAIS ---
    { keywords: ['cão', 'cao', 'cachorro', 'raçãocão'], icon: '🐶', cat: 'outros' },
    { keywords: ['gato', 'gata', 'areia', 'whiskas', 'felix'], icon: '🐱', cat: 'outros' }
  ];

  for (const group of mappings) {
    if (group.keywords.some(k => lower.includes(k))) {
      return { icon: group.icon, category: group.cat };
    }
  }

  // Fallback to default
  return { icon: '📦', category: 'outros' };
};