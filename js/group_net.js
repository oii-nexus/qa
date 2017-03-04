"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for adjacency section
	oiiNexus.group_net = {
		 "name": "group_net",
		 "instruc": "This section will ask you to count how many connections (edges/lines) are between two geographic regions.",
		 "rep": 5,
		 "question": "How many connections are there between countries in:",
		 "data":[{"from":"Asia","to":"Europe"},{"from":"Asia","to":"Middle East &#38; North Africa"},{"from":"Asia","to":"North America &#38; Caribbean"},{"from":"Asia","to":"Oceania"},{"from":"Asia","to":"South America"},{"from":"Europe","to":"Middle East &#38; North Africa"},{"from":"Europe","to":"North America &#38; Caribbean"},{"from":"Europe","to":"Oceania"},{"from":"Europe","to":"South America"},{"from":"Europe","to":"Sub-Saharan Africa"},{"from":"Middle East &#38; North Africa","to":"North America &#38; Caribbean"},{"from":"Middle East &#38; North Africa","to":"Sub-Saharan Africa"},{"from":"North America &#38; Caribbean","to":"South America"},{"from":"North America &#38; Caribbean","to":"Sub-Saharan Africa"}],
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

		var targets = shuffle.array(this.data).slice(0,this.rep);
		var t;
		var config=this;
		//$("#question-var").css("font-weight","normal");
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
				});
				sig.refresh();
				sig.cameras[0].goTo({"x":0,"y":0,"angle":0,"ratio":1}); //recenter and zoom
				oiiNexus.currentQ.action=[]; //Reset to clear recenter/zoom actions
			
				$('#question-var').html(t.from+"<br/><span style='font-weight: normal'> and </span><br/>"+t.to);
				//oiiNexus.addButtons(['Orange','Green','I don\'t know']);   //show answer buttons
				oiiNexus.addNumberInput();
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			}
		 		else  {
	 				//$("#question-var").css("font-weight","900");
		 			oiiNexus.finishSection();
		 		}
		}
		oiiNexus.nextQ(); //ask first question
	}
  };
})();
