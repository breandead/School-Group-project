//TODO: move stuff out into own files -Lena

const ExpenditureType = {
    RENT: "Rent",
    GROCERIES: "Groceries",
    // .... and so on
};

class Expenditure {
    constructor(date, type, amount) {
        this.dateSet = date;
        this.type = type;
        this.amount = amount;
    }
};

function exportExpenditures(expenses) {
    const jsonArr = [];
    for (let i = 0; i < expenses.length; i++) {
        jsonArr.push(JSON.stringify(expenses[i]));
    }
    return jsonArr;
};

function importExpenditures(file) {
    try {
        const fr = new FileReader();
        const json = fr.readAsText(file);
        return JSON.parse(json);
    } catch(e) {
        logError(e)
    }
};

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

function assert(condition, msg) {
    const result = typeof condition === "function" ? condition() : condition;

    if (!result) {
        logError(new Error(msg, {}));
    }
}


// TODO: better test and better testing infrastructure (lmao) -Lena
function test() {
    assert(() => {
        const testObject = new Expenditure(Date.now(), ExpenditureType.RENT, 900.0);
        const jsonOutput = JSON.parse(exportExpenditures([testObject]));
        const resultObject = new Expenditure(jsonOutput.dateSet, jsonOutput.type, jsonOutput.amount);
        return resultObject.toString() === testObject.toString();
    }, "exportExpenditures is broken halp");

    // assert(() => {
    //     const testObject = new Expenditure(Date.now(), ExpenditureType.RENT, 900.0);
    //     const jsonOutput = importExpenditures(new Blob(exportExpenditures([testObject])));
    //     const resultObject = new Expenditure(jsonOutput[0], jsonOutput[1], jsonOutput[2]);
    //     return testObject.toString() == resultObject.toString();
    // }, "importExpenditures is broken halp")
}

document.addEventListener("DOMContentLoaded", test);
