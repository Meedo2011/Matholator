let expression = "";
let resultShown = false;

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
    } else if (expression.endsWith("cos(")) {
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
        // Log expression before conversion
        console.log("Original Expression:", expression);
        
        // Replace ^ with ** for power evaluation
        let powerExpression = expression.replace(/\^/g, '**');
        
        // Log converted expression
        console.log("Converted Expression:", powerExpression);
        
        // Evaluate with Math.js
        expression = math.evaluate(powerExpression).toString();
        
        // Log the result after evaluation
        console.log("Evaluation Result:", expression);
        
        updateDisplay();
        resultShown = true; // Set flag indicating result is shown
    } catch (e) {
        expression = "Error";
        console.error("Calculation Error:", e);
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

// Function to handle graph plotting
function plotGraph() {
    let input = document.getElementById("function-input").value.trim();
    
    // Check if the input is empty
    if (input === "") {
        Plotly.purge('graph');  // Clear the graph if input is empty
        return;
    }

    try {
        // Parse the function input and create a range of x values
        let expr = math.compile(input);
        let xValues = math.range(-10, 10, 0.1).toArray();  // Range for x-axis
        
        // Evaluate y values based on the input function
        let yValues = xValues.map(function (x) {
            return expr.evaluate({ x: x });
        });

        // Define the trace for Plotly
        let trace = {
            x: xValues,
            y: yValues,
            mode: 'lines',
            type: 'scatter'
        };

        // Layout for the graph
        let layout = {
            title: `Graph of f(x) = ${input}`,
            xaxis: { title: 'x' },
            yaxis: { title: 'f(x)' }
        };

        // Plot the graph with updated values
        Plotly.newPlot('graph', [trace], layout);

    } catch (error) {
        console.error("Error plotting graph:", error);
        Plotly.purge('graph');  // Clear the graph on error
    }
}
