/**
 * Collection of date time helper functions inspired by moment.js
 */

/**
 * Returns true if now is before given time
 *
 * @param date
 * @returns boolean
 */
function isBefore(date) {
    return date.getTime() > new Date().getTime();
}

/**
 * Returns true if now is after given time
 *
 * @param date
 * @returns boolean
 */
function isAfter(date) {
    return date.getTime() < new Date().getTime();
}

/**
 * Returns true if now is before or same as given time
 *
 * @param date
 * @returns boolean
 */
function isSameOrBefore(date) {
    return date.getTime() >= new Date().getTime();
}

/**
 * Returns true if now is after or same as given time
 *
 * @param date
 * @returns boolean
 */
function isSameOrAfter(date) {
    return date.getTime() <= new Date().getTime();
}

export { isBefore, isAfter, isSameOrBefore, isSameOrAfter };
