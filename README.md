# 🛒 Smart Budget Shopping Optimizer

> Maximize your shopping value within a limited budget using the **0/1 Knapsack Dynamic Programming** algorithm.

---

## 📌 Overview

This web application helps users select the **best combination of products** that maximizes total utility (importance/rating) while staying within a given budget. It uses the classic **0/1 Knapsack** problem solved with **bottom-up Dynamic Programming**, and compares results against a **Greedy** approach.

---

## 🔗 Knapsack Mapping

| Knapsack Concept | Shopping Mapping     |
| ---------------- | -------------------- |
| **Items**        | Products             |
| **Weight**       | Price (₹)            |
| **Value**        | Utility / Importance |
| **Capacity**     | Budget               |

**DP Recurrence:**

```
dp[i][w] = max(
  dp[i-1][w],
  dp[i-1][w - price[i]] + value[i]
)
```

---

## ✨ Features

- ✅ **0/1 Knapsack DP** — Optimal product selection with traceback
- ✅ **Greedy Comparison** — Sort by value/price ratio and compare outcomes
- ✅ **Discount Simulation** — Apply a discount percentage and re-optimize
- ✅ **DP Table Visualization** — Scrollable table with optimal-path highlighting
- ✅ **Budget Slider** — Adjust budget dynamically
- ✅ **Add / Delete Products** — Full CRUD for the product list
- ✅ **Summary Dashboard** — Total cost, total value, budget utilization
- ✅ **Skipped Products** — See which products were excluded and why
- ✅ **Edge-case Handling** — Empty list, zero budget, all items too expensive
- ✅ **Premium UI** — Glassmorphism, gradients, animations, responsive

---

## 🗂 File Structure

```
/shopping-optimizer/
├── index.html    — Main page (semantic HTML5)
├── style.css     — Premium dark-theme CSS
├── app.js        — Application logic & UI rendering
├── dp.js         — DP algorithm, Greedy algorithm, discount utility
└── README.md     — This file
```

---

## 🚀 How to Run

1. Clone or download the project.
2. Open `index.html` in any modern browser.
3. Add products, set a budget, toggle discounts, and click **"Find Best Shopping Plan"**.

> No build tools, no frameworks — pure HTML + CSS + JavaScript.

---

## 🧠 Concepts Demonstrated

- **Dynamic Programming** — Bottom-up tabulation for 0/1 Knapsack
- **Greedy Algorithms** — Sorting by efficiency ratio
- **Algorithm Comparison** — DP vs Greedy with concrete examples
- **Real-world Optimization** — Budget-constrained shopping

---

## 📄 License

MIT — free for academic and personal use.
