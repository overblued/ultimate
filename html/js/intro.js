( function (theProject) {
/*	init data ********************************************************************************************************/

	var showcase = $(document.createElement('ul')).set({ className: 'showcase', }),
		template = '<h4>{{name}}</h4><p>{{des}}</p>',
		
		nav = document.getElementsByClassName('nav')[0],
		menu = nav.children[0],
		currentLabel = nav.children[1],
	
		app = {
			name: "Intro",
			description: "a showcase for all apps",
			start: function (){
				//clear main
				(this.start = function(){
					showcase.appendTo(theProject.stage);
				})();
			}
		};
		
	menu.onclick = function (){ switchApp(app.name) };
	
	function newApp(name){
		var newOne,
			itemElem;
		if (app.name === name){ return; }
		if (newOne = theProject.apps[name]){
			itemElem = document.createElement('li');
			itemElem.innerHTML = template.replace('{{name}}', newOne.name)
										 .replace('{{des}}', newOne.description);
			itemElem.onclick = function (){ switchApp(name) };
			showcase.invoke('appendChild', itemElem);
		}
	}
	theProject.attach('new', function (name){ newApp(name);	});
	
	//take the name of an app, launch it.
	function switchApp(name){
		currentLabel.innerText = name;
		theProject.launch(name);
	}
	
	theProject.new(app);
	//launche this immediatly after loading;
	switchApp(app.name);
}(window.ultimate = window.ultimate || {}) );
