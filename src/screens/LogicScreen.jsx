import React, { useState } from 'react';
import LANGUAGES from '../data/languages';
import { generatePantryCode } from '../utils/id';
import { createHousehold, joinHousehold, householdExists } from '../services/pantryService';

const DIETARY_OPTIONS = [
  { id: "vegetarian", labels: { PT: "Vegetariano", ES: "Vegetariano", EN: "Vegetarian", FR: "Végétarien", DE: "Vegetarisch" } },
  { id: "vegan", labels: { PT: "Vegano", ES: "Vegano", EN: "Vegan", FR: "Végan", DE: "Vegan" } },
  { id: "gluten_free", labels: { PT: "Sem Glúten", ES: "Sin Gluten", EN: "Gluten-Free", FR: "Sans Gluten", DE: "Glutenfrei" } },
  { id: "lactose_free", labels: { PT: "Sem Lactose", ES: "Sin Lactosa", EN: "Lactose-Free", FR: "Sans Lactose", DE: "Laktosefrei" } },
  { id: "nut_free", labels: { PT: "Sem Frutos Secos", ES: "Sin Frutos Secos", EN: "Nut-Free", FR: "Sans Noix", DE: "Nussfrei" } },
  { id: "halal", labels: { PT: "Halal", ES: "Halal", EN: "Halal", FR: "Halal", DE: "Halal" } },
];

export default function LogicScreen({ onLogin }) {
  const [lang, setLang] = useState('PT');
  const [step, setStep] = useState('welcome'); // welcome, choice, create, join
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [dietary, setDietary] = useState([]);

  const T = LANGUAGES[lang];
  const langKeys = Object.keys(LANGUAGES);

  const toggleDietary = (id) => {
    setDietary(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    const newCode = generatePantryCode();
    setGeneratedCode(newCode);
    createHousehold(newCode, name.trim(), lang, dietary);
    setStep('created');
  };

  const handleJoin = () => {
    if (!name.trim() || !code.trim()) return;
    const upperCode = code.trim().toUpperCase();
    if (!householdExists(upperCode)) {
      setError(lang === 'PT' ? 'Código não encontrado' : 'Code not found');
      return;
    }
    joinHousehold(upperCode, name.trim(), dietary);
    onLogin({ name: name.trim(), code: upperCode, lang });
  };

  const handleStart = () => {
    onLogin({ name: name.trim(), code: generatedCode, lang });
  };

  return (
    <div className="login-screen">
      <div className="login-logo">🏠</div>
      <div className="login-title">Pantry</div>
      <div className="login-subtitle">{T.welcome}</div>

      {/* Language picker */}
      <div className="login-lang">
        {langKeys.map(k => (
          <button key={k} className={lang === k ? 'active' : ''} onClick={() => setLang(k)}>
            {LANGUAGES[k].flag}
          </button>
        ))}
      </div>

      <div className="login-card">
        {step === 'welcome' && (
          <>
            <h2>{T.welcome}!</h2>
            <input
              className="login-input"
              placeholder={T.enterName}
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
            
            {/* Restrições alimentares */}
            <div className="dietary-setup">
              <h3>🥗 {lang === 'PT' ? 'Restrições Alimentares' : lang === 'ES' ? 'Restricciones Alimentarias' : lang === 'FR' ? 'Restrictions Alimentaires' : lang === 'DE' ? 'Ernährungseinschränkungen' : 'Dietary Restrictions'}</h3>
              <div className="dietary-tags">
                {DIETARY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    className={`dietary-tag ${dietary.includes(opt.id) ? 'selected' : ''}`}
                    onClick={() => toggleDietary(opt.id)}
                  >
                    {opt.labels[lang] || opt.labels.EN}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="login-btn"
              style={{ marginTop: 16 }}
              disabled={!name.trim()}
              onClick={() => setStep('choice')}
            >
              {T.start} →
            </button>
          </>
        )}

        {step === 'choice' && (
          <>
            <h2>{T.welcome}, {name}!</h2>
            <div className="login-choice">
              <button onClick={() => setStep('create')}>
                <div className="choice-title">🏠 {T.choiceCreate}</div>
                <div className="choice-desc">{T.createDesc}</div>
              </button>
              <button onClick={() => setStep('join')}>
                <div className="choice-title">🔗 {T.choiceJoin}</div>
                <div className="choice-desc">{T.joinDesc}</div>
              </button>
            </div>
            <button className="login-btn secondary" onClick={() => setStep('welcome')}>{T.back}</button>
          </>
        )}

        {step === 'create' && (
          <>
            <h2>🏠 {T.choiceCreate}</h2>
            <button className="login-btn" onClick={handleCreate}>{T.confirm}</button>
            <button className="login-btn secondary" onClick={() => setStep('choice')}>{T.back}</button>
          </>
        )}

        {step === 'created' && (
          <>
            <h2>{T.shareTitle}</h2>
            <div className="pantry-code">{generatedCode}</div>
            <div className="share-hint">{T.shareDesc}</div>
            <button className="login-btn" onClick={handleStart}>{T.start} →</button>
          </>
        )}

        {step === 'join' && (
          <>
            <h2>🔗 {T.choiceJoin}</h2>
            <input
              className="login-input"
              placeholder={T.enterCode}
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
              maxLength={6}
              style={{ textAlign: 'center', letterSpacing: 4, fontSize: 20 }}
              autoFocus
            />
            {error && <p style={{ color: '#e94560', fontSize: 13, textAlign: 'center' }}>{error}</p>}
            <button className="login-btn" onClick={handleJoin} disabled={!code.trim() || code.length < 6}>
              {T.start} →
            </button>
            <button className="login-btn secondary" onClick={() => setStep('choice')}>{T.back}</button>
          </>
        )}
      </div>
    </div>
  );
}
