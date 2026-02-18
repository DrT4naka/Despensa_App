// Mock implementation replacing Firebase to fix module resolution errors
// and allow the demo to run using LocalStorage.

// Mock Data Store in Memory (synced to LocalStorage)
const STORAGE_KEY = 'smart_pantry_demo_db';

const getStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const setStore = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const listeners: Record<string, Function[]> = {};

const notifyListeners = (path: string) => {
   if (listeners[path]) {
      const store = getStore();
      const parts = path.split('/');
      let data = store;
      for (const part of parts) {
        data = data?.[part];
      }
      
      const docs = data ? Object.keys(data).map(key => ({
        id: key,
        data: () => data[key]
      })) : [];
      
      listeners[path].forEach(cb => cb({ docs }));
   }
};

export const db = {}; 
export const auth = {};

export const signIn = async () => {
  // Mock sign in
  return Promise.resolve();
};

export const subscribeToAuth = (cb: (user: any | null) => void) => {
  // Simulate authenticated user immediately
  setTimeout(() => cb({ uid: 'demo-user', isAnonymous: true }), 100);
  return () => {};
};

export const saveData = async (path: string, id: string, data: any) => {
  const store = getStore();
  const parts = path.split('/');
  
  let current = store;
  for (const part of parts) {
    if (!current[part]) current[part] = {};
    current = current[part];
  }
  
  current[id] = { ...current[id], ...data };
  setStore(store);
  notifyListeners(path);
};

export const deleteData = async (path: string, id: string) => {
  const store = getStore();
  const parts = path.split('/');
  
  let current = store;
  for (const part of parts) {
    if (!current[part]) return;
    current = current[part];
  }
  
  if (current[id]) {
    delete current[id];
    setStore(store);
    notifyListeners(path);
  }
};

export const subscribeCollection = (path: string, cb: (snap: any) => void) => {
  if (!listeners[path]) listeners[path] = [];
  listeners[path].push(cb);
  
  // Initial callback
  setTimeout(() => notifyListeners(path), 0);
  
  return () => {
    listeners[path] = listeners[path].filter(l => l !== cb);
  };
};
