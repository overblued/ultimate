/* * *
 *
 * an intro menu
 *
 * * * * * * * * * * * * * * * * * * */

( function (theProject) {

		$$('#nav').set({innerHTML: '<div class="intro"><ul><li><a>{{back}}</a></li><li><a>{{current}}</a></li></ul></div>'});
		//private var
	var showcase = $$(document.createElement('ul')).set({ className: 'showcase' }),
		template = '<h4>{{name}}</h4><p>{{des}}</p>',
		menu = $$('#nav ul'),
		btn1 = $$('#nav ul li:nth-child(1) a'),
		btn2 = $$('#nav ul li:nth-child(2) a'),
		//the app to be exported
		app = {
			name:			"Menu",
			description:	"a showcase for all apps",
			hidden:			true,
			autostart:		true,
			
			start: function (){
				//because this app won't always be the first to load
				// the 'new' event may not be invoke for previous loaded apps
				$$.forEach(theProject.apps, function (app){
					newApp(app);
				});
				
				theProject.attach('new', newApp2);
				
				menu.set({
					onmouseout: function (e){
						//to prevent onmouseout triger on child nodes;
						var to = e.toElement || e.relatedTarget;
						while(to && to.parentElement !== null){
							if ((to = to.parentElement) === this.element){return;}
						}console.log(theProject.current);
						if (theProject.current !== app)
							this.styles({marginTop: '-2em'});
					}
				});
				//scroll effect
				btn2.set({
					innerHTML: app.name,
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
			}
		};
	
	theProject.new(app);

	//privileged methods
	//----------------------------------------------------------------------
	var n = 1,f = 100;
	function newApp2(app){
		setTimeout(function (){
			newApp(app)
		}, n*f);
		n++
	}
	function newApp(app){
		var itemElem;
		if (app.hidden){ return; }
		else {
			itemElem = document.createElement('li');
			itemElem.innerHTML = template.replace('{{name}}', app.name)
										 .replace('{{des}}', app.description);
			itemElem.onclick = function (){ switchApp(app.name) };
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
