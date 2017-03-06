"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for adjacency section
	oiiNexus.adjacency = {
		 "name": "adjacency",
		 "instruc": "This section will ask you to examine how many countries in the same geographic region are connected to a given country.",
		 "rep": 5,
		 "question": "Look at the labeled country (circle) in the network:",
		 "data":[{"question":"How many <strong>Asian</strong> countries are connected to <strong>India</strong>?","target":"India"},{"question":"How many <strong>Asian</strong> countries are connected to <strong>China</strong>?","target":"China"},{"question":"How many <strong>Asian</strong> countries are connected to <strong>Malaysia</strong>?","target":"Malaysia"},{"question":"How many <strong>Asian</strong> countries are connected to <strong>Thailand</strong>?","target":"Thailand"},{"question":"How many <strong>Asian</strong> countries are connected to <strong>Japan</strong>?","target":"Japan"},{"question":"How many <strong>European</strong> countries are connected to <strong>Romania</strong>?","target":"Romania"},{"question":"How many <strong>European</strong> countries are connected to <strong>Switzerland</strong>?","target":"Switzerland"},{"question":"How many <strong>European</strong> countries are connected to <strong>Croatia</strong>?","target":"Croatia"},{"question":"How many <strong>European</strong> countries are connected to <strong>Spain</strong>?","target":"Spain"},{"question":"How many <strong>European</strong> countries are connected to <strong>United Kingdom</strong>?","target":"United Kingdom"},{"question":"How many <strong>European</strong> countries are connected to <strong>Ukraine</strong>?","target":"Ukraine"},{"question":"How many <strong>Middle Eastern &#38; North African</strong> countries are connected to <strong>Saudi Arabia</strong>?","target":"Saudi Arabia"},{"question":"How many <strong>Middle Eastern &#38; North African</strong> countries are connected to <strong>Syria</strong>?","target":"Syria"},{"question":"How many <strong>Middle Eastern &#38; North African</strong> countries are connected to <strong>Egypt</strong>?","target":"Egypt"},{"question":"How many <strong>Middle Eastern &#38; North African</strong> countries are connected to <strong>Palestine</strong>?","target":"Palestine"},{"question":"How many <strong>South American</strong> countries are connected to <strong>Argentina</strong>?","target":"Argentina"},{"question":"How many <strong>Sub-Saharan African</strong> countries are connected to <strong>South Africa</strong>?","target":"South Africa"},{"question":"How many <strong>Sub-Saharan African</strong> countries are connected to <strong>Democratic Republic of the Congo</strong>?","target":"Democratic Republic of the Congo"}],
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
			 maxNodeSize: 4,
			 defaultEdgeType: "curve"
			}
		});
		sigma.utils.logger(sig);

		sig.graph.clear();
		sig.graph.read(oiiNexus.TRAIN_DATA);
		
		var map = L.map('map-container', {
		  layers: [],
		  // avoid unexpected moves:
		  scrollWheelZoom: 'center',
		  doubleClickZoom: 'center',
		  bounceAtZoomLimits: false,
		  keyboard: false,
		  crs: L.CRS.EPSG4326,
		  zoom: 1,
		  center: [0,0]
		}).addEventListener("zoomend",function(evt) {
			 oiiNexus.currentQ.action.push({type: "zoom",details: evt.target._zoom});
		});
		
		if (oiiNexus.CONDITION=="geo") {
			var geojson = new L.geoJson(oiiNexus.MAP).addTo(map);		
			geojson.setStyle({"weight":2,"fill":false,"color":"#666666"});
		}
		
		var leafletPlugin = sigma.plugins.leaflet(sig, map, {});
		leafletPlugin.enable();		

		var targets = shuffle.array(this.data).slice(0,this.rep);
		var t;
		var config=this;
		$("#question-var").css("font-weight","normal");
		$("#color_legend").show();
		oiiNexus.nextQ = function() {
			if (targets.length > 0) { //more questions in this section
				t = targets.shift();    //pop new target answer off front of targets array
		
				//set up log for new question
				oiiNexus.currentQ = {target: t.target, action: [], condition: oiiNexus.CONDITION};

				//Load/Refresh the network	   
				sig.graph.clear();
				sig.graph.read(oiiNexus.TRAIN_DATA);
				sig.graph.nodes().forEach(function(n) {
					if (n.id==t.target) {
						n.color="#666666"; //gray
						n.forceLabel=true;
					}
				});
				sig.refresh();
				sig.cameras[0].goTo({"x":0,"y":0,"angle":0,"ratio":1}); //recenter and zoom
				leafletPlugin.fitBounds();
				oiiNexus.currentQ.action=[]; //Reset to clear recenter/zoom actions
			
				$('#question-var').html(t.question);             //show new question
				//oiiNexus.addButtons(['Orange','Green','I don\'t know']);   //show answer buttons
				oiiNexus.addNumberInput();
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			} else {
		 		oiiNexus.finishSection();
	 			$("#question-var").css("font-weight","900");
				$("#color_legend").hide();
				leafletPlugin.kill();
	 		}
		}
		oiiNexus.nextQ(); //ask first question
	}
  };
})();
