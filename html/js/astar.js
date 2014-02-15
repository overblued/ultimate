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
			dotColor: "#8f00ff",
			//composite attr
			get height(){
				return this.gridRows * this.gridSize + 1;
			},
			get width(){
				return this.gridColumns * this.gridSize + 1;
			}
		},
		//base object
		Base,
		//inheret from thing
		Dot,
		Wall,
		//the search alg
		Astar,
		//a 2d grid constructor
		grid,
		//draw on canvas
		painter,
		//a binary heap constructor
		BinaryHeap,
		//the app itself
		app = {
			name: "A star",
			description: "A star search with binary heap",
			start: function (){
				//main workflow
				var dot = new Dot(),
					grid = new Grid(tuning.gridColumns,tuning.gridRows, tuning.gridSize),
					astar = new Astar(grid),
					map = $(document.createElement("canvas"));
				//prepare the canvas				
				map.styles({border: "none"})
				   .set({
						 height: tuning.height
						,width: tuning.width
						,onclick: function (e){
							if (e.target.tagName === 'CANVAS'){
								var gridX = ~~(e.offsetX / tuning.gridSize),
									gridY = ~~(e.offsetY / tuning.gridSize),
									path;
								console.log(path = astar.search(grid.index(dot.p), grid.index({x: gridX, y: gridY})));
								painter.draw(path);
								dot.blink({x: gridX, y: gridY});
								
							}
						}
					});
				//paint				
				painter.init(map.invoke("getContext",'2d'), grid);
				//make some wall in grid
				$.forEach(grid.cells, function (v,k,a){
					if (Math.random() < 0.2){
						a[k] = new Wall(grid.point(k));
					}
				});
				//replace the first cell with the dot
				if (grid.cells[0] !== null){
					grid.cells[0].remove();
				}
				grid.cells[0] = dot.add(grid.point(0));
				
				//rewrite the start function
				(this.start = function(){ map.appendTo(theProject.stage); })();
			}
		};
	
	Base = function (p){
		if (p){	this.add(p)	}
		else {
			this.x = undefined;
			this.y = undefined;
			this.onstage = false;
		}
	};
	Base.prototype = {
		//properties
		get p(){
			return {x: this.x, y: this.y};
		}
		,set p(p){
			this.x = p.x;
			this.y = p.y;
		}
		//methods
		,remove: function (){
			if (this.onstage){
				painter.clearCell({x: this.x, y: this.y});
				this.onstage = false;
			}
		}
		,add: function (p){
			if (!this.onstage){
				var tmp = this.p;
				this.p = p;
				if (painter.draw(this));
					this.onstage = true;
				return this;
			}else{
				return false;
			}
		}
	};
	//inherit from thing
	Dot = function (p){
		Base.call(this,p)
	};
	Dot.prototype = Object.create(Base.prototype, {
		name: {value: 'dot', enumerable: true,}
	});
	Dot.prototype.move = function (p){
		if (this.onstage){
			return this;
		}else
			return false;
	};
	Dot.prototype.blink = function (p){
		var tmp = this.p;
		this.p = p
		if (this.onstage && painter.draw(this, tmp)){
			return this;
		}else{
			this.p = tmp;
			return false;
		}
	};
	
	Wall = function (p){
		Base.call(this,p)
	};
	Wall.prototype = Object.create(Base.prototype, {
		name: {value: 'wall', enumerable: true,}
	});
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
			this.cells[i] = null;
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
		isOccupied: function (p){
			return Boolean(this.get(p));
		},
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
		drawDot: function(p,r){
			var ctx = this.ctx,
				s = this.size,
				rad = r || Math.abs(s/2 - 1.5);
			ctx.beginPath();
			ctx.arc(p.x * s + s/2, p.y * s + s/2, rad, 0, Math.PI*2, false);
			ctx.fillStyle = tuning.dotColor;
			ctx.fill();
			ctx.closePath();
		},
		//new draw
		draw: function (obj, from){
			var that = this;
			if (obj instanceof Array){
				obj.forEach(function (v){
					that.drawDot(that.data.point(v), 2);
				});
				return true;
			}
			if (!this.paintable(obj.p)){
				return false
			}
			if (from){
				this.clearCell(from);
			}
			if (obj.name === 'dot'){
				this.drawDot(obj.p);
			}else if (obj.name === 'wall'){
				this.drawCell(obj.p);
			}
			return true;
		},
		clearCell: function(p){
			var s = this.size;
			this.ctx.clearRect(p.x * s + 0.5, p.y * s + 0.5, s - 1, s - 1);
		},
		paintable: function (p){
			return !this.data.isOccupied(p)
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


	Astar = function (map){
		this.map = map;
	};
	
	Astar.prototype = {
		search: function (start, goal){
			//initiation
			this.prep(start, goal);
			
			var that = this,
				diagnal = 14,
				adjacent = 10,
				gTmp,
				neighbors,
				current;
			console.log(start,goal);
			while((current = that.fscore.pop()) !== false){
				//pop out the first one in fscore heap, add it to closedset;
				that.addToClosedSet(current);
				//found!
				if (current === goal){
					return that.retrievePath(current);
				}
				
				neighbors = that.getNeighbors(current);
				
				neighbors.forEach(function (v, k){
					//if it's a wall or out of range or in closeset
					if (v === null || that.map.cells[v] || that.closedset[v]){
						return ;
					} else {
						gTmp = that.closedset[current].g + (k > 3 ? diagnal : adjacent);
						//if it's in openset
						if (that.openset[v]){
							if (that.openset[v].g > gTmp){
								//make current parent node of this neignbor
								that.openset[v].from = current;
								that.openset[v].g = gTmp;
							}
						}else{
							that.addToOpenSet(v, current, gTmp);
						}
					}
				});
				
				
			}
		},
		prep: function (start, goal){
			this.start = start;
			this.goal = goal;
			this.closedset = {};
			
			var os = this.openset = {};
			this.openset[start] = {f: 0,g: 0,from: null};
			
			this.fscore = new BinaryHeap(function (a,b){
				return os[a].f < os[b].f;
			});
			this.fscore.push(start);
		},
		//the manhattan distance
		heuristic: function (i, j){
			return 10 * (Math.abs(~~((i-j)/this.map.columns)) + Math.abs(i % this.map.columns - j % this.map.columns));
		},
		getNeighbors: function (i){
			var c = this.map.columns,
				nbs = [
					i - c,		//0
					i + c,		//1
					i - 1,		//2
					i + 1,		//3
					i - c - 1,	//4
					i - c + 1,	//5
					i + c - 1,	//6
					i + c + 1	//7
				];
			if ( nbs[0] < 0 || this.map.cells[nbs[0]]){
				nbs[0] = nbs[4] = nbs[5] = null;
			}
			if ( nbs[1] > this.map.length || this.map.cells[nbs[1]]){
				nbs[1] = nbs[6] = nbs[7] = null;
			}
			if ( i % c === 0 || this.map.cells[nbs[2]]){
				nbs[2] = nbs[4] = nbs[6] = null;
			}
			if ( nbs[3] % c === 0 || this.map.cells[nbs[3]]){
				nbs[3] = nbs[5] = nbs[7] = null;
			}
			return nbs;
		},
		addToOpenSet: function (i, from, g){
			this.openset[i] = {
				f: this.heuristic(i, this.goal),
				g: g,
				from: from
			};
			this.fscore.push(i);
		},
		addToClosedSet: function (index){
			this.closedset[index] = this.openset[index];
			delete this.openset[index];
		},
		retrievePath: function (i){
			var path = [];
			while((i = this.closedset[i].from) !== null){
				path.push(i);
			}
			return path;
		}
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
			var item = this.stack[0],
				len = this.stack.length;
			if (len === 0){
				return false;
			}
			if (len < 3){
				if (len === 2)
					this.stack[0] = this.stack[1];
				this.stack.length -= 1;
			}else {
				this.stack[0] = this.stack[len - 1];
				this.stack.length = len - 1;
				this.siftdown();
			}
			return item;
		},
		get length(){
			return this.stack.length;
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
		},
		kill: function (){
			this.stack.length = 0;
		}
	};
//private functions	
//--------------------------------------------------------------------------------------------------------------------
	function isEmpty(o){
		for (var v in o)
			return true;
		return false
	}
	//always new this app to main project
	theProject.new(app);

}(window.ultimate = window.ultimate || {}) );
