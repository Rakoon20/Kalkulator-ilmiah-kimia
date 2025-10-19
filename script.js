const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
let isResultShown = false;

// ===== Kalkulator Ilmiah =====
function appendValue(value) {
  if (isResultShown && /[0-9(πe]/.test(value)) {
    display.value = "";
    isResultShown = false;
  }
  if (isResultShown && /[+\-*/^]/.test(value)) {
    isResultShown = false;
  }
  display.value += value;
}

function clearDisplay() {
  display.value = "";
  isResultShown = false;
}

function deleteLast() {
  if (!isResultShown) display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    let exp = display.value;
    if (!exp) return;

    const originalExp = exp;

    exp = exp.replace(/π/g, Math.PI)
             .replace(/e/g, Math.E)
             .replace(/√\(/g, "Math.sqrt(")
             .replace(/log\(/g, "Math.log10(")
             .replace(/ln\(/g, "Math.log(")
             .replace(/sin\(/g, "Math.sin(")
             .replace(/cos\(/g, "Math.cos(")
             .replace(/tan\(/g, "Math.tan(")
             .replace(/\^/g, "**")
             .replace(/%/g, "/100");

    const result = eval(exp);
    if (!Number.isFinite(result)) throw new Error("Invalid");

    display.value = result;
    addToHistory(originalExp, result);
    isResultShown = true;
  } catch {
    display.value = "Error";
    isResultShown = true;
  }
}

// ===== History Panel =====
function addToHistory(expression, result) {
  const li = document.createElement("li");
  li.textContent = `${expression} = ${result}`;
  li.onclick = () => {
    display.value = result;
    isResultShown = true;
  };
  historyList.prepend(li);

  if (historyList.childNodes.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

function clearHistory() {
  historyList.innerHTML = "";
}

// ===== Tab Switch =====
function showCalc(type) {
  document.querySelectorAll(".calculator, .tabs button").forEach(el => el.classList.remove("active"));
  const sci = document.getElementById("sciCalc");
  const chem = document.getElementById("chemCalc");

  if (type === "sci") {
    sci.classList.add("active");
    document.getElementById("btnSci").classList.add("active");
  } else {
    chem.classList.add("active");
    document.getElementById("btnChem").classList.add("active");
  }
}

// ===== Kalkulator Kimia =====
const AVOGADRO = 6.022e23;
function calcChem() {
  const option = document.getElementById("chemOption").value;
  const value = parseFloat(document.getElementById("chemValue").value);
  const molarMass = parseFloat(document.getElementById("molarMass").value);
  const resultBox = document.getElementById("chemResult");

  if (isNaN(value)) return resultBox.innerHTML = "⚠️ Masukkan nilai yang valid!";

  let result = "";
  switch (option) {
    case "molToGram":
      if (isNaN(molarMass)) return resultBox.innerHTML = "Masukkan massa molar!";
      result = `${value} mol × ${molarMass} g/mol = ${(value * molarMass).toFixed(3)} gram`;
      break;
    case "gramToMol":
      if (isNaN(molarMass)) return resultBox.innerHTML = "Masukkan massa molar!";
      result = `${value} g ÷ ${molarMass} g/mol = ${(value / molarMass).toFixed(5)} mol`;
      break;
    case "molToPartikel":
      result = `${value} mol × 6.022×10²³ = ${(value * AVOGADRO).toExponential(3)} partikel`;
      break;
    case "partikelToMol":
      result = `${value} ÷ 6.022×10²³ = ${(value / AVOGADRO).toExponential(5)} mol`;
      break;
  }
  resultBox.innerHTML = `<b>Hasil:</b><br>${result}`;
}

// ===== Dark Mode Toggle =====
function toggleTheme() {
  document.body.classList.toggle("dark");
  const btn = document.querySelector(".theme-toggle");
  btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}
