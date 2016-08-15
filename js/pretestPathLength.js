//callback for pretestDegree section
$(function(){
	//Load data callback
	$.get(section.data, function(data) {
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

		var targets = shuffle.array([0,1,2]),t;
		nextQ = function() {
			if (targets.length > 0) { //more questions in this section
				t = targets.shift();    //pop new target answer off front of tagets array

				//Load/Refresh the network	   
				sig.graph.clear();
				sig.graph.read(data[t]);
				sig.refresh();
				//set up log for new question
				currentQ = {target: data[t]["name"], action: []};
				$('#question-var').html(section.question);
				addButtons(['1','2','3','4','Other']);   //show answer buttons
				startQ(nextQ);  //ask new question - startQ will call nextQ ...
			}
		 		else  finishSection();
		}
		nextQ(); //ask first question
		});
});
