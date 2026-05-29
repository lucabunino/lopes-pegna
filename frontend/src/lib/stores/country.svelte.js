let current = $state('IT')

export function getCountry() {
	return {
		get current() { return current },
		set(c) { current = c },
	}
}
