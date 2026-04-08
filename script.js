let display = document.querySelector(".display");

let state = "idle"; 
// "idle" | "typing" | "result" | "error"

function append(value) {
  if (state === "error") {
    clearDisplay();
  }

  state = "typing";
  display.value += value;
}

function clearDisplay() {
  display.value = "";
  state = "idle";
}

function calculate() {
  try {
    let result = eval(display.value);
    if (result == Infinity || result == -Infinity){
      throw new Error("Divide by zero");
    }
    display.value = result;    
    state = "result";
  } catch {
    display.value = "ERROR";
    state = "error";
    triggerErrorEffect();
  }
  history.push(`${display.value} = ${result}`);
  updateReceipt();
}

function triggerErrorEffect() {
  const calc = document.querySelector(".calculator");

  calc.classList.add("error");

  // create smoke particles
  for (let i = 0; i < 12; i++) {
    let smoke = document.createElement("div");
    smoke.classList.add("smoke");

    // random horizontal movement
    smoke.style.setProperty("--rand", Math.random());

    calc.appendChild(smoke);

    setTimeout(() => {
      smoke.remove();
    }, 1000);
  }

  setTimeout(() => {
    calc.classList.remove("error");
  }, 300);
}

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key) || "+-*/.".includes(key)) {
    append(key);
  } else if (key === "Enter") {
    calculate();
  } else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (key.toLowerCase() === "c") {
    clearDisplay();
  }
});

function updateReceipt() {
  const receipt = document.getElementById("receipt");
  receipt.innerHTML = "";

  let i = 0;

  function printNextLine() {
    if (i >= history.length) return;

    const line = document.createElement("div");
    line.textContent = history[i];

    receipt.appendChild(line);

    // scroll like a printer
    receipt.scrollTop = receipt.scrollHeight;

    i++;
    setTimeout(printNextLine, 150); //print speed
  }

  printNextLine();
}