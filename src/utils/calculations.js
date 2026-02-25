/**
 * Calculates the Risk:Reward ratio based on Entry, Stop Loss, and Take Profit.
 * Formula provided: RR = (TakeProfit - Entry) / (Entry - Stop)
 * Handles both Long and Short directions.
 */
export function calculateRR(trade) {
  const entry = Number(trade.entry_price);
  const stop = Number(trade.stop_loss);
  const tp = Number(trade.take_profit);
  const direction = trade.direction || "Long";

  if (!entry || !stop || !tp) return null;

  let reward, risk;
  if (direction === "Long") {
    reward = tp - entry;
    risk = entry - stop;
  } else {
    // For Short trades, the formula is inverted
    reward = entry - tp;
    risk = stop - entry;
  }

  if (risk === 0) return 0;
  
  const ratio = reward / risk;
  
  // Return as string with 2 decimals, or 0 if negative (invalid setup)
  return ratio > 0 ? ratio.toFixed(2) : "0.00";
}
