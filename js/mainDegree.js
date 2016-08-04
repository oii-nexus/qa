//callback for mainDegree section
$(function(){
	$('#question-text').html(section.question);
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

	var targets = shuffle.array(section.targets); //.slice(0,section.rep);
	var t;
	nextQ = function() {
		if (targets.length > 0) { //more questions in this section
			t = targets.shift();    //pop new target answer off front of tagets array

			//Load/Refresh the network	   
			sig.graph.clear();
			sig.graph.read(TRAIN_DATA);
			sig.graph.nodes().forEach(function(n) {
				n.x=n.layouts[CONDITION].x;
				n.y=n.layouts[CONDITION].y;
				if (n.id==t[0])
					n.color="#fc8d62"; //orange
				else if (n.id==t[1])
					n.color="#66c2a5"; //green
				else
					n.color="#888888"; //TODO: Just remove color from json
			});
			sig.refresh();
			//set up log for new question
			currentQ = {target: t, action: [], condition: CONDITION};
			$('#question-var').html("");             //show new question
			addButtons(['Orange','Green','I don\'t know']);   //show answer buttons
			startQ(nextQ);  //ask new question - startQ will call nextQ ...
		}
	 		else  finishSection();
	}
	nextQ(); //ask first question
});
