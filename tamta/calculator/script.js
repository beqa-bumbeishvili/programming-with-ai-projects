function clearDisplay() {
    document.getElementById('display').value = '';
}

function appendNumber(number) {
    document.getElementById('display').value += number;
}

function appendOperator(operator) {
    const display = document.getElementById('display');
    const lastChar = display.value.slice(-1);

    if (['+', '-', '*', '/'].includes(lastChar)) {
        display.value = display.value.slice(0, -1) + operator;
    } else {
        display.value += operator;
    }
}

function calculateResult() {
    const display = document.getElementById('display');
    const input = display.value;

    try {
        const tokens = tokenize(input);
        const result = evaluate(tokens);
        display.value = result;
    } catch (e) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function tokenize(input) {
    const tokens = [];
    let currentNumber = '';

    for (let char of input) {
        if ('0123456789.'.includes(char)) {
            currentNumber += char;
        } else if ('+-*/'.includes(char)) {
            if (currentNumber) {
                tokens.push(parseFloat(currentNumber));
                currentNumber = '';
            }
            tokens.push(char);
        }
    }

    if (currentNumber) {
        tokens.push(parseFloat(currentNumber));
    }

    return tokens;
}

function evaluate(tokens) {
    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
    };

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
    };

    const outputQueue = [];
    const operatorStack = [];

    for (let token of tokens) {
        if (typeof token === 'number') {
            outputQueue.push(token);
        } else if ('+-*/'.includes(token)) {
            while (
                operatorStack.length > 0 &&
                precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
    }

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    const stack = [];

    for (let token of outputQueue) {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(operators[token](a, b));
        }
    }

    return stack[0];
}
