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