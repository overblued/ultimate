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

	var text = "LianLianKan";
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
			this.cells.length = this.rows * this.columns;
			return this;
		},
		// accept index, coordinate, array,and any object with property x and y;
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
		isValid: function(x,y){
			return this.cells[this.toIndex(x,y)] > 0;
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
		
		makeHorde: function(){
			var horde = {};
			$.forEach(this.cells, function(data, i){
				if (!horde[data]){
					horde[data] = [];
				}
				horde[data].push(i);
			});
			this.horde = horde;
		}
	};

	view = {
		init: function(model){
			this.model = model;
			this.data = this.data || [];
			this.main = $("main");
			$.events(this);

	//prepare the grid;
			if (!this.table){
				var tbl = this.table = $(document.createElement("table"));
				tbl.set({id: "link"});

				var i, j,
					r = this.model.rows,
					c = this.model.columns;
				for (i = 0; i < r; i++){
					var tr = document.createElement("tr");
					for (j = 0; j < c; j++){
						var td = document.createElement("td");
						this.data.push($(td));
						tr.appendChild(td);
					}
					tbl.invoke("appendChild", tr);
				}
			}
			this.main.set({innerHTML: "<p>" + text + "</p>"});
			this.table.appendTo(this.main);

		},
		remove: function(){
			if(this.main){
				this.table.appendTo(this.main.removeChilds());
			}
		},
		addBrick: function(index, clr){
			this.data[index].set({innerHTML: "<div class='bricks clr" + clr + "'></div>"});
		},
		removeBrick: function(index){
			this.data[index].removeChilds();
		},
		refresh: function(){
			var that = this;
			$.forEach(that.model.cells,function(dat,i){
				if (that.model.isValid(i)){
					that.addBrick(i, that.model.get(i));
				}else{
					that.removeBrick(i);
				}
			});
		},
		showPath: function(path,c){
			var x, y, dirX, dirY, i, j, roads=[];
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
			i = 0;
			j = roads.length - 1;
			(function anim(){
				roads[i].set({innerHTML: "<div class='fading clr" + c + "'></div>"})
						.schedule(function(t){
							if (t===22){
								this.removeChilds();
								return;
							}
							if (t===3 && i < j){
								anim(i++);
							}
							this.set({innerHTML: "<div class='fading clr" + c + " level" + (t>>1) +"'></div>"});
						},[2,22],15);
			})();
		}
	};

	controller = {
		init: function(view, model){
			this.view = view;
			this.model = model;
			this.previous = null;
			//prepare
			this.view.init(this.model.init(24,12));
			this.reset();
			//attach controll event
			this.view.table.set({onclick: this.onClick.bind(this)});
		},
		reset: function(){
			this.model.init();

			var numOfBricks = (3 * (this.model.cells.length >> 2)) >> 1,
				i = numOfBricks;
			while (i--){
				this.model.cells[i] = this.model.cells[i + numOfBricks] = $.random(19) + 1;
			}
			$.shuffle(this.model.cells);

			this.view.refresh();
		},
		onClick: function(e){
			var current = e.target,
				previous = this.previous,
				path,
				p1,
				p2;
			if (current.tagName === "DIV" && previous !== current){
				p2 = this.getCoord(current);
				if (this.model.isValid(p2)){
					if (previous){
						p1 = this.getCoord(previous);
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
						this.previous = current;
						current.className += " selected";
					}
				}
			}
		},
		getCoord: function(elem){
			return $.Point(elem.parentElement.cellIndex, elem.parentElement.parentElement.sectionRowIndex);
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
					if (map.isValid(p1x,p1y)){
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
				var directions = [[1, 0], [0, 1], [-1, 0], [0, -1]],
					steps = [p1x - border[0] + 1, p1y - border[1] + 1, p1x, p1y],
					orders = [	[2, 3, 0, 1],	//case 0
								[1, 3],		//case 1
								[2, 1, 0, 3],	//case 2
								[2, 0],		//case 3
								[],//case none
								[0, 2],		//case 5
								[0, 3, 2, 1],	//case 6
								[3, 1],		//case 7
								[0, 1, 2, 3] ],	//case 8
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
						if (map.isValid(x, y)){
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

	
	theProject.link = {
		start: function(){
			if (view.main){
				view.remove();
			}else{
				controller.reset();
			}
		}
	};
	controller.init(view, grid);
//	theProject.link.start();
}(window.ultimate = window.ultimate || {}) );