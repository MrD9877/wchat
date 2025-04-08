export async function getFriend(userId) {
  try {
    const res = await fetch("/api/getFriend", { method: "POST", body: JSON.stringify({ userId }) });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      return "error";
    }
  } catch {
    return "error";
  }
}

export function areDatesOnSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const d1UTC = new Date(Date.UTC(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate()));
  const d2UTC = new Date(Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate()));

  return d1UTC.getTime() === d2UTC.getTime();
}
