/* * * * * * * * * *
 *my realization of astar search with binary heap
 *
 *with canvas
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
( function (theProject) {
/*	init data ********************************************************************************************************/
	//some parameters
	var tuning = {
			gridSize: 20,
			gridColumns: 30,
			gridRows: 15,
			gridColor: "#333",
			cellColor: "#555",
			dotColor: "red",
			//composite attr
			get height(){
				return this.gridRows * this.gridSize + 1;
			},
			get width(){
				return this.gridColumns * this.gridSize + 1;
			}
		},
		//the search alg
		astar,
		//a 2d grid constructor
		grid,
		//draw on canvas
		painter,
		//a binary heap constructor
		BinaryHeap,
		//
		dot,
		//the app itself
		app = {
			name: "A star",
			description: "A star search with binary heap",
			start: function (){
				//main workflow

				//prepare the canvas
				var dot = new Dot();
					map = $(document.createElement("canvas"));
				map.styles({border: "none"})
				   .set({
						 height: tuning.height
						,width: tuning.width
						,onclick: function (e){
							
							if (e.target.tagName === 'CANVAS'){
								var gridX = ~~(e.offsetX / tuning.gridSize),
									gridY = ~~(e.offsetY / tuning.gridSize);
								dot.move({x: gridX, y: gridY});
							}
						}
					});
				
				painter.init(map.invoke("getContext",'2d'), new Grid(tuning.gridColumns,tuning.gridRows, tuning.gridSize));

				painter.data.crumble();
				painter.update();
				
				dot.add({x:0,y:0});
				//rewrite the start function
				(this.start = function(){ map.appendTo(theProject.stage); })();
			}
		};
	
	
	Dot = function (){
		this.x = undefined;
		this.y = undefined;
		this.onstage = false;
	}
	Dot.prototype = {
		 get p(){
			if (this.onstage)
				return {x: this.x, y: this.y};
			else
				return false;
		}
		,set p(p){
			this.x = p.x;
			this.y = p.y;
		}
		,move: function (p){
			if (this.onstage && painter.paintable(p)){
				painter.clearCell(this.p);
				painter.drawDot(this.p = p);
				return true;
			}else
				return false;
		}
		,remove: function (){
			if (this.onstage)
				painter.clearCell({x: this.x, y: this.y});
		}
		,add: function (p){
			if (painter.paintable(p)){
				painter.drawDot(this.p = p);
				this.onstage = true;
			}else{
				return false;
			}
		}
	};
	
	/* * *
	 * Grid
	 * a 2d grid 
	 * @param {Number} columns 
	 * @param {Number} rows
	 * @param {Object} the object the cells host
	 * * * * * * * * * * * * * * * * * * */
	Grid = function(c, r, s){
		this.columns = c;
		this.rows = r;
		this.size = s;
		this.length = c * r;
		this.cells = Array(this.length);
		
		for(var i = 0; i < this.length; i++)
			this.cells[i] = undefined;
	};
	Grid.prototype = {
		index: function(p){
			return p.y * this.columns + p.x;
		},
		point: function(i){
			return {x: i % this.columns, y: i / this.columns | 0};
		},
		//retrieve a cell member
		get: function(p){
			if (p.y >= this.rows)
				p.y = this.rows - 1;
			if (p.x >= this.columns)
				p.x = this.columns - 1;
			return this.cells[this.index(p)];
		},
		set: function(data, p){
			this.cells[this.index(x,y)] = data;
		},
		unset: function(x,y){
			this.set(null, x, y);
		},
		compare: function(p1,p2){
			return this.get(p1) === this.get(p2);
		},
		crumble: function(){
		
			$.forEach(this.cells, function (v,k,a){
				if (Math.random() < 0.2){
					a[k] = 0;
				}
			});
		}
	};
	painter = {
		init: function(ctx, data){
			ctx.translate(0.5, 0.5);
			ctx.linecap = "square";
			this.ctx = ctx;
			this.size = tuning.gridSize;;
			this.data = data;
			this.drawGrid();
		},
		update: function(){
			var that = this;
			$.forEach(this.data.cells, function(data,i){
				if (data === 0){
					that.drawCell(that.data.point(i));
				}else
					that.clearCell(that.data.point(i));
			});
		},
		drawGrid: function(){
			var	i,j,
				s = this.size,
				r = this.data.rows,
				c = this.data.columns,
				ctx = this.ctx;
			ctx.strokeStyle = tuning.gridColor;
			ctx.lineWidth = 1;
			ctx.beginPath();
			for (i = 0; i <= r; i++){
				ctx.moveTo(0, i * s );
				ctx.lineTo(c * s, i * s );
			}
			for (j = 0; j <= c; j++){
				ctx.moveTo(j * s , 0);
				ctx.lineTo(j * s , r * s);
			}
			ctx.stroke();
			ctx.closePath();
		},
		//
		drawCell: function(p){
			var ctx = this.ctx,
				s = this.size;
			ctx.beginPath();
			ctx.rect(p.x * s , p.y * s, s, s);
			ctx.fillStyle = tuning.cellColor;
			ctx.fill();
			ctx.closePath();
		},
		//draw a dot at point p;
		drawDot: function(p){
			var ctx = this.ctx,
				s = this.size,
				rad = Math.abs(s/2 - 1.5);
			ctx.beginPath();
			ctx.arc(p.x * s + s/2, p.y * s + s/2, rad, 0, Math.PI*2, false);
			ctx.fillStyle = tuning.dotColor;
			ctx.fill();
			ctx.closePath();
		},
		clearCell: function(p){
			var s = this.size;
			this.ctx.clearRect(p.x * s + 0.5, p.y * s + 0.5, s - 1, s - 1);
		},
		paintable: function (p){
			return !(this.data.get(p) === 0);
		}

	};
