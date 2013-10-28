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
		view;
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
		}
	};

	view = {
		init: function(model){
			this.model = model;

			var tbl = $(document.createElement("table"));
			tbl.set({id: "link"});

			var i, j,
				r = this.model.rows,
				c = this.model.columns;
			for (i = 0; i < r; i++){
				var tr = document.createElement("tr");
				for (j = 0; j < c; j++){
					tr.appendChild(document.createElement("td"));
				}
				tbl.invoke("appendChild", tr);
			}
			tbl.appendTo("stage");
		},
		update: function(){
			
		}
		
	};

	view.init(grid.init(24,15));

}(window.ultimate = window.ultimate || {}) );