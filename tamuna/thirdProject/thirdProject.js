let inputField=document.getElementById("result");
let numberButtons=document.querySelectorAll(".numbers");
let clearButton=document.querySelector(".clear");
let operatorButtons = document.querySelectorAll(".operator");
let equalsButton = document.querySelector(".equals");
let decimalButton = document.querySelector(".decimal");
let operatorUsed = false;
let decimalUsed = false;

//avoid "function" here and define function appendNumber saperately//
numberButtons.forEach(button => {
    button.addEventListener("click", () => appendNumber(button.getAttribute("data-value")));
});

function appendNumber(number) {
    inputField.value += number;
}

clearButton.addEventListener('click',function(){
    inputField.value = "";
});

//do the same here, use appendOperator function and define saperately//
operatorButtons.forEach(button => {
    button.addEventListener("click", () => appendOperator(button.getAttribute("data-value")));
});

function appendOperator(operator) {
    const currentInput = inputField.value;
    const lastChar = currentInput.slice(-1);
    if (currentInput && !['+', '-', '*', '/'].includes(lastChar)) {
        inputField.value += operator;
        operatorUsed = true;
        decimalUsed = false;
    }
};

//avoid function "eval"//
equalsButton.addEventListener('click', function() {
    try {
        let expression = inputField.value;
        let result = safeEvaluate(expression);
        inputField.value = result !== null ? result : "Error";
    } catch (e) {
        inputField.value = "Error";
    }
});

function safeEvaluate(expression) {
    if (/[^0-9+\-*/().\s]/.test(expression)) {
        return null; 
    }
    try {
        return new Function('return ' + expression)();
    } catch (e) {
        return null; 
    }
}

decimalButton.addEventListener("click", function() {
    let currentInput = inputField.value;
    let lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
    if (lastNumber && !lastNumber.includes(".")) {
        inputField.value += ".";
        decimalUsed = true;  
    }
});





