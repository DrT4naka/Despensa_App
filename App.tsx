import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Language, InventoryItem, WeeklyPlan, UserSettings, Recipe, MealPlanItem } from './types';
import { LANGUAGES, DICTIONARY, FULL_CATALOG, CATEGORIES_MAP } from './constants';
// Updated imports to use mock service and removed direct firebase/firestore imports
import { signIn, subscribeToAuth, saveData, deleteData, subscribeCollection, db, auth } from './services/firebaseService';
import { generateRecipe } from './services/geminiService';
import { normalizeId, generateSafeCode, getLocalISODate, getExpiryStatus } from './utils/helpers';
import { 
  ChefHat, ShoppingCart, List, Calendar, LayoutGrid, 
  LogOut, Plus, Trash2, Check, X, Search, Wand2, Settings, User as UserIcon, CalendarDays,
  Utensils
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<Language>('PT');
  const [view, setView] = useState<'dashboard' | 'shop' | 'cook' | 'list' | 'plan' | 'settings'>('dashboard');
  
  // Data
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [plan, setPlan] = useState<WeeklyPlan>({});
  
  // Settings & Auth
  const [settings, setSettings] = useState<UserSettings>({ name: '', dietaryRestrictions: [], householdId: '' });
  const [tempName, setTempName] = useState('');
  const [tempCode, setTempCode] = useState('');
  const [isLoginStep, setIsLoginStep] = useState<'welcome' | 'create' | 'join'>('welcome');

  // UI State
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [loadingMealIdx, setLoadingMealIdx] = useState<number | null>(null); // Specific loading state
  const [servings, setServings] = useState(2);
  const [selectedDayId, setSelectedDayId] = useState(getLocalISODate());

  const t = DICTIONARY[lang];

  // --- EFFECTS ---

  useEffect(() => {
    // Load local persist
    const savedId = localStorage.getItem('pantry_hid');
    const savedName = localStorage.getItem('pantry_user');
    const savedLang = localStorage.getItem('pantry_lang');
    if (savedId && savedName) {
      setSettings(prev => ({ ...prev, householdId: savedId, name: savedName }));
      signIn();
    }
    if (savedLang) setLang(savedLang as Language);

    const unsub = subscribeToAuth(setUser);
    return () => unsub();
  }, []);

  // Sync Logic (Updated to use subscribeCollection from service)
  useEffect(() => {
    if (!user || !settings.householdId) return;
    const cleanId = normalizeId(settings.householdId);

    // Sync Inventory
    const unsubInv = subscribeCollection(`pantries/${cleanId}/inventory`, (snap) => {
      const items = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as InventoryItem));
      setInventory(items);
    });

    // Sync Plan
    const unsubPlan = subscribeCollection(`pantries/${cleanId}/plan`, (snap) => {
      const p: WeeklyPlan = {};
      snap.docs.forEach((d: any) => { p[d.id] = d.data() as any; });
      setPlan(p);
    });

    return () => { unsubInv(); unsubPlan(); };
  }, [user, settings.householdId]);

  // --- ACTIONS ---

  const handleLogin = (mode: 'create' | 'join') => {
    const code = mode === 'create' ? generateSafeCode() : tempCode;
    if (!tempName || (mode === 'join' && code.length < 5)) return;
    
    setSettings({ ...settings, name: tempName, householdId: code });
    localStorage.setItem('pantry_hid', code);
    localStorage.setItem('pantry_user', tempName);
    localStorage.setItem('pantry_lang', lang);
    signIn();
  };

  const handleLogout = () => {
    if (window.confirm(t.logoutConfirm)) {
      localStorage.clear();
      setSettings({ name: '', dietaryRestrictions: [], householdId: '' });
      setUser(null);
      setIsLoginStep('welcome');
      setInventory([]);
    }
  };

  const updateItem = async (item: InventoryItem, updates: Partial<InventoryItem>) => {
    if (!settings.householdId) return;
    
    // Validate negative numbers
    if (updates.stockQuantity !== undefined && updates.stockQuantity < 0) updates.stockQuantity = 0;
    if (updates.listQuantity !== undefined && updates.listQuantity < 0) updates.listQuantity = 0;

    const newItem = { ...item, ...updates, lastUser: settings.name, updatedAt: Date.now() };
    
    // Optimistic Update
    setInventory(prev => prev.map(i => i.id === item.id ? newItem : i));
    
    await saveData(`pantries/${normalizeId(settings.householdId)}/inventory`, item.id, newItem);
  };

  const addNewItem = async (product: any) => {
    const newItem: InventoryItem = {
      ...product,
      stockQuantity: 0,
      listQuantity: 1,
      manual: true
    };
    // Check if exists
    const exists = inventory.find(i => i.id === product.id);
    if (exists) {
      updateItem(exists, { listQuantity: (exists.listQuantity || 0) + 1 });
    } else {
      setInventory([...inventory, newItem]); // Optimistic
      await saveData(`pantries/${normalizeId(settings.householdId)}/inventory`, newItem.id, newItem);
    }
  };

  const askChef = async (mealIdx: number, currentMeal?: any) => {
    setLoadingMealIdx(mealIdx);
    
    // Construct pantry string
    const stock = inventory.filter(i => i.stockQuantity > 0).map(i => i.names[lang] || i.names.PT).join(', ');
    const mealName = t.meals[mealIdx];
    
    const recipe = await generateRecipe(stock, mealName, lang, settings.dietaryRestrictions);
    
    if (recipe) {
        // Save to plan
        const cleanId = normalizeId(settings.householdId);
        const dayData = plan[selectedDayId] || { meals: {} };
        const newMeal: MealPlanItem = { type: 'ai', data: recipe, updatedBy: settings.name };
        const updatedMeals = { ...dayData.meals, [mealIdx]: newMeal };
        
        // Update local plan for immediate feedback
        setPlan(prev => ({...prev, [selectedDayId]: { meals: updatedMeals } }));
        await saveData(`pantries/${normalizeId(settings.householdId)}/plan`, selectedDayId, { meals: updatedMeals });
    }
    setLoadingMealIdx(null);
  };

  const handleBuyAll = async () => {
    const toBuy = inventory.filter(i => (i.listQuantity || 0) > 0);
    const updates = toBuy.map(i => updateItem(i, { 
      stockQuantity: (i.stockQuantity || 0) + (i.listQuantity || 0), 
      listQuantity: 0,
      expiryDate: undefined // Reset expiry on new buy, user should set manually if needed
    }));
    await Promise.all(updates);
  };

  // --- RENDER HELPERS ---

  const getCatName = (catId: string) => CATEGORIES_MAP[catId]?.[lang] || CATEGORIES_MAP[catId]?.PT || catId;

  // --- VIEWS ---

  if (!user || !settings.householdId) {
    return (
      <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-6 text-center animate-in">
        <div className="w-24 h-24 bg-brand-500 rounded-3xl flex items-center justify-center text-6xl shadow-xl mb-6 text-white">
          <ChefHat size={48} />
        </div>
        <h1 className="text-3xl font-black mb-2 text-brand-900 tracking-tight">Despensa Mágica</h1>
        <p className="text-brand-700 font-bold mb-6 opacity-60 text-sm">A tua cozinha, mais inteligente.</p>
        
        {/* Language Selector */}
        <div className="flex gap-2 mb-8 bg-white/50 p-2 rounded-2xl">
          {Object.keys(LANGUAGES).map((l) => (
            <button key={l} onClick={() => setLang(l as Language)} className={`p-2 rounded-lg border-2 ${lang === l ? 'border-brand-500 bg-brand-100' : 'border-transparent opacity-50'}`}>
              <span className="text-2xl">{LANGUAGES[l as Language].flag}</span>
            </button>
          ))}
        </div>

        {isLoginStep === 'welcome' && (
          <div className="space-y-4 w-full max-w-sm">
            <button onClick={() => setIsLoginStep('create')} className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">{t.enterName}</button>
            <button onClick={() => setIsLoginStep('join')} className="w-full py-4 bg-white text-brand-600 rounded-2xl font-bold shadow-sm border-2 border-brand-100 active:scale-95 transition-transform">{t.enterCode}</button>
          </div>
        )}

        {(isLoginStep === 'create' || isLoginStep === 'join') && (
          <div className="space-y-4 w-full max-w-sm bg-white p-6 rounded-3xl shadow-xl">
             <input type="text" placeholder={t.enterName} value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-4 bg-brand-50 rounded-xl outline-none font-bold text-center border-2 focus:border-brand-400 text-slate-800" />
             {isLoginStep === 'join' && (
               <input type="text" placeholder="CODE: XXXXX" value={tempCode} onChange={e => setTempCode(e.target.value.toUpperCase())} className="w-full p-4 bg-brand-50 rounded-xl outline-none font-bold text-center tracking-widest border-2 focus:border-brand-400 text-slate-800" />
             )}
             <div className="flex gap-3 pt-2">
               <button onClick={() => setIsLoginStep('welcome')} className="flex-1 py-3 text-slate-400 font-bold uppercase text-xs">{t.cancel}</button>
               <button onClick={() => handleLogin(isLoginStep)} className="flex-[2] py-3 bg-brand-500 text-white font-bold rounded-xl uppercase shadow-md">{t.start}</button>
             </div>
          </div>
        )}
      </div>
    );
  }

  // APP UI
  return (
    <div className="min-h-screen pb-24 font-sans text-slate-800 bg-brand-50">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-100 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 font-bold">
             {settings.name.charAt(0)}
           </div>
           <div>
             <h2 className="text-xs font-black uppercase text-brand-400 tracking-wider">{t.householdName}</h2>
             <p className="font-bold leading-tight text-slate-800">#{settings.householdId}</p>
           </div>
        </div>
        <button onClick={() => setView('settings')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
          <Settings size={20} className="text-slate-600" />
        </button>
      </header>

      <main className="max-w-xl mx-auto p-4">
        
        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-6 animate-in">
            <div className="grid gap-3">
              {inventory.filter(i => i.stockQuantity > 0).length === 0 && (
                <div className="text-center py-10 opacity-50">
                  <p>Despensa Vazia</p>
                </div>
              )}
              {inventory.filter(i => i.stockQuantity > 0).sort((a,b) => {
                 // Sort by expiry
                 if(a.expiryDate && !b.expiryDate) return -1;
                 if(!a.expiryDate && b.expiryDate) return 1;
                 if(a.expiryDate && b.expiryDate) return a.expiryDate.localeCompare(b.expiryDate);
                 return 0;
              }).map(item => {
                 const status = getExpiryStatus(item.expiryDate);
                 const borderClass = status === 'expired' ? 'border-red-500 bg-red-50' : status === 'expiring' ? 'border-orange-400 bg-orange-50' : 'border-transparent bg-white';
                 
                 return (
                  <div key={item.id} className={`p-4 rounded-[2rem] shadow-sm border-2 ${borderClass} flex flex-col gap-3 relative`}>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <h3 className="font-bold text-lg leading-none text-slate-800">{item.names[lang] || item.names.PT}</h3>
                          <p className="text-xs font-bold opacity-50 uppercase mt-1 text-slate-500">{getCatName(item.category)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-brand-600">{item.stockQuantity}</span>
                        <span className="text-xs font-bold text-brand-400 ml-1">{item.unit === 'q.b.' ? '' : item.unit}</span>
                      </div>
                    </div>

                    {/* Expiry & Consumption */}
                    <div className="flex gap-2 items-center bg-white/50 p-2 rounded-xl">
                       <Calendar size={14} className="text-slate-400" />
                       <div className="flex-1 flex flex-col">
                         <label className="text-[9px] font-black uppercase text-slate-400">{t.expiryDate}</label>
                         <input type="date" className="bg-transparent text-xs font-bold outline-none w-full text-slate-700" 
                            value={item.expiryDate || ''} 
                            onChange={(e) => updateItem(item, { expiryDate: e.target.value })} 
                         />
                       </div>
                       <div className="w-px h-6 bg-slate-200"></div>
                       <div className="flex-1 flex flex-col items-end">
                         <label className="text-[9px] font-black uppercase text-slate-400">{t.consumeTitle}</label>
                         <div className="flex items-center gap-1">
                            <input type="number" className="w-8 bg-transparent text-xs font-bold text-right outline-none text-slate-700" 
                               value={item.consumptionPeriod && item.consumptionPeriod % 30 === 0 ? item.consumptionPeriod / 30 : item.consumptionPeriod || ''}
                               onChange={(e) => {
                                 const val = Number(e.target.value);
                                 updateItem(item, { consumptionPeriod: val }); 
                               }}
                            />
                            <span className="text-[9px] font-bold text-slate-600">{t.days}</span>
                         </div>
                       </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 justify-end">
                       <button onClick={() => updateItem(item, { stockQuantity: Math.max(0, item.stockQuantity - 1) })} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors">-</button>
                       <button onClick={() => updateItem(item, { listQuantity: (item.listQuantity || 0) + 1 })} className="px-3 h-8 rounded-full bg-brand-100 text-brand-600 text-xs font-bold flex items-center gap-1 hover:bg-brand-200 transition-colors">
                          <ShoppingCart size={12} /> +{t.list}
                       </button>
                    </div>
                  </div>
                 );
              })}
            </div>
          </div>
        )}

        {/* SHOP (Catalog) */}
        {view === 'shop' && (
          <div className="space-y-4 animate-in">
             <div className="sticky top-14 bg-brand-50 z-40 pb-2">
                <div className="relative">
                  <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input type="text" placeholder={t.search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 p-4 rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-brand-200 text-slate-800" />
                </div>
                <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                   <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap ${activeCategory === 'all' ? 'bg-brand-500 text-white shadow-md' : 'bg-white text-slate-500'}`}>All</button>
                   {Object.keys(CATEGORIES_MAP).map(catId => (
                     <button key={catId} onClick={() => setActiveCategory(catId)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap flex items-center gap-2 ${activeCategory === catId ? 'bg-brand-500 text-white shadow-md' : 'bg-white text-slate-500'}`}>
                       <span>{CATEGORIES_MAP[catId].icon}</span>
                       <span>{getCatName(catId)}</span>
                     </button>
                   ))}
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               {[...FULL_CATALOG, ...inventory.filter(i => i.manual)].filter(item => {
                 const name = (item.names?.[lang] || item.names?.PT || 'Item').toLowerCase();
                 return name.includes(searchTerm.toLowerCase()) && (activeCategory === 'all' || item.category === activeCategory);
               }).map(item => {
                 const inStock = inventory.find(i => i.id === item.id);
                 return (
                   <div key={item.id} className="bg-white p-4 rounded-3xl flex flex-col items-center text-center shadow-sm relative">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <h4 className="font-bold text-sm leading-tight mb-4 text-slate-800">{item.names?.[lang] || item.names?.PT}</h4>
                      <button onClick={() => addNewItem(item)} className="absolute bottom-3 right-3 w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                        <Plus size={18} />
                      </button>
                      {inStock && inStock.stockQuantity > 0 && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                   </div>
                 )
               })}
             </div>
          </div>
        )}

        {/* LIST */}
        {view === 'list' && (
          <div className="space-y-4 animate-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-slate-800">{t.list}</h2>
                <button onClick={handleBuyAll} className="bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-lg flex items-center gap-2">
                  <Check size={14} /> {t.buyAll}
                </button>
             </div>
             
             <div className="space-y-2">
               {inventory.filter(i => (i.listQuantity || 0) > 0).map(item => (
                 <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                       <span className="text-2xl">{item.icon}</span>
                       <div>
                         <h4 className="font-bold text-slate-800">{item.names[lang] || item.names.PT}</h4>
                         <div className="flex items-center gap-2 mt-1">
                           <button onClick={() => updateItem(item, { listQuantity: Math.max(0, (item.listQuantity || 0) - 1) })} className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500">-</button>
                           <span className="w-6 text-center font-bold text-slate-800">{item.listQuantity}</span>
                           <button onClick={() => updateItem(item, { listQuantity: (item.listQuantity || 0) + 1 })} className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500">+</button>
                         </div>
                       </div>
                    </div>
                    <button onClick={() => updateItem(item, { stockQuantity: (item.stockQuantity || 0) + (item.listQuantity || 0), listQuantity: 0, expiryDate: undefined })} className="p-3 bg-brand-50 rounded-xl text-brand-600">
                      <Check size={20} />
                    </button>
                 </div>
               ))}
               {inventory.filter(i => (i.listQuantity || 0) > 0).length === 0 && (
                 <div className="text-center py-10 opacity-50">Lista Vazia</div>
               )}
             </div>
          </div>
        )}

        {/* PLAN */}
        {view === 'plan' && (
          <div className="space-y-6 animate-in">
             {/* Dates Scroller */}
             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[...Array(7)].map((_, i) => {
                   const d = new Date();
                   d.setDate(d.getDate() + i);
                   const iso = d.toISOString().split('T')[0];
                   const dayName = t.daysWeek[d.getDay()];
                   const isSelected = selectedDayId === iso;
                   return (
                     <button key={iso} onClick={() => setSelectedDayId(iso)} className={`flex-shrink-0 w-16 h-20 rounded-[2rem] flex flex-col items-center justify-center border-2 transition-all ${isSelected ? 'bg-brand-500 text-white border-brand-500 shadow-lg scale-105' : 'bg-white text-slate-400 border-transparent'}`}>
                        <span className={`text-[10px] font-black uppercase mb-1 ${isSelected ? 'opacity-90' : 'opacity-80'}`}>{dayName}</span>
                        <span className="text-xl font-black">{d.getDate()}</span>
                     </button>
                   )
                })}
             </div>

             <div className="space-y-3">
               {t.meals.map((mealName: string, idx: number) => {
                 const planData = plan[selectedDayId]?.meals?.[idx];
                 const isLoading = loadingMealIdx === idx;

                 return (
                   <div key={idx} className="bg-white p-5 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">{mealName}</span>
                        {planData && (
                          <button onClick={() => {
                            const newPlan = { ...plan[selectedDayId] };
                            delete newPlan.meals[idx];
                            setPlan({ ...plan, [selectedDayId]: newPlan });
                            saveData(`pantries/${normalizeId(settings.householdId)}/plan`, selectedDayId, newPlan);
                          }} className="text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                        )}
                      </div>

                      {isLoading ? (
                        <div className="py-6 flex flex-col items-center text-brand-400 animate-pulse">
                          <Wand2 size={32} className="animate-spin mb-2" />
                          <p className="text-xs font-bold uppercase">{t.translating}</p>
                        </div>
                      ) : planData ? (
                         <div>
                           <h3 className="font-black text-lg mb-2 text-slate-800">{planData.data.title}</h3>
                           {planData.type === 'ai' && (
                             <button onClick={() => { setActiveRecipe(planData.data as Recipe); setView('cook'); }} className="w-full py-3 bg-brand-50 text-brand-600 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-brand-100 transition-colors">
                               <Utensils size={14} /> {t.openRecipe}
                             </button>
                           )}
                           {planData.type === 'manual' && (
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500">{planData.manualType === 'cooked_alone' ? 'Cozinhado em Casa' : 'Fora'}</span>
                              </div>
                           )}
                         </div>
                      ) : (
                         <div className="flex gap-2">
                           <button onClick={() => askChef(idx)} className="flex-1 py-4 border-2 border-dashed border-brand-200 rounded-2xl text-brand-400 font-bold uppercase text-xs hover:bg-brand-50 transition-colors flex flex-col items-center gap-1">
                              <Wand2 size={16} />
                              {t.cook}
                           </button>
                           <button onClick={() => {
                              // Simple Manual Add Logic
                              const title = prompt("Nome da Refeição:");
                              if(title) {
                                const newMeal: MealPlanItem = { type: 'manual', data: { title }, manualType: 'cooked_alone' };
                                const newPlan = { 
                                  ...(plan[selectedDayId] || { meals: {} }), 
                                  meals: { ...(plan[selectedDayId]?.meals || {}), [idx]: newMeal } 
                                };
                                setPlan({ ...plan, [selectedDayId]: newPlan });
                                saveData(`pantries/${normalizeId(settings.householdId)}/plan`, selectedDayId, newPlan);
                              }
                           }} className="w-16 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 flex items-center justify-center hover:border-slate-300 hover:text-slate-400">
                              <Plus />
                           </button>
                         </div>
                      )}
                   </div>
                 );
               })}
             </div>
          </div>
        )}

        {/* COOK VIEW (Recipe Detail) */}
        {view === 'cook' && activeRecipe && (
           <div className="animate-in pb-10">
              <button onClick={() => setView('plan')} className="mb-4 text-slate-400 font-bold flex items-center gap-1 text-xs uppercase"><X size={14}/> {t.back}</button>
              
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-brand-100">
                 <div className="bg-brand-500 p-8 text-white relative">
                    <h2 className="text-2xl font-black uppercase leading-tight">{activeRecipe.title}</h2>
                    <div className="flex gap-4 mt-6">
                       <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg text-center">
                          <span className="block text-[8px] font-black uppercase opacity-80">Time</span>
                          <span className="font-bold">{activeRecipe.time}m</span>
                       </div>
                       <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg text-center flex items-center gap-2">
                          <div>
                            <span className="block text-[8px] font-black uppercase opacity-80">{t.servings}</span>
                            <span className="font-bold">{servings}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                             <button onClick={() => setServings(s => s+1)} className="w-4 h-4 bg-white text-brand-500 rounded flex items-center justify-center text-[10px] font-bold hover:bg-white/90">+</button>
                             <button onClick={() => setServings(s => Math.max(1, s-1))} className="w-4 h-4 bg-white/50 text-white rounded flex items-center justify-center text-[10px] font-bold hover:bg-white/60">-</button>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-6 space-y-6">
                    <div>
                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t.recipeIng}</h3>
                       <div className="space-y-2">
                         {activeRecipe.ingredients.map((ing, i) => {
                           const ratio = servings / activeRecipe.baseServings;
                           const amount = ing.amount * ratio;
                           const pantryItem = inventory.find(pi => pi.id === ing.id || (pi.names[lang] || pi.names.PT)?.toLowerCase() === ing.name.toLowerCase());
                           const hasStock = pantryItem && (pantryItem.stockQuantity >= amount || ing.unit === 'q.b.');
                           
                           return (
                             <div key={i} className={`p-3 rounded-xl border flex justify-between items-center ${hasStock ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                               <span className={`font-bold text-sm ${hasStock ? 'text-green-800' : 'text-red-800'}`}>{ing.name}</span>
                               <span className="text-xs font-bold opacity-70 text-slate-600">
                                 {ing.unit === 'q.b.' ? 'q.b.' : `${amount.toFixed(1)} ${ing.unit}`}
                               </span>
                             </div>
                           );
                         })}
                       </div>
                    </div>

                    <div>
                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Steps</h3>
                       <div className="space-y-4">
                         {activeRecipe.steps.map((step, i) => (
                           <div key={i} className="flex gap-4">
                              <span className="w-6 h-6 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center font-black text-xs shrink-0">{i+1}</span>
                              <p className="text-sm font-semibold text-slate-600 leading-relaxed">{step}</p>
                           </div>
                         ))}
                       </div>
                    </div>

                    <button onClick={async () => {
                       // Deduct stock logic
                       const ratio = servings / activeRecipe.baseServings;
                       const updates = activeRecipe.ingredients.map(async (ing) => {
                          if (ing.unit === 'q.b.') return;
                          const amount = ing.amount * ratio;
                          const pantryItem = inventory.find(pi => pi.id === ing.id || (pi.names[lang] || pi.names.PT)?.toLowerCase() === ing.name.toLowerCase());
                          if (pantryItem) {
                            await updateItem(pantryItem, { stockQuantity: Math.max(0, pantryItem.stockQuantity - amount) });
                          }
                       });
                       await Promise.all(updates);
                       setActiveRecipe(null);
                       setView('dashboard');
                    }} className="w-full py-4 bg-brand-500 text-white font-black rounded-2xl uppercase shadow-lg shadow-brand-200/50 active:scale-95 transition-transform">{t.finish}</button>
                 </div>
              </div>
           </div>
        )}

        {/* SETTINGS VIEW */}
        {view === 'settings' && (
           <div className="animate-in space-y-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm text-center">
                 <div className="w-20 h-20 bg-brand-100 rounded-full mx-auto flex items-center justify-center text-4xl text-brand-500 mb-4 font-black">
                    {settings.name.charAt(0)}
                 </div>
                 <h2 className="text-xl font-black text-slate-800">{settings.name}</h2>
                 <p className="text-sm text-slate-400 font-bold">#{settings.householdId}</p>
                 <button onClick={handleLogout} className="mt-4 px-6 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs uppercase flex items-center gap-2 mx-auto">
                   <LogOut size={14} /> {t.logout}
                 </button>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm space-y-4">
                 <h3 className="font-black text-lg flex items-center gap-2 text-slate-800"><UserIcon size={18}/> {t.dietary}</h3>
                 <div className="flex flex-wrap gap-2">
                    {settings.dietaryRestrictions.map((r, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold flex items-center gap-1">
                        {r} <button onClick={() => {
                           const newRestrictions = settings.dietaryRestrictions.filter((_, idx) => idx !== i);
                           setSettings({ ...settings, dietaryRestrictions: newRestrictions });
                           // In real app, sync to Firebase User Profile
                        }}><X size={12}/></button>
                      </span>
                    ))}
                 </div>
                 <div className="flex gap-2">
                    <input type="text" id="dietInput" placeholder={t.dietaryPlaceholder} className="flex-1 bg-slate-50 p-3 rounded-xl text-sm font-bold outline-none text-slate-800" 
                       onKeyDown={(e) => {
                         if(e.key === 'Enter') {
                           const val = e.currentTarget.value;
                           if(val) {
                             setSettings(prev => ({ ...prev, dietaryRestrictions: [...prev.dietaryRestrictions, val] }));
                             e.currentTarget.value = '';
                           }
                         }
                       }}
                    />
                    <button onClick={() => {
                       const input = document.getElementById('dietInput') as HTMLInputElement;
                       if(input.value) {
                         setSettings(prev => ({ ...prev, dietaryRestrictions: [...prev.dietaryRestrictions, input.value] }));
                         input.value = '';
                       }
                    }} className="bg-brand-500 text-white p-3 rounded-xl font-bold">+</button>
                 </div>
              </div>
           </div>
        )}

      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-brand-900/10 border border-white flex items-center justify-between px-6 z-50">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${view === 'dashboard' ? 'text-brand-600 scale-110' : 'text-slate-300'}`}>
          <LayoutGrid size={24} strokeWidth={3} />
        </button>
        <button onClick={() => setView('plan')} className={`flex flex-col items-center gap-1 transition-all ${view === 'plan' ? 'text-brand-600 scale-110' : 'text-slate-300'}`}>
          <CalendarDays size={24} strokeWidth={3} />
        </button>
        
        <button onClick={() => setView('shop')} className="-mt-12 w-16 h-16 bg-gradient-to-tr from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-500/40 border-4 border-brand-50 active:scale-90 transition-transform">
          <Plus size={32} strokeWidth={3} />
        </button>

        <button onClick={() => setView('list')} className={`flex flex-col items-center gap-1 transition-all ${view === 'list' ? 'text-brand-600 scale-110' : 'text-slate-300'}`}>
          <List size={24} strokeWidth={3} />
          {inventory.filter(i => (i.listQuantity||0)>0).length > 0 && (
            <span className="absolute top-5 ml-4 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <button onClick={() => setView('cook')} className={`flex flex-col items-center gap-1 transition-all ${view === 'cook' ? 'text-brand-600 scale-110' : 'text-slate-300'}`}>
          <ChefHat size={24} strokeWidth={3} />
        </button>
      </nav>

    </div>
  );
}