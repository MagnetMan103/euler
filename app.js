const input = document.getElementById("input");
const submit = document.getElementById("submit");
const debug = document.getElementById("debug");
const initial = document.getElementById("initial")
const step = document.getElementById("step")
const tstart = document.getElementById("tstart")
const end = document.getElementById("final")
const myTable = document.getElementById("myTable")


submit.addEventListener("click", onClick);
let t;
let stepNum;
let y;
const stepValue = parseFloat(step.value)
function onClick() {
    if ((parseFloat(end.value)*100) % (parseFloat(step.value)*100) !== 0 ||
        parseFloat(tstart.value) > parseFloat(end.value)) {
        debug.textContent = "Invalid end value or step"
        return
    }
    if (typeof(stepNum) === "number") {
        for (let i = stepNum + 1; i > 0; i--) {
            myTable.deleteRow(1)
        }
    }
    t = parseFloat(tstart.value)
    stepNum = 0
    y = parseFloat(initial.value)
    debug.textContent = ''

    const equation = input.value.slice(3)
    // debug.textContent = input.value.slice(3);
    // input.value = "y'=";
    newRow(stepNum, t, y)
    getValues(equation);

}

function getValues(equation) {
    let eq = replace(equation, '*(y)', 'y')
    eq = replace(eq, '*(t)', 't')
    console.log(eq)
    eq = fixMultiply(eq)
    console.log(eq)
    eq = replace(eq, '**', '^')
    console.log(eq)

    while (t !== parseFloat(end.value) && stepNum < 50) {
        const next = replace(replace(eq, y, 'y'), t, 't');
        console.log(next, y, t)
        // debug.textContent = eval(next);
        t += parseFloat(step.value)
        t = Math.round(t * 100000)/100000
        y += eval(next) * parseFloat(step.value)
        y = Math.round(y * 100000)/100000
        stepNum++
        newRow(stepNum, t, y)
    }
}
function replace(equation, value, variable) {
    let newEq = ''
    for (let i = 0; i < equation.length; i++) {
        if (equation.charAt(i) === variable) {
            newEq += value
        }
        else { newEq += equation.charAt(i) }
    }

    return newEq
}


function newRow(step, t, y) {
    let row = myTable.insertRow(-1)
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = step.toString();
    cell2.innerHTML = t.toString();
    cell3.innerHTML = y.toString();

}

function fixMultiply(equation) {
    let newEq = ''
    for (let i = 0; i < equation.length; i ++) {
        if (equation[i] === '*' && i === 0) {
            newEq += '1'
        }
        else if (equation[i] === '*' && !isNumerical(equation[i-1]) && equation[i-1] !== ')') {
            console.log((equation[i-1]))
            newEq += '1'
        }
        newEq += equation[i]
    }
    return newEq
}

function isNumerical(char) {
    return char >= '0' && char <= '9';
}