"use strict";

class PolarCell extends Cell {
	constructor(row, column) {
		super(row, column);
		this.outward = [];
		
		this.cw = null;
		this.ccw = null;
		this.inward = null;
		this.partofpath = false;
	}

	neighbors() {
		let list = []
		if (this.cw){
			list.push({cell: this.cw, weight: "high"});
		}
		if (this.ccw){
			list.push({cell: this.ccw, weight: "high"});
		}
		if (this.inward){
			list.push({cell: this.inward, weight: "low"});
		}
		for(let o of this.outward){
			list.push({cell: o, weight: "medium"});
		}
		return list
	}

	get_id() {
		return this.row + '#' + this.column
	}
}