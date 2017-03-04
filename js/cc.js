"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for adjacency section
	oiiNexus.cc = {
		 "name": "cc",
		 "instruc": "This section will ask you to find the country with the largest number of links to a specific geographic region.",
		 "rep": 5,
		 "data":[{"from":"European","to":"Asia"},{"from":"Middle Eastern &#38; North African","to":"Asia"},{"from":"Oceanian","to":"Asia"},{"from":"South American","to":"Asia"},{"from":"Asian","to":"Europe"},{"from":"Middle Eastern &#38; North African","to":"Europe"},{"from":"Oceanian","to":"Europe"},{"from":"South American","to":"Europe"},{"from":"Sub-Saharan African","to":"Europe"},{"from":"Asian","to":"Middle East &#38; North Africa"},{"from":"European","to":"Middle East &#38; North Africa"},{"from":"Sub-Saharan African","to":"North America &#38; Caribbean"},{"from":"European","to":"Oceania"},{"from":"Asian","to":"South America"},{"from":"European","to":"South America"},{"from":"European","to":"Sub-Saharan Africa"},{"from":"Middle Eastern &#38; North African","to":"Sub-Saharan Africa"}] 
,
		 "execute": function(){
	
		//$('#question-text').html(this.question);
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


		var targets = shuffle.array(this.data).slice(0,this.rep);
		var t;
		var config=this;
		$("#question-var").css("font-weight","normal");
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
			
				//#Which t.from country has the most links to t.to?
				$('#question-var').html("Please click the <strong>"+t.from+"</strong> country with the most links to <strong>"+t.to+"</strong>");
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			}
		 		else  {
	 				$("#question-var").css("font-weight","900");
		 			oiiNexus.finishSection();
		 		}
		}
		oiiNexus.nextQ(); //ask first question
	}
  };
})();
