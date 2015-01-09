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
		var red =	"red",
			black = "black",
			clr =	black;
			
		$('header').set({
			onmouseover:	function (){ clr = red;},
			onmouseout:		function (){ clr = black;}
		});
		$("bar").schedule(kitt, [-5,38,-4], 40, "permanent")
				.styles({backgroundColor: "transparent"});
				
		function kitt(t){
			this.styles({backgroundImage: "linear-gradient(90deg, transparent,"
			 	+ clr + " " + (t*3+1)+ "%, transparent)"});
		};
	})();

	//
	(function (){
		//a way to manage more apps
		var apps =		theProject.apps = {},
			stage =		theProject.stage = $('#main'),
			//share by all app
			id = 0,
			commonProperty = {
					name:			'App no.' + id,
					description:	'No description',
					hidden:			false,
					autostart:		false
			},
			//private methods
			//
			//lauch the app
			initLaunch = function (app){
				app.start();
				//anime fadein
				stage.schedule(
					function (tick){ this.styles({opacity: tick/10}); }
					,[1,10], 10, "interupt"
				);
			};
		
		$.events(theProject);
		/* * *
		 * use this to introduce new app
		 * * * * * * * * * * * * * * * * * * */
		theProject.new = function (app){
			id += 1;
			//common attr
			$.events(app);
			$.extend(app, commonProperty);
			//
			apps[app.name] = app;
			console.log("%s has been loaded.", app.name);
			//tell everyone that a new app is added
			this.notify('new', app);
			if (app.autostart)
				this.launch(app);
		};
		/* * *
		 * launch app by name or the app itself
		 * use theProject.current to track current running app
		 * * * * * * * * * * * * * * * * * * */
		theProject.launch = function (app){
			if ( "string" === typeof app){ app = apps[app]; }
			//make sure a start method is there
			if (!app.start){
				console.log("App %s has no method 'Start'.", app.name);
				return false;
			}
			if (!this.current){
				this.current = app;
				initLaunch(app);
			}
			if (this.current === app){ return; }
			
			//triger close event on prev app
			this.current.notify('close');
			this.current = app;
			//anime fade out
			stage.schedule(
				function (tick){
					this.styles({opacity: tick/10});
					if (tick === 0){
						this.removeChildren();
						initLaunch(app);
					}
				}, [9,0], 10, "interupt"
			);
			return true;
		};
		theProject.show = function(elem){
			if (elem.appendTo){
				elem.appendTo(this.stage)
			}
		}
	}());
	
	
	//load apps
	$.load("css/intro.css", "js/intro.js")
	
	$.load("css/link.css", "js/link.js", "js/astar.js", "js/sudoku.js");
	$.load("css/slideshow.css", "js/slideshow.js")
	$.load("css/colors.css", "js/colors.js")
}(window.ultimate = window.ultimate || {})); };
