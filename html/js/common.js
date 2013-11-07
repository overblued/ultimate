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
	//hidden message-.-
	var clr = "black ",
		kitt = function(t){
			this.styles({backgroundImage: "linear-gradient(90deg, transparent," +clr + (t*3+1)+"%, transparent)"});
		};
	$("bar").schedule( kitt, [-5,38,-4], 40, "permanent")
			.styles({backgroundColor:"transparent"})
			.set({onmouseover: function(){clr="red ";document.getElementsByTagName("h1")[0].innerText = "Blow a Tire!";}, onmouseout: function(){setTimeout(function(){clr="black ";document.getElementsByTagName("h1")[0].innerText = "Some Project";}, 10000);}});

//asynchronously load additional js/css files;
	$("buttons").set({onclick:function(e){
			switch(e.target.innerText){
				case("Link"):
					if (!theProject.link){
						$.load("css/link.css","js/link.js");
					}else{
						theProject.link.start();
					}
					break;
				case("A star"):
					if (!theProject.astar){
						$.load("js/astar.js");
					}else{
						theProject.astar.start();
					}
					break;
				case("Sudoku"):
					break;
				default:
					break;
			}
		}});

}(window.ultimate = window.ultimate || {})); };