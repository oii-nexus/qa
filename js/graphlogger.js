"use strict";

//log sigma actions to currentQ.action variable
(function(undefined) {

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.utils');
  
  sigma.utils.logger = function(sig) {
	if (! sig instanceof sigma) {
		throw 'sig parameter is not a sigma instance';
	}

    sig.bind('clickNode', function(evt) {
      oiiNexus.currentQ.action.push({type: evt.type, id: evt.data.node.id});
      //console.log({type: evt.type, id: evt.data.node.id});
    });
    
    sig.bind('hovers',function(evt) {
    	 if (evt.data.current.nodes.length>0) {
    	 	oiiNexus.currentQ.action.push({type: "hover", id: evt.data.current.nodes[0].id});
      	//console.log({type: "hover", id: evt.data.current.nodes[0].id});
      }
    });
    
    sig.cameras[0].bind('coordinatesUpdated',function(evt) {
   	 if (oiiNexus.currentQ) {
		 var state={
		 	x: sig.cameras[0].x,
		 	y: sig.cameras[0].y,
		 	ratio: sig.cameras[0].ratio,
		 	angle: sig.cameras[0].angle
		 }
		 oiiNexus.currentQ.action.push({type: "pan",details: state});
		 //console.log(state);
      }
    });	
  };

}).call(this);

    

