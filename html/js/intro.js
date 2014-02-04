( function (theProject) {
/*	init data ********************************************************************************************************/

	var showcase = $(document.createElement('ul'));
	var itemList = [];
	var template = '<h4>{{name}}</h4><p>{{des}}</p>';
	var app;
	var nav = document.getElementsByClassName('nav')[0];
	
	var menu = nav.children[0]
	var currentLabel = nav.children[1];
	
	menu.onclick = function (){ switchApp(app.name) };
	
	showcase.set({
		className: 'showcase',
		innerHTML: ''
	});
	
	
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

	//
	function newApp(name){
		var newOne,
			itemElem;
		if (app.name === name){ return; }
		if (newOne = theProject.apps[name]){
			itemElem = document.createElement('li');
			itemElem.innerHTML = template.replace('{{name}}', newOne.name)
										 .replace('{{des}}', newOne.description);
			itemElem.onclick = function (){ switchApp(name) };
			itemList.push(itemElem);
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
