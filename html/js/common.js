/* * * * * * * * * *
 * My webpage-game-homecenter all-in-one project
 *
 * 
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
window.onload = function () { (function (theProject) {
	//public
	theProject.loadOrder = theProject.loadOrder || 1;
	console.log((theProject.loadOrder)++);
	console.log(navigator.userAgent);
	

/*	init	********************************************************************************************************/
//rainbow title
	var i,
		mattr = "linear-gradient(to right";

	for (i = 0; i <= 20; i++) {
		var opa = i/5 - i*i/100;
		mattr += ",rgba(0,0,0," + opa + ")";
	}
	//	mattr += ",hsla(" + i*18 + ", 0%, 50%," + opa + ")";
	//$.get("tu").style.backgroundImage = mattr + ")";
	//$.get("tt").style.backgroundImage = mattr + ")";
	//$.setStyles(["tt","tu2"], {backgroundImage: mattr + ")"});
	//$("bar").styles({backgroundImage: mattr + ")"});
	var kitt=function(t){
			this.styles({backgroundImage: "linear-gradient(90deg, transparent, red "+(t*2+1)+"%, transparent)"});
	};
	$("bar").schedule( kitt, [0,49,1], 40, "permanent");

//a star
	$.astar();


}(window.ultimate = window.ultimate || {})); };