export const ExpenditureType = Object.freeze([
    {id: 0, Key: "RENT",      Label: "Rent"},
    {id: 1, Key: "GROCERIES", Label: "Groceries"},
    {id: 2, Key: "UTILITIES", Label: "Utilities"}
    // .... and so on
]);

export class Expenditure {
    constructor(date, type, amount) {
        this.dateSet = date;
        this.type = type;
        this.amount = amount;
    }

    toString() {
        return `${this.dateSet}-${this.type}-${this.amount}`;
    }
};

export function exportExpenditures(expenses) {
    return JSON.stringify(expenses);
}

export async function importExpenditures(file) {
    const text = await file.text();
    return JSON.parse(text);
}
