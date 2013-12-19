/* * * * * * * * * *
 * My single page app
 *
 * 
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
window.onload = function () { (function (theProject) {
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
		//ui
		buttons = $('buttons');
	/* * *
	 * use this to introduce new app
	 * * * * * * * * * * * * * * * * * * */
	theProject.new = (function (){
		var id = 0,
			buttonTemplate = buttons.get('innerHTML');
		buttons.set({innerHTML: ''});
		return function (app){
			id += 1;
			projects[app.name || ("unnamed" + id)] = app;
			//for every newly added app, add an ui button
			buttons.set({innerHTML: buttons.get('innerHTML') + buttonTemplate.replace('{{name}}', app.name)});
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
			console.log("App %s has no method 'Start'.", app.name);
		}
	};
	
	$.load("css/link.css", "js/link.js", "js/astar.js", "js/sudoku.js");

	buttons.set({
		onclick: (function(){
			var selected;
			return function (e){
				//e.preventDefault();
				if (e.target.tagName !== "SPAN"){ return; }
				var name = e.target.innerText;
				if (theProject.current && name === theProject.current.name){ return; }
				else if (selected) { selected.className = ""; }
				
				selected = e.target;
				selected.className = "selected";
				theProject.launch(name);
			};
		})()
	});
}(window.ultimate = window.ultimate || {})); };
