class RecursiveBacktracker {
	on(grid, start_at = grid.get_random_cell()) {
		//let stack = [start_at];

		let endCell = grid.get_cell(0,0);
		let stack = [endCell];
		while (stack.length > 0 && stack[stack.length - 1] !== start_at) {
			let current = stack[stack.length - 1];
			let neighbors = current.neighbors().filter(cell => cell.cell.get_links().length == 0);

			if (neighbors.length == 0) {
				stack.pop();
			}
			else {
				//weighted picking neighbor
				//high = .6, mid = .3, low = .1
				let numHighNeighbors = neighbors.filter(cell => cell.weight === "high").length;
				let numMidNeighbors = neighbors.filter(cell => cell.weight === "middle").length;
				let numLowNeighbors = neighbors.filter(cell => cell.wieght === "low").length;
				let randomNum = Math.random();
				let numHigh = 0;
				let numMid = 0;
				let numLow = 0;
				let neighbor;
				for(let n = 0; n < neighbors.length; n++){
					if(!!neighbor){
						break;
					}
					
					if(neighbors[n].weight === "high"){
						numHigh++;
						if((.4 / numHighNeighbors) * numHigh + .4 >= randomNum){
							neighbor = neighbors[n];
						}
					}else if (neighbors[n].weight === "middle"){
						numMid++;
						if((.4 / numMidNeighbors) * numMid + .1 >= randomNum){
							neighbor = neighbors[n];
						}
					}else{
						numLow++;
						if((.2 / numLowNeighbors) * numLow >= randomNum){
							neighbor = neighbors[n];
						}
					}
				}
				
				let buNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
				current.link(!!neighbor ? neighbor.cell : buNeighbor.cell);
				stack.push(!!neighbor ? neighbor.cell : buNeighbor.cell);
			}
		}
		
		//solved path
		for(let c of stack){
			c.partofpath = true;
		}
	}
}