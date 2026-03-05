/** Caminhos para a base de dados Firebase */

export const PATHS = {
  household: (code) => `households/${code}`,
  inventory: (code) => `households/${code}/inventory`,
  shoppingList: (code) => `households/${code}/shoppingList`,
  plans: (code) => `households/${code}/plans`,
  members: (code) => `households/${code}/members`,
  categories: (code) => `households/${code}/categories`,
  settings: (code) => `households/${code}/settings`,
};
