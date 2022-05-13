class Maze{
    //assumes either rows or height and either columns or width passed in
    constructor (rows, columns, xPos, yPos, alg, width, height, aveCellSize) {
        this.xPos = xPos || 0;
        this.yPos = yPos || 0;
        this.alg = alg || "backtrack";
        this.aveCellSize = aveCellSize || 16;

        this.rows = rows;
        if(!this.rows){
            this.rows = Math.floor(height / aveCellSize);
        }

        this.columns = columns;
        if(!this.columns){
            this.columns = Math.floor(width / aveCellSize);
        }

        this.cells = [];
        this.startCell;
        this.endCell;
        this.openStart = true;
        this.openEnd = true;
        this.solvedPath = [];
    }

    setStartEndCells(start, end){
        this.startCell = start;
        this.endCell = end;
    }

    prepareCells(){
        for(let x = 0; x < this.rows; x++){
            let columns = [];
            for(let y = 0; y < this.columns; y++){
                columns.push(new Cell(x, y));
            }
            this.cells.push(columns);
        }

        if(!this.startCell){
            this.startCell = this.cells[0][0];
        }

        if(!this.endCell){
            this.endCell = this.cells[this.rows - 1][this.columns - 1];
        }
    }

    createMaze(){
        if(!this.cells.length){
            this.prepareCells();
        }

        switch(this.alg){
            case "backtrack":
                let stack = [];
                this.solvedPath = [];
                let solvedPathDone = false;
                
                this.endCell.explored = true;
                stack.push(this.endCell);
                this.solvedPath.push(this.endCell);
                
                while(!!stack.length){
                    let currentCell = stack[stack.length - 1];
                    let currentUnexploredNeighbors = this.getCellNeighbors(currentCell).filter((cell) => {
                        return !cell.explored;
                    });
                    
                    if(currentUnexploredNeighbors.length > 0){
                        let sortedNeighbors = this.shuffle(currentUnexploredNeighbors);
                        
                        let chosenNeighbor = sortedNeighbors[0];
                        chosenNeighbor.explored = true;
                        
                        this.removeWallBetweenCells(currentCell, chosenNeighbor);
                        
                        stack.push(chosenNeighbor);
                        if(!solvedPathDone){
                            this.solvedPath.push(chosenNeighbor);
                        }

                        if(chosenNeighbor === this.startCell){
                            solvedPathDone = true;
                        }
                    }else{
                        stack.pop();
                        if(!solvedPathDone){
                            this.solvedPath.pop();
                        }
                    }
                }
            break;
            case "kruskals":
                let allCells = [];
                for(let row of this.cells){
                    for(let cell of row){
                        let setNumber = cell.row * this.columns + cell.column;
                        allCells.push({cell: cell, setNumber: setNumber});
                    }
                }
                
                this.shuffle(allCells);
                
                for(let thisCell of allCells){
                    let neighbors = this.getCellNeighbors(thisCell.cell);
                    let otherSetNeighbors = [];
                    for(let allCell of allCells){
                        for(let n = 0; n < neighbors.length; n++){
                            if(neighbors[n] === allCell.cell){
                                if(allCell.setNumber !== thisCell.setNumber){
                                    otherSetNeighbors.push(allCell);
                                }
                                neighbors.splice(n, 1);
                                break;
                            }
                        }
                        if(!neighbors.length){
                            break;
                        }
                    }
                    let sortedNeighbors = this.shuffle(otherSetNeighbors);
                    let chosenNeighbor = sortedNeighbors[0];
                    
                    if(chosenNeighbor){
                        //remove wall between cells
                        this.removeWallBetweenCells(thisCell.cell, chosenNeighbor.cell);
                        
                        //join both sets
                        for(let allCell of allCells){
                            if(allCell.setNumber === chosenNeighbor.setNumber){
                                allCell.setNumber = thisCell.setNumber;
                            }
                        }
                    }
                }

                let sets = [];
                for(let thisCell of allCells){
                    let thisSet;
                    for(let set of sets){
                        if(set.setNumber === thisCell.setNumber){
                            thisSet = set;
                            break;
                        }
                    }

                    if(thisSet){
                        thisSet.cells.push(thisCell);
                    }else{
                        sets.push({setNumber: thisCell.setNumber, cells: [thisCell], attached: false});
                    }
                }

                for(let thisSet of sets){
                    for(let otherSet of sets){
                        if(otherSet === thisSet){
                            continue;
                        }
                    }
                }
                break;
        }
    }

    getSolvedPath(){
        return this.solvedPath;
    }

    getCellNeighbors(cell){
        let neighbors = [];
				
        if (cell.row - 1 >= 0){
            neighbors.push(this.cells[cell.row - 1][cell.column]);
        }
        if (cell.row + 1 < this.cells.length){
            neighbors.push(this.cells[cell.row + 1][cell.column]);
        }
        if (cell.column - 1 >= 0){
            neighbors.push(this.cells[cell.row][cell.column - 1]);
        }
        if (cell.column + 1 < this.cells[cell.row].length){
            neighbors.push(this.cells[cell.row][cell.column + 1]);
        }
        
        return neighbors;
    }

    removeWallBetweenCells = function (cellA, cellB){
        // If a is to b's right, remove b's right wall
        if (cellA.column > cellB.column){
            cellB.walls['right'] = false;
        }
        // Do the opposite for the opposite case
        else if (cellA.column < cellB.column){
            cellA.walls['right'] = false;
        }
        // Same happens up and down
        if (cellA.row > cellB.row){
            cellB.walls['bottom'] = false;
        }
        else if (cellA.row < cellB.row){
            cellA.walls['bottom'] = false;
        }
    }

    draw(ctx){
        //draw cells
        for(let row of this.cells){
            for(let cell of row){
                ctx.strokeStyle = "#000";

                //outer top wall of row 0
                if(cell.row === 0 && 
                    (cell !== this.startCell || !this.openStart || cell.column === 0) && 
                    (cell !== this.endCell || !this.openEnd || cell.column === 0)){
                    ctx.beginPath();
                    ctx.moveTo(cell.column * this.aveCellSize + this.xPos, this.yPos);
                    ctx.lineTo(cell.column * this.aveCellSize + this.aveCellSize + this.xPos, this.yPos);
                    ctx.stroke();
                }

                //outer left wall of column 0
                if(cell.column === 0 && 
                    (cell !== this.startCell || !this.openStart) && 
                    (cell !== this.endCell || !this.openEnd)){
                    ctx.beginPath();
                    ctx.moveTo(this.xPos, cell.row * this.aveCellSize + this.yPos);
                    ctx.lineTo(this.xPos, cell.row * this.aveCellSize + this.aveCellSize + this.yPos);
                    ctx.stroke();
                }

                //right wall
                if(cell.walls.right &&
                    (cell !== this.startCell || cell.column !== this.columns - 1 || !this.openStart) &&
                    (cell !== this.endCell || cell.column !== this.columns - 1 || !this.openEnd)){
                    ctx.beginPath();
                    ctx.moveTo(cell.column * this.aveCellSize + this.aveCellSize + this.xPos, cell.row * this.aveCellSize + this.yPos);
                    ctx.lineTo(cell.column * this.aveCellSize + this.aveCellSize + this.xPos, cell.row * this.aveCellSize + this.aveCellSize + this.yPos);
                    ctx.stroke();
                }

                //bottom wall
                if(cell.walls.bottom &&
                    (cell !== this.startCell || cell.row !== this.rows - 1 || !this.openStart || cell.column === this.columns - 1) &&
                    (cell !== this.endCell || cell.row !== this.rows - 1 || !this.openEnd || cell.column === this.columns - 1)){
                    ctx.beginPath();
                    ctx.moveTo(cell.column * this.aveCellSize + this.xPos, cell.row * this.aveCellSize + this.aveCellSize + this.yPos);
                    ctx.lineTo(cell.column * this.aveCellSize + this.aveCellSize + this.xPos, cell.row * this.aveCellSize + this.aveCellSize + this.yPos);
                    ctx.stroke();
                }
            }
        }

        //draw solved path
        ctx.strokeStyle = "red";
        ctx.beginPath();
        for(let cell of this.solvedPath){
            let cellCenterX = cell.column * this.aveCellSize + Math.round(this.aveCellSize / 2) + this.xPos;
            let cellCenterY = cell.row * this.aveCellSize + Math.round(this.aveCellSize / 2) + this.yPos;

            if(cell === this.solvedPath[0]){
                ctx.moveTo(cellCenterX, cellCenterY);
            }else{
                ctx.lineTo(cellCenterX, cellCenterY);
            }
        }
        ctx.stroke();
    }

    //HELPER FUNCTIONS
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      }
}