"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';
	//callback for pretestDegree section
	oiiNexus.pretestDegree = function() {
	
	//Load data callback
	$.get(oiiNexus.section.data, function(data) {
		$('#question-text').html(oiiNexus.section.question);
		mask.off();

		var sig = new sigma({
		graph: null,
		renderer: {
			container: document.getElementById('graph-container'),
			type: 'canvas'
		},
		settings: {
			 defaultNodeColor: '#BBBBBB',
			 defaultEdgeColor: '#AAAAAA',
			 edgeColor: 'default',
			 labelThreshold: 100,
			 minNodeSize: 8,
			 maxNodeSize: 8
			}
		});
		sigma.utils.logger(sig);

		var targets = oiiNexus.shuffle.array([0,1,2]),t;
		oiiNexus.nextQ = function() {
			if (targets.length > 0) { //more questions in this section
				t = targets.shift();    //pop new target answer off front of tagets array

				//Load/Refresh the network	   
				sig.graph.clear();
				sig.graph.read(data[t]);
				sig.refresh();
				//set up log for new question
				oiiNexus.currentQ = {target: data[t]["name"], action: []};
				sig.cameras[0].goTo({"x":0,"y":0,"angle":0,"ratio":1}); //recenter and zoom
				oiiNexus.currentQ.action=[]; //Reset to get clear the actions of the recenter/zoom
				$('#question-var').html(oiiNexus.section.question2);             //show new question
				oiiNexus.addButtons(['Orange','Green','I don\'t know']);   //show answer buttons
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			}
		 		else  oiiNexus.finishSection();
		}
		oiiNexus.nextQ(); //ask first question
		});
	};
})();
