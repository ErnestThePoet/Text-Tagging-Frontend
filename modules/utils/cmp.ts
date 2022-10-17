export const stringCompare: (a: string, b: string) => number
    = (a: string, b: string) => {
    if (a < b) {
        return -1;
    }
    else if (a === b) {
        return 0;
    }
    else {
        return 1;
    }
    }

export const stringNullCompare: (a: string | null, b: string | null) => number
    = (a: string | null, b: string | null) => {
        if (a === null && b !== null) {
            return -1;
        }
        else if (a !== null && b === null) {
            return 1;
        }
        else if (a === null && b === null) {
            return 0;
        }
        else {
            return stringCompare(a!, b!);
        }
}