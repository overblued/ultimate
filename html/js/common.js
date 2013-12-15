/* * * * * * * * * *
 * My single page app
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
		title = document.getElementsByTagName("h1")[0],
		kitt = function(t){
				this.styles({backgroundImage: "linear-gradient(90deg, transparent," +clr + (t*3+1)+"%, transparent)"});
		};
	$("bar").schedule( kitt, [-5,38,-4], 40, "permanent")
			.styles({backgroundColor:"transparent"})
			.set({
				  onmouseover: function(){clr="red ";title.innerText = "Blow a Tire!";}
				, onmouseout: function(){setTimeout(function(){clr="black ";title.innerText = "Some Project";}, 10000);}
			});

	var session;
	$("buttons").set({onclick:function(e){
//			e.preventDefault();
			if (e.target.tagName !== "SPAN"){
				return;
			}
			if (session){
				if (session === e.target)
					return;
				else
					session.className = "";
			}
			session = e.target;
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
				case("Slideshow"):
					$("main").set({innerHTML:"<iframe src='res/slideshow/slideshow.html' width='700' height='300' style='border:none'></iframe>"});
					break;
				default:
					break;
			}
			session.className = "selected";
		}});
//asynchronously load additional js/css files;
$.load("css/link.css","js/link.js");
}(window.ultimate = window.ultimate || {})); };
