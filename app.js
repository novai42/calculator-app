let expression = '';
let justCalculated = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay(val) {
  const str = String(val);
  resultEl.style.fontSize = str.length > 10 ? '24px' : str.length > 7 ? '32px' : '40px';
  resultEl.textContent = str;
}

function input(ch) {
  const ops = ['+', '-', '*', '/'];
  if (justCalculated) {
    if (ops.includes(ch)) { expression = resultEl.textContent; }
    else { expression = ''; }
    justCalculated = false;
  }
  const lastChar = expression.slice(-1);
  if (ops.includes(ch) && ops.includes(lastChar)) { expression = expression.slice(0, -1); }
  if (ch === '0' && expression === '0') return;
  if (ch === '.') {
    const parts = expression.split(/[+\-*/]/);
    if (parts[parts.length - 1].includes('.')) return;
  }
  expression += ch;
  expressionEl.textContent = expression.replace(/\*/g, '×').replace(/\//g, '÷');
  updateDisplay(expression.slice(-1) === '.' ? expression : evalSafe(expression));
}

function evalSafe(expr) {
  try {
    const result = Function('"use strict"; return (' + expr + ')')();
    if (!isFinite(result)) return 'Error';
    return parseFloat(result.toFixed(10));
  } catch { return expression; }
}

function calculate() {
  if (!expression) return;
  const result = evalSafe(expression);
  expressionEl.textContent = expression.replace(/\*/g, '×').replace(/\//g, '÷') + ' =';
  expression = String(result);
  updateDisplay(result);
  justCalculated = true;
}

function clearAll() {
  expression = '';
  justCalculated = false;
  expressionEl.textContent = '';
  updateDisplay(0);
}

function toggleSign() {
  if (!expression) return;
  const val = evalSafe(expression);
  if (typeof val === 'number') { expression = String(-val); updateDisplay(expression); expressionEl.textContent = expression; }
}

function percent() {
  if (!expression) return;
  const val = evalSafe(expression);
  if (typeof val === 'number') { expression = String(val / 100); updateDisplay(expression); expressionEl.textContent = expression; }
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') input(e.key);
  else if (e.key === '+') input('+');
  else if (e.key === '-') input('-');
  else if (e.key === '*') input('*');
  else if (e.key === '/') { e.preventDefault(); input('/'); }
  else if (e.key === '.') input('.');
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') {
    if (!justCalculated) {
      expression = expression.slice(0, -1);
      expressionEl.textContent = expression.replace(/\*/g, '×').replace(/\//g, '÷');
      updateDisplay(expression ? evalSafe(expression) : 0);
    }
  }
  else if (e.key === 'Escape') clearAll();
});