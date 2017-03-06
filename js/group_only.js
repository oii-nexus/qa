"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for adjacency section
	oiiNexus.group_only = {
		 "name": "group_only",
		 "instruc": "This section will ask you to count how many geographic regions are connected to a given region.",
		 "rep": 5,
		 "question": "How many different geographic regions are connected to countries in:",
		 "data":["Asia","Europe","Middle East &#38; North Africa","North America &#38; Caribbean","Oceania","South America","Sub-Saharan Africa"],
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
		//$("#question-var").css("font-weight","normal");
  		$("#color_legend").show();
		oiiNexus.nextQ = function() {
			if (targets.length > 0) { //more questions in this section
				t = targets.shift();    //pop new target answer off front of tagets array
		
				//set up log for new question
				oiiNexus.currentQ = {target: t, action: [], condition: oiiNexus.CONDITION};

				//Load/Refresh the network	   
				sig.cameras[0].goTo({"x":0,"y":0,"angle":0,"ratio":1}); //recenter and zoom
				leafletPlugin.fitBounds();
				oiiNexus.currentQ.action=[]; //Reset to clear recenter/zoom actions
			
				$('#question-var').html(t);
				//oiiNexus.addButtons(['Orange','Green','I don\'t know']);   //show answer buttons
				oiiNexus.addNumberInput();
				oiiNexus.startQ();  //ask new question - startQ will call nextQ ...
			} else  {
				$("#color_legend").hide();
				leafletPlugin.kill();
	 			oiiNexus.finishSection();
	 		}
		}
		oiiNexus.nextQ(); //ask first question
	}
  };
})();
