/*
    This file contains all of the functions that I found that I was repeating across
    multiple pages / components. I extracted them all out, consolidated them into a
    single function in this file, and then replaced all calls to the component-specific
    versions to use these ones instead.
*/

/**
 * This function is used to display a snackbar, provided the state setters and the desired values.
 * @param {Function} dataSetter The state variable setter for the snackbarData state variable.
 * @param {Function} flagSetter The state variable setter for the showSnackbar state variable.
 * @param {{
 *  severity: string,
 *  message: string
 * }} data  An object containing the severity (color) and message to be displayed in the snackbar.
 */
export const displaySnackbar = function (dataSetter, flagSetter, data) {
    dataSetter(data);
    flagSetter(true);
}