
function appendValuesToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function roundToDecimals(num, decimals) {
    let factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

function calculateTheResult() {
    const expression = document.getElementById('display').value;

    let numbers = expression.split(/[\+\-\*\/]/).map(num => parseFloat(num));
    console.log(expression);
    let operators = expression.split(/[^\+\-\*\/]/).filter(op => op !== '');
    while (true) {
        if (operators.includes("*")) {
            let multiplyIndex = operators.indexOf("*");
            numbers[multiplyIndex] = numbers[multiplyIndex] * numbers[multiplyIndex + 1];
            numbers.splice(multiplyIndex + 1, 1);
            operators.splice(multiplyIndex, 1);

        } else if ((operators.includes("/"))) {
            let divideIndex = operators.indexOf("/");
            numbers[divideIndex] = numbers[divideIndex] / numbers[divideIndex + 1];
            numbers.splice(divideIndex + 1, 1);
            operators.splice(divideIndex, 1);

        } else {
            break;
        }
    }
    let result = numbers[0];



    for (let i = 0; i < operators.length; i++) {
        switch (operators[i]) {
            case '+':
                result += numbers[i + 1];
                break;
            case '-':
                result -= numbers[i + 1];
                break;
            case '*':
                result *= numbers[i + 1];
                break;
            case '/':
                if (numbers[i + 1] !== 0) {
                    result /= numbers[i + 1];
                } else {
                    document.getElementById('display').value = 'Error';
                    return;
                }
                break;
        }
    }
    result = roundToDecimals(result, 8)

    document.getElementById('display').value = result;
}