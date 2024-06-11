let display = document.getElementById('display');
let currentExpression = '';
let resultDisplayed = false;
let expUsed = false;

function appendNumber(number) {
    if (resultDisplayed) {
        currentExpression = number;
        resultDisplayed = false;
    } else {
        currentExpression += number;
    }
    display.value = currentExpression;
}

function appendOperator(operator) {
    if (currentExpression === '' && operator !== '-') return;
    if (resultDisplayed) {
        resultDisplayed = false;
    }
    currentExpression += operator;
    display.value = currentExpression;
}

function appendFunction(func) {
    currentExpression += func + '(';
    display.value = currentExpression;
}

function appendExp() {
    if (currentExpression === '') return;
    currentExpression += 'e';
    expUsed = true;
    display.value = currentExpression;
}


Decimal.set({ precision: 20 }); // Configurar precisión

function calculate() {
    try {
        let expression = currentExpression
            .replace(/\^/g, '**') // Reemplazar ^ con ** para la potencia
            .replace(/(\d+)e([-+]?\d+)/g, '$1*Math.pow(10,$2)')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        // Verificar si hay una expresión elevada a un exponente negativo
        if (/\*\*-/.test(expression)) {
            // Agregar paréntesis para mejorar la precisión de la operación
            expression = `(${expression})`;
        }

        let result = eval(expression);
        if (expUsed) {
            result = new Decimal(result).toExponential(2); // Convertir a Decimal y redondear
            expUsed = false;
        }

        display.value = result.toString(); // Convertir el resultado a cadena para mostrarlo
        currentExpression = result.toString();
        resultDisplayed = true;
    } catch (error) {
        display.value = 'Error';
        currentExpression = '';
    }
}

function clearDisplay() {
    currentExpression = '';
    display.value = '0';
    resultDisplayed = false;
}

function backspace() {
    if (resultDisplayed) {
        clearDisplay();
        return;
    }
    currentExpression = currentExpression.slice(0, -1);
    display.value = currentExpression || '0';
}

function appendConstant(constant) {
    if (constant === 'π') {
        currentExpression += 'π';
    } else if (constant === 'e') {
        currentExpression += 'e';
    }
    display.value = currentExpression;
}

function calculateSquareRoot() {
    currentExpression += 'sqrt(';
    display.value = currentExpression;
}

function calculateSine() {
    currentExpression += 'sin(';
    display.value = currentExpression;
}

function calculateCosine() {
    currentExpression += 'cos(';
    display.value = currentExpression;
}

// Función para agregar paréntesis
function appendParenthesis(parenthesis) {
    currentExpression += parenthesis;
    display.value = currentExpression;
}

function calculateTangent() {
    currentExpression += 'tan(';
    display.value = currentExpression;
}

function calculateLog() {
    currentExpression += 'log(';
    display.value = currentExpression;
}

function calculateLn() {
    currentExpression += 'ln(';
    display.value = currentExpression;
}

function calculateExp() {
    appendExp();
}

function calculateFactorial() {
    let number = parseInt(currentExpression);
    if (number < 0) {
        display.value = 'Error';
        return;
    }
    let factorial = 1;
    for (let i = 1; i <= number; i++) {
        factorial *= i;
    }
    display.value = factorial;
    currentExpression = factorial.toString();
}

function calculateReciprocal() {
    let reciprocal = 1 / parseFloat(currentExpression);
    display.value = reciprocal.toFixed(2);
    currentExpression = reciprocal.toString();
}

function toggleSign() {
    if (currentExpression.charAt(0) === '-') {
        currentExpression = currentExpression.slice(1);
    } else {
        currentExpression = '-' + currentExpression;
    }
    display.value = currentExpression;
}

let scientificNotationEnabled = false; // Variable para mantener el estado de la notación científica


document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (!isNaN(key) || key === '.') {
        appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});