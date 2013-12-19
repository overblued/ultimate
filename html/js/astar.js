/* * * * * * * * * *
 *my realization of astar search with binary heap
 *
 *with canvas
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
( function (theProject) {
/*	init data ********************************************************************************************************/
	//public
	var app = {
			name: "A star",
			description: ""
		},
		tuning = {
			gridSize: 20,
			gridColumns: 30,
			gridRows: 15,
			gridColor: "#333",
			cellColor: "#555",
			dotColor: "red"
		};
	var	grid = {
		init: function(columns, rows){
			this.rows = rows || this.rows;
			this.columns = columns || this.columns;
			this.cells = this.cells || [];
			if (this.cells.length !== 0)
				this.cells.length = 0;
			this.cells.length = this.rows * this.columns;
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
		crumble: function(){
			var i,
				len = this.cells.length;
			for(i = 0; i < len; i++){
				if (Math.random() < 0.2){
					this.cells[i] = 0;
				}
			}
			for(i = 0; i < len; i++){
				if (Math.random() < 0.2){
					this.cells[i] = 1;
				}
			}
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
	var painter = {
		init: function(ctx, data){
			if (ctx){
				ctx.translate(0.5, 0.5);
				ctx.linecap = "square";
				this.ctx = ctx;
				this.size = tuning.gridSize;;
			}
			this.data = data || this.data;
			this.drawGrid();
		},
		update: function(){
			var that = this;
			$.forEach(this.data.cells, function(data,i){
				if (data === 0){
					that.drawCell(that.data.toCoord(i));
				}else if (data ===1){
					that.drawDot(that.data.toCoord(i));
				}else
					that.clearCell(that.data.toCoord(i));
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
		}

	};
		
	function reset(){
		grid.crumble();
		painter.update();
	}
	app.start = function (){
		//do the preparation
		var map = $(document.createElement("canvas"));
		map.styles({border: "none"})
		   .set({id: "map", height: tuning.gridRows * tuning.gridSize + 1+ "", width: tuning.gridColumns * tuning.gridSize + 1+""});
		painter.init(map.invoke("getContext",'2d'), grid.init(tuning.gridColumns,tuning.gridRows));

		grid.crumble();
		painter.update();

		//rewrite the start function
		(this.start = function(){
			map.appendTo($("main").set({innerHTML: ""}));
		})();
	};
	theProject.new(app);
	

}(window.ultimate = window.ultimate || {}) );
