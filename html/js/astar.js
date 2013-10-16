/* * * * * * * * * *
 * Template
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
( function ($) {
/*	init data ********************************************************************************************************/
	//public
	$.loadOrder = $.loadOrder || 1;
	console.log(($.loadOrder)++);
	$.astar = function(){
		var painter = {
			init: function(ctx, data){
				$.events(this);
				this.ctx = ctx;
				this.ctx.translate(0.5, 0.5);
				this.ctx.linecap = "square";
				this.data = data;
				this.drawoutline(ctx, data);
				this.attach("makewall", this.drawCell);
			},
			drawoutline: function(ctx, data){
				var	i,j,
					s = data.size,
					r = data.rows,
					c = data.columns;
				ctx.strokeStyle = "#000";
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
			drawCell: function(p){
				var ctx = this.ctx,
					r = p.r,
					c = p.c,
					s = this.data.size;
				ctx.beginPath();
				ctx.rect(c * s , r * s, s, s);
				ctx.fillStyle = "#000";
				ctx.fill();
				ctx.closePath();
			},
			drawDot: function(p){
				var ctx = this.ctx,
					s = this.data.size,
					rad = Math.abs(s/2 - 1.5);
				ctx.beginPath();
				ctx.arc(p.c * s + s/2, p.r * s + s/2, rad, 0, Math.PI*2, false);
				ctx.fillStyle = "#0F0";
				ctx.fill();
				ctx.closePath();
			},
			clearCell: function(p){
				var s = this.data.size;
				this.ctx.clearRect(p.r * s + 0.5, p.c * s + 0.5, s - 1, s - 1);
			}
			
		};
		var grid = {
			init: function(canvas, columns, rows, size){
				this.canvas = canvas;
				this.size = size || this.size;
				this.rows = rows || this.rows;
				this.columns = columns || this.columns;
				this.cells = this.cells || [];
				if (this.cells.length !== 0)
					this.cells.length = 0;
				this.cells.length = rows * columns;
				return this;
			},
			toIndex: function(r, c){
				return r * this.columns +c;
			},
			toCoord: function(n){
				return {r: n / this.columns << 0,
						c: n % this.columns};
			},
			get: function(r, c){
				return this.cells[this.toIndex(r, c)];
			},
			set: function(r, c, data){
				return this.cells[this.toIndex(r, c)] = data;
			},
			crumble: function(){
				var i,
					len = this.cells.length;
				for(i = 0; i < len; i++){
					if (Math.random() < 0.2){
						this.cells[i] = -1;
						this.canvas.notify("makewall",this.toCoord(i));
					}
				}
			}

		};

		var map = document.createElement("canvas");
		map.id = "map";
		map.height = "250";
		map.width = "500";
		map.style.border = "none";
		map.style.margin = "1em";
	//	map.style.position = "absolute";
	//	map.style.top = "10px";
//		map.style.left = "10px";
		$.get("stage").appendChild(map);
		painter.init(map.getContext('2d'), grid.init(painter,20,10,19));
		grid.crumble();
		function getX(ele){
			return ele.getBoundingClientRect().left;
		}
		function getY(ele){
			return ele.getBoundingClientRect().top;
		}

		map.addEventListener("click", function(e){
			console.log(e);
		});
	};
}(window.ultimate = window.ultimate || {}) );