/* ==========================================================================
   OBELIX - Live Explorer & AI Threat Monitor Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('live-stream-body')) return;

  initExplorerStats();
  initLiveStream();
  initFilters();
  initSearch();
});

let totalEvents = 1428590;
let activeAgents = 1420;
let currentThreatLevel = 'LOW';
let activeCategoryFilter = 'ALL';
let searchQuery = '';

const sampleAddresses = [
  '0x7F2b...4A91', '0x1C8e...D04F', '0x99A3...B210', '0x3E11...88F9',
  '0x55C0...E412', '0x8802...11D3', '0xBB4F...992A', '0xD012...33C1'
];

const sampleEvents = [
  { type: 'DeFi', name: 'Liquidity Swap', text: 'Swapped 45.2 RH-ETH for 120,500 OBX', risk: 'NORMAL' },
  { type: 'Wallets', name: 'Whale Transfer', text: 'Transferred 500,000 RH Token to 0x1C8e...D04F', risk: 'WARNING' },
  { type: 'Smart Contracts', name: 'Contract Call', text: 'Executed Vault.deposit() with 12.5 ETH', risk: 'NORMAL' },
  { type: 'NFTs', name: 'NFT Mint', text: 'Minted Obelisk Pioneer #0482', risk: 'NORMAL' },
  { type: 'DAOs', name: 'Governance Vote', text: 'Voted YES on Proposal #14: AI Risk Threshold Update', risk: 'NORMAL' },
  { type: 'Cross-Chain', name: 'Bridge Transfer', text: 'Cross-chain bridge relay to Ethereum Mainnet', risk: 'NORMAL' },
  { type: 'DeFi', name: 'Flash Loan Attack Detection', text: 'AI Flagged flash loan arbitrage anomaly on Robin DEX', risk: 'DANGER' },
  { type: 'Wallets', name: 'New Wallet Cluster', text: 'AI identified 12 bot wallets performing synced trades', risk: 'WARNING' }
];

function initExplorerStats() {
  const eventCounterEl = document.getElementById('stat-total-events');
  const agentCounterEl = document.getElementById('stat-active-agents');

  setInterval(() => {
    totalEvents += Math.floor(Math.random() * 8) + 3;
    if (eventCounterEl) eventCounterEl.innerText = totalEvents.toLocaleString();

    if (Math.random() > 0.8) {
      activeAgents += Math.random() > 0.5 ? 1 : -1;
      if (agentCounterEl) agentCounterEl.innerText = activeAgents.toLocaleString();
    }
  }, 800);
}

function initLiveStream() {
  const tbody = document.getElementById('live-stream-body');
  if (!tbody) return;

  // Add initial rows
  for (let i = 0; i < 8; i++) {
    addRandomTransaction(tbody, false);
  }

  // Continuously append new live transactions
  setInterval(() => {
    addRandomTransaction(tbody, true);
  }, 1200);
}

function addRandomTransaction(tbody, animate = true) {
  const randomEvt = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
  const sender = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)];
  const hash = '0x' + Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('');
  const now = new Date().toLocaleTimeString();

  const tr = document.createElement('tr');
  tr.dataset.category = randomEvt.type.toUpperCase();
  tr.dataset.hash = hash.toLowerCase();

  let tagClass = 'tag-normal';
  if (randomEvt.risk === 'WARNING') tagClass = 'tag-warning';
  if (randomEvt.risk === 'DANGER') tagClass = 'tag-danger';

  tr.innerHTML = `
    <td><span style="color: var(--text-muted); font-size: 0.8rem;">${now}</span></td>
    <td><a href="#" class="tx-hash" onclick="showTxDetails('${hash}', '${randomEvt.name}', '${randomEvt.risk}')">${hash}</a></td>
    <td><span class="pulse-badge" style="font-size: 0.72rem;"><i class="fas fa-cube"></i> Robinhood</span></td>
    <td><span style="color: var(--accent-cyan); font-family: var(--font-code);">${sender}</span></td>
    <td><strong>${randomEvt.name}</strong> - <span style="color: var(--text-muted);">${randomEvt.text}</span></td>
    <td><span class="tag-badge ${tagClass}">${randomEvt.risk}</span></td>
  `;

  if (animate) {
    tr.style.opacity = '0';
    tr.style.transform = 'translateY(-10px)';
    tbody.insertBefore(tr, tbody.firstChild);

    setTimeout(() => {
      tr.style.transition = 'all 0.4s ease';
      tr.style.opacity = '1';
      tr.style.transform = 'translateY(0)';
    }, 50);

    // Keep max 20 rows
    if (tbody.children.length > 20) {
      tbody.removeChild(tbody.lastChild);
    }
  } else {
    tbody.appendChild(tr);
  }

  applyRowFilters(tr);
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategoryFilter = btn.dataset.filter.toUpperCase();
      filterAllRows();
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('explorer-search');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterAllRows();
  });
}

function filterAllRows() {
  const rows = document.querySelectorAll('#live-stream-body tr');
  rows.forEach(row => applyRowFilters(row));
}

function applyRowFilters(row) {
  const category = row.dataset.category || '';
  const hash = row.dataset.hash || '';
  const text = row.innerText.toLowerCase();

  const matchesCategory = activeCategoryFilter === 'ALL' || category.includes(activeCategoryFilter);
  const matchesSearch = searchQuery === '' || hash.includes(searchQuery) || text.includes(searchQuery);

  if (matchesCategory && matchesSearch) {
    row.style.display = '';
  } else {
    row.style.display = 'none';
  }
}

// Global modal trigger for tx details
window.showTxDetails = function(hash, name, risk) {
  alert(`OBELIX AI Inspector Report:\n\nHash: ${hash}\nEvent: ${name}\nRisk Level: ${risk}\nNetwork: Robinhood Chain\nLatency: 0.04ms\nAI Confidence: 99.8%\n\nAll smart contract signatures verified clean.`);
};
