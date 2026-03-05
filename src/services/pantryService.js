/**
 * Serviço de persistência da despensa.
 * Usa localStorage. Quando Firebase estiver configurado, trocar aqui.
 */

const STORAGE_KEY = "pantry_data";

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadHousehold(code) {
  const all = loadAll();
  return all[code] || null;
}

export function saveHousehold(code, data) {
  const all = loadAll();
  all[code] = data;
  saveAll(all);
}

export function householdExists(code) {
  return !!loadHousehold(code);
}

export function createHousehold(code, userName, lang, dietaryRestrictions = []) {
  const data = {
    code,
    createdAt: new Date().toISOString(),
    members: { [userName]: { name: userName, joinedAt: new Date().toISOString(), dietaryRestrictions } },
    inventory: {},
    shoppingList: {},
    plans: {},
    categories: {},
    settings: { lang }
  };
  saveHousehold(code, data);
  return data;
}

export function joinHousehold(code, userName, dietaryRestrictions = []) {
  const data = loadHousehold(code);
  if (!data) return null;
  if (!data.members) data.members = {};
  data.members[userName] = { name: userName, joinedAt: new Date().toISOString(), dietaryRestrictions };
  saveHousehold(code, data);
  return data;
}

/* ── Inventário ── */

export function getInventory(code) {
  const data = loadHousehold(code);
  return data?.inventory || {};
}

export function addToInventory(code, itemId, item) {
  const data = loadHousehold(code);
  if (!data) return;
  if (!data.inventory) data.inventory = {};
  data.inventory[itemId] = item;
  saveHousehold(code, data);
}

export function updateInventoryItem(code, itemId, updates) {
  const data = loadHousehold(code);
  if (!data?.inventory?.[itemId]) return;
  Object.assign(data.inventory[itemId], updates);
  saveHousehold(code, data);
}

export function removeFromInventory(code, itemId) {
  const data = loadHousehold(code);
  if (!data?.inventory) return;
  delete data.inventory[itemId];
  saveHousehold(code, data);
}

/* ── Lista de Compras ── */

export function getShoppingList(code) {
  const data = loadHousehold(code);
  return data?.shoppingList || {};
}

export function addToShoppingList(code, itemId, item) {
  const data = loadHousehold(code);
  if (!data) return;
  if (!data.shoppingList) data.shoppingList = {};
  data.shoppingList[itemId] = item;
  saveHousehold(code, data);
}

export function removeFromShoppingList(code, itemId) {
  const data = loadHousehold(code);
  if (!data?.shoppingList) return;
  delete data.shoppingList[itemId];
  saveHousehold(code, data);
}

export function markAsBought(code, itemId) {
  const data = loadHousehold(code);
  if (!data?.shoppingList?.[itemId]) return;
  const item = data.shoppingList[itemId];
  item.bought = true;
  item.boughtAt = new Date().toISOString();
  saveHousehold(code, data);
}

export function buyAllItems(code) {
  const data = loadHousehold(code);
  if (!data?.shoppingList) return;
  Object.keys(data.shoppingList).forEach(id => {
    data.shoppingList[id].bought = true;
    data.shoppingList[id].boughtAt = new Date().toISOString();
  });
  saveHousehold(code, data);
}

export function clearBoughtItems(code) {
  const data = loadHousehold(code);
  if (!data?.shoppingList) return;
  Object.keys(data.shoppingList).forEach(id => {
    if (data.shoppingList[id].bought) {
      // Move to inventory
      if (!data.inventory) data.inventory = {};
      const item = data.shoppingList[id];
      data.inventory[id] = {
        ...item,
        addedAt: new Date().toISOString(),
        bought: undefined,
        boughtAt: undefined
      };
      delete data.shoppingList[id];
    }
  });
  saveHousehold(code, data);
}

/* ── Plano Semanal ── */

export function getPlans(code) {
  const data = loadHousehold(code);
  return data?.plans || {};
}

export function saveMealPlan(code, dateKey, mealIndex, mealData) {
  const data = loadHousehold(code);
  if (!data) return;
  if (!data.plans) data.plans = {};
  if (!data.plans[dateKey]) data.plans[dateKey] = {};
  data.plans[dateKey][mealIndex] = mealData;
  saveHousehold(code, data);
}

/* ── Custom Categories ── */

export function getCustomCategories(code) {
  const data = loadHousehold(code);
  return data?.categories || {};
}

export function addCustomCategory(code, catId, catData) {
  const data = loadHousehold(code);
  if (!data) return;
  if (!data.categories) data.categories = {};
  data.categories[catId] = catData;
  saveHousehold(code, data);
}

/* ── Members & Dietary ── */

export function getMembers(code) {
  const data = loadHousehold(code);
  return data?.members || {};
}

export function updateMemberDietary(code, userName, restrictions) {
  const data = loadHousehold(code);
  if (!data?.members?.[userName]) return;
  data.members[userName].dietaryRestrictions = restrictions;
  saveHousehold(code, data);
}

export function getDietaryRestrictions(code) {
  const data = loadHousehold(code);
  if (!data?.members) return [];
  const all = new Set();
  Object.values(data.members).forEach(m => {
    (m.dietaryRestrictions || []).forEach(r => all.add(r));
  });
  return [...all];
}
