/* ==========================================================================
   OBELIX - AI Agent Terminal Interactive Console
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const inputEl = document.getElementById('terminal-input');
  const sendBtn = document.getElementById('terminal-send-btn');
  const promptChips = document.querySelectorAll('.prompt-chip');

  if (!terminalBody || !inputEl) return;

  function appendUserCommand(cmdText) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-prompt">user@obelix:~$</span> ${escapeHtml(cmdText)}`;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function appendAgentResponse(htmlContent) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.style.marginTop = '0.5rem';
    line.style.marginBottom = '1.25rem';
    line.innerHTML = htmlContent;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function appendTypingIndicator() {
    const id = 'typing-' + Date.now();
    const line = document.createElement('div');
    line.id = id;
    line.className = 'terminal-line';
    line.innerHTML = `<span style="color: var(--accent-primary);"><i class="fas fa-spinner fa-spin"></i> Obelix AI Agent is computing...</span>`;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function processQuery(query) {
    if (!query.trim()) return;

    appendUserCommand(query);
    inputEl.value = '';

    const typingId = appendTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator(typingId);
      const resHtml = generateResponse(query);
      appendAgentResponse(resHtml);
    }, 900);
  }

  // Handle Enter key
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      processQuery(inputEl.value);
    }
  });

  // Handle Send button
  sendBtn?.addEventListener('click', () => {
    processQuery(inputEl.value);
  });

  // Handle Preset Quick Prompt Chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.dataset.prompt || chip.innerText;
      processQuery(promptText);
    });
  });

  function generateResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('scan') || q.includes('anomaly') || q.includes('exploit')) {
      return `
        <div style="background: rgba(0, 255, 135, 0.05); border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px;">
          <div style="color: var(--accent-primary); font-weight: 700; margin-bottom: 0.5rem;">[AI SCAN COMPLETE] Robinhood Chain Anomalies (Last 100 Blocks)</div>
          <pre style="color: #A6E22E; font-size: 0.82rem; overflow-x: auto;">
{
  "scanned_blocks": 100,
  "anomalies_detected": 1,
  "threat_level": "CAUTION",
  "anomaly_detail": {
    "type": "Flash Loan Liquidity Spike",
    "target_pool": "0x892F...Pool-A",
    "impact_usd": "$42,000",
    "mitigation_status": "AUTO_ALERT_SENT"
  }
}</pre>
        </div>
      `;
    }

    if (q.includes('gas') || q.includes('predict') || q.includes('trend')) {
      return `
        <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.3); padding: 1rem; border-radius: 8px;">
          <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 0.5rem;">[PREDICTIVE ANALYTICS] Robinhood Chain Gas Forecast</div>
          <p style="color: #CBD5E1; font-size: 0.85rem; margin-bottom: 0.5rem;">Predicted next 60 mins gas trend: <strong>STABLE (~0.00004 RH-ETH)</strong></p>
          <div style="display: flex; gap: 0.5rem;">
            <span class="pulse-badge"><i class="fas fa-chart-line"></i> Confidence: 98.4%</span>
            <span class="pulse-badge" style="border-color: var(--accent-cyan); color: var(--accent-cyan);"><i class="fas fa-bolt"></i> TPS Peak: 14,200</span>
          </div>
        </div>
      `;
    }

    if (q.includes('wallet') || q.includes('0x')) {
      return `
        <div style="background: rgba(13, 20, 25, 0.9); border: 1px solid var(--border-highlight); padding: 1rem; border-radius: 8px;">
          <div style="color: var(--accent-primary); font-weight: 700; margin-bottom: 0.5rem;">[WALLET INTELLIGENCE REPORT] Target: 0x7F2b...4A91</div>
          <ul style="color: #CBD5E1; font-size: 0.85rem; padding-left: 1.2rem; line-height: 1.6;">
            <li><strong>Risk Score:</strong> <span style="color: var(--accent-primary);">12/100 (LOW RISK)</span></li>
            <li><strong>Behavior Category:</strong> Institutional Liquidity Provider</li>
            <li><strong>Total Transactions:</strong> 4,890 events on Robinhood Chain</li>
            <li><strong>Smart Contracts Deployed:</strong> 3 Verified Contracts</li>
          </ul>
        </div>
      `;
    }

    // Default Fallback
    return `
      <div style="color: #E2E8F0;">
        <p><strong>OBELIX Autonomous AI Agent v2.4:</strong> Query parsed successfully.</p>
        <p style="font-size: 0.85rem; margin-top: 0.4rem;">"<em>${escapeHtml(query)}</em>" - System state normal across Robinhood Chain nodes. Ready for next command.</p>
      </div>
    `;
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
