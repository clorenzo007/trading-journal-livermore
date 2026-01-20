import { useMemo } from "react";

export default function useDailyStats(trades) {
  return useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        profitTotal: 0,
        tradeCount: 0,
        wins: 0,
        losses: 0,
        be: 0,
        winrate: 0,
        avgWin: 0,
        avgLoss: 0,
        expectancy: 0,
        avgR: 0,
        bestTrade: null,
        worstTrade: null,
      };
    }

    let profitTotal = 0;
    let wins = 0;
    let losses = 0;
    let be = 0;

    const winPL = [];
    const lossPL = [];
    const rValues = [];

    let bestTrade = trades[0];
    let worstTrade = trades[0];

    trades.forEach((t) => {
      const p = Number(t.profit_loss || 0);
      profitTotal += p;

      if (p > 0) {
        wins++;
        winPL.push(p);
      } else if (p < 0) {
        losses++;
        lossPL.push(Math.abs(p));
      } else {
        be++;
      }

      if (t.risk_amount) {
        const r = p / Number(t.risk_amount);
        if (!isNaN(r)) rValues.push(r);
      }

      if (p > Number(bestTrade.profit_loss)) bestTrade = t;
      if (p < Number(worstTrade.profit_loss)) worstTrade = t;
    });

    const tradeCount = trades.length;
    const winrate = tradeCount ? (wins / tradeCount) * 100 : 0;

    const avgWin =
      winPL.length > 0 ? winPL.reduce((a, b) => a + b, 0) / winPL.length : 0;

    const avgLoss =
      lossPL.length > 0 ? lossPL.reduce((a, b) => a + b, 0) / lossPL.length : 0;

    const lossRate = tradeCount ? losses / tradeCount : 0;
    const winRate = tradeCount ? wins / tradeCount : 0;

    const expectancy = winRate * avgWin - lossRate * avgLoss;

    const avgR =
      rValues.length > 0
        ? rValues.reduce((a, b) => a + b, 0) / rValues.length
        : 0;

    return {
      profitTotal,
      tradeCount,
      wins,
      losses,
      be,
      winrate,
      avgWin,
      avgLoss,
      expectancy,
      avgR,
      bestTrade,
      worstTrade,
    };
  }, [trades]);
}
