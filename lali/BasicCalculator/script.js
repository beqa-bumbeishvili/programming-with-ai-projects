let display = document.getElementById("display");
let currentInput = "";
let startsWithDoubleSlash = false;

function appendNumber(number) {
    // თუ ვიწყებთ პირველი სლეშით
    if (currentInput === "" && number === "/") {
        startsWithDoubleSlash = false;
        currentInput = "/";
    }
    // თუ მეორე სლეში მოდის
    else if (currentInput === "/" && number === "/") {
        startsWithDoubleSlash = true;
        currentInput += number;
    }
    // სხვა ნებისმიერი სიმბოლო
    else {
        currentInput += number;
    }

    updateDisplay();
}

function decimal(dot) {
    currentInput += dot;
    updateDisplay();
}

function chooseOperator(op) {
    currentInput += op;
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = "";
    startsWithDoubleSlash = false;
    updateDisplay();
}

function calculate() {

    if (currentInput.startsWith("//")) {
        display.value = "undefined";
        currentInput = "";
        startsWithDoubleSlash = false;
        return;
    }

    try {
        let result = eval(currentInput);
        currentInput = result.toString();
        updateDisplay();
        
    } catch (e) {
        return;
    }
}