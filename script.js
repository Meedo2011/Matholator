let expression = "";
let resultShown = false;
let functionCount = 1; 


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


function press(key) {
    if (resultShown) {
        expression = "";
        resultShown = false;
    }
    expression += key;
    updateDisplay();
}


function clearDisplay() {
    expression = "";
    updateDisplay();
}


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


function calculate() {
    try {
        expression = math.evaluate(expression).toString();
        updateDisplay();
        resultShown = true; 
    } catch (e) {
        expression = "Error";
        updateDisplay();
        resultShown = true;
    }
}


function updateDisplay() {
    const normalDisplay = document.getElementById("normal-display");
    const scientificDisplay = document.getElementById("scientific-display");

    if (document.getElementById("normal-calculator").style.display === "block") {
        normalDisplay.value = expression || "0";
    } else if (document.getElementById("scientific-calculator").style.display === "block") {
        scientificDisplay.value = expression || "0";
    }
}


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


function removeFunction() {
    if (functionCount > 1) {
        functionCount--;
        const functionsContainer = document.getElementById('functions-container');
        const lastFunctionInput = document.getElementById(`function-input-${functionCount}`);
        functionsContainer.removeChild(lastFunctionInput);
        plotGraph(); 
    }
}

// 
function press(key) {
    if (resultShown) {
        expression = "";
        resultShown = false;
    }
    expression += key; 
    updateDisplay();
}



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
