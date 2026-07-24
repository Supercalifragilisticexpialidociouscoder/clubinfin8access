export function formatYear(year: string | number): string {
  const y = String(year);
  if (y === '1' || y === 'Y1' || y.toLowerCase() === 'first year') return 'First Year';
  if (y === '2' || y === 'Y2' || y.toLowerCase() === 'second year') return 'Second Year';
  if (y === '3' || y === 'Y3' || y.toLowerCase() === 'third year') return 'Third Year';
  if (y === '4' || y === 'Y4' || y.toLowerCase() === 'fourth year') return 'Fourth Year';
  return `Year ${y}`;
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return 'N/A';
  
  let safeString = String(dateString);
  // Convert SQL datetime "YYYY-MM-DD HH:MM:SS" to UTC ISO string
  if (safeString.length === 19 && safeString.includes(' ')) {
    safeString = safeString.replace(' ', 'T') + 'Z';
  } else if (!safeString.endsWith('Z') && !safeString.includes('+') && safeString.includes('T')) {
    safeString = safeString + 'Z';
  }
  
  const d = new Date(safeString);
  if (isNaN(d.getTime())) return String(dateString);
  
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  let hour = d.getHours();
  const minute = d.getMinutes().toString().padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  
  hour = hour % 12;
  hour = hour ? hour : 12;
  
  return `${day} ${month} ${year}, ${hour}:${minute} ${ampm}`;
}
