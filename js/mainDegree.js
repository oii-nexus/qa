"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for mainDegree section
	oiiNexus.mainDegree = {
		 "name": "mainDegree",
		 "instruc": "This section will again ask you to examine the degree of nodes (circles). Remember degree refers to the number of edges (lines) connected to each node.",
		 "rep": 3,
		 "question": "Look at the green and orange nodes (circles) in the network:",
		 "question2": "Which node has a higher degree (more connections)?",
		 "targets":[["Manchester","London"],["Birmingham","Leeds"],["London","Glasgow City"],
		 	["Cardiff","Leicester"],["City of Edinburgh","Glasgow City"]],
		 "execute": function(){
	
		$('#question-text').html(this.question);
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
					if (n.id==t[0])
						n.color="#fc8d62"; //orange
					else if (n.id==t[1])
						n.color="#66c2a5"; //green
				});
				sig.refresh();
				sig.cameras[0].goTo({"x":0,"y":0,"angle":0,"ratio":1}); //recenter and zoom
				oiiNexus.currentQ.action=[]; //Reset to clear recenter/zoom actions
			
				$('#question-var').html(config.question2);             //show new question
				oiiNexus.addButtons(['Orange','Green','I don\'t know']);   //show answer buttons
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			}
		 		else  oiiNexus.finishSection();
		}
		oiiNexus.nextQ(); //ask first question
	}
  };
})();
