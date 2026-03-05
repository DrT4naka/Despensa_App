import React, { useState } from 'react';

export default function AddCategoryModal({ T, onAdd, onCancel }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{T.addCategory}</h2>
        <input
          className="modal-input"
          placeholder={T.typeHere || "..."}
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>{T.cancel}</button>
          <button className="modal-confirm" onClick={handleSubmit} disabled={!name.trim()}>{T.confirm}</button>
        </div>
      </div>
    </div>
  );
}
