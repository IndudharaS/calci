// script.js
let expression = "";
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

function updateDisplay() {
  document.getElementById("expression").value = expression;
}

function appendToDisplay(value) {
  expression += value;
  updateDisplay();
}

function appendOperation(operation) {
  const lastChar = expression.slice(-1);
  const operations = ["+", "-", "*", "/", "^"];

  if (operations.includes(lastChar)) {
    expression = expression.slice(0, -1) + operation;
  } else {
    expression += operation;
  }
  updateDisplay();
}

function clearDisplay() {
  expression = "";
  document.getElementById("result").value = "";
  updateDisplay();
}

function calculate() {
  try {
    let expr = expression
      .replace(/π/g, Math.PI)
      .replace(/!/g, "factorial")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/\^/g, "**");

    // Custom factorial function
    const factorial = (n) => {
      if (n < 0) throw new Error("Negative factorial");
      return n <= 1 ? 1 : n * factorial(n - 1);
    };

    const result = eval(expr);
    document.getElementById("result").value = result;

    // Add to history
    history.unshift({
      expression: expression,
      result: result,
    });

    if (history.length > 10) history.pop();
    localStorage.setItem("calcHistory", JSON.stringify(history));
    updateHistory();

    expression = result.toString();
    updateDisplay();
  } catch (error) {
    document.getElementById("result").value = "Error";
  }
}

function updateHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  history.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.expression}</strong> = ${item.result}`;
    li.onclick = () => {
      expression = item.expression;
      updateDisplay();
    };
    historyList.appendChild(li);
  });
}

function clearHistory() {
  history = [];
  localStorage.removeItem("calcHistory");
  updateHistory();
}

function toggleHistory() {
  const historyPanel = document.getElementById("historyPanel");
  historyPanel.classList.toggle("active");
}

// Initial history load
updateHistory();
