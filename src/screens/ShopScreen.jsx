import React, { useState } from 'react';
import CATALOG from '../data/catalog';
import AddProductModal from '../components/modlas/AddProductModal';
import AddCategoryModal from '../components/modlas/AddCategoryModal';

const ALL_CATS_KEY = '__all__';

export default function ShopScreen({ T, lang, inventory, onAddToInventory, customCategories, onAddCategory }) {
  const [activeCat, setActiveCat] = useState(ALL_CATS_KEY);
  const [search, setSearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const catalogEntries = Object.entries(CATALOG);
  const inventoryIds = new Set(Object.keys(inventory || {}));

  // All categories from catalog
  const defaultCats = [...new Set(catalogEntries.map(([, p]) => p.cat))].sort();
  const allCats = [...defaultCats, ...Object.keys(customCategories || {})];

  const getCatName = (catKey) => {
    if (T.cats?.[catKey]) return T.cats[catKey];
    if (customCategories?.[catKey]) return customCategories[catKey].name;
    return catKey;
  };

  const getProductName = (product) => product.names?.[lang] || product.names?.PT || product.name || '';

  // Filter
  const filtered = catalogEntries.filter(([id, product]) => {
    const matchesCat = activeCat === ALL_CATS_KEY || product.cat === activeCat;
    const name = getProductName(product);
    const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCatalogAdd = (id, product) => {
    const name = getProductName(product);
    onAddToInventory(id, {
      name,
      emoji: product.emoji,
      cat: product.cat,
      unit: product.unit,
      qty: 1,
      consumeDays: product.defaultDays || 7,
      addedAt: new Date().toISOString(),
    });
  };

  const handleCustomAdd = (productData) => {
    const id = productData.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString(36);
    onAddToInventory(id, {
      ...productData,
      addedAt: new Date().toISOString(),
      expiryDate: productData.expiryDays 
        ? new Date(Date.now() + productData.expiryDays * 86400000).toISOString().slice(0, 10)
        : null,
    });
    setShowAddProduct(false);
  };

  const handleAddCategory = (name) => {
    const key = name.toLowerCase().replace(/\s+/g, '_');
    onAddCategory(key, { name });
    setShowAddCategory(false);
  };

  return (
    <div>
      <div className="search-bar">
        <input
          placeholder={T.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category tabs - full names */}
      <div className="cat-tabs">
        <button
          className={`cat-tab ${activeCat === ALL_CATS_KEY ? 'active' : ''}`}
          onClick={() => setActiveCat(ALL_CATS_KEY)}
        >
          {T.allCats}
        </button>
        {allCats.map(c => (
          <button
            key={c}
            className={`cat-tab ${activeCat === c ? 'active' : ''}`}
            onClick={() => setActiveCat(c)}
          >
            {getCatName(c)}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="add-custom-btn" style={{ flex: 1 }} onClick={() => setShowAddProduct(true)}>
          ➕ {T.addManual}
        </button>
        <button className="add-custom-btn" style={{ flex: 1 }} onClick={() => setShowAddCategory(true)}>
          📁 {T.addCategory}
        </button>
      </div>

      {/* Catalog grid */}
      <div className="shop-grid">
        {filtered.map(([id, product]) => {
          const isInPantry = inventoryIds.has(id);
          return (
            <button
              key={id}
              className={`shop-item ${isInPantry ? 'in-pantry' : ''}`}
              onClick={() => !isInPantry && handleCatalogAdd(id, product)}
              disabled={isInPantry}
            >
              <span className="shop-emoji">{product.emoji}</span>
              <span className="shop-name">{getProductName(product)}</span>
            </button>
          );
        })}
      </div>

      {showAddProduct && (
        <AddProductModal
          T={T}
          lang={lang}
          onAdd={handleCustomAdd}
          onCancel={() => setShowAddProduct(false)}
          customCategories={customCategories}
        />
      )}

      {showAddCategory && (
        <AddCategoryModal
          T={T}
          onAdd={handleAddCategory}
          onCancel={() => setShowAddCategory(false)}
        />
      )}
    </div>
  );
}
