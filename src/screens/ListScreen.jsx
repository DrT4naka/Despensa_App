import React, { useState } from 'react';

export default function ListScreen({ T, lang, shoppingList, onBuy, onBuyAll, onRemove, onClearBought }) {
  const items = Object.entries(shoppingList || {});
  const unbought = items.filter(([, item]) => !item.bought);
  const bought = items.filter(([, item]) => item.bought);

  const buyAllLabel = {
    PT: "🛒 Comprei Tudo",
    ES: "🛒 Compré Todo",
    EN: "🛒 Bought All",
    FR: "🛒 Tout Acheté",
    DE: "🛒 Alles Gekauft"
  };

  const clearLabel = {
    PT: "✅ Mover para Despensa",
    ES: "✅ Mover a Despensa",
    EN: "✅ Move to Pantry",
    FR: "✅ Déplacer au Cellier",
    DE: "✅ In Vorratskammer"
  };

  return (
    <div>
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <div>{T.empty}</div>
        </div>
      ) : (
        <>
          {/* Action buttons */}
          <div className="list-header-actions">
            {unbought.length > 0 && (
              <button className="buy-all-btn" onClick={onBuyAll}>
                {buyAllLabel[lang] || buyAllLabel.EN}
              </button>
            )}
            {bought.length > 0 && (
              <button className="buy-all-btn" style={{ background: '#4ecdc4' }} onClick={onClearBought}>
                {clearLabel[lang] || clearLabel.EN}
              </button>
            )}
          </div>

          {/* Unbought items */}
          {unbought.map(([id, item]) => (
            <div key={id} className="list-item">
              <button
                className="list-check"
                onClick={() => onBuy(id)}
              />
              <div className="list-item-info">
                <div className="list-item-name">{item.emoji} {item.name}</div>
                <div className="list-item-meta">
                  {item.qty || 1} {item.unit || 'un'}
                </div>
              </div>
              <button className="list-remove" onClick={() => onRemove(id)}>✕</button>
            </div>
          ))}

          {/* Bought items */}
          {bought.length > 0 && (
            <>
              <div className="section-title" style={{ marginTop: 16 }}>
                ✅ {T.buy} ({bought.length})
              </div>
              {bought.map(([id, item]) => (
                <div key={id} className="list-item bought">
                  <button className="list-check checked" onClick={() => onBuy(id)}>✓</button>
                  <div className="list-item-info">
                    <div className="list-item-name">{item.emoji} {item.name}</div>
                    <div className="list-item-meta">
                      {item.qty || 1} {item.unit || 'un'}
                    </div>
                  </div>
                  <button className="list-remove" onClick={() => onRemove(id)}>✕</button>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
