/**
 * Takes an dictionary with strings as both keys and values, and transforms it into a single string for use in the
 * database. None of the strings should contain the preserved character combination #,#
 * @param dictionary        Dictionary to be stringified.
 * @returns                 Stringified dictionary, consisting of the dictionary elements separated by #,#
 */
export function stringifyDictionaryOfStrings(dictionary: { [key: string]: string }): string {
    if (Object.keys(dictionary).length === 0) { return ""; }

    let result = "";
    for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            result += key;
            result += "#,#";
            result += dictionary[key];
            result += "#,#";
        }
    }

    // Remove final separator
    result = result.slice(0, -3);

    return result;
}

/**
 * Takes a string as used for storing a dictionary of strings in the database, and transforms it back to an dictionary
 * of strings.
 * @param input_string      Stringified dictionary of strings to be destringified, using #,# as separator
 * @returns                 Dictionary with string-typed elements
 */
export function destringifyStringifiedDictionaryOfStrings(input_string: string): { [key: string]: string } {
    if (input_string.length === 0) { return {}; }

    // Create temporary array to parse the string
    const array = input_string.split("#,#");

    const result: { [key: string]: string } = {};

    // Construct dictionary from array
    for (let i = 0; i < array.length; i += 2) {
        const key = array[i];
        result[key] = array[i + 1];
    }

    return result;
}

/**
 * Takes an dictionary with strings as keys and numbers as values, and transforms it into a single string for use in the
 * database.
 * @param dictionary        Dictionary with numbers as elements to be stringified
 * @returns                 String encoding the dictionary of numbers, using #,# as separator
 */
export function stringifyDictionaryOfNumbers(dictionary: { [key: string]: number }): string {
    if (Object.keys(dictionary).length === 0) { return ""; }

    let result = "";
    for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            result += key;
            result += "#,#";
            result += dictionary[key].toString();
            result += "#,#";
        }
    }

    // Remove final separator
    result = result.slice(0, -3);

    return result;
}

/**
 * Takes a string as used for storing a dictionary of numbers in the database, and transforms it back to an dictionary
 * of numbers.
 * @param input_string          String encoding dictionary of numbers using #,# as separator
 * @returns                     Dictionary with numbers as elements
 */
export function destringifyStringifiedDictionaryOfNumbers(input_string: string): { [key: string]: number } {
    if (input_string.length === 0) { return {}; }

    // Create temporary array to parse the string
    const array = input_string.split("#,#");

    const result: { [key: string]: number } = {};

    // Construct dictionary from array
    for (let i = 0; i < array.length; i += 2) {
        result[array[i]] = parseInt(array[i + 1], 10);
    }

    return result;
}

/**
 * Takes an dictionary with strings as keys and booleans as values, and transforms it into a single string for use in
 * the database.
 * @param dictionary            Dictionary with boolean-typed elements
 * @returns                     String encoding dictionary of booleans, using #,# as separator
 */
export function stringifyDictionaryOfBooleans(dictionary: { [key: string]: boolean }): string {
    if (Object.keys(dictionary).length === 0) { return ""; }

    let result = "";
    for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            result += key;
            result += "#,#";
            result += dictionary[key].toString();
            result += "#,#";
        }
    }

    // Remove final separator
    result = result.slice(0, -3);

    return result;
}

/**
 * Takes a string as used for storing a dictionary of booleans in the database, and transforms it back to an dictionary
 * of numbers.
 * @param input_string          String encoding dictionary of booleans, using #,# as separator
 * @returns                     Dictionary of boolean-typed elements
 */
export function destringifyStringifiedDictionaryOfBooleans(input_string: string): { [key: string]: boolean }{
    if (input_string.length === 0) { return {}; }

    // Create temporary array to parse the string
    const array = input_string.split("#,#");

    const result: { [key: string]: boolean } = {};

    // Construct dictionary from array
    for (let i = 0; i < array.length; i += 2) {
        result[array[i]] = (array[i + 1] === 'true');
    }

    return result;
}
