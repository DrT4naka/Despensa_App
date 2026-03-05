import React, { useState } from 'react';
import { findEmoji } from '../../data/smartMappings';
import { UNITS } from '../../utils/units';

const DEFAULT_CATS = [
  "arroz_massa", "azeites", "bebidas", "congelados", "conservas",
  "doces", "fruta", "higiene", "laticinios", "limpeza",
  "padaria_pastelaria", "peixaria", "talho", "vegetais", "outros"
];

export default function AddProductModal({ T, lang, onAdd, onCancel, customCategories }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📦');
  const [cat, setCat] = useState('outros');
  const [unit, setUnit] = useState('un');
  const [qty, setQty] = useState(1);
  const [consumeDays, setConsumeDays] = useState(7);
  const [consumeUnit, setConsumeUnit] = useState('days'); // 'days' or 'months'
  const [expiryDays, setExpiryDays] = useState('');
  const [expiryUnit, setExpiryUnit] = useState('days');

  const handleWand = () => {
    if (name.trim()) setEmoji(findEmoji(name));
  };

  const allCats = [...DEFAULT_CATS, ...Object.keys(customCategories || {})];
  
  const getCatLabel = (key) => {
    if (T.cats && T.cats[key]) return T.cats[key];
    if (customCategories?.[key]) return customCategories[key].name;
    return key;
  };

  const daysLabel = { PT: "Dias", ES: "Días", EN: "Days", FR: "Jours", DE: "Tage" };
  const monthsLabel = { PT: "Meses", ES: "Meses", EN: "Months", FR: "Mois", DE: "Monate" };
  const consumeLabel = { PT: "Consumo estimado", ES: "Consumo estimado", EN: "Estimated usage", FR: "Usage estimé", DE: "Geschätzter Verbrauch" };
  const expiryLabel = { PT: "Validade", ES: "Caducidad", EN: "Expiry", FR: "Expiration", DE: "Ablaufdatum" };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const totalConsumeDays = consumeUnit === 'months' ? consumeDays * 30 : consumeDays;
    const totalExpiryDays = expiryDays ? (expiryUnit === 'months' ? Number(expiryDays) * 30 : Number(expiryDays)) : null;
    
    onAdd({
      name: name.trim(),
      emoji,
      cat,
      unit,
      qty: Number(qty) || 1,
      consumeDays: totalConsumeDays,
      expiryDays: totalExpiryDays,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <h2>{T.addManual}</h2>

        <div className="emoji-preview">{emoji}</div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            className="modal-input"
            style={{ flex: 1, marginBottom: 0 }}
            placeholder={T.wandTip || "Nome do produto"}
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <button className="wand-btn" onClick={handleWand} title={T.wandTip}>🪄</button>
        </div>

        <label className="modal-label">{T.selectCat}</label>
        <select className="modal-select" value={cat} onChange={e => setCat(e.target.value)}>
          {allCats.map(c => (
            <option key={c} value={c}>{getCatLabel(c)}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="modal-label">{T.unitShort}</label>
            <select className="modal-select" value={unit} onChange={e => setUnit(e.target.value)}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="modal-label">Qty</label>
            <input
              className="modal-input"
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
          </div>
        </div>

        <label className="modal-label">{consumeLabel[lang] || consumeLabel.EN}</label>
        <div className="consumption-row">
          <input
            className="modal-input"
            type="number"
            min="1"
            value={consumeDays}
            onChange={e => setConsumeDays(Math.max(1, Number(e.target.value)))}
            style={{ marginBottom: 0 }}
          />
          <select
            className="modal-select"
            value={consumeUnit}
            onChange={e => setConsumeUnit(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="days">{daysLabel[lang] || daysLabel.EN}</option>
            <option value="months">{monthsLabel[lang] || monthsLabel.EN}</option>
          </select>
        </div>

        <label className="modal-label">{expiryLabel[lang] || expiryLabel.EN}</label>
        <div className="expiry-row">
          <input
            className="modal-input"
            type="number"
            min="1"
            placeholder="—"
            value={expiryDays}
            onChange={e => setExpiryDays(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <select
            className="modal-select"
            value={expiryUnit}
            onChange={e => setExpiryUnit(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="days">{daysLabel[lang] || daysLabel.EN}</option>
            <option value="months">{monthsLabel[lang] || monthsLabel.EN}</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>{T.cancel}</button>
          <button className="modal-confirm" onClick={handleSubmit} disabled={!name.trim()}>{T.confirm}</button>
        </div>
      </div>
    </div>
  );
}
