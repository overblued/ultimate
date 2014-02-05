( function (theProject) {
/*	init data ********************************************************************************************************/

	var showcase = $(document.createElement('ul')).set({ className: 'showcase', }),
		template = '<h4>{{name}}</h4><p>{{des}}</p>',
		
		menu = $('#nav ul'),
		btn1 = $('#nav ul li:nth-child(1) a'),
		btn2 = $('#nav ul li:nth-child(2) a'),
	
		app = {
			name: "Menu",
			description: "a showcase for all apps",
			start: function (){
				//clear main
				(this.start = function(){
					showcase.appendTo(theProject.stage);
				})();
			}
		};console.log(btn2);
	//scroll effect
	menu.set({
		onmouseover: function (){
			if (theProject.current !== app){
				this.styles({marginTop: 0});
			}
		},
		onmouseout: function (){
			if (theProject.current !== app)
			this.styles({marginTop: '-2em'});
		}
	});
	
	//make it a home button
	btn1.set({
		innerText: app.name,
		onclick: function (){ switchApp(app.name); }
	});
	
	
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
		if (theProject.launch(name)){
			menuText(name);
			if (name !== app.name)
				menu.styles({marginTop: '-2em'});
		}
	}
	function menuText(txt){
		btn2.set({innerText: txt});
	}
	theProject.new(app);
	//launche this immediatly after loading;
	switchApp(app.name);
}(window.ultimate = window.ultimate || {}) );
