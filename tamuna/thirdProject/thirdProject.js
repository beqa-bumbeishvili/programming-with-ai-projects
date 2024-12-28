let inputField=document.getElementById("result");
let numberButtons=document.querySelectorAll(".numbers");
let clearButton=document.querySelector(".clear");
let operatorButtons = document.querySelectorAll(".operator");
let equalsButton = document.querySelector(".equals");
let decimalButton = document.querySelector(".decimal");
let operatorUsed = false;
let decimalUsed = false;

numberButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        let number = button.getAttribute("data-value");
        inputField.value += number;
        operatorUsed = false;
    });
});

function appendNumber(number) {
    inputField.value += number;
}

clearButton.addEventListener('click',function(){
    inputField.value = "";
});

operatorButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        let operator = button.getAttribute("data-value");
        if (inputField.value && !['+', '-', '*', '/'].includes(inputField.value.slice(-1))) {
            inputField.value += operator;
            operatorUsed = true;
            decimalUsed = false; 
        }
    });
});

equalsButton.addEventListener('click', function() {
    try {
        let result = eval(inputField.value);
        inputField.value = result;
    } catch (e) {
        inputField.value = "Error";
    }
});

decimalButton.addEventListener("click", function() {
    let currentInput = inputField.value;
    let lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
    if (lastNumber && !lastNumber.includes(".")) {
        inputField.value += ".";
        decimalUsed = true;  
    }
});





