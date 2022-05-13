using System;
using System.Collections.Generic;

namespace astar{
    public class Graph(){
        private GraphNode[,] nodes = new GraphNode[grid.length, grid[0].length];
        public Nodes{
            get{ return nodes;}
        }
        public input {get; set;}

        public Graph(List<int> grid){
            for(int x = 0; x < grid.length; x++){
                for(int y = 0, row = grid[x]; y < row.length; y++){
                    nodes[x, y] = new GraphNode(x, y, row[y]);
                }
            }
            input = grid;
        }
    }

    public class GraphNode(){
	    public int x {get; set;}
	    public int y {get; set;}
        public Vector3 pos {get; set;}
	    public float type {get; set;}
        public float f {get; set;}
        public float g {get; set;}
        public float h {get; set;}
        public bool visited {get; set;}
        public bool closed {get; set;}
        public GraphNode parent {get; set;}
	
	    public GraphNode(int x, int y, int type){
		    this.x = x;
            this.y = y;
            pos = new Vector3(x, 0, y);
            this.type = type;
            f = 0;
            g = 0;
            h = 0;
            visited = false;
            closed = false;
            parent = null;
	    }
    }

    public class BinaryHeap(){
	    private List<GraphNode> content = new List<GraphNode>()
	
	    public BinaryHeap(){
	
	    }
	
	    public void Push(GraphNode node){
	        content.Add(node);
            SinkDown(content.length - 1);
	    }
	
	    public GraphNode Pop(){
		    GraphNode result = content[0];
            GraphNode end = content.RemoveAt(content.length - 1);
            if(content.length > 0){
                content[0] = end;
                BubbleUp(0);
            }
            return result;
	    }

        public void Remove(GraphNode node){
            int i = content.indexOf(node);
            GraphNode end = content.Pop();
            if(i !== content.length - 1){
                content[i] = end;
                if(end.f < node.f){
                    SinkDown(i);
                }else{
                    BubbleUp(i);
                }
            }
        }

        public void RescoreElement(GraphNode node){
            SinkDown(content.indexOf(node));
        }

        public void SinkDown(int n){
            GraphNode node = content[n];
            while(n > 0){
                int parentN = ((n+1) >> 1) - 1;
                GraphNode parent = content[parentN];
                if(node.f < parent.f){
                    content[parentN] = node;
                    content[n] = parent;
                    n = parentN;
                }else{
                    break;
                }
            }
        }

        public void BubbleUp(int n){
            int length = content.length;
            GraphNode element = content[n];
            int elemScore = elementf;

            while(true){
                int child2N = (n+1) << 1;
                int child1N = child2N - 1;
                int? swap = null;
                if(child1N < length){
                    GraphNode child1 = content[child1N];
                    int child1Score = child1.f;
                    
                    if(child1Score < elemScore){
                        swap = child1N;
                    }

                    if(child2N < length){
                        GraphNode = content[child2N];
                        int child2Score = child2.f;
                        if(child2Score < (swap == null ? elemScore : child1Score)){
                            swap = child2N;
                        }
                    }

                    if(swap != null){
                        content[n] = content[swap];
                        content[swap] = element;
                        n = swap;
                    }else{
                        break;
                    }
                }
            }
        }
    }

    public class AStar(){
        private void init(Graph grid){
            for(int x = 0; x < grid.length; x++){
                for(int y = 0; y < grid[x].length; y++){
                    GraphNode node = grid[x][y];
                    node.f = 0;
                    node.g = 0;
                    node.h = 0;
                    node.visited = false;
                    node.closed = false;
                    node.parent = null;
                }
            }
        }
        public static List<GraphNode> Search(Graph grid, GraphNode start, GraphNode end){
            init(grid);
            List<GraphNode> openList = new List<GraphNode>();
            openList.Add(start);
            BinaryHeap openHeap = new BinaryHeap();
            openHeap.Push(start);

            while(openHeap.size() > 0){
                GraphNode currentNode = openHeap.Pop();
                if(currentNode = end){
                    GraphNode curr = currentNode;
                    List<GraphNode> ret = new List<GraphNode>();
                    while(curr.parent){
                        ret.Add(curr);
                        curr = curr.parent;
                    }
                    return ret.Reverse();
                }
                currentNode.closed = true;

                List<GraphNode> neighbors = Neighbors(grid, currentNode);
                for(int i = 0; i < neighbors.length; i++){
                    GraphNode neighbor = neighbors[i];
                    if(neighbor.closed){
                        continue;
                    }
                    float gScore = currentNode.g + neighbor.type + Math.sqrt(Math.pow(currentNode.pos.x - neighbor.pos.x, 2) + Math.pos(currentNode.pos.y - neighbor.pos.y, 2));
                    bool gScoreIsBest = false;
                    bool beenVisisted = neighbor.visited;

                    if(!beenVisited || gScore < neighbor.g){
                        neighbor.visited = true;
                        neighbor.parent = currentNode;
                        neighbor.h = neighbor.h ? neighbor.h : Heuristic(neighbor.pos, end.pos);
                        neighbor.g = gScore;
                        neighbor.f = neighbor.g + neighbor.h;

                        if(!beenVisited){
                            openHeap.Push(neighbor);
                        }else{
                            openHeap.RescoreElement(neighbor);
                        }
                    }
                }
            }
            return new List<GraphNode>();
        }

        private float Heuristic(Vector3 pos0, Vector3 pos1){
            float dx = Math.abs(pos0.x - pos1.x);
            float dy = Math.abs(pos0.y - pos1.y);
            float D = 1; //straight movement
            float D2 = 1.4f; //diagonal movement
            return D* (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
        }

        private List<GraphNode> Neighbors(Graph grid, GraphNode node){
            List<GraphNode> ret = new List<GraphNode>();
			int x = node.x;
			int y = node.y;
				
			if(grid[x-1] && grid[x-1][y]) {
				ret.Add(grid[x-1][y]);
			}
			if(grid[x+1] && grid[x+1][y]) {
				ret.Add(grid[x+1][y]);
			}
			if(grid[x][y-1] && grid[x][y-1]) {
				ret.Add(grid[x][y-1]);
			}
			if(grid[x][y+1] && grid[x][y+1]) {
				ret.Add(grid[x][y+1]);
			}
			if(grid[x-1] && grid[x-1][y-1]) {
				ret.Add(grid[x-1][y-1]);
			}
			if(grid[x+1] && grid[x+1][y-1]) {
				ret.Add(grid[x+1][y-1]);
			}
			if(grid[x+1] && grid[x+1][y+1]) {
				ret.Add(grid[x+1][y+1]);
			}
			if(grid[x-1] && grid[x-1][y+1]) {
				ret.Add(grid[x-1][y+1]);
			}
			return ret;
        }
    }


}
