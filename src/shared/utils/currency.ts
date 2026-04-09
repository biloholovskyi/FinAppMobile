export function formatAmount(kopecks: number): string {
  return (Math.abs(kopecks) / 100).toLocaleString('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}