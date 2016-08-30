"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for pretestPathLength section
	oiiNexus.pretestPathLength = {
      "name": "pretestPathLength",
      "instruc": "This set of questions will ask you to determine the network distance between two nodes (circles). Distance is measured as the number of edges (lines) between two nodes.",
      "instruc2":"<h1>Network distance</h1><p>Distance is measured as the number of edges (lines) between two nodes. Two nodes connected directly are said to have a distance of 1. If it is only possible to go from one node to another through a third node, then this is distance 2 (A->B->C). If it is only possible to go from one node to another through two additional nodes, this is distance 3 (A->B->C->D).</p><img src='pretest/path_distance.svg'>",
      "rep": 3,
      "question": "What is the distance between the two orange nodes?",
      "data": "pretest_path_length.json",
      "execute":function() {
	      var config=this;
	
	//Load data callback
	$.get(this.data, function(data) {
		$('#question-text').html("");
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

		var targets = shuffle.array([0,1,2]),t;
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
				oiiNexus.currentQ.action=[];
				$('#question-var').html(config.question);
				oiiNexus.addButtons(['1','2','3','4','Other']);   //show answer buttons
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			}
		 		else  oiiNexus.finishSection();
		}
		oiiNexus.nextQ(); //ask first question
		});
	}
  };
})();
