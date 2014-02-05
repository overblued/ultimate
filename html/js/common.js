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
	(function (){
		var red = "red",
			black = "black",
			clr = black,
			title = document.getElementsByTagName("h1")[0],
			kitt = function(t){
					this.styles({backgroundImage: "linear-gradient(90deg, transparent,"
					 + clr + " " + (t*3+1)+ "%, transparent)"});
			};
		$('header').set({
			onmouseover: function(){ clr = red;},
			onmouseout: function (){ clr = black;}
		});
		$("bar").schedule(kitt, [-5,38,-4], 40, "permanent")
				.styles({backgroundColor: "transparent"});
	})();

	//
	$.events(theProject);
	//a way to manage more apps
	var apps = theProject.apps = {};
	
	var stage = theProject.stage = $('main');
	/* * *
	 * use this to introduce new app
	 * * * * * * * * * * * * * * * * * * */
	theProject.new = (function (){
		//an internal track for the number of apps
		var id = 0;
		return function (app){
			id += 1;
			$.events(app);
			apps[app.name || ("unnamed" + id)] = app;
			console.log("%s has been loaded.", app.name);
			//triguer an event
			this.notify('new', app.name);
		};
	})();
	/* * *
	 * launch app by name or the app itself
	 * use theProject.current to track current running app
	 * * * * * * * * * * * * * * * * * * */
	theProject.launch = function (app){
		var that = this;
		if ( "string" === typeof app){ app = that.apps[app]; }
		//make sure a start method is there
		if (!app.start){
			console.log("App %s has no method 'Start'.", app.name);
			return false;
		}
		if (!that.current){
			initLaunch();
		} else {
			if (that.current === app){ return; }
			else {
				that.current.notify('close');
				//anime fade out
				that.stage.schedule(
					function (tick){
						this.styles({opacity: tick/10});
						if (tick === 0){
							this.removeChilds();
							initLaunch();
						}
					},
					[9,0], 10, "interupt"
				);
			}
		}
		return true;
		function initLaunch(){
			theProject.current = app;
			app.start();
			//anime fadein
			that.stage.schedule(
				function (tick){ this.styles({opacity: tick/10}); }
				,[1,10], 10, "interupt"
			);
		}
				
	};
	
	$.load("css/intro.css", "js/intro.js")
	
	//load apps
	$.load("css/link.css", "js/link.js", "js/astar.js", "js/sudoku.js");

	
}(window.ultimate = window.ultimate || {})); };
