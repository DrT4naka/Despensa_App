import React, { useState, useCallback } from 'react';
import { getWeekStart, getWeekDates } from '../utils/date';
import { generateRecipe } from '../services/chefService';

export default function PlanScreen({ T, lang, plans, servings, onSetServings, onSaveMeal, onViewRecipe, inventory, dietaryRestrictions }) {
  const weekStart = getWeekStart();
  const weekDates = getWeekDates(weekStart);
  const [activeDay, setActiveDay] = useState(new Date().getDay()); // 0-6
  const [thinkingMeal, setThinkingMeal] = useState(null); // { dateKey, mealIndex }
  const [editingMeal, setEditingMeal] = useState(null);
  const [editText, setEditText] = useState('');

  const dateKey = weekDates[activeDay];
  const dayMeals = plans?.[dateKey] || {};

  const mealTypes = T.meals || ["Breakfast", "Snack", "Lunch", "Snack", "Dinner"];

  // Labels for "eating out" / "cooking alone"
  const outLabel = { PT: "Fora", ES: "Fuera", EN: "Out", FR: "Dehors", DE: "Auswärts" };
  const aloneLabel = { PT: "Sozinho", ES: "Solo", EN: "Alone", FR: "Seul", DE: "Allein" };

  const handleManualSave = (mealIndex) => {
    if (editText.trim()) {
      onSaveMeal(dateKey, mealIndex, {
        type: 'manual',
        text: editText.trim(),
        savedAt: new Date().toISOString()
      });
    }
    setEditingMeal(null);
    setEditText('');
  };

  const handleOutOrAlone = (mealIndex, option) => {
    onSaveMeal(dateKey, mealIndex, {
      type: option, // 'out' or 'alone'
      text: option === 'out' ? (outLabel[lang] || 'Out') : (aloneLabel[lang] || 'Alone'),
      savedAt: new Date().toISOString()
    });
  };

  const handleAiChef = async (mealIndex) => {
    setThinkingMeal({ dateKey, mealIndex });
    try {
      const recipe = await generateRecipe(inventory, servings, lang, dietaryRestrictions);
      onSaveMeal(dateKey, mealIndex, {
        type: 'ai',
        text: recipe.name,
        recipe,
        savedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Chef error:', err);
    } finally {
      setThinkingMeal(null);
    }
  };

  const isThinking = (mealIndex) => {
    return thinkingMeal && thinkingMeal.dateKey === dateKey && thinkingMeal.mealIndex === mealIndex;
  };

  return (
    <div>
      {/* Header with servings */}
      <div className="plan-header">
        <h2>{T.weeklyPlan}</h2>
        <div className="servings-picker">
          <span>👥 {T.servings}:</span>
          <button onClick={() => onSetServings(Math.max(1, servings - 1))}>−</button>
          <span>{servings}</span>
          <button onClick={() => onSetServings(servings + 1)}>+</button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="day-tabs">
        {weekDates.map((d, i) => {
          const date = new Date(d);
          const isToday = i === new Date().getDay();
          return (
            <button
              key={d}
              className={`day-tab ${activeDay === i ? 'active' : ''}`}
              onClick={() => setActiveDay(i)}
            >
              <div style={{ fontSize: 10 }}>{T.daysWeek[i]}</div>
              <div className="day-num">{date.getDate()}</div>
            </button>
          );
        })}
      </div>

      {/* Meal slots */}
      <div className="meal-slots">
        {mealTypes.map((mealName, mealIndex) => {
          const meal = dayMeals[mealIndex];
          const thinking = isThinking(mealIndex);
          const isEditing = editingMeal === mealIndex;

          return (
            <div key={mealIndex} className="meal-slot">
              <div className="meal-slot-header">
                <span className="meal-slot-title">{mealName}</span>
                <div className="meal-actions">
                  <button
                    className={`meal-action-btn ${isEditing ? 'active' : ''}`}
                    onClick={() => {
                      setEditingMeal(isEditing ? null : mealIndex);
                      setEditText(meal?.text || '');
                    }}
                  >
                    ✏️ {T.manualMeal}
                  </button>
                  <button
                    className="meal-action-btn"
                    onClick={() => handleOutOrAlone(mealIndex, 'out')}
                  >
                    🍽️ {outLabel[lang] || 'Out'}
                  </button>
                  <button
                    className="meal-action-btn"
                    onClick={() => handleAiChef(mealIndex)}
                    disabled={thinking}
                  >
                    👨‍🍳 {T.aiMeal}
                  </button>
                </div>
              </div>

              <div className="meal-content">
                {thinking ? (
                  <div className="chef-thinking">
                    <div className="spinner" />
                    <span>{T.translating}</span>
                  </div>
                ) : isEditing ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="meal-input"
                      placeholder={T.typeHere || T.mealPlaceholder}
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleManualSave(mealIndex)}
                      autoFocus
                    />
                    <button
                      className="meal-action-btn active"
                      onClick={() => handleManualSave(mealIndex)}
                    >
                      {T.save}
                    </button>
                  </div>
                ) : meal ? (
                  <div>
                    <span className="meal-text">
                      {meal.type === 'out' ? '🍽️ ' : meal.type === 'alone' ? '👤 ' : meal.type === 'ai' ? '👨‍🍳 ' : ''}
                      {meal.text}
                    </span>
                    {meal.recipe && (
                      <button
                        className="meal-recipe-btn"
                        onClick={() => onViewRecipe(meal.recipe)}
                      >
                        📖 {T.openRecipe}
                      </button>
                    )}
                  </div>
                ) : (
                  <span style={{ color: '#555', fontSize: 13 }}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
