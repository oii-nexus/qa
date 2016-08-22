"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for mainPathLength section
	oiiNexus.mainPathLength = {
      "name": "mainPathLength",
      "instruc": "This set of questions will again ask you to determine the network distance between two nodes (circles). Remember that the \"distance\" is the number of edges (lines) between two nodes.",
      "instruc2": "<h1>Network distance</h1><p>Distance is measured as the number of edges (lines) between two nodes. Two nodes directly connected are said to have a distance of 1. If is only possible to go from one node to another through a third node, then this is distance 2 (A->B->C). If it is only possible to go from one node to another through two additional nodes, this is distance 3 (A->B->C->D).</p><img src='pretest/path_distance.svg'>",
      "rep": 3,
      "targets":[["Manchester","London"],["Birmingham","Leeds"],["York","Leicester"],
      	["City of Edinburgh","London"]],
      "question": "What is the distance between the two orange nodes?",
      "execute":function() {
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
			 minNodeSize: 4,
			 maxNodeSize: 4
			}
		});
		sigma.utils.logger(sig);

		var targets = shuffle.array(this.targets).slice(0,this.rep);
		var t;
		var config=this;
		oiiNexus.nextQ = function() {
			if (targets.length > 0) { //more questions in this section
				t = targets.shift();    //pop new target answer off front of tagets array
			
				//set up log for new question
				oiiNexus.currentQ = {target: t, action: [], condition: oiiNexus.CONDITION};

				//Load/Refresh the network	   
				sig.graph.clear();
				sig.graph.read(oiiNexus.TRAIN_DATA);
				sig.graph.nodes().forEach(function(n) {
					n.x=n.layouts[oiiNexus.CONDITION].x;
					n.y=n.layouts[oiiNexus.CONDITION].y;
					if (n.id==t[0] || n.id==t[1])
						n.color="#d95f02"; //orange
				});
				sig.refresh();
				sig.cameras[0].goTo({"x":0,"y":0,"angle":0,"ratio":1}); //recenter and zoom
				oiiNexus.currentQ.action=[]; //Reset to clear recenter/zoom actions
			
				$('#question-var').html(config.question);
				oiiNexus.addButtons(['1','2','3','4','Other']);   //show answer buttons
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			}
		 		else  oiiNexus.finishSection();
		}
		oiiNexus.nextQ(); //ask first question
	}
  };
})();
