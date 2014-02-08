/* * * * * * * * * *
 * a simple slideshow demo
 *
 * * * * * * * * * * * * * * * * * * * * * * * */
( function (theProject) {

	var tmp = '\
				<div class="slideshow">\
					<input type="radio" name="slide" id="slidecontrol1" checked>\
					<input type="radio" name="slide" id="slidecontrol2">\
					<input type="radio" name="slide" id="slidecontrol3">\
					<input type="radio" name="slide" id="slidecontrol4">\
					<input type="radio" name="slide" id="slidecontrol5">\
					<div class="container">\
						<div class="slide">\
			 				<img src="img/1.jpg"></img>\
							<img src="img/2.jpg"></img>\
							<img src="img/3.jpg"></img>\
							<img src="img/4.jpg"></img>\
							<img src="img/5.jpg"></img>\
						</div>\
					</div>\
					<div class="control">\
						<label for="slidecontrol1"></label>\
						<label for="slidecontrol2"></label>\
						<label for="slidecontrol3"></label>\
						<label for="slidecontrol4"></label>\
						<label for="slidecontrol5"></label>\
					</div>\
				</div>'
	theProject.new({
		name: "Slideshow",
		description: "Pure CSS slideshow",
		start: function (){
			theProject.stage.set({innerHTML: tmp});
		}
	});
	
}(window.ultimate = window.ultimate || {}) );
	

	
