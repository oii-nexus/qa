//callback for pretestDegree section
var TRAIN_DATA;
var CONDITION;
$(function(){

	$('#question-text').html(section.question);
	
	//Randomize condition
	var r=Math.random();
	if (r<0.33) {
		CONDITION="geo";
	} else if (r < 0.66) {
		CONDITION="pseudo-geo";
	} else {
		CONDITION="fr";
	}
	console.log(CONDITION);
	
	//Load data callback
	$.get(section.data, function(data) {
		mask.off();
		TRAIN_DATA=data;
		
		nextQ = function() {
			finishSection();
		}
		nextQ();
		});
});
