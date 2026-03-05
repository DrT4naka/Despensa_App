/** Utilitários de data */

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function daysFromNow(dateStr) {
  return daysBetween(todayStr(), dateStr);
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Retorna o início da semana (Domingo) para uma data */
export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Retorna array com 7 datas da semana */
export function getWeekDates(weekStart) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

/** Formata dias restantes - mostra em meses se > 30 dias */
export function formatDaysLeft(days, lang) {
  if (days <= 0) return { text: "0", className: "badge-danger" };
  if (days > 60) {
    const months = Math.round(days / 30);
    const monthLabels = { PT: "meses", ES: "meses", EN: "months", FR: "mois", DE: "Monate" };
    return { text: `~${months} ${monthLabels[lang] || "months"}`, className: "badge-ok" };
  }
  if (days > 7) {
    return { text: `${days}d`, className: "badge-ok" };
  }
  if (days > 3) {
    return { text: `${days}d`, className: "badge-warn" };
  }
  return { text: `${days}d`, className: "badge-danger" };
}
