class WaveCollapse {
	constructor (numRows, numCols) {
		this.numRows = numRows;
		this.numCols = numCols;
		this.grid = [];
		this.cellOptions = [];
		this.cellOptionIds = [];
	}
	
	//expect data to be an object with properties {id, neighborOps,}
	setOptionData(data) {
		for (let d of data) {
			this.cellOptions.push(new WaveCollapseOption(d));
		}
		this.cellOptionIds = data.map(x => x.id);
		
		this.initGrid();
	}
	
	initGrid() {
		for(let row = 0; row < this.numRows; row++){
			for(let col = 0; col < this.numCols; col++){
				this.grid[row * this.numCols + col] = this.cellOptionIds;
			}
		}
	}
	
	collapseGrid() {
		//randomly pick a cell to start with
		let curRow = Helpers.getRancomIntInRange(this.numRows - 1);
		let curCol = Helpers.getRancomIntInRange(this.numCols - 1);
		let curOp = this.cellOptionIds[Helpers.getRancomIntInRange(this.cellOptionIds.length - 1)];
		
		while (curRow != null && curCol != null) {
			//assign chosen option to current cell
			this.grid[curRow * this.numCols + curCol] = [curOp];
			
			//reduce current cell with current option
			this.reduceNeighbors(curRow, curCol, [curOp], []);
			
			//find next cell with smallest option list
			let smallestOptionsLength = this.cellOptionIds.length + 1;
			let smallestCell;
			curRow = null;
			curCol = null;
			for(let i = 0; i < this.grid.length; i++) {
				let cell = this.grid[i];
				if (cell.length > 1 && cell.length < smallestOptionsLength) {
					smallestOptionsLength = cell.length;
					smallestCell = cell;
					curRow = Math.floor(i / this.numCols);
					curCol = i % this.numCols;
				}
			}
			
			//select next current option from list of current cell options
			if (smallestCell) {				
				curOp = smallestCell[Helpers.getRancomIntInRange(smallestCell.length - 1)];
			}
		}
		
		return this.grid;
	}
	
	countSameNeighbors (row, col, cellId) {
		let visited = [];
		visited.push({row: row, col: col});
		
		let count = 1;
		let counting = {row: row, col: col};
		
		let toCount = [];
		if(row !== 0) {
			toCount.push({row: row - 1, col: col}); //top
		}
		if(row < this.numRows -1) {
			toCount.push({row: row + 1, col: col}); //bottom
		}
		if(col !== 0) {
			toCount.push({row: row, col: col - 1}); //left
		}
		if(col !== this.numCols - 1) {
			toCount.push({row: row, col: col + 1}); //right
		}
		
		while (toCount.length > 0) {
			let counting = toCount.pop();
			visited.push(counting);
			
			let gridValues = this.grid[counting.row * this.numRows + counting.col];
			if(gridValues.length === 1 && gridValues[0] === cellId) {
				count++;
			
				if(row !== 0 && visited.indexOf({row: row - 1, col: col}) >= 0) {
					toCount.push({row: row - 1, col: col}); //top
				}
				if(row < this.numRows -1 && visited.indexOf({row: row + 1, col: col}) >= 0) {
					toCount.push({row: row + 1, col: col}); //bottom
				}
				if(col !== 0 && visited.indexOf({row: row, col: col - 1}) >= 0) {
					toCount.push({row: row, col: col - 1}); //left
				}
				if(col !== this.numCols - 1 && visited.indexOf({row: row, col: col + 1}) >= 0) {
					toCount.push({row: row, col: col + 1}); //right
				}
			}
		}
		
		return count;
	}
	
