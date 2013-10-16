/* * * * * * *
* functional tools  
* 
* 
* @ultimate
* * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function ($) {
	$.loadOrder = $.loadOrder || 1;
	console.log(($.loadOrder)++);
	//cache some useful method
	var Vector,
		View,
		Controller,
		Model,
		events,
		extend,
		forEach,
		drag,
		setSchedule,
		slice = Array.prototype.slice,
		has = Object.prototype.hasOwnProperty,
		fetch = document.getElementById;

	/* * * * * * *
	* for Each instance do action as in context
	* @param {Object} instance
	* @param {Function} action
	* @param {Object} set "this" inside callback
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	forEach = $.forEach = function (inst, action, context) {
		var i,
			property,
			len = inst.length;
		if (inst instanceof Array) {
			for (i = 0; i < len; i++) {
				action.call(context, inst[i], i, inst);
			}
		} else {
			for (property in inst) {
				if (has.call(inst, property)) {
					action.call(context, inst[property], property, inst);
				}
			}
		}
	};
	extend = $.extend = function (src) {
		var i,
			property,
			args = slice.call(arguments, 1),
			len = args.length;
		for (i = 0; i < len; i++) {
			for (property in args[i]) {
				src[property] = args[i][property];
			}
		}
	};
		/* * * * * * *
	 * functionality tool schedule an event to be called a certain times at a certain interval
	 * @method setSchedule
	 * @param {Function} callBack function
	 * @param {Number} how many times ,100 for default
	 * @param {Number} time in between each call, 1000ms for default
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	setSchedule = $.setSchedule = function (callBack, times, frequency) {
		var t = times || 100,
			f = frequency || 1000,
			id;
		(function handler() {
			if (t-- >= 0) {
				callBack(f);
				id = setTimeout(handler, f);
			} else {
				clearTimeout(id);
			}
		}());
	};
	/* * * * * * *
	* event manager
	* $.Events() to add this components
	* 
	* 
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	events = $.events = function (obj) {
		obj.listeners = obj.listeners || {};
		obj.notify = notify;
		obj.attach = attach;
		obj.detach = detach;

		function notify(evtName, args) {
			var i,
				tmp,
				callBacks = this.listeners[evtName],
				len;
			if (callBacks) {
				len = callBacks.length;
				//put the args in to an array if it is not one,becaus the Object.prototype.apply method only accpet an array. 
				if (!(args instanceof Array) && args) {
					(tmp = []).push(args);
				}
				for (i = 0; i < len; i++) {
					callBacks[i].apply(this, tmp || args);
				}
			}
			return this;
		}
		function attach(evtName, callBack) {
			if (callBack instanceof Function) {
				(this.listeners[evtName] = this.listeners[evtName] || []).push(callBack);
			}
			return this;
		}
		function detach(evtName, callBack) {
			var obj,
				i,
				callBacks = this.listeners[evtName],
				len;
			//remove all events if not specified
			if (evtName === undefined) {
				for (obj in this.listeners) {
					this.listeners[obj].length = 0;
					delete this.listeners[obj];
				}
				// if the callBacks stack is not empty
			} else if (callBacks) {
				len = callBacks.length;
				//if callBack is not undefine or more than 1 callback is attached to the event
				if (!callBack || len < 2) {
					for (i = 0; i < len; i++) {
						if (callBack === callBacks[i]) {
							//found and ereased
							callBacks[i] = callBacks[len - 1];
							callBacks.length = len - 1;
						}
					}
				} else {
					callBacks.length = 0;
				}
			}
			return this;
		}
	};
	
	$.mouseX = $.mouseY = $.dX = $.dY = 0;
	var dragthis;
	window.addEventListener("mousemove", function (evt) {
		var b = canvas.getBoundingClientRect();
		$.mouseX = evt.clientX - b.left;
		$.mouseY = evt.clientY - b.top;
		//console.log(evt);
		if (dragthis){
			var	i,
				left="",
				top="",
				lenx = dragthis.style.left.search(/p/),
				leny = dragthis.style.top.search(/p/);
			for (i=0;i<lenx;i++){
				left += dragthis.style.left[i];
			}
			for (i=0;i<leny;i++){
				top += dragthis.style.top[i];
			}
			dragthis.style.left = +left + $.mouseX - $.dX + "px";
			dragthis.style.top = +top + $.mouseY - $.dY + "px";
			$.dX = $.mouseX;
			$.dY = $.mouseY;

		}

	},	false);
	
	/* * * * * * *
	* drag
	*
	*@param {Object} dom object
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	drag = $.drag = function (obj, axis) {
		var evt;
		obj.dragble = {
			on: false,
			axis: axis
		};

		evt = {
			onmousedown: function (e) {
				e.preventDefault();
				$.dX = $.mouseX;
				$.dY = $.mouseY;
				dragthis = obj;
				//obj.dragble.on = true;
				//obj.dragble.renew();

			},
			onmouseup: function () {
				dragthis = null;
				//obj.dragble.on = false;
			},
		};
		extend(obj, evt);
		
		
	};
	/* * * * * * *
	* view
	* 
	* 
	* 
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	View = $.View = function (model) {
		events(this);
		this.model = model;
		this.data = {};
	};
	View.prototype = {
		update: function () {
			//var hsla = this.model.getS
		},
		init: function () {
			
		},
		//for the dom object
		addElement: function (id, evts) {
			var elem = this.data[id] = fetch(id);
			events(elem);
			forEach(evts, function (action, evt) {	elem.attach(evt, action); });
		}
	};
	/* * * * * * *
	* Model
	*
	*
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	Model = $.Model = function (data) {
		events(this);
		this.model = model;
		this.data = {};
	};
	Model.prototype = {
		set: function(key, value){
			this.data[key] = value;
			this.notify("change", key, value);
		},
	};
	/* * * * * * *
	* Controller
	*
	*
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	Controller = $.Controller = function (model, view) {
		this.view = view;
		this.model = model;
		events(this.view);
		events(this.model);
	};
	Controller.prototype = {

	};
	/* * * * * * *
	* Vector
	* 
	* 
	* 
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	Vector = $.Vector = function (x, y) {
		this.x = x || 1;
		this.y = y || 1;
	};
	Vector.prototype = {
		getMagnitude: function () {
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		},
		add: function (v) {
			if (v instanceof Vector) {
				this.x += v.x;
				this.y += v.y;
			}
		},
		sub: function (v) {
			if (v instanceof Vector) {
				this.x -= v.x;
				this.y -= v.y;
			}
		}
	};
	Vector.dotProduct = function (v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	};
	Vector.add = function (v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	};
	Vector.sub = function (v1, v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	};



}(window.ultimate = window.ultimate || {}));