

/**
 * Check whether map values are empty
 */
export function emptyValues(map) {
	return map.filter(x => x !== undefined).isEmpty()
}