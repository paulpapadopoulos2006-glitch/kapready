export function calculateTotal(nightlyRate: number, numNights: number) {
  return { nightlyRate, numNights, total: nightlyRate * numNights }
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)
}
