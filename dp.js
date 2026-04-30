/**
 * dp.js — 0/1 Knapsack Dynamic Programming Engine
 */

function knapsackDP(products, budget) {
  const n = products.length;
  const W = Math.floor(budget);
  if (n === 0 || W <= 0) return { selectedItems: [], totalValue: 0, totalCost: 0, dpTable: [] };

  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const price = Math.floor(products[i - 1].price);
    const val = products[i - 1].value;
    for (let w = 0; w <= W; w++) {
      dp[i][w] = price <= w
        ? Math.max(dp[i - 1][w], dp[i - 1][w - price] + val)
        : dp[i - 1][w];
    }
  }

  const selected = [];
  let w = W;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(products[i - 1]);
      w -= Math.floor(products[i - 1].price);
    }
  }
  selected.reverse();

  return {
    selectedItems: selected,
    totalValue: selected.reduce((s, p) => s + p.value, 0),
    totalCost: selected.reduce((s, p) => s + p.price, 0),
    dpTable: dp
  };
}

function knapsackGreedy(products, budget) {
  if (products.length === 0 || budget <= 0) return { selectedItems: [], totalValue: 0, totalCost: 0 };
  const sorted = [...products].sort((a, b) => (b.value / b.price) - (a.value / a.price));
  const selected = [];
  let remaining = budget;
  for (const item of sorted) {
    if (item.price <= remaining) { selected.push(item); remaining -= item.price; }
  }
  return {
    selectedItems: selected,
    totalValue: selected.reduce((s, p) => s + p.value, 0),
    totalCost: selected.reduce((s, p) => s + p.price, 0)
  };
}

function applyDiscount(products, discountPercent) {
  const factor = 1 - discountPercent / 100;
  return products.map(p => ({
    ...p,
    originalPrice: p.originalPrice ?? p.price,
    price: Math.round(p.price * factor)
  }));
}
