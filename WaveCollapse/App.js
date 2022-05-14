//rules
var cellOptions = [];

//global variables
var rows = 22;
var cols = 22;
var spritePixelSize = 32;
var world = [];
var collapsedCells = [];
var ctx;

function main () {	
	let canvasEl = document.getElementById("canvas");
	ctx = canvasEl.getContext("2d");

	document.getElementById("createBtn").addEventListener("click", () => {
		cellOptions = dataSets.golf;
		
		let wc = new WaveCollapse(rows, cols);
		wc.setOptionData(cellOptions);
		world = wc.collapseGrid();
		
		drawWorld();
		
		//printGridToConsole();
	});
}

function drawWorld() {
	ctx.clearRect(0,0,700,700);
	for(let row = 0; row < rows; row++){
		for(let col = 0; col < cols; col++){
			let cellValue = world[row * cols + col][0];
			let cellImage = new Image();
			cellImage.src = cellOptions.find(x => x.id === cellValue).img;
			cellImage.onload = () => {
				ctx.drawImage(cellImage, col * spritePixelSize, row * spritePixelSize);
			};
		}
	}
}

function printGridToConsole() {
	for(let row = 0; row < rows; row++){
		let string = "";
		
		for(let col = 0; col < cols; col++){
			string += world[row * cols + col][0] + " ";
		}
		
		console.log(string);
	}
}