const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.fram');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        case 'removelast':
            removelast();
            break;
        default:
            if (!isNaN(parseFloat(value)) || value === '00') {
                inputDigit(value);
            }
    }

    updateDisplay();
});

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand || calculator.displayValue.includes(dot)) {
        return;
    }
    calculator.displayValue += dot;
}

function removelast() {
    calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (nextOperator === '=' && !operator) {
        return; // Do nothing if equals is pressed without an operator
    }

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator === '=' ? null : nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
        calculator.operator = nextOperator === '=' ? null : nextOperator;
        calculator.displayValue = '0'; // Clear display for next input
        calculator.waitingForSecondOperand = true;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        if (result === 'Error' || isNaN(result) || !isFinite(result)) {
            calculator.displayValue = 'Error';
            resetCalculator();
            updateDisplay();
            return;
        }
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
        calculator.operator = nextOperator === '=' ? null : nextOperator;
        calculator.waitingForSecondOperand = nextOperator !== '=';
        if (nextOperator !== '=') {
            calculator.displayValue = '0'; // Clear display for next input
        }
    }
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        if (secondOperand === 0) {
            return 'Error';
        }
        return firstOperand / secondOperand;
    } else if (operator === '%') {
        return (firstOperand * secondOperand) / 100; // Percentage calculation
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}