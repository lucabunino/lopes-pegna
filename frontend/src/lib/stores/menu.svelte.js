let open = $state(false)
let small = $state(false)
let dark = $state(false)
let difference = $state(false)

export function getMenu() {
	function setOpen(o) {
		open = o
	}
	function setSmall(s) {
		small = s
	}
	function setDark(d) {
		dark = d
	}
	function setDifference(d) {
		difference = d
	}
	return {
		get open() { return open; },
		setOpen(o) { open = o },

		get small() { return small; },
		setSmall(s) { small = s },

		get dark() { return dark; },
		setDark(d) { dark = d },

		get difference() { return difference; },
		setDifference(d) { difference = d },
	};
}