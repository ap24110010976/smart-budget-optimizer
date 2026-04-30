/* ═══════════════════════════════════════════════════
   app.js  —  Smart Budget Shopping Optimizer
   ═══════════════════════════════════════════════════ */

// ─── Default Data ───
const defaultProducts = [
  { id: 1, name: "Shoes",      price: 800, value: 9, category: "Fashion" },
  { id: 2, name: "Shirt",      price: 400, value: 6, category: "Fashion" },
  { id: 3, name: "Watch",      price: 500, value: 7, category: "Accessories" },
  { id: 4, name: "Bag",        price: 300, value: 5, category: "Lifestyle" },
  { id: 5, name: "Headphones", price: 600, value: 8, category: "Electronics" },
  { id: 6, name: "Cap",        price: 200, value: 3, category: "Fashion" }
];

let products = [];
let nextId = 100;

// ─── DOM refs ───
const $ = id => document.getElementById(id);
const productTableBody   = $('product-table-body');
const budgetInput        = $('budget-input');
const budgetSlider       = $('budget-slider');
const budgetDisplay      = $('budget-display');
const discountToggle     = $('discount-toggle');
const discountControls   = $('discount-controls');
const discountInput      = $('discount-input');
const optimizeBtn        = $('optimize-btn');
const spinner            = $('spinner');
const resultsSection     = $('results-section');
const toastContainer     = $('toast-container');

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  products = defaultProducts.map(p => ({ ...p }));
  renderTable();
  syncBudget(1000);
  $('add-form').addEventListener('submit', handleAddProduct);
  optimizeBtn.addEventListener('click', handleOptimize);
  discountToggle.addEventListener('click', toggleDiscount);
  budgetInput.addEventListener('input', () => syncBudget(+budgetInput.value));
  budgetSlider.addEventListener('input', () => syncBudget(+budgetSlider.value));
});

