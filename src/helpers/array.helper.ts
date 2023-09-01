/**
 * Takes an array of strings, and transforms it into a single string for use in the database
 * None of the strings should contain the preserved character combination #,#
 * @param array         Array of strings to be stringified
 * @throws Error        If one of the items contains `#,#`
 * @returns             Stringified array, consisting of the input elements separated by #,#
 */
export function stringifyArrayOfStrings(array: string[]): string {
    if (array.length === 0) { return ""; }

    let result: string = "";
    for (let i: number = 0; i < array.length; i++) {
        if (typeof array[i] === "string" && array[i].includes("#,#")) {
            throw new Error("array.helper.stringifyArrayOfStrings: item " + i + " contains #,# (is " + array[i]
                + ") and can therefore not be stringified");
        }

        result += array[i];

        if (i !== array.length - 1) {
            result += "#,#";
        }
    }

    return result;
}

/**
 * Takes a string as used for storing an array of strings in the database, and transforms it back to an array of strings
 * @param input_string      String to be destringified, with elements separated by #,#
 * @returns                 Array of string encoded in the input string
 */
export function destringifyStringifiedArrayOfStrings(input_string: string): string[] {
    if (input_string === null || input_string === undefined) {
        throw new Error("array.helper.destringifyStringifiedArrayofString: input_string was null");
    }

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
    for (let i: number = 0; i < array.length; i++) {
        result += array[i].toString();

        if (i !== array.length - 1) {
            result += "#,#";
        }
    }

    return result;
}


/**
 * Takes a string as used for storing an array of numbers in the database, and transforms it back to an array of numbers
 * @param input_string          String to be destringified, with numerical elements separated by #,#
 * @returns                     Array of numbers encoded in the input string
 */
export function destringifyStringifiedArrayOfNumbers(input_string: string): number[] {
    if (input_string === null) {
        throw new Error("array.helper.destringifyStringifiedArrayofNumbers: input_string was null");
    }

    if (input_string.length === 0) { return []; }

    return input_string.split("#,#").map((i: string) => +i);
}
