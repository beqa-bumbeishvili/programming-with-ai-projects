const resultInput = document.getElementById("result");
const buttons = document.querySelectorAll("button");

// Variables to keep track of the current input, operator, and history - ცვლადების სახელები ისედაც მაგას ამბობენ, კომენტარი ზედმეტია
let currentInput = "";
let previousInput = "";
let operator = "";
let history = "";

// Function to update the display - ზედმეტია
function updateDisplay(value) {
    resultInput.value = value;
}

// Function to handle number and decimal input - ფუნქციის სახელი უნდა ამბობდეს ამას, კომენტარო ზედმეტია
function handleNumber(number) {
    if (currentInput.length < 12) {
        currentInput += number;
        updateDisplay(history + currentInput);
    }
}

// Function to handle operator input - ზედმეტია
function handleOperator(op) {
    if (currentInput === "" && previousInput !== "") {
        operator = op;
        history = history.slice(0, -1) + op; // Replace the last operator in history
    }
    else if (currentInput !== "") {
        if (previousInput === "")
            previousInput = currentInput;
        else
            previousInput = calculate();

        operator = op;
        history += currentInput + operator;
        currentInput = "";

        updateDisplay(history);
    }
}

// Function to calculate the result
function calculate() {
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);

    if (isNaN(num1) || isNaN(num2))
        return "";

    switch (operator) {
        case "+":
            return (num1 + num2).toString();
        case "-":
            return (num1 - num2).toString();
        case "*":
            return (num1 * num2).toString();
        case "/":
            return num2 !== 0 ? (num1 / num2).toString() : "Error";
        default:
            return currentInput;
    }
}

// Function to clear all inputs
function clearCalculator() {
    currentInput = "";
    previousInput = "";
    operator = "";
    history = "";

    updateDisplay("");
}

// ჯობია კოდი ზემოთ იყოს და ფუნქციები ქვემოთ, ეს შეგიძლია მეცხრე ხაზზე აიტანო
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        if (button.classList.contains("number")) {
            handleNumber(value);
        }
        else if (button.classList.contains("operator")) {
            handleOperator(value);
        }
        else if (button.classList.contains("decimal")) {
            if (!currentInput.includes(".")) {
                currentInput += ".";
                updateDisplay(history + currentInput);
            }
        }
        else if (button.classList.contains("clear")) {
            clearCalculator();
        }
        else if (button.classList.contains("equals")) {
            if (currentInput !== "" && operator !== "") {
                history += currentInput; // Add the last number to the history
                currentInput = calculate();

                previousInput = "";
                operator = "";
                
                updateDisplay(currentInput); // Show only the result
                history = ""; // Reset history after displaying result
            }
        }
    });
});