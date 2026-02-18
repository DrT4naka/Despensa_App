// Tipos básicos para o app
export type Language = 'PT' | 'EN' | 'ES' | 'FR' | 'DE';

export type Unit = 'unid' | 'g' | 'kg' | 'ml' | 'L' | 'emb' | 'q.b.' | 'par' | 'dose';

export interface LocalizedString {
  [key: string]: string;
}

export interface Category {
  id: string;
  name: string; // Current localized name
  icon: string;
  fixed?: boolean;
}

export interface ProductDef {
  id: string;
  names: { [key in Language]?: string };
  icon: string;
  unit: Unit;
  category: string;
}

export interface InventoryItem extends ProductDef {
  stockQuantity: number;
  listQuantity: number; // Shopping list amount
  consumptionStep?: number;
  consumptionPeriod?: number; // In days
  updatedAt?: number;
  lastUser?: string;
  expiryDate?: string; // YYYY-MM-DD
  manual?: boolean;
  categories?: string[]; // Legacy support
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  missing?: boolean;
}

export interface Recipe {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  time: number;
  baseServings: number;
  calories?: number;
}

export interface MealPlanItem {
  type: 'ai' | 'manual';
  data: Recipe | { title: string }; // If manual, just title in data
  updatedBy?: string;
  updatedAt?: number;
  manualType?: 'cooked_alone' | 'ate_out'; // New manual types
}

export interface DayPlan {
  meals: { [key: number]: MealPlanItem }; // Key is meal index (0-4)
}

export interface WeeklyPlan {
  [dateId: string]: DayPlan;
}

export interface UserSettings {
  name: string;
  dietaryRestrictions: string[]; // e.g., 'vegan', 'gluten_free'
  householdId: string;
}
