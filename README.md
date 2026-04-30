[README (2).md](https://github.com/user-attachments/files/27252626/README.2.md)
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

## 📸 Screenshots

### 🏠 Home — Add Product & Budget Setup

![Home Page](screenshots/screenshot_hero.png)

The landing view features the **Add Product** form (name, price, value, category) alongside the **Budget & Discount** panel with a live slider and optional discount toggle.

---

### 📋 Product List

![Product List](screenshots/screenshot_products.png)

All added products are displayed in a responsive table showing price, value rating, category badge, and the computed **value/price efficiency ratio**.

---

### 📊 Optimization Results & Selected Products

![Results Dashboard](screenshots/screenshot_results.png)

After optimization, the dashboard shows **Total Cost**, **Total Value**, and **Budget Utilization %** as stat cards, followed by a progress bar and the list of **DP-selected products**.

---

### ⚔️ Greedy vs DP Comparison & Skipped Products

![Greedy vs DP](screenshots/screenshot_comparison.png)

A side-by-side comparison of **DP (Optimal)** vs **Greedy** total values. Below it, the **Skipped Products** section explains which items were excluded and why.

---

### 🧮 DP Table Visualization & Discount Impact

![DP Table & Discount](screenshots/screenshot_dp_table.png)

The full **DP Table** is rendered with scrollable columns showing the knapsack computation for each item × budget combination. Below it, the **Discount Impact Analysis** compares before vs after discount results.

---

## 🧠 Concepts Demonstrated

- **Dynamic Programming** — Bottom-up tabulation for 0/1 Knapsack
- **Greedy Algorithms** — Sorting by efficiency ratio
- **Algorithm Comparison** — DP vs Greedy with concrete examples
- **Real-world Optimization** — Budget-constrained shopping

---

## 📄 License

MIT — free for academic and personal use.
