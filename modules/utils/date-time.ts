function toTwoDigits(number: number): string {
    return `${number <= 9 ? '0' : ''}${number}`;
}

// yyyy-MM-dd HH:mm
export function getCurrentDateTimeStr(): string {
    const date = new Date();

    return `${date.getFullYear()}-` +
        `${toTwoDigits(date.getMonth() + 1)}-` +
        `${toTwoDigits(date.getDate())} ` +
        `${toTwoDigits(date.getHours())}:` +
        `${toTwoDigits(date.getMinutes())}`;
}

// yyyyMMdd-HHmmss-Ms
export function getExportTimeStr(): string {
    const date = new Date();

    return `${date.getFullYear()}` +
        `${toTwoDigits(date.getMonth() + 1)}` +
        `${toTwoDigits(date.getDate())}-` +
        `${toTwoDigits(date.getHours())}` +
        `${toTwoDigits(date.getMinutes())}` +
        `${toTwoDigits(date.getSeconds())}-` +
        `${date.getMilliseconds()}`;
}

export const MOMENT_DATE_FORMAT = "YYYY-MM-DD";
export const MOMENT_TIME_FORMAT = "HH:mm";
export const MOMENT_DATETIME_FORMAT = MOMENT_DATE_FORMAT + " " + MOMENT_TIME_FORMAT;