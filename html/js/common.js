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
		mattr = "-webkit-linear-gradient(left";

	for (i = 0; i <= 36; i++) {
		mattr += ",hsl(" + i*10 + ", 50%, 80%)";
	}
	//$.get("tu").style.backgroundImage = mattr + ")";
	//$.get("tt").style.backgroundImage = mattr + ")";
	$.setStyles(["tt","tu2"], {backgroundImage: mattr + ")"});

//gradually hightlight mouseover button: setSchedule test drive
	var brightness = 27,
		hslValue = "hsl(0, 0%," + brightness + "%)",
		steps = 5,
		lightScale = 8,
		dimScale = -4,
		interval = 60;
		//3, no hard encoded numbers
	var subs = [$("subtitle"),$("subtitle2"),$("subtitle3")],
		//1.combine lightup and dimdown , the light changes depends on the given argument
		changeLight = function(t){ this.styles({backgroundColor: "hsl(0,0%," + (brightness + t * steps) + "%)"}) ; },
		//2.here i make the schedule accept another parameter to make the times it pass to callback can count down
		onSwitch = function(lightness){ return function(){ this.schedule( changeLight, lightness, interval);};};
		
	$.setStyles(subs, {color: "blue", backgroundColor: hslValue});
	$.setAttrs(subs, {onmouseout: onSwitch(dimScale), onmouseover: onSwitch(lightScale)});
	
//a star
	$.astar();


}(window.ultimate = window.ultimate || {})); };