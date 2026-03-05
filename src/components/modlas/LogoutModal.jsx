import React from 'react';

export default function LogoutModal({ T, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{T.logoutConfirm}</h2>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>{T.cancel}</button>
          <button className="modal-delete" onClick={onConfirm}>{T.logout}</button>
        </div>
      </div>
    </div>
  );
}
