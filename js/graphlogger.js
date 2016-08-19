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
      currentQ.action.push({type: evt.type, id: evt.data.node.id});
    });
    
    sig.bind('overNode',function(evt) {
      currentQ.action.push({type: evt.type, id: evt.data.node.id});
      //console.log({type: evt.type, id: evt.data.node.id});
    });
    
    sig.cameras[0].bind('coordinatesUpdated',function(evt) {
   	 if (currentQ) {
		 var state={
		 	x: sig.cameras[0].x,
		 	y: sig.cameras[0].y,
		 	ratio: sig.cameras[0].ratio,
		 	angle: sig.cameras[0].angle
		 }
		 currentQ.action.push({type: "zoom/pan",details: state});
      }
    });	
  };

}).call(this);

    

