/* * * * * * * * * *
 * My webpage-game-homecenter all-in-one project
 *
 * 
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
window.onload = function () { (function (theProject) {
/*	init data ********************************************************************************************************/
	//public
	theProject.loadOrder = theProject.loadOrder || 1;
	console.log((theProject.loadOrder)++);
	console.log(navigator.userAgent);
	
//navBtn object ********************************************************************************************************
	var navBtn = function (name, w, h, scaleSize){
		var theBtn,
			containerElement,
			child,
			parent,
			link,
			interval = "0.2em",
			bgColorScale = ["#404040","#424242","#444444","#464646","#484848"],
			scaleW = scaleSize,
			scaleH = w / h * scaleSize,
			i,
			len = bgColorScale.length;

		theBtn = {
			

		};
		for (i = 0; i < len; i++){
			child = document.createElement("div");
			
			child.style.backgroundColor = bgColorScale[i];
			child.style.position = "relative";
			if (containerElement){
				$(child).styles({	width: (100 - scaleW * 2) + "%",
									height: (100 - scaleH * 2) + "%",
									left: scaleW + "%",
									top: scaleH +"%"	})
						.appendTo(parent);
			}else{
				child.style.width = w + "em";
				child.style.height = h + "em";
				containerElement = child;
			}
			parent = child;
		}
		link = document.createElement("a");
		link.style.lineHeight = Math.floor(10 * h * Math.pow(1 - scaleH * 2 / 100, 4))/10 + "em";
		//link.style.verticalAlign = "text-bottom";
		link.innerHTML = name;

		parent.appendChild(link);
		return containerElement;
	};

/*	init	********************************************************************************************************/
	//private
	var i,
		mattr = "-webkit-linear-gradient(left";

	for (i = 0; i <= 36; i++) {
		mattr += ",hsla(" + i*10 + ", 50%, 80%, 1)";
	}
	//$.get("tu").style.backgroundImage = mattr + ")";
	//$.get("tt").style.backgroundImage = mattr + ")";
	$.setStyle(["tt","tu2"], {backgroundImage: mattr + ")"});

// setSchedule test drive
	var brightness = 27,
		hslValue = "hsl(0, 0%," + brightness + "%)",
		steps = 4;

	var sub1 = $("subtitle"),
		sub2 = $("subtitle2"),
		sub3 = $("subtitle3"),
		lightUp = function(t){ this.styles({backgroundColor: "hsl(0,0%," + (brightness + t * steps) + "%)"}); },
		dimDown = function(t){ this.styles({backgroundColor: "hsl(0,0%," + (brightness + 10 * steps - steps * t * 2) + "%)"}); },
		onLight = function(elem){ return function(){ $.setSchedule( lightUp, 10, 50, elem );$.setSchedule( lightUp, 10, ((Math.random()*3)>>0) * 25 + 25, elem ); };},
		onDim = function(elem){ return function(){ $.setSchedule( dimDown, 5, 50, elem );};};
	$.setStyle([sub1,sub2,sub3], {color: "blue", backgroundColor: hslValue});
	sub1.set("onmouseout", onDim(sub1) )
		.set("onmouseover",onLight(sub1));
	sub2.set("onmouseout", onDim(sub2))
		.set("onmouseover",onLight(sub2));
	sub3.set("onmouseout", onDim(sub3))
		.set("onmouseover",onLight(sub3));
	//a star
	$.astar();

//	var testBtn = navBtn("Pizza Shop", 8, 2, 2);
//	document.getElementsByTagName("header")[0].appendChild(testBtn);


}(window.ultimate = window.ultimate || {})); };