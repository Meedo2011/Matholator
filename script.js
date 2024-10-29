let expression = "";
let resultShown = false;
let functionCount = 1; // Tracks the number of functions added

// Switch between modes
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
        expression = "";
        resultShown = false;
    }
    expression += key;
    updateDisplay();
}

// Function to clear the display
function clearDisplay() {
    expression = "";
    updateDisplay();
}

// Function to delete the last character or a full function (e.g., sin(), tan(), sqrt())
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

// Function to evaluate the expression using Math.js
function calculate() {
    try {
        expression = math.evaluate(expression).toString();
        updateDisplay();
        resultShown = true; // Set flag indicating result is shown
    } catch (e) {
        expression = "Error";
        updateDisplay();
        resultShown = true;
    }
}

// Function to update the display
function updateDisplay() {
    const normalDisplay = document.getElementById("normal-display");
    const scientificDisplay = document.getElementById("scientific-display");

    if (document.getElementById("normal-calculator").style.display === "block") {
        normalDisplay.value = expression || "0";
    } else if (document.getElementById("scientific-calculator").style.display === "block") {
        scientificDisplay.value = expression || "0";
    }
}

// Add new function
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

// Remove last function
function removeFunction() {
    if (functionCount > 1) {
        functionCount--;
        const functionsContainer = document.getElementById('functions-container');
        const lastFunctionInput = document.getElementById(`function-input-${functionCount}`);
        functionsContainer.removeChild(lastFunctionInput);
        plotGraph(); // Re-plot graph without the removed function
    }
}

// Function to handle button presses
function press(key) {
    if (resultShown) {
        expression = "";
        resultShown = false;
    }
    expression += key; // Append the key (like ^ for power) to the expression
    updateDisplay();
}


// Function to handle graph plotting for multiple functions
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
