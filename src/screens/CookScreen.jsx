import React from 'react';

export default function CookScreen({ T, lang, recipe, onFinish, onDiscard }) {
  if (!recipe) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👨‍🍳</div>
        <div>{lang === 'PT' ? 'Seleciona uma receita no Plano Semanal' : 'Select a recipe from the Weekly Plan'}</div>
      </div>
    );
  }

  const formatIngredient = (ing) => {
    if (ing.unit === 'q.b.' || ing.unit === 'QB' || ing.unit === 'qb') {
      return `${ing.name} q.b.`;
    }
    if (!ing.qty || ing.qty === 0) return ing.name;
    return `${ing.qty} ${ing.unit} — ${ing.name}`;
  };

  return (
    <div>
      <div className="recipe-card">
        <div className="recipe-title">👨‍🍳 {recipe.name}</div>
        <div className="recipe-time">
          ⏱️ {T.recipeTime} {recipe.time} | 👥 {recipe.servings} {T.servings?.toLowerCase?.() || 'people'}
        </div>

        {recipe.dietaryNotes && (
          <div style={{ fontSize: 12, color: '#ff6b35', marginBottom: 12, padding: '8px 12px', background: 'rgba(255,107,53,0.1)', borderRadius: 8 }}>
            ⚠️ {recipe.dietaryNotes}
          </div>
        )}

        <div className="recipe-section">
          <h3>📋 {T.recipeIng}</h3>
          <ul>
            {recipe.ingredients?.map((ing, i) => (
              <li key={i}>{formatIngredient(ing)}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-section">
          <h3>👩‍🍳 {lang === 'PT' ? 'Preparação' : lang === 'ES' ? 'Preparación' : lang === 'FR' ? 'Préparation' : lang === 'DE' ? 'Zubereitung' : 'Instructions'}</h3>
          <ol>
            {recipe.steps?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="recipe-actions">
          <button className="recipe-reject" onClick={onDiscard}>{T.discard}</button>
          <button className="recipe-accept" onClick={onFinish}>{T.finish}</button>
        </div>
      </div>
    </div>
  );
}
