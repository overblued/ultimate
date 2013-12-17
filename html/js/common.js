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


//a way to manage more apps
	var projects = theProject.projects = {},
		ressource = {};
	/* * *
	 * use this to introduce new app
	 * * * * * * * * * * * * * * * * * * */
	theProject.new = (function (){
		var id = 0;
		return function (app){
			id += 1;
			projects[app.name || ("unnamed" + id)] = app;
			console.log("%s has been loaded.", app.name);
		};
	})();
	/* * *
	 * launch app by name or the app itself
	 * use theProject.current to track current running app
	 * * * * * * * * * * * * * * * * * * */
	theProject.launch = function (app){
		if ( "string" === typeof app){
			app = this.projects[app]
		}
		if (app.start){
			theProject.current = app;
			app.start();
		} else {
			console.log("App " + app.name + "has no method 'Start'.");
		}
	};


$.load("css/link.css", "js/link.js", "js/astar.js", "js/sudoku.js");

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
					theProject.launch("Link");
					break;
				case("A star"):
					theProject.launch("A star");
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
}(window.ultimate = window.ultimate || {})); };