// ─── Toast ───
function toast(msg, icon = '✅') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${icon}</span> ${msg}`;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─── Budget sync ───
function syncBudget(v) {
  v = Math.max(0, Math.min(10000, v || 0));
  budgetInput.value = v;
  budgetSlider.value = v;
  budgetDisplay.textContent = `₹${v.toLocaleString()}`;
}

// ─── Discount toggle ───
function toggleDiscount() {
  discountToggle.classList.toggle('active');
  const open = discountToggle.classList.contains('active');
  discountControls.style.display = open ? 'flex' : 'none';
}

// ─── Add Product ───
function handleAddProduct(e) {
  e.preventDefault();
  const name     = $('inp-name').value.trim();
  const price    = +$('inp-price').value;
  const value    = +$('inp-value').value;
  const category = $('inp-category').value;
  if (!name) { toast('Enter a product name', '⚠️'); return; }
  if (price <= 0) { toast('Price must be positive', '⚠️'); return; }
  if (value < 1 || value > 10) { toast('Value must be 1–10', '⚠️'); return; }
  products.push({ id: nextId++, name, price, value, category });
  renderTable();
  e.target.reset();
  toast(`"${name}" added`);
}

// ─── Delete Product ───
function deleteProduct(id) {
  const p = products.find(x => x.id === id);
  products = products.filter(x => x.id !== id);
  renderTable();
  if (p) toast(`"${p.name}" removed`, '🗑️');
}

// ─── Render Table ───
function renderTable() {
  if (products.length === 0) {
    productTableBody.innerHTML = `<tr><td colspan="6" class="empty-state"><span>📦</span>No products yet — add some above!</td></tr>`;
    return;
  }
  productTableBody.innerHTML = products.map(p => {
    const ratio = (p.value / p.price).toFixed(4);
    const cat = p.category.toLowerCase();
    return `<tr>
      <td style="font-weight:600">${p.name}</td>
      <td>₹${p.price.toLocaleString()}</td>
      <td>⭐ ${p.value}</td>
      <td><span class="badge badge-${cat}">${p.category}</span></td>
      <td><span class="ratio-pill">⚡ ${ratio}<span class="tooltip">Value per ₹ spent</span></span></td>
      <td><button class="btn btn-danger-sm" onclick="deleteProduct(${p.id})">✕ Delete</button></td>
    </tr>`;
  }).join('');
}

// ─── Optimize ───
function handleOptimize() {
  // Edge cases
  if (products.length === 0) { toast('Add at least one product', '⚠️'); return; }
  const budget = +budgetInput.value;
  if (budget <= 0) { toast('Budget must be greater than 0', '⚠️'); return; }

  // Show spinner
  optimizeBtn.disabled = true;
  spinner.style.display = 'block';

  setTimeout(() => {
    const discountOn = discountToggle.classList.contains('active');
    const discountPct = discountOn ? Math.max(0, Math.min(100, +discountInput.value || 0)) : 0;

    // Without discount
    const dpResult      = knapsackDP(products, budget);
    const greedyResult  = knapsackGreedy(products, budget);

    // With discount
    let discountDP = null;
    if (discountOn && discountPct > 0) {
      const discounted = applyDiscount(products, discountPct);
      discountDP = knapsackDP(discounted, budget);
      discountDP._discountedProducts = discounted;
    }

    renderResults(dpResult, greedyResult, budget, discountDP, discountPct);

    spinner.style.display = 'none';
    optimizeBtn.disabled = false;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast('Optimization complete!', '🎯');
  }, 600);
}

// ─── Render Results ───
function renderResults(dp, greedy, budget, discountDP, discountPct) {
  // Summary stats
  const pct = budget > 0 ? Math.round((dp.totalCost / budget) * 100) : 0;
  $('stat-cost').textContent   = `₹${dp.totalCost.toLocaleString()}`;
  $('stat-value').textContent  = dp.totalValue;
  $('stat-pct').textContent    = `${pct}%`;
  $('progress-fill').style.width = `${pct}%`;
  animateCounter('stat-cost',  dp.totalCost, '₹');
  animateCounter('stat-value', dp.totalValue);

  // Selected products
  const selBox = $('selected-products');
  if (dp.selectedItems.length === 0) {
    selBox.innerHTML = `<div class="empty-state"><span>😕</span>No products fit within the budget.</div>`;
  } else {
    selBox.innerHTML = dp.selectedItems.map((p, i) =>
      `<div class="selected-card fade-up" style="animation-delay:${i * .1}s">
        <div><div class="sel-name">${p.name}</div><div class="sel-meta">₹${p.price.toLocaleString()} · ⭐ ${p.value}</div></div>
        <span class="sel-tag">Selected by DP</span>
      </div>`
    ).join('');
  }

  // Greedy vs DP comparison
  $('dp-total').textContent     = dp.totalValue;
  $('greedy-total').textContent = greedy.totalValue;
  const diff = dp.totalValue - greedy.totalValue;
  const msgEl = $('compare-msg');
  if (diff > 0) {
    msgEl.className = 'compare-msg win';
    msgEl.textContent = `✨ DP provides optimal solution over greedy approach (+${diff} value)`;
  } else {
    msgEl.className = 'compare-msg tie';
    msgEl.textContent = '🤝 Both approaches yield the same result for this input';
  }

  // Skipped products
  const selectedIds = new Set(dp.selectedItems.map(p => p.id));
  const skipped = products.filter(p => !selectedIds.has(p.id));
  const skipBox = $('skipped-products');
  if (skipped.length === 0) {
    skipBox.innerHTML = `<p style="color:var(--text-muted);text-align:center">All products were selected! 🎉</p>`;
  } else {
    skipBox.innerHTML = skipped.map(p =>
      `<div class="skipped-item">
        <div><strong>${p.name}</strong> — ₹${p.price.toLocaleString()} · ⭐ ${p.value}</div>
        <span class="skip-reason">Did not maximize value within budget</span>
      </div>`
    ).join('');
  }

  // DP Table Visualization
  renderDPTable(dp.dpTable, products, budget);

  // Discount Impact
  const impactSection = $('discount-impact');
  if (discountDP && discountPct > 0) {
    impactSection.style.display = 'block';
    $('impact-before-val').textContent  = dp.totalValue;
    $('impact-before-cost').textContent = `₹${dp.totalCost.toLocaleString()}`;
    $('impact-after-val').textContent   = discountDP.totalValue;
    $('impact-after-cost').textContent  = `₹${discountDP.totalCost.toLocaleString()}`;
    $('impact-after-items').textContent = `${discountDP.selectedItems.length} items`;
    $('impact-before-items').textContent = `${dp.selectedItems.length} items`;
    const impMsg = $('impact-msg');
    if (discountDP.totalValue > dp.totalValue) {
      impMsg.textContent = `💡 A ${discountPct}% discount allows more products to fit within budget, increasing total value!`;
      impMsg.style.color = 'var(--success)';
    } else {
      impMsg.textContent = `The ${discountPct}% discount did not change the optimal selection for this budget.`;
      impMsg.style.color = 'var(--text-muted)';
    }
  } else {
    impactSection.style.display = 'none';
  }
}

// ─── DP Table ───
function renderDPTable(dpTable, items, budget) {
  const container = $('dp-table-vis');
  if (!dpTable || dpTable.length === 0) { container.innerHTML = ''; return; }

  const n = items.length;
  const W = Math.floor(budget);
  // Only render a subset of columns for large budgets
  const step = W > 100 ? Math.max(1, Math.floor(W / 60)) : 1;
  const cols = [];
  for (let w = 0; w <= W; w += step) cols.push(w);
  if (cols[cols.length - 1] !== W) cols.push(W);

  // Traceback path
  const path = new Set();
  let tw = W;
  for (let i = n; i >= 1; i--) {
    if (dpTable[i][tw] !== dpTable[i - 1][tw]) {
      path.add(`${i}-${tw}`);
      tw -= Math.floor(items[i - 1].price);
    } else {
      path.add(`${i}-${tw}`);
    }
  }

  let html = '<table><thead><tr><th class="dp-header">Item \\ Budget</th>';
  cols.forEach(c => { html += `<th class="dp-header">${c}</th>`; });
  html += '</tr></thead><tbody>';

  for (let i = 0; i <= n; i++) {
    html += `<tr><td style="font-weight:600;white-space:nowrap">${i === 0 ? '∅' : items[i - 1].name}</td>`;
    cols.forEach(c => {
      const cls = path.has(`${i}-${c}`) ? ' class="dp-highlight"' : '';
      html += `<td${cls}>${dpTable[i][c]}</td>`;
    });
    html += '</tr>';
  }
  html += '</tbody></table>';
  container.innerHTML = html;
}

// ─── Animated counter ───
function animateCounter(id, target, prefix = '') {
  const el = $(id);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = prefix + current.toLocaleString();
  }, 25);
}
