import React from 'react';

export default function ConfirmModal({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {message && <p style={{ fontSize: 14, color: '#aaa', marginBottom: 12, textAlign: 'center' }}>{message}</p>}
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>{cancelLabel || 'Cancel'}</button>
          <button className={danger ? "modal-delete" : "modal-confirm"} onClick={onConfirm}>{confirmLabel || 'OK'}</button>
        </div>
      </div>
    </div>
  );
}
