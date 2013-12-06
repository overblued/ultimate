/* * * * * * *
* functional tools  
* 
* 
* @ultimate
* * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function (window) {
	
	//cache some useful method
	var $,
		Vector,
		View,
		Controller,
		Model,
		forEach,
		events,
		extend,
		slice = Array.prototype.slice,
		has = Object.prototype.hasOwnProperty,
		fetch = document.getElementById.bind(document);
	/* * * * * * *
	* a jquery object mockup
	* main acess point,i use the sign $,same as the jquery,because i have no intention to use it rather to make my own.
	* @param {String} name of element id
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	function _$(id){
		if (id instanceof _$)
			return id;
		if (typeof id === "string")
			this.element = fetch(id);
		else if (id.tagName)
			this.element = id;
	}
	_$.prototype = {
		/* * * * * * *
		* styles: can set multiple css style at once
		* @param {Object} the key and value in pairs
		* * * * * * * * * * * * * * * * * * * * * * * * * * * */
		styles: function(pairs) {
			forEach(pairs, function(attr, key){ this.element.style[key] = attr; }, this);
			return this;
		},
		/* * * * * * *
		* invoke: call one of the element's method
		* @param {Function}
		* @param {arguments}
		* * * * * * * * * * * * * * * * * * * * * * * * * * * */
		invoke: function(method, attr){
			return this.element[method](attr);
		},
		/* * * * * * *
		* set: set the element's property
		* @param {String} name of property
		* @param {attr} depends on the nature of property
		* * * * * * * * * * * * * * * * * * * * * * * * * * * */
		set: function(pairs){
			forEach(pairs, function(attr, key){ if (typeof attr === "function") attr = attr.bind(this); this.element[key] = attr; }, this);
			return this;
		},
		/* * * * * * *
		* get:
		*
		* @param {Object} the key and value in pairs
		* * * * * * * * * * * * * * * * * * * * * * * * * * * */
		get: function(property){
			return this.element[property];
		},
		/* * * * * * *
		* append the element to a parent node
		*
		* @param {Dom Object}
		* * * * * * * * * * * * * * * * * * * * * * * * * * * */
		appendTo: function(parent){
			$(parent).element.appendChild(this.element);
			return this;
		},
		removeChilds: function(){
			while(this.element.firstChild)
				this.element.removeChild(this.element.firstChild);
			return this;
		},
		/* * * * * * *
		* schedule: trying to move the setSchedule method to here, make it dom dependent
		* 
		* @param {Function} callBack function
		* @param {Number} how many times
		* @param {Number} time in between each call, 1000ms for default
		* * * * * * * * * * * * * * * * * * * * * * * * * * * */
		schedule: function (callBack, sequence, interval, option) {
			var that = this,
				i = 1,
				t = sequence[0],
				len = sequence.length,
				f = interval || 1000;
			if (that.scheduleId){
				if (option === "interupt" || !callBack){
					clearTimeout(that.scheduleId);
					that.scheduleId = 0;
				}else{
					return false;
				}
			}
			if (typeof callBack !== "function")
				return;
			(function handler() {
				if (i < len) {
					callBack.call(that, t);
					if(t < sequence[i]){
						t += 1;
					} else if (t > sequence[i]) {
						t -= 1;
					} else {
						i += 1;
					}
				
					if(i === len && option === "permanent"){
						i = 1;
						t = sequence[0];
					}
					
					that.scheduleId = setTimeout(handler, f);
				}else{
					that.scheduleId = 0;
				}
			}());
			return this;
		}
	};
	/**
	* main acess point,i use the sign $,same as the jquery,because i have no intention to use it rather to make my own.
	* @param {String} name of element id
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	$ = function (id){ return new _$(id); };

//dom object operation
	/* * * * * * *
	* set multiple elements with same multiple css style
	* @param {Array} a list of the element id
	* @param {String} css style property
	* @param {String} attribute
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	$.setStyles = function (ids){
		var cssStyles = arguments[1];
		forEach(ids, function(id){ $(id).styles(cssStyles); });
	};
	$.setAttrs = function (ids){
		var attrs = arguments[1];
		forEach(ids, function(id){ $(id).set(attrs); });
	};

//functional tool
	/* * * * * * *
	* for Each instance do action as in context
	* @param {Object} instance
	* @param {Function} action
	* @param {Object} set "this" inside callback
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	forEach = $.forEach = function (obj, action, context) {
		var i,
			property,
			len = obj.length;
		if (obj instanceof Array) {
			for (i = 0; i < len; i++) {
				action.call(context, obj[i], i, obj);
			}
		} else {
			for (property in obj) {
				if (has.call(obj, property)) {
					action.call(context, obj[property], property, obj);
				}
			}
		}
	};
	extend = $.extend = function (obj) {
		var i,
			property,
			args = slice.call(arguments, 1),
			len = args.length;
		for (i = 0; i < len; i++) {
			for (property in args[i]) {
				if (has.call(args[i], property))
					obj[property] = args[i][property];
			}
		}
	};
	
	/* * * * * * *
	* event manager
	* $.events() to add this components
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

	/* * * * * * *
	* load an external js/css file
	* @param {String} takes abitiry numbers of strings
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	$.load = function(){
//		var files = slice.call(arguments);
		var files = arguments;
		forEach(files, function(src){
			if (/\.js$/.test(src)){
				file=document.createElement('script');
				file.setAttribute("src", src);
			}
			if (/\.css$/.test(src)){
				file=document.createElement('link');
				file.setAttribute("rel", "stylesheet");
				file.setAttribute("href", src);
			}
			if(file){
				document.getElementsByTagName("head")[0].appendChild(file);
			}
		});
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
	* Point
	*
	*
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * */
	$.Point = function(x, y){
		if (!(this instanceof $.Point)) {
			return new $.Point(x, y);
		}
		this.x = x || 0;
		this.y = y || 0;
	};
	$.Point.prototype.toString = function(){
		return this.x + "," + this.y;
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
		dotProduct: function(v){
			if (v instanceof Vector){
				return this.x * v.x + this.y * v.y;
			}
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

	$.random = function(n){
		var seed = Math.random();
		return n ? seed * n >> 0 : seed;
	};
	$.shuffle = function(array){
		var len = array.length - 1,
			temp,
			rnd;
		if(len<1)
			return array;
		while(len){
			rnd = $.random(len);
			temp = array[len];
			array[len] = array[rnd];
			array[rnd] = temp;
			len -= 1;
		}
		return array;
	};
	$.filter = function (array, fn) {
		var i, result = [], len = array.length;
		for (i = 0; i < len; i++) {
			if (fn(array[i]))
				result.push(array[i]);
		}
		return result;
	};
	window.requestAnimFrame = (function () {
		return	window.requestAnimationFrame		 ||
				window.webkitRequestAnimationFrame   ||
				window.mozRequestAnimationFrame      ||
				window.oRequestAnimationFrame        ||
				window.msRequestAnimationFrame       ||
				function (callback) {
					window.setTimeout(function () {
						callback(+new Date());
					}, 1000 / 60);
				};
	}());
	//attach thie $ sign to global window
	window.$ = $;

}(this));