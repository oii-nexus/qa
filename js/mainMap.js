;(function(undefined) {
"use strict";
	
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for mainMap section
	oiiNexus.mainMap = {
		 "name": "mainMap",
		 "instruc": "This set of questions will ask you to locate three countries on the network diagram. Each country is represented as a node (circle) within the network.",
		 "rep": 3,
		 "question": "Please click on the following country:",
		 "execute":function(){
	
	
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
			 defaultEdgeType: "curve",
			 minNodeSize: 4,
			 maxNodeSize: 4
			}
		});
		sigma.utils.logger(sig);
	
		sig.bind('clickNode', function(evt) {
			oiiNexus.recordAnswer(evt.data.node.id);
		});
		
		//Load/Refresh the network	   
		sig.graph.clear();
		sig.graph.read(oiiNexus.TRAIN_DATA);
		sig.graph.nodes().forEach(function(n) {
			n.x=n.layouts[oiiNexus.CONDITION].x;
			n.y=n.layouts[oiiNexus.CONDITION].y;
		});
		sig.refresh();
		
		var pretestMapRep=oiiNexus["pretestMap"].rep;

		var targets = oiiNexus.config.place.slice(pretestMapRep,pretestMapRep+this.rep);
		var t;
		oiiNexus.nextQ = function() {
			if (targets.length > 0) { //more questions in this section
				t = targets.shift();    //pop new target answer off front of targets array
			
				//set up log for new question
				oiiNexus.currentQ = {target: t, action: [], condition: oiiNexus.CONDITION};
				sig.cameras[0].goTo({"x":0,"y":0,"angle":0,"ratio":1}); //recenter and zoom
				oiiNexus.currentQ.action=[]; //Reset to clear recenter/zoom actions
			
				$('#question-var').html(t);
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			}
		 	else  oiiNexus.finishSection();
		}
		oiiNexus.nextQ(); //ask first question
	}
  };
})();
