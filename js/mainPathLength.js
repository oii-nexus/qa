"use strict";

//callback for mainPathLength section
$(function(){
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
	//sigma.utils.stop_logger(sig);

	var targets = shuffle.array(section.targets); //.slice(0,section.rep);
	var t;
	window.nextQ = function() {
		if (targets.length > 0) { //more questions in this section
			t = targets.shift();    //pop new target answer off front of tagets array
			
			//set up log for new question
			currentQ = {target: t, action: [], condition: CONDITION};

			//Load/Refresh the network	   
			sig.graph.clear();
			sig.graph.read(TRAIN_DATA);
			sig.graph.nodes().forEach(function(n) {
				n.x=n.layouts[CONDITION].x;
				n.y=n.layouts[CONDITION].y;
				if (n.id==t[0] || n.id==t[1])
					n.color="#d95f02"; //orange
			});
			sig.refresh();
			sig.cameras[0].goTo({"x":0,"y":0,"angle":0,"ratio":1}); //recenter and zoom
			currentQ.action=[]; //Reset to clear recenter/zoom actions
			
			$('#question-var').html(section.question);
			addButtons(['1','2','3','4','Other']);   //show answer buttons
			startQ();  //ask new question - startQ will call nextQ ...
		}
	 		else  finishSection();
	}
	nextQ(); //ask first question
});
