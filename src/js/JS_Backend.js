import { ExpenditureType, Expenditure, exportExpenditures, importExpenditures } from "./expenditures.js"
import { chartOnLoad } from "./charts.js";

new Chart({});
// Mozilla has non-standard features that make errors better, so im compiling 
// all the platform specific ways to log errors here to avoid platform issues
function logError(e) {
    // TODO: maybe move browser detection somewhere more central so we only need to query once? Will need more examples of browser specific behaviour -Lena
    const isFireFox = /Firefox\/(\d+\.\d+)/.test(navigator.userAgent);
    let err = `ERROR: ${e.message}`;

    if (isFireFox) {
        const errFile = e.fileName;
        const errLine = e.lineNumber;
        const errColumn = e.columnNumber;
        err = err.concat(" at ", errLine, ":", errColumn, " in file ", errFile);
    }

    console.log(err)
}

async function assert(condition, msg) {
    const result = typeof condition === "function" 
        ? await condition() : condition;

    if (!result) {
        logError(new Error(msg, {}));
    }
}


// TODO: better test and better testing infrastructure (lmao) -Lena
function test() {
    assert(() => {
        const testObject = new Expenditure(Date.now(), ExpenditureType.RENT, 900.0);

        const jsonOutput = JSON.parse(exportExpenditures([testObject]))[0];

        const resultObject = new Expenditure(
            jsonOutput.dateSet,
            jsonOutput.type,
            jsonOutput.amount
        );

        return resultObject.toString() === testObject.toString();
    }, "exportExpenditures is broken halp");

    assert(async () => {
        const testObject = new Expenditure(Date.now(), ExpenditureType.RENT, 900.0);

        const blob = new Blob ([exportExpenditures([testObject])]);

        const jsonOutput = await importExpenditures(blob);

        const resultObject = new Expenditure(
            jsonOutput[0].dateSet,
            jsonOutput[0].type,
            jsonOutput[0].amount
        );

        return testObject.toString() == resultObject.toString();
    }, "importExpenditures is broken halp")
}

document.addEventListener("DOMContentLoaded", test);
document.addEventListener("DOMContentLoaded", chartOnLoad);


const toggleBtn = document.getElementById("toggleBtn");
const container = document.querySelector(".container");

toggleBtn.addEventListener("click", function () {

    container.classList.toggle("collapsed");

    if (container.classList.contains("collapsed")) {
        toggleBtn.textContent = "Show ➜";
    } else {
        toggleBtn.textContent = "Hide ➜";
    }

});

//Dynamically fills in the dropdown with expenditureTypes.
const ExpenseType = document.getElementById("ExpenditureType");
const CostInput = document.getElementById("Cost");
const form = document.getElementById("ExpenseForm");

ExpenditureType.forEach(type => {
    const DropdownOption = document.createElement("option");
    DropdownOption.textContent = type.Label;
    ExpenseType.appendChild(DropdownOption);
});

const submitBtn = document.querySelector("#ExpenseForm button");

submitBtn.addEventListener("click", function () {
    const expenseType = document.getElementById("ExpenditureType").value;
    const cost = parseFloat(document.getElementById("Cost").value);

    // Validation
    if (!expenseType) {
        showToast("Please select an expense type.");
        return;
    }

    if (!cost || cost <= 0) {
        showToast("Please enter a cost greater than £0.");
        return;
    }

    // If validation passes
    showToast(`You entered: ${expenseType} - £${cost.toFixed(2)}`);
});

function showToast(message) {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        container.removeChild(toast);
    }, 3000);
}