/* * *
 *
 * A* search algorithme
 *
 *
 * 
 
 ------------------------------------------------------------------------------------------------------------------- 
 pseudocode from wikipedia
 ------------------------------------------------------------------------------------------------------------------- 

 function A*(start,goal)
    closedset := the empty set    // The set of nodes already evaluated.
    openset := {start}    // The set of tentative nodes to be evaluated, initially containing the start node
    came_from := the empty map    // The map of navigated nodes.

    g_score[start] := 0    // Cost from start along best known path.
    // Estimated total cost from start to goal through y.
    f_score[start] := g_score[start] + heuristic_cost_estimate(start, goal)
     
    while openset is not empty
        current := the node in openset having the lowest f_score[] value
        if current = goal
            return reconstruct_path(came_from, goal)
         
        remove current from openset
        add current to closedset
        for each neighbor in neighbor_nodes(current)
            tentative_g_score := g_score[current] + dist_between(current,neighbor)
            tentative_f_score := tentative_g_score + heuristic_cost_estimate(neighbor, goal)
            if neighbor in closedset and tentative_f_score >= f_score[neighbor]
                    continue

            if neighbor not in openset or tentative_f_score < f_score[neighbor] 
                came_from[neighbor] := current
                g_score[neighbor] := tentative_g_score
                f_score[neighbor] := tentative_f_score
                if neighbor not in openset
                    add neighbor to openset
    return failure
------------------------------------------------------------------------------------------------------------------- 
  * * * * * * * * * * * * * * * * * * */


	astar = function (map){
		this.map = map;
		
	};
	
	astar.prototype = {
		prep: function (start){
			this.closedset = [];
			this.openset = [start];
			this.g_score = [0]; // this is a binary heap
		},
		search: function (start, goal){
			this.prep(start);
		},
		//the manhattan distance
		heuristic: function (p1, p2){
	        return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
		},
		getNeighbors: function (){
			
		},
	};
	/* * *
	 * BinaryHeap
	 * Function Constructor
	 *
	 * @param {function} a compare function, optional
	 * * * * * * * * * * * * * * * * * * */

	BinaryHeap = function( fn ){
		this.fn = fn || this.defaultfn;
		this.stack = [];
	}

	BinaryHeap.prototype = {
		push: function ( obj ){
			this.stack.push(obj);
			this.siftup();
		},
		pop: function (){
			if (this.stack.length){
				var item = this.stack[0],
					len = this.stack.length - 1;
				if (len){
					this.stack[0] = this.stack[len];
					this.stack.length = len;
			
					this.siftdown();
				}
				return item;
			}
			//nothing to pop
			return false;
		},
		siftup: function (){
			var index = this.stack.length - 1;
			if (index < 1) return;
			while ( index > 0 && this.fn(this.stack[index], this.stack[(index - 1 >> 1)]) ) {
				this.switchPlace(index , index = (index - 1 >> 1));
			}
		},
		// sift the first node (0) down
		siftdown: function (){
			var index = 0,
				childIndex1, childIndex2,
				child1, child2,
				candidate;
			while (true){
				childIndex1 = (index << 1) + 1,
				childIndex2 = childIndex1 + 1,
				child1 = this.stack[childIndex1],
				child2 = this.stack[childIndex2],
				candidate = 0;
				//find the target to switch in one of its children;
				if (child2 && this.fn(child2, child1) && this.fn(child2, this.stack[index])){
					candidate = childIndex2;
				} else if (child1 && this.fn(child1, this.stack[index])){
					candidate = childIndex1;
				}
				//do the switch and continue sifting
				if (candidate){
					this.switchPlace(candidate, index);
					index = candidate;
					continue;
				}
				//done
				return false;
			}
		},
		switchPlace: function (i, j) {
			var temp = this.stack[i];
			this.stack[i] = this.stack[j];
			this.stack[j] = temp;
		},
		// a default compare function
		defaultfn: function (a, b){
			return a < b;
		}
	};
//private functions	
//--------------------------------------------------------------------------------------------------------------------
	function reset(){
		grid.crumble();
		painter.update();
	}
	//always new this app to main project
	theProject.new(app);

}(window.ultimate = window.ultimate || {}) );
