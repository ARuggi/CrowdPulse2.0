/**
 * Perform an async filtering on an array.
 * usage:
 * let result = await asyncFilter(array, async (element) => {
 *     ...
 *     return true; // or false
 * });
 *
 * @param array The array.
 * @param predicate The filtering predicate.
 */
export async function asyncFilter(array, predicate) {
    const results = await Promise.all(array.map(predicate));
    return array.filter((_v, index) => results[index]);
}