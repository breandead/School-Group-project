//TODO: move stuff out into own files -Lena

const ExpenditureType = Object.freeze([
    {id: 0, Key: "RENT",      Label: "Rent"},
    {id: 1, Key: "GROCERIES", Label: "Groceries"},
    {id: 2, Key: "UTILITIES", Label: "Utilities"}
    // .... and so on
]);

class Expenditure {
    constructor(date, type, amount) {
        this.dateSet = date;
        this.type = type;
        this.amount = amount;
    }

    toString() {
        return `${this.dateSet}-${this.type}-${this.amount}`;
    }
};

function exportExpenditures(expenses) {
    return JSON.stringify(expenses);
}

async function importExpenditures(file) {
    const text = await file.text();
    return JSON.parse(text);
}

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


const toggleBtn = document.getElementById("toggleBtn");
const container = document.querySelector(".container");

toggleBtn.addEventListener("click", function() {

    container.classList.toggle("collapsed");

    if (container.classList.contains("collapsed")) {
        toggleBtn.textContent = "Show ➜";
    } else {
        toggleBtn.textContent = "Hide ➜";
    }
});
