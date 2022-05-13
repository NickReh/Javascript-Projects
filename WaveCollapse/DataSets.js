let dataSets = {
	world: [
		{id: 1, neighborOps: [1,2], img: ".\\Assets\\Water.png"},
		{id: 2, neighborOps: [1,2, 3], img: ".\\Assets\\Sand.png"},
		{id: 3, neighborOps: [2,3, 4], img: ".\\Assets\\Grass.png"},
		{id: 4, neighborOps: [3,4, 5], img: ".\\Assets\\Tree.png"},
		{id: 5,	neighborOps: [4,5, 6], img: ".\\Assets\\Forest.png"},
		{id: 6, neighborOps: [5,6], img: ".\\Assets\\Mountain.png"}
	],
	golf: [
		{id: 1, neighborOps: [1,2,4,5,6], minGrouped: 4, img: ".\\Assets\\Fairway_Golf.png"},
		{id: 2, neighborOps: [1,2,3], minGrouped: 1, img: ".\\Assets\\GreenEdge_Golf.png"},
		{id: 3, neighborOps: [2,3], minGrouped: 2, img: ".\\Assets\\Green_Golf.png"},
		{id: 4, neighborOps: [1,4,5,6], minGrouped: 1, img: ".\\Assets\\Sand_Golf.png"},
		{id: 5, neighborOps: [1,2,4,5,6], minGrouped: 1, img: ".\\Assets\\Water_Golf.png"},
		{id: 6, neighborOps: [1,5,6,7], minGrouped: 1, img: ".\\Assets\\Rough_Golf.png"},
		{id: 7, neighborOps: [5,6,7,8], minGrouped: 1, img: ".\\Assets\\DeepRough_Golf.png"},
		{id: 8, neighborOps: [5,7,8], minGrouped: 1, img: ".\\Assets\\Trees_Golf.png"},
		//{id: 9, neighborOps: [3], img: ".\\Assets\\Hole_Golf.png"},
		//{id: 10, neighborOps: [1], img: ".\\Assets\\TeeBox_Golf.png"}
	]
};