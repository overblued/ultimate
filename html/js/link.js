/* * * * * * * * * *
 *link - lian lian kan
 *
 *with table
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
( function (theProject) {
/*	init data ********************************************************************************************************/
	//public
	theProject.loadOrder = theProject.loadOrder || 1;
	console.log((theProject.loadOrder)++);
	
	var grid,
		view,
		controller;
	grid = {
		init: function(columns, rows){
			this.rows = rows || this.rows;
			this.columns = columns || this.columns;
			this.cells = this.cells || [];
			if (this.cells.length !== 0)
				this.cells.length = 0;
			this.cells.length = rows * columns;
			return this;
		},
		// accept index, coordinate, array,and object contains x key and y key;
		toIndex: function(x, y){
			var index;
			if (typeof y === "number"){
				index = y * this.columns + x;
			} else if (x instanceof Array){
				index = x[1] * this.columns + x[0];
			} else if (typeof x === "object"){
				index = x.y * this.columns + x.x;
			} else {
				index = x;
			}
			return index;
		},
		toCoord: function(n){
			return new $.Point(n % this.columns, n / this.columns | 0);
		},
		get: function(x,y){
			return this.cells[this.toIndex(x,y)];
		},
		set: function(data, x, y){
			this.cells[this.toIndex(x,y)] = data;
			//todo
		},
		unset: function(x,y){
			this.set(null, x, y);
		},
		compare: function(p1,p2){
			return this.get(p1) === this.get(p2);
		},
		randomize: function(){
			var numOfBricks = (3 * (this.cells.length >> 2)) >> 1,
				i = numOfBricks;
			while (i--){
				this.cells[i] = this.cells[i + numOfBricks] = $.random(19) + 1;
			}
			$.shuffle(this.cells);
		}
	};

	view = {
		init: function(model){
			this.model = model;
			this.data = [];
			$.events(this);

			var tbl = this.table = $(document.createElement("table"));
			tbl.set({id: "link"});

			var i, j,
				r = this.model.rows,
				c = this.model.columns;
			for (i = 0; i < r; i++){
				var tr = document.createElement("tr");
				for (j = 0; j < c; j++){
					var td = document.createElement("td");
					this.data.push(td);
					tr.appendChild(td);
				}
				tbl.invoke("appendChild", tr);
			}
			tbl.appendTo("main");
		},
		update: function(){
			
		},
		refresh: function(){
			var len = this.model.cells.length;
			for( i = 0; i < len; i++){
				var dat = this.model.cells[i];
				if (dat > 0){
					this.data[i].innerHTML = "<div class='bricks clr" + dat + "'></div>";
				}
			}
		},
		showPath: function(path,c){
			if (path){
				var x,y, dirX, dirY,i,j, roads=[];
				i = path.length - 1;
				while(i){
					x = path[i].x;
					y = path[i].y;
					dirX = quickMatch(path[i].x, path[i-1].x);
					dirY = quickMatch(path[i].y, path[i-1].y);
					j = path[i].x - path[i-1].x + path[i].y - path[i-1].y;
					while(j){
						roads.push(this.data[this.model.toIndex(x,y)]);
						x += dirX;
						y += dirY;
						j += dirX + dirY;
					}
					i--;
				}
				roads.push(this.data[this.model.toIndex(path[0])]);
			}
			$.forEach(roads,function(node){
				node.innerHTML="<div class='fading clr" + c + "'></div>";
				$(node).schedule(function(t){
					if (t===11){
						node.innerHTML = "";
						return;
					}
					node.firstChild.className = "fading clr" + c + " level"+ t;
				},[1,11],30);
			});
		}
	};

	controller = {
		init: function(view, model){
			this.view = view;
			this.model = model;
			this.previous = null;
			//prepare
			this.view.init(this.model.init(24,12));

			this.model.randomize();
			this.view.refresh();
			//attach controll event
			this.view.table.set({onclick: this.onClick.bind(this)});
			//this.notify("update", r, c, data);
		},
		//init: function(){}
		onClick: function(e){
			var current = e.target,
				previous = this.previous,
				path,
				p1,
				p2;
			if (current.tagName === "DIV"){
				if (previous && previous !== current){
					p1 = $.Point(previous.parentElement.cellIndex, previous.parentElement.parentElement.sectionRowIndex);
					p2 = $.Point(current.parentElement.cellIndex, current.parentElement.parentElement.sectionRowIndex);
					if (this.model.compare(p1,p2)){
						path = this.link(p1,p2);
					}
					if (path){
						this.view.showPath(path,this.model.get(p1));
						this.model.unset(p1);
						this.model.unset(p2);
						current = null;
						this.previous = null;
					//to do
					} else {
						previous.className = previous.className.slice(0, previous.className.search(/ selected/));
					}
				}
				if (current){
					current.className += " selected";
					this.previous = current;
				}
			}
		},
		onHover: function(e){
		},
		link: function(p1, p2){
			var border = [this.model.columns, this.model.rows],
				map = this.model,
				path;
			if (checkLinkage()){
				path.push(p1);
				return path;
			}
			return false;

			function checkLinkage(){
				path = [p2];
				if ((p1.x === p2.x) || (p1.y === p2.y)){
					if (checkCaseZero(p1.x, p1.y, p2.x, p2.y, 1)){
						return true;
					}
				} else if (checkCaseOne(p1.x, p1.y, p2.x, p2.y)){
					return true;
				}
				return checkCaseTwo(p1.x, p1.y, p2.x, p2.y);
			}

			function checkCaseZero(p1x, p1y, p2x, p2y, n){
				var dirX,dirY,steps;
				dirX = quickMatch(p1x,p2x);
				dirY = quickMatch(p1y,p2y);
				steps = p1x - p2x + p1y - p2y + n * (dirX + dirY);
				while (steps) {
					p1x += dirX;
					p1y += dirY;
					if (map.get(p1x,p1y)){
						return false;
					}
					steps += dirX + dirY;
				};
				return true;
			}
			
			function checkCaseOne(p1x, p1y, p2x, p2y){
				if (checkCaseZero(p1x, p1y, p1x, p2y, 0) && checkCaseZero(p2x, p2y, p1x, p2y, 0)){
					path.push($.Point(p1x, p2y));
					return true;
				}
				if (checkCaseZero(p1x, p1y, p2x, p1y, 0) && checkCaseZero(p2x, p2y, p2x, p1y, 0)){
					path.push($.Point(p2x, p1y));
					return true;
				}
				return false;
			}
			function checkCaseTwo(p1x, p1y, p2x, p2y){
				var directions = [[1, 0], [-1, 0], [0, 1], [0, -1]],
					steps = [p1x - border[0] + 1, p1x, p1y - border[1] + 1, p1y],
					orders = [	[1, 3, 0, 2],	//case 0
								[2, 3],		//case 1
								[1, 2, 0, 3],	//case 2
								[1, 0],		//case 3
								[],//case none
								[0, 1],		//case 5
								[0, 3, 1, 2],	//case 6
								[3, 2],		//case 7
								[0, 2, 1, 3] ],	//case 8
					tryoutOrder = orders[3 * quickMatch(p1x, p2x) + quickMatch(p1y, p2y) + 4],
					i = 0, x, y, step, dir;
				while (i < tryoutOrder.length) {
					x = p1x;
					y = p1y;
					step = steps[tryoutOrder[i]];
					dir = directions[tryoutOrder[i]];
					while(step){
						x += dir[0];
						y += dir[1];
						if (map.get(x, y)){
							break;
						}else if (checkCaseOne(x, y, p2x, p2y)){
							path.push($.Point(x, y));
							return true;
						}
						step += dir[0] + dir[1];
					}
					i++;
				}
				return false;
			}
		}
	};
	function quickMatch(n, k){
		if (k === n)
			return 0;
		return k > n ? 1 : -1;
	}
	controller.init(view, grid);
}(window.ultimate = window.ultimate || {}) );