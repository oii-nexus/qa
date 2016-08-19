;(function(undefined) {
"use strict";

console.log("loading mainMap...");
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for mainMap section
	oiiNexus.mainMap = function() {
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

		var targets = oiiNexus.shuffle.array(oiiNexus.config.place).slice(0,oiiNexus.section.rep);
		var t;
		oiiNexus.nextQ = function() {
			if (targets.length > 0) { //more questions in this section
				t = targets.shift();    //pop new target answer off front of tagets array
			
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
	};
})();
