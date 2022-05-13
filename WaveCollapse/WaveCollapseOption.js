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
		this.minAlone = this.minAlone || 1;
	}
}