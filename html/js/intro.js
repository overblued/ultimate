/* * *
 *
 * an intro menu
 *
 * * * * * * * * * * * * * * * * * * */

( function (theProject) {

		//private var
	var showcase = $(document.createElement('ul')).set({ className: 'showcase' }),
		template = '<h4>{{name}}</h4><p>{{des}}</p>',
		
		menu = $('#nav ul'),
		btn1 = $('#nav ul li:nth-child(1) a'),
		btn2 = $('#nav ul li:nth-child(2) a'),
		//the app to be exported
		app = {
			name: "Menu",
			description: "a showcase for all apps",
			start: function (){
				//because this app won't always be the first to load
				// the 'new' event may not be invoke for previous loaded apps
				$.forEach(theProject.apps, function (app){
					newApp(app.name);
				});
				
				theProject.attach('new', function (name){ newApp(name);	});
				
				menu.set({
					onmouseout: function (e){
						//to prevent onmouseout triger on child nodes;
						var to = e.toElement || e.relatedTarget;
						while(to && to.parentElement !== null){
							if ((to = to.parentElement) === this.element){return;}
						}
			
						if (theProject.current !== app)
							this.styles({marginTop: '-2em'});
					}
				});
				//scroll effect
				btn2.set({
					onmouseover: function (){
						if (theProject.current !== app){
							menu.styles({marginTop: 0});
						}
					}
				});
				//make it a home button
				btn1.set({
					innerHTML: app.name,
					onclick: function (){ switchApp(app.name); }
				});
				//clear main
				(this.start = function(){
					showcase.appendTo(theProject.stage);
				})();
			},
			hidden: true,
			autostart: true
		};
	
	theProject.new(app);

	//privileged methods
	//----------------------------------------------------------------------
	
	function newApp(name){
		var newOne,
			itemElem;
		newOne = theProject.apps[name];
		if (newOne.hidden){ return; }
		else {
			itemElem = document.createElement('li');
			itemElem.innerHTML = template.replace('{{name}}', newOne.name)
										 .replace('{{des}}', newOne.description);
			itemElem.onclick = function (){ switchApp(name) };
			showcase.invoke('appendChild', itemElem);
		}
	}
	
	//take the name of an app, launch it.
	function switchApp(name){
		if (theProject.launch(name)){
			menuText(name);
			if (name !== app.name)
				menu.styles({marginTop: '-2em'});
		}
	}
	function menuText(txt){
		btn2.set({innerHTML: txt});
	}
}(window.ultimate = window.ultimate || {}) );
