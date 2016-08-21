"use strict";

//callback for map pretest

//NOTES
//-there is a pan event associated with each zoom - which we don't want
//  -if always a single pan after each zoom(?) easy to handle
//-should resest pan/zoom of map between questions
//-check Cambridge/S Cambridge issue on map if relevant
//-cache path elmts in same loc-auth if too slow selecting on hover

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for mainMap section
	oiiNexus.pretestMap = {
	 	"name": "pretestMap",
	 	"instruc": "This section will ask you to locate three UK cities on a map of the country.",
	 	"rep": 3,
	 	"question": "Please click on the following city:",
	 	"data": "map.txt",
	 	"execute":function(config) {	
	 	
	 	var config=this; //Would normally use this throughout, but context obviously changes within data handler function
	
	  $.get(this.data, function(data) {
	    
	    $('#graph-container').html(data).append('<div id="map-hover"><div>').show();
	    $('#question-text').html(config.question);
	    mask.off();
	    
	    //map pan and zoom
	    function onPanZoom(z) {oiiNexus.currentQ.action.push(z);}
	    var panZoomMap = svgPanZoom('#map',  //zoom options:
		 { viewportSelector: '.svg-pan-zoom_viewport'
		 , dblClickZoomEnabled: false
		 , preventMouseEventsDefault: true
		 , zoomScaleSensitivity: 0.3
		 , minZoom: 0.9
		 , maxZoom: 25
		 , fit: true
		 , contain: false
		 , center: true
		 , onZoom: onPanZoom
		 , onPan: onPanZoom
		 });

	    //events
	    var $path = $('path'),
		   $mapHover = $('#map-hover'),
		   downXY = [],   //pan fires click - use mousedown/up for click, need posn where mousedown
		   thisLA;
	    function pathFill(color,locAuth) {  //some loc auths represented by more than one elmt
		 if (locAuth) $('[data-loc_auth = "' + locAuth  + '"]').css('fill',color);
		 else $path.css('fill',color);
	    }
	    $path.mouseover( function(evt) {
		 thisLA = $(this).attr('data-loc_auth');
		 pathFill('#996600', thisLA);
		 $mapHover.show().html(thisLA);
	    });
	    $path.mousemove( function(evt) {
		 $mapHover.css({left: (evt.pageX + 14 + 'px'), top: evt.pageY - 5 + 'px'});
	    });
	    $path.mousedown( function(evt) { downXY = [evt.clientX, evt.clientY] });  
	    $path.mouseout( function(evt) {
		 pathFill('#bbb', $(this).attr('data-loc_auth'));
		 $mapHover.hide().html('');
	    });
	    $path.mouseup( function(evt) {
		 if (evt.clientX === downXY[0] && evt.clientY === downXY[1]) {
		   pathFill('#bbb');
		   oiiNexus.recordAnswer($(this).attr('data-loc_auth'));
		 }
	    });
	    
	    //questions
	    var targets = shuffle.array(oiiNexus.config.place).slice(0,config.rep);
	    oiiNexus.nextQ = function() {
		 if (targets.length > 0) { //not finished questions in this section
			var tg = targets.shift();      
			oiiNexus.currentQ = {target: tg, action: []};  //set up log for new question
			panZoomMap.fit();
			panZoomMap.center();
			oiiNexus.currentQ.action = [];  //reset after fitting/centering map
			$('#question-var').html(tg);           //show new question
			oiiNexus.startQ();  //ask new question (startQ will call nextQ ...)
		 }
		 else oiiNexus.finishSection(); //finished section - clean up and move to next section
	    }
	    oiiNexus.nextQ(); //ask first question
	    
	  });
	}//end execute function
};//end section
})();
