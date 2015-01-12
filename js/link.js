/* * * * * * * * * *
 *link - lian lian kan
 *
 *with table
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
( function (theProject) {
/*	init data ********************************************************************************************************/
	//public
	var pairs = 1,	//percentage
		numberOfColors = 19,
		columns = 24,
		rows = 12,
		options = ["Restart","Hint","Rearrange","AutoPlay"],
		grid,
		view,
		controller,
		//to hookup with the project
		app = {
			name: "Link",
			description: "Simple link game using table grid"
		},
		stage = theProject.stage,
		init = false;
		
	grid = {
		init: function(columns, rows){
			this.rows = rows || this.rows;
			this.columns = columns || this.columns;
			this.cells = this.cells || [];
			if (this.cells.length !== 0)
				this.cells.length = 0;
			this.horde = {};
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
			return new $$.Point(n % this.columns, n / this.columns | 0);
		},
		get: function(x,y){
			return this.cells[this.toIndex(x,y)];
		},
		isValid: function(x,y){
			return this.cells[this.toIndex(x,y)] > 0;
		},
		set: function(data, x, y){
			var i = this.toIndex(x,y);
			if (this.horde[this.get(i)]){
				this.horde[this.get(i)] = $$.filter(this.horde[this.get(i)], function(index){return index !== i;});
			}
			if (data && data !== "undefined"){
				if (!this.horde[data])
					this.horde[data] = [];
				this.horde[data].push(i);
			}
			this.cells[i] = data;
			//todo
		},
		unset: function(x,y){
			this.set("undefined", x, y);
		},
		compare: function(p1,p2){
			return this.get(p1) === this.get(p2);
		},
		
		makeHorde: function(){
			var horde = {};
			$$.forEach(this.cells, function(data, i){
				if (!horde[data]){
					horde[data] = [];
				}
				horde[data].push(i);
			});
			this.horde = horde;
		},
		shuffle: function(){
			var len = this.cells.length,
				temp,
				rnd;
			while(--len){
				rnd = $$.random(len);
				temp = this.cells[len];
				this.set(this.cells[rnd], len);
				this.set(temp, rnd);
//				this.cells[len] = this.cells[rnd];
//				this.cells[rnd] = temp;
			}
		}
	};

	view = {
		init: function(model){
			this.model = model;
			this.data = this.data || [];
			$$.events(this);
			
	//prepare the grid;
			if (!this.table){
				var tbl = this.table = $$(document.createElement("table"));
				tbl.set({id: "link"});

				var i, j,
					r = this.model.rows,
					c = this.model.columns;
				for (i = 0; i < r; i++){
					var tr = document.createElement("tr");
					for (j = 0; j < c; j++){
						var td = document.createElement("td");
						this.data.push($$(td));
						tr.appendChild(td);
					}
					tbl.invoke("appendChild", tr);
				}
			}
			if (!this.options){
				this.options = $$(document.createElement("ol"));
				var ops = this.options.set({className: "option"});
				$$.forEach(options,function(label,i){
					$$(document.createElement("li")).appendTo(ops)
													 .set({innerHTML:label, className: "clr"+(i+1)});
				});
			}
			this.show();

		},
		show: function(){
			init = true;
//			if(this.main){
				//this.main.removeChildren();
//				this.main.set({innerHTML: "<noscript>" + noscriptMsg + "</noscript>"});
				this.options.appendTo(stage);
				this.table.appendTo(stage);
//			}
		},
		addBrick: function(index, clr){
			this.data[index].set({innerHTML: "<div class='bricks clr" + clr + "'></div>"});
		},
		removeBrick: function(index){
			this.data[index].removeChildren();
		},
		refresh: function(){
			var that = this;
			$$.forEach(that.model.cells,function(dat,i){
				if (that.model.isValid(i)){
					that.addBrick(i, dat);
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
			(function anim(i){
				if (roads[i]){
					if (!(roads[i].schedule(
						function(t){
								//start fading
								if (t === 2){
									this.set({innerHTML: "<div class='fading clr" + c + "'></div>"});
								}
								//finish fading, remove itself
								if (t === 22){
									this.removeChildren();
									return;
								}
								//make fading the next one, with a delay of 1 iteration
								if (t === 3 && i < roads.length - 1){
									anim(++i);
								}
								//change the fading level
								if(this.element.firstChild)
									this.element.firstChild.className = "fading clr" + c + " level" + (t>>1);
							}
						, [2, 22], 15))) {
						//if the schedule function return false(occupied), step to the next one
						anim(++i);
					}
				}
			})(0);
		}
	};

	controller = {
		init: function(view, model){
			this.view = view;
			this.model = model;
			this.previous = null;
			//prepare
			this.view.init(this.model.init(columns,rows));
			this.reset();
			//attach controll event
			this.view.table.set({onclick: this.onClick.bind(this)});
			this.view.options.set({onclick: this.onClickOptions.bind(this)});
		},
		reset: function(){
			//reset data
			this.model.init();
			this.numOfBricks = (this.model.cells.length * pairs) >> 1;
			
			var	i = this.numOfBricks,
				clr;
		
			while (i--){
				clr = $$.random(numberOfColors) + 1;
				this.model.set(clr,i);
				this.model.set(clr,i+this.numOfBricks);
			}
			//shuffle the bricks
			this.model.shuffle();
			
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
							this.found(path);
							current = null;
						//to do
						} 
						this.clearSelect();
					}
					if (current){
						this.previous = current;
						current.className += " selected";
					}
				}
			}
		},
		onClickOptions: function(e){
			if (e.target.tagName !== "LI"){
				return;
			}
			
			this.clearSelect();
			switch(e.target.innerHTML){
				case(options[0]):
					this.reset();
					break;
				case(options[1]):
					if (this.auto){
						break;
					}
					this.findHint();
					break;
				case(options[2]):
					this.rearrange();
					break;
				case(options[3]):
					if (this.auto){
						clearTimeout(this.auto);
						this.auto = 0;
					}else
						this.autoPlay();
					break;
				default:
					break;
			}
			
		},
		clearSelect: function(){
			var previous = this.previous;
			if (previous){
				//previous.className = previous.className.slice(0, previous.className.search(/ selected/));
				previous.className = previous.className.replace(" selected", "");
				this.previous = null;
			}
		},
		findHint: function(){
			var i,j,k,path,
				horde = this.model.horde,
				that = this;
			for (k in horde){
				var g = horde[k];
				for(i=0;i<g.length-1;i++){
					for(j=i+1;j<g.length;j++){
						path = that.link(that.model.toCoord(g[i]),that.model.toCoord(g[j]));
						if (path){
							this.found(path);
							//this.giveHint(path);
							return true;
						}
					}
				}
			}
			return false;
		},
		giveHint: function(){
			
		},
		rearrange:function(){
			var i, j=0, temp;
			temp = $$.shuffle($$.filter(this.model.cells, function(dat){return dat>0;}));
			for(i=0;i<temp.length;i++){
				while(!this.model.isValid(j)){
					j++;
				}
				this.model.set(temp[i],j);
				j++;
			}
			this.view.refresh();
		},
		autoPlay: function(){
			if (!this.findHint()){
				if (this.numOfBricks){
					setTimeout(this.rearrange.bind(this),500);
				}else{
					setTimeout(this.reset.bind(this),500);
				}//return true;
				this.auto = setTimeout(this.autoPlay.bind(this),1000);
			}else{
				this.auto = setTimeout(this.autoPlay.bind(this),100);
			}
		},
		getCoord: function(elem){
			return $$.Point(elem.parentElement.cellIndex, elem.parentElement.parentElement.sectionRowIndex);
		},
		found: function(path){
			var l = path.length-1,c = this.model.get(path[0]);
			this.model.unset(path[0].x,path[0].y);
			this.model.unset(path[l].x,path[l].y);
			this.numOfBricks -= 1;
			this.view.showPath(path,c);

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
					path.push($$.Point(p1x, p2y));
					return true;
				}
				if (checkCaseZero(p1x, p1y, p2x, p1y, 0) && checkCaseZero(p2x, p2y, p2x, p1y, 0)){
					path.push($$.Point(p2x, p1y));
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
							path.push($$.Point(x, y));
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

	//every project should have a start method
	app.start = function(){
		if (init){
			view.show();
		}else{
			controller.init(view, grid);
		}
	};
	theProject.new(app);
	

}(window.ultimate = window.ultimate || {}) );