	reduceNeighbors(row, col, values, visitedIndices) {
		let neighborOptions = [];
		for(let i = 0; i < values.length; i++) {
			let value = values[i];
			let cellOption = cellOptions.find(x => x.id === value);
			let concatOptions = neighborOptions.concat(cellOption.neighborOps);
			neighborOptions = concatOptions.filter(Helpers.onlyUnique);
		}
		
		let checkNeighborGroup = values.length === 1;
		let sameNeighborCount;
		let thisCellOption;
		if(checkNeighborGroup) {
			sameNeighborCount = this.countSameNeighbors(row, col, values[0]);
			thisCellOption = cellOptions.find(x => x.id === values[0]);
		}
			 
		//reduce top neighbor
		let topIndex = (row - 1) * this.numCols + col;
		if (row !== 0 && this.grid[topIndex].length > 1 && visitedIndices.indexOf(topIndex) === -1) {
			let newValues = this.grid[topIndex].filter(x => neighborOptions.includes(x));
			let uniqueNewValues = newValues.filter(Helpers.onlyUnique);
				
			//check total number grouped is greater than required numCols
			if(checkNeighborGroup && sameNeighborCount < thisCellOption.minGrouped && uniqueNewValues.includes(values[0])) {
				uniqueNewValues = [values[0]];
				sameNeighborCount++;
			}
			
			if(!Helpers.arraysEqual(uniqueNewValues, this.grid[topIndex])) {
				this.grid[topIndex] = uniqueNewValues;
				visitedIndices.push(topIndex);
				this.reduceNeighbors(row - 1, col, uniqueNewValues, visitedIndices);
			}
		}
		
		//reduce bottom neighbor
		let bottomIndex = (row + 1) * this.numCols + col;
		if(row !== this.numRows - 1 && this.grid[bottomIndex].length > 1 && visitedIndices.indexOf(bottomIndex) === -1) {
			let newValues = this.grid[bottomIndex].filter(x => neighborOptions.includes(x));
			let uniqueNewValues = newValues.filter(Helpers.onlyUnique);
			
			//check total number grouped is greater than required numCols
			if(checkNeighborGroup && sameNeighborCount < thisCellOption.minGrouped && uniqueNewValues.includes(values[0])) {
				uniqueNewValues = [values[0]];
				sameNeighborCount++;
			}
			
			if(!Helpers.arraysEqual(uniqueNewValues, this.grid[bottomIndex])) {
				this.grid[bottomIndex] = uniqueNewValues;
				visitedIndices.push(bottomIndex);
				this.reduceNeighbors(row + 1, col, uniqueNewValues, visitedIndices);
			}
		}
		
		//reduce left neighbor
		let leftIndex = row * this.numCols + (col - 1);
		if (col !== 0 && this.grid[leftIndex].length > 1 && visitedIndices.indexOf(leftIndex) === -1) {
			let newValues = this.grid[leftIndex].filter(x => neighborOptions.includes(x));
			let uniqueNewValues = newValues.filter(Helpers.onlyUnique);
			
			//check total number grouped is greater than required numCols
			if(checkNeighborGroup && sameNeighborCount < thisCellOption.minGrouped && uniqueNewValues.includes(values[0])) {
				uniqueNewValues = [values[0]];
				sameNeighborCount++;
			}
			
			if(!Helpers.arraysEqual(uniqueNewValues, this.grid[leftIndex])) {
				this.grid[leftIndex] = uniqueNewValues;
				visitedIndices.push(leftIndex);
				this.reduceNeighbors(row, col - 1, uniqueNewValues, visitedIndices);
			}
		}
		
		//reduce right neighbor
		let rightIndex = row * this.numCols + (col + 1);
		if(col !== this.numCols - 1 && this.grid[rightIndex].length > 1 && visitedIndices.indexOf(rightIndex) === -1) {
			let newValues = this.grid[rightIndex].filter(x => neighborOptions.includes(x));
			let uniqueNewValues = newValues.filter(Helpers.onlyUnique);
			
			//check total number grouped is greater than required numCols
			if(checkNeighborGroup && sameNeighborCount < thisCellOption.minGrouped && uniqueNewValues.includes(values[0])) {
				uniqueNewValues = [values[0]];
				sameNeighborCount++;
			}
			
			if(!Helpers.arraysEqual(uniqueNewValues, this.grid[rightIndex])) {
				this.grid[rightIndex] = uniqueNewValues;
				visitedIndices.push(rightIndex);
				this.reduceNeighbors(row, col + 1, uniqueNewValues, visitedIndices);
			}
		}
	}
}