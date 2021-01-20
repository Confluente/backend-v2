/**
 * Takes an array of strings, and transforms it into a single string for use in the database
 * None of the strings should contain the preserved character combination #,#
 * @param array         Array of strings to be stringified
 * @returns             Stringified array, consisting of the input elements separated by #,#
 */
export function stringifyArrayOfStrings(array: string[]): string {
    if (array === null || array.length === 0) { return ""; }

    let result: string = "";
    for (let i: number = 0; i < array.length - 1; i++) {
        result += array[i];
        result += "#,#";
    }
    result += array[array.length - 1];
    return result;
}


/**
 * Takes a string as used for storing an array of strings in the database, and transforms it back to an array of strings
 * @param input_string      String to be destringified, with elements separated by #,#
 * @returns                 Array of string encoded in the input string
 */
export function destringifyStringifiedArrayOfStrings(input_string: string): string[] {
    if (input_string.length === 0) { return []; }

    return input_string.split("#,#");
}


/**
 * Takes an array of numbers, and transforms it into a single string for use in the database
 * @param array             Array of numbers to be stringified
 * @returns                 Stringified array, consisting of the input elements separated by #,#
 */
export function stringifyArrayOfNumbers(array: number[]): string {
    if (array.length === 0) { return ""; }

    let result: string = "";
    for (let i: number = 0; i < array.length - 1; i++) {
        result += array[i].toString();
        result += "#,#";
    }
    result += array[array.length - 1].toString();
    return result;
}


/**
 * Takes a string as used for storing an array of numbers in the database, and transforms it back to an array of numbers
 * @param input_string          String to be destringified, with numerical elements separated by #,#
 * @returns                     Array of numbers encoded in the input string
 */
export function destringifyStringifiedArrayOfNumbers(input_string: string): number[] {
    if (input_string.length === 0) { return []; }

    const split_string: string[] = input_string.split("#,#");
    const result: number[] = new Array<number>(split_string.length);

    for (let i: number = 0; i < split_string.length; i++) {
        result[i] = +split_string[i];
    }

    return result;
}
