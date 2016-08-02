//callback for pretestDegree section
$(function(){
	//Load data callback
	$.get(section.data, function(data) {
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
				$('#question-var').html("");             //show new question
				addButtons(['Orange','Green','I don\'t know']);   //show answer buttons
				startQ(nextQ);  //ask new question - startQ will call nextQ ...
			}
		 		else  finishSection();
		}
		nextQ(); //ask first question
		});
});
