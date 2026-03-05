/** Formatação de unidades e quantidades */

export const UNITS = ["un", "kg", "g", "L", "mL"];

export function formatQty(qty, unit) {
  if (unit === "un") return `${Math.round(qty)}`;
  return `${qty % 1 === 0 ? qty : qty.toFixed(1)}`;
}

export function formatIngredient(name, qty, unit) {
  if (!qty || qty === 0) return name;
  // "qb" → "q.b." (quanto basta)
  if (unit === "qb" || unit === "QB") {
    return `${name} q.b.`;
  }
  return `${formatQty(qty, unit)} ${unit} ${name}`;
}
