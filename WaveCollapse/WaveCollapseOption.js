class WaveCollapseOption {
	constructor (data) {
		this.init(data);
	}
	
	init (data) {
		if(!data.id) {
			throw "Option data must include an id";
		}
		
		this.id = data.id;
		this.neighborOps = data.neighborOps || [];
		this.minGrouped = data.minGrouped || 1;
		this.maxGrouped = data.maxGrouped || Infinity;
		
	}
}