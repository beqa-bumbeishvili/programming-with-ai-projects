
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

    const numbers = expression.split(/[\+\-\*\/]/).map(num => parseFloat(num));
    console.log(expression);
    const operators = expression.split(/[^\+\-\*\/]/).filter(op => op !== '');

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