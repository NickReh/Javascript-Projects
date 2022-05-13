class Cell{
    constructor(row, column){
        this.row = row;
        this.column = column;
        this.walls = {
            right: true,
            bottom: true
        };
        this.explored = false;
    }
}