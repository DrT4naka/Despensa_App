export const normalizeId = (str: string) => str ? str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";

export const generateSafeCode = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

export const getLocalISODate = (dateObj = new Date()) => {
  const offset = dateObj.getTimezoneOffset() * 60000;
  return new Date(dateObj.getTime() - offset).toISOString().split('T')[0];
};

export const getDaysDifference = (timestamp: number) => {
  const now = Date.now();
  return (now - timestamp) / (1000 * 60 * 60 * 24);
};

// Check if expired or expiring soon (within 3 days)
export const getExpiryStatus = (expiryDate?: string) => {
  if (!expiryDate) return 'good';
  const today = new Date().toISOString().split('T')[0];
  const expiry = new Date(expiryDate).getTime();
  const now = new Date(today).getTime();
  
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'expiring';
  return 'good';
};