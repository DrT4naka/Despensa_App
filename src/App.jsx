import React, { useState, useEffect, useCallback } from 'react';
import LANGUAGES from './data/languages';
import LogicScreen from './screens/LogicScreen';
import DashboardScreen from './screens/DashboardScreen';
import ShopScreen from './screens/ShopScreen';
import ListScreen from './screens/ListScreen';
import PlanScreen from './screens/PlanScreen';
import CookScreen from './screens/CookScreen';
import LogoutModal from './components/modlas/LogoutModal';
import NavBtn from './components/NavBtn';
import {
  loadHousehold, saveHousehold,
  addToInventory, updateInventoryItem, removeFromInventory,
  addToShoppingList, removeFromShoppingList, markAsBought, buyAllItems, clearBoughtItems,
  saveMealPlan, addCustomCategory, getDietaryRestrictions
} from './services/pantryService';

const SESSION_KEY = 'pantry_session';
const TABS = ['panel', 'shop', 'list', 'plan', 'cook'];
const TAB_ICONS = { panel: '📦', shop: '🛒', list: '📝', plan: '📅', cook: '👨‍🍳' };

export default function App() {
  // Session
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  });
  const [lang, setLang] = useState(session?.lang || 'PT');
  const [activeTab, setActiveTab] = useState('panel');
  const [showLogout, setShowLogout] = useState(false);
  const [toast, setToast] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [servings, setServings] = useState(2);

  // Data (reloaded from localStorage)
  const [household, setHousehold] = useState(null);

  const T = LANGUAGES[lang] || LANGUAGES.PT;

  // Load household data
  const reloadData = useCallback(() => {
    if (session?.code) {
      const data = loadHousehold(session.code);
      setHousehold(data);
    }
  }, [session?.code]);

  useEffect(() => { reloadData(); }, [reloadData]);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Login handler
  const handleLogin = ({ name, code, lang: newLang }) => {
    const s = { name, code, lang: newLang };
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
    setLang(newLang);
    reloadData();
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setHousehold(null);
    setShowLogout(false);
    setActiveTab('panel');
  };

  // Language change
  const handleLangChange = (newLang) => {
    setLang(newLang);
    if (session) {
      const s = { ...session, lang: newLang };
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSession(s);
    }
  };

  // ── Inventory handlers ──
  const handleAddToInventory = (id, item) => {
    addToInventory(session.code, id, { ...item, updatedBy: session.name });
    reloadData();
    showToast(`✅ ${item.name}`);
  };

  const handleUpdateItem = (id, updates) => {
    updateInventoryItem(session.code, id, { ...updates, updatedBy: session.name });
    reloadData();
  };

  const handleRemoveItem = (id) => {
    removeFromInventory(session.code, id);
    reloadData();
  };

  const handleAddToList = (id, item) => {
    addToShoppingList(session.code, id, { ...item, addedBy: session.name });
    reloadData();
  };

  // ── Shopping list handlers ──
  const handleBuy = (id) => {
    markAsBought(session.code, id);
    reloadData();
  };

  const handleBuyAll = () => {
    buyAllItems(session.code);
    reloadData();
    showToast('🛒 ✅');
  };

  const handleRemoveFromList = (id) => {
    removeFromShoppingList(session.code, id);
    reloadData();
  };

  const handleClearBought = () => {
    clearBoughtItems(session.code);
    reloadData();
    showToast('📦 ✅');
  };

  // ── Plan handlers ──
  const handleSaveMeal = (dateKey, mealIndex, mealData) => {
    saveMealPlan(session.code, dateKey, mealIndex, mealData);
    reloadData();
  };

  const handleViewRecipe = (r) => {
    setRecipe(r);
    setActiveTab('cook');
  };

  // ── Category handlers ──
  const handleAddCategory = (key, data) => {
    addCustomCategory(session.code, key, data);
    reloadData();
  };

  // Not logged in → show login
  if (!session) {
    return <LogicScreen onLogin={handleLogin} />;
  }

  const dietaryRestrictions = household ? getDietaryRestrictions(session.code) : [];

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="app-header">
        <h1>🏠 Pantry</h1>
        <div className="header-actions">
          <select
            className="lang-select"
            value={lang}
            onChange={e => handleLangChange(e.target.value)}
          >
            {Object.keys(LANGUAGES).map(k => (
              <option key={k} value={k}>{LANGUAGES[k].flag} {k}</option>
            ))}
          </select>
          <button className="header-btn" onClick={() => setShowLogout(true)} title={T.logout}>
            🚪
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="app-content">
        {activeTab === 'panel' && (
          <DashboardScreen
            T={T}
            lang={lang}
            inventory={household?.inventory}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onAddToList={handleAddToList}
          />
        )}
        {activeTab === 'shop' && (
          <ShopScreen
            T={T}
            lang={lang}
            inventory={household?.inventory}
            onAddToInventory={handleAddToInventory}
            customCategories={household?.categories}
            onAddCategory={handleAddCategory}
          />
        )}
        {activeTab === 'list' && (
          <ListScreen
            T={T}
            lang={lang}
            shoppingList={household?.shoppingList}
            onBuy={handleBuy}
            onBuyAll={handleBuyAll}
            onRemove={handleRemoveFromList}
            onClearBought={handleClearBought}
          />
        )}
        {activeTab === 'plan' && (
          <PlanScreen
            T={T}
            lang={lang}
            plans={household?.plans}
            servings={servings}
            onSetServings={setServings}
            onSaveMeal={handleSaveMeal}
            onViewRecipe={handleViewRecipe}
            inventory={household?.inventory}
            dietaryRestrictions={dietaryRestrictions}
          />
        )}
        {activeTab === 'cook' && (
          <CookScreen
            T={T}
            lang={lang}
            recipe={recipe}
            onFinish={() => { setRecipe(null); setActiveTab('plan'); }}
            onDiscard={() => { setRecipe(null); setActiveTab('plan'); }}
          />
        )}
      </div>

      {/* Nav bar */}
      <nav className="nav-bar">
        {TABS.map(tab => (
          <NavBtn
            key={tab}
            icon={TAB_ICONS[tab]}
            label={T[tab] || tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </nav>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Logout modal */}
      {showLogout && (
        <LogoutModal
          T={T}
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
}
