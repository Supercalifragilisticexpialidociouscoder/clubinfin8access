export function formatYear(year: string | number): string {
  const y = String(year);
  if (y === '1' || y === 'Y1' || y.toLowerCase() === 'first year') return 'First Year';
  if (y === '2' || y === 'Y2' || y.toLowerCase() === 'second year') return 'Second Year';
  if (y === '3' || y === 'Y3' || y.toLowerCase() === 'third year') return 'Third Year';
  if (y === '4' || y === 'Y4' || y.toLowerCase() === 'fourth year') return 'Fourth Year';
  return `Year ${y}`;
}
