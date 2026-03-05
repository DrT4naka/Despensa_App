import React, { useState } from 'react';
import { formatDaysLeft } from '../utils/date';
import { todayStr, addDays, daysFromNow } from '../utils/date';
import ConfirmModal from '../components/modlas/ConfirmModal';

const ALL_CATS_KEY = '__all__';

export default function DashboardScreen({ T, lang, inventory, onUpdateItem, onRemoveItem, onAddToList }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(ALL_CATS_KEY);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const items = Object.entries(inventory || {});

  // Get unique categories in inventory
  const cats = [...new Set(items.map(([, item]) => item.cat))].sort();

  // Filter items
  const filtered = items.filter(([id, item]) => {
    const matchesCat = activeCat === ALL_CATS_KEY || item.cat === activeCat;
    const matchesSearch = !search || (item.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCatName = (catKey) => T.cats?.[catKey] || catKey;

  const handleQtyChange = (id, item, delta) => {
    const newQty = Math.max(0, (item.qty || 1) + delta);
    if (newQty === 0) {
      // Remove from inventory, add to shopping list
      setConfirmRemove({ id, item });
    } else {
      onUpdateItem(id, { qty: newQty });
    }
  };

  const handleRemoveConfirm = () => {
    if (confirmRemove) {
      onRemoveItem(confirmRemove.id);
      // Add to shopping list
      onAddToList(confirmRemove.id, confirmRemove.item);
      setConfirmRemove(null);
    }
  };

  const getDaysInfo = (item) => {
    if (!item.addedAt || !item.consumeDays) return null;
    const totalDays = item.consumeDays * (item.qty || 1);
    const elapsed = daysFromNow(item.addedAt) * -1; // days since added (positive)
    const remaining = Math.max(0, totalDays - elapsed);
    return { remaining, total: totalDays };
  };

  const getExpiryInfo = (item) => {
    if (!item.expiryDate) return null;
    const daysLeft = daysFromNow(item.expiryDate);
    return daysLeft;
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
        {cats.map(c => (
          <button
            key={c}
            className={`cat-tab ${activeCat === c ? 'active' : ''}`}
            onClick={() => setActiveCat(c)}
          >
            {getCatName(c)}
          </button>
        ))}
      </div>

      {/* Products */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <div>{T.empty}</div>
        </div>
      ) : (
        <div className="product-list">
          {filtered.map(([id, item]) => {
            const daysInfo = getDaysInfo(item);
            const expiryDaysLeft = getExpiryInfo(item);
            const badge = daysInfo ? formatDaysLeft(daysInfo.remaining, lang) : null;

            return (
              <div key={id} className="product-card">
                <div className="product-emoji">{item.emoji || '📦'}</div>
                <div className="product-info">
                  <div className="product-name">{item.name}</div>
                  <div className="product-meta">
                    <span>{getCatName(item.cat)}</span>
                    {item.updatedBy && <span>{T.updatedBy} {item.updatedBy}</span>}
                    {daysInfo && (
                      <span className={daysInfo.remaining <= 0 ? 'expiry-danger' : daysInfo.remaining <= 3 ? 'expiry-warning' : 'expiry-ok'}>
                        {T.rest}: {daysInfo.remaining > 0 ? `${daysInfo.remaining} ${T.days}` : '0'}
                      </span>
                    )}
                    {expiryDaysLeft !== null && (
                      <span className={expiryDaysLeft <= 0 ? 'expiry-danger' : expiryDaysLeft <= 3 ? 'expiry-warning' : 'expiry-ok'}>
                        {lang === 'PT' ? 'Val' : 'Exp'}: {expiryDaysLeft > 0 ? formatDaysLeft(expiryDaysLeft, lang).text : '⚠️'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="product-actions">
                  {badge && <span className={`badge-days ${badge.className}`}>{badge.text}</span>}
                  <div className="product-qty">
                    <button onClick={() => handleQtyChange(id, item, -1)}>−</button>
                    <span>{item.qty || 1}</span>
                    <button onClick={() => handleQtyChange(id, item, 1)}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmRemove && (
        <ConfirmModal
          title={T.delete}
          message={T.pantryRemoveText}
          confirmLabel={T.confirm}
          cancelLabel={T.cancel}
          onConfirm={handleRemoveConfirm}
          onCancel={() => setConfirmRemove(null)}
          danger
        />
      )}
    </div>
  );
}
