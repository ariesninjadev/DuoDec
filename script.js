
var len = 2;
var type = "add";

var currentProblem;
var currentAnswer;
var inputValue;

var activeLenButton = document.getElementById("len-2");
var activeTypeButton = document.getElementById("add");

function setLength(length, el) {
    if (el === activeLenButton) {
        return;
    }
    len = length;
    updateProblem();
    el.classList.add("active");
    if (activeLenButton) {
        activeLenButton.classList.remove("active");
    }
    activeLenButton = el;
    localStorage.setItem("len", length);
}

function setType(operation, el) {
    if (el === activeTypeButton) {
        return;
    }
    type = operation;
    updateProblem();
    el.classList.add("active");
    if (activeTypeButton) {
        activeTypeButton.classList.remove("active");
    }
    activeTypeButton = el;
    localStorage.setItem("type", operation);
}

function generateDuoProblem() {
    // Generate a random problem in duodecimal based on len
    const a = Math.floor(Math.random() * Math.pow(12, len));
    const b = Math.floor(Math.random() * Math.pow(12, len));
    if (type == "add") {
        currentProblem = `${toDuo(a)} + ${toDuo(b)}`;
        // Answer in decimal then convert to duodecimal
        currentAnswer = toDuo(a + b);
    } else if (type == "sub") {
        currentProblem = `${toDuo(a)} - ${toDuo(b)}`;
        // Answer in decimal then convert to duodecimal
        currentAnswer = toDuo(a - b);
    } else if (type == "mult") {
        currentProblem = `${toDuo(a)} × ${toDuo(b)}`;
        // Answer in decimal then convert to duodecimal
        currentAnswer = toDuo(a * b);
    }
}

function toDuo(decimal) {
    if (decimal === 0) return "0";

    const symbols = "0123456789XE";
    let result = "";
    let num = decimal;

    while (num > 0) {
        const remainder = num % 12;
        result = symbols[remainder] + result;
        num = Math.floor(num / 12);
    }

    return result;
}

function fromDuo(duoString) {
    const symbols = "0123456789XE";
    let decimal = 0;

    for (let i = 0; i < duoString.length; i++) {
        const value = symbols.indexOf(duoString[i]);
        if (value === -1) {
            throw new Error(`Invalid character '${duoString[i]}' in duodecimal string`);
        }
        decimal = decimal * 12 + value;
    }

    return decimal;
}

function submitted(event) {

    event.preventDefault();

    inputValue = document.getElementById('answer').value.toUpperCase();

    if (inputValue === "") {
        return;
    }

    if (inputValue === currentAnswer) {
        console.log("Correct!");
    } else {
        console.log("Incorrect!");
    }

    generateReview();
    updateProblem();

}

document.getElementById('answer').addEventListener('input', function (event) {
    const validCharacters = "0123456789XE";
    const input = event.target.value.toUpperCase();
    let filteredInput = "";

    for (let i = 0; i < input.length; i++) {
        if (validCharacters.includes(input[i])) {
            filteredInput += input[i];
        }
    }

    event.target.value = filteredInput;
});

function generateReview() {
    // If correct, show the equation in green with a checkmark
    // If incorrect, show the equation in red with an X and the correct answer
    const review = document.getElementById('review');
    review.innerHTML = "";
    const div = document.createElement("div");
    if (inputValue === currentAnswer) {
        div.style.color = "green";
        div.textContent = "✓ " + currentProblem + " = " + currentAnswer;
    } else {
        div.style.color = "red";
        div.textContent = "✗ " + currentProblem + " = " + currentAnswer + " (You said: " + inputValue + ")";
    }
    review.appendChild(div);
}

function updateProblem() {
    // Clear answer input
    document.getElementById('answer').value = "";
    generateDuoProblem();
    document.getElementById('question').textContent = currentProblem;
}

if (localStorage.getItem("len")) {
    len = parseInt(localStorage.getItem("len"));
    setLength(len, document.getElementById("len-" + len));
}

if (localStorage.getItem("type")) {
    type = localStorage.getItem("type");
    if (type === "add") {
        setType("add", document.getElementById("add"));
    } else if (type === "sub") {
        setType("sub", document.getElementById("sub"));
    } else if (type === "mult") {
        setType("mult", document.getElementById("mult"));
    }
}

updateProblem();