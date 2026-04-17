export async function sendDrawResults(userId: string, drawId: string): Promise<void> {
  console.log('[EMAIL] Draw results to', userId, 'for draw', drawId);
}

export async function sendWinnerNotification(winnerId: string): Promise<void> {
  console.log('[EMAIL] Winner notification to', winnerId);
}

export async function sendSubscriptionReceipt(userId: string, amount: number): Promise<void> {
  console.log('[EMAIL] Subscription receipt to', userId, 'amount', amount);
}
