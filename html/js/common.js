/* * * * * * * * * *
 * My webpage-game-homecenter all-in-one project
 *
 * 
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
window.onload = function () { (function ($) {
/*	init data ********************************************************************************************************/
	//public
	$.loadOrder = $.loadOrder || 1;
	console.log(($.loadOrder)++);
	console.log(navigator.userAgent);
	
	$.canvas = document.getElementById("canvas");
	$.context = $.canvas.getContext('2d');

	$.get = function(id){
		return document.getElementById(id);
	};
	
	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
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
	
/*  event handlers ********************************************************************************************************/
	(window.onresize = function () {
		$.canvas.width = window.innerWidth;
		$.canvas.height = window.innerHeight;
	})();

	
/*	init	********************************************************************************************************/
	//private
	var i,
		mattr = "-webkit-linear-gradient(left";

	for (i = 0; i <= 36; i++) {
		mattr += ",hsla(" + i*10 + ", 20%, 50%, 1)";
	}
	//$.get("tu").style.backgroundImage = mattr + ")";
	$.get("tu2").style.backgroundImage = mattr + ")";
	$.get("tt").style.backgroundImage = mattr + ")";

//	$.get("drag").draggable =true;
	$.drag($.get("drag"));


	//a star
	$.astar();


}(window.ultimate = window.ultimate || {})); };