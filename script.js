// Initialize variables to store the current expression and track if the result is shown
let expression = "";
let resultShown = false;
let functionCount = 1; // Tracks the number of functions added

// Mode switching for Normal, Scientific, and Graphic calculators
document.getElementById("normal-btn").addEventListener("click", () => {
    document.getElementById("normal-calculator").style.display = "block";
    document.getElementById("scientific-calculator").style.display = "none";
    document.getElementById("graphic-calculator").style.display = "none";
});

document.getElementById("scientific-btn").addEventListener("click", () => {
    document.getElementById("normal-calculator").style.display = "none";
    document.getElementById("scientific-calculator").style.display = "block";
    document.getElementById("graphic-calculator").style.display = "none";
});

document.getElementById("graphic-btn").addEventListener("click", () => {
    document.getElementById("normal-calculator").style.display = "none";
    document.getElementById("scientific-calculator").style.display = "none";
    document.getElementById("graphic-calculator").style.display = "block";
});

// Function to handle button presses
function press(key) {
    if (resultShown) {
        expression = ""; // Clear expression if a result was previously shown
        resultShown = false;
    }
    expression += key; // Append the pressed key to the expression
    updateDisplay();
}

// Clear the calculator display
function clearDisplay() {
    expression = "";
    updateDisplay();
}

// Delete the last character or function from the expression
function deleteLast() {
    if (expression.endsWith("sin(")) {
        expression = expression.slice(0, -4);
    } else if (expression.endsWith("tan(")) {
        expression = expression.slice(0, -4);
    } else if (expression.endsWith("sqrt(")) {
        expression = expression.slice(0, -5);
    } else {
        expression = expression.slice(0, -1);
    }
    updateDisplay();
}

// Evaluate the expression and round results with more than 3 decimal places
function calculate() {
    try {
        let result = math.evaluate(expression);
        if (result.toString().includes('.')) {
            const decimals = result.toString().split('.')[1].length;
            if (decimals > 3) {
                result = math.round(result, 3);
            }
        }
        expression = result.toString();
        updateDisplay();
        resultShown = true;
    } catch (e) {
        expression = "Error";
        updateDisplay();
        resultShown = true;
    }
}

// Update the display to show the current expression or result
function updateDisplay() {
    const normalDisplay = document.getElementById("normal-display");
    const scientificDisplay = document.getElementById("scientific-display");

    if (document.getElementById("normal-calculator").style.display === "block") {
        normalDisplay.value = expression || "0";
    } else if (document.getElementById("scientific-calculator").style.display === "block") {
        scientificDisplay.value = expression || "0";
    }
}

// Add a new function input for the graphic calculator
function addFunction() {
    const functionsContainer = document.getElementById('functions-container');
    const newFunctionInput = document.createElement('input');
    newFunctionInput.type = 'text';
    newFunctionInput.id = `function-input-${functionCount}`;
    newFunctionInput.placeholder = `Enter function g(x), h(x), etc.`;
    newFunctionInput.oninput = () => plotGraph();
    functionsContainer.appendChild(newFunctionInput);
    functionCount++;
}

// Remove the last function input for the graphic calculator
function removeFunction() {
    if (functionCount > 1) {
        functionCount--;
        const functionsContainer = document.getElementById('functions-container');
        const lastFunctionInput = document.getElementById(`function-input-${functionCount}`);
        functionsContainer.removeChild(lastFunctionInput);
        plotGraph();
    }
}

// Plot the functions entered in the graphic calculator
function plotGraph() {
    const traces = [];
    for (let i = 0; i < functionCount; i++) {
        const input = document.getElementById(`function-input-${i}`).value;
        if (input) {
            try {
                const expr = math.compile(input);
                const xValues = math.range(-10, 10, 0.1).toArray();
                const yValues = xValues.map(x => expr.evaluate({ x }));
                traces.push({
                    x: xValues,
                    y: yValues,
                    mode: 'lines',
                    type: 'scatter',
                    name: `f${i + 1}(x)`
                });
            } catch (error) {
                console.error("Error plotting graph:", error);
            }
        }
    }
    Plotly.newPlot('graph', traces, { title: 'Graph of Functions', xaxis: { title: 'x' }, yaxis: { title: 'y' } });
}

// Event listeners for theme selection and custom background
document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('theme-button');
    const themeModal = document.getElementById('theme-modal');
    const closeModal = document.querySelector('.close');
    const themeSelector = document.getElementById('theme-selector');
    const bgInput = document.getElementById('bg-input');
    const removeBgButton = document.getElementById('remove-bg-button');
    const body = document.body;

    themeButton.addEventListener('click', () => {
        themeModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        themeModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === themeModal) {
            themeModal.style.display = 'none';
        }
    });

    themeSelector.addEventListener('change', (event) => {
        body.classList.remove('dark-theme', 'light-theme', 'space-blue-theme', 'red-theme', 'rose-pink-theme', 'emerald-green-theme', 'custom-background');
        const selectedTheme = event.target.value;
        if (selectedTheme !== 'default') {
            body.classList.add(selectedTheme);
        }
    });

    document.addEventListener('keydown', (event) => {
        const validKeys = "0123456789+-*/.";
        const key = event.key;
    
        if (validKeys.includes(key)) {
            press(key);
        } else if (key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            calculate();
        } else if (key === 'Backspace') {
            deleteLast();
        } else if (key === 'Escape') {
            clearDisplay();
        }
    });

    bgInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                body.style.backgroundImage = `url('${e.target.result}')`;
                body.classList.add('custom-background');
            };
            reader.readAsDataURL(file);
        }
    });

    removeBgButton.addEventListener('click', () => {
        body.style.backgroundImage = '';
        body.classList.remove('custom-background');
    });
});
