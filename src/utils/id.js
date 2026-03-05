/** Gera IDs únicos simples para items e despensas */

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function generatePantryCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
