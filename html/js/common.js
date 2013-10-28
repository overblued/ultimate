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
	
//asynchronously load additional js/css files;
$.load("css/link.css","js/link.js");

/*	init	********************************************************************************************************/
	//hidden message-.-
	var clr = "black ",
		kitt = function(t){
			this.styles({backgroundImage: "linear-gradient(90deg, transparent," +clr + (t*3+1)+"%, transparent)"});
		};
	$("bar").schedule( kitt, [-5,38,-4], 40, "permanent").set({onmouseover: function(){clr="red ";document.getElementsByTagName("h1")[0].innerText = "Blow a Tire!"}, onmouseout: function(){clr="black ";document.getElementsByTagName("h1")[0].innerText = "Ultimate Project";}});


}(window.ultimate = window.ultimate || {})); };