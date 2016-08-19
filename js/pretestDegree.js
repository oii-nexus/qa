"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';
	//callback for pretestDegree section
	oiiNexus.pretestDegree = {
      "name": "pretestDegree",
      "instruc": "When looking at a network, \"degree\" refers to the extent to which a node (circle) is connected to other nodes. So, a node with many edges (lines) to other nodes is said to have high degree.",
      "rep": 3,
      "question": "Look at the green and orange nodes (circles) in the network:",
      "question2": "Which node has a higher degree (more connections)?",
      "data": "pretest_degree.json",
      "execute":function() {
      	var config=this;
	
	//Load data callback
	$.get(this.data, function(data) {
		$('#question-text').html(config.question);
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
				$('#question-var').html(config.question2);             //show new question
				oiiNexus.addButtons(['Orange','Green','I don\'t know']);   //show answer buttons
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			}
		 		else  oiiNexus.finishSection();
		}
		oiiNexus.nextQ(); //ask first question
		});
	}
  };
})();
