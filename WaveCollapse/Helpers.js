let Helpers = {
	getRancomIntInRange(max, min) {
		if (!min) {
			min = 0;
		}
		let range = max - min;
		return Math.round(Math.random() * range) + min;
	},
	
	onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	},

	arraysEqual(a, b) {
		if (a.length !== b.length) {
			return false;
		}
		
		let sortedA = a.sort();
		let sortedB = b.sort();
		
		for (var i = 0; i < sortedA.length; ++i) {
			if (sortedA[i] !== sortedB[i]) { 
				return false;
			}
		}
		return true;
	}
};