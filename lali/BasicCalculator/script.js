let display = document.getElementById("display");
let currentInput = "";
let startsWithDoubleSlash = false;

function appendNumber(number) {
    if (currentInput === "" && number === "/") {
        startsWithDoubleSlash = false;
        currentInput = "/";
    }

    else if (currentInput === "/" && number === "/") {
        startsWithDoubleSlash = true;
        currentInput += number;
    }

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
    // აქ ცარიელი ხაზი ზედმეტია, ფუნქციის პირველივე ხაზზე უნდა დაიწყოს კოდი
    if (currentInput.startsWith("//")) {
        display.value = "undefined";
        currentInput = "";
        startsWithDoubleSlash = false;
        return;
    }

    const validRegex = /^[0-9+\-*/.()]+$/;
    if (!validRegex.test(currentInput)) {
        display.value = "Invalid input";
        currentInput = "";
        return;
    }

    try {
        const result = new Function(`return ${currentInput}`)();
        currentInput = result.toString();
        updateDisplay();

    } catch (e) {
        return;
    }
}