import React from 'react';

export default function NavBtn({ icon, label, active, onClick }) {
  return (
    <button className={`nav-btn${active ? ' active' : ''}`} onClick={onClick}>
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
