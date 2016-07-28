/* ----- NOTES -----

WE SHOULD NOW DESIGN UI AND QUESTIONS IN DETAIL
BEFORE GO ANY FURHTER SINCE THERE WILL BE SOME FIDDLY ISSUES
REGARDLESS AND WANT TO SOLVE AS FEW AS POSSIBLE!

- if track clickNode and doubleClickNode, clickNode will be fired
twice with each doubleClick. Also, when drag, fires click if on node
- when change a single node, change does not persist - I think node is
a clone? So currently iterating over all nodes with forEach on
every change! - must be some way to change one node?
  -still behavior is odd since node is cyan when double click but turns black
   when go off it
- no mousewheel and pan-zoom events like there are for nodes? - and 
coordinatesUpdated event does not fire unless change coodrs with goTo()
  -docs say can define a custom captor; also says somewhere that captors
    take care of pan/zoom in Docs somewhere?
  -could use camera properties x, y and ratio to detect and calculate zooms,
    but this is clunky
*/


window.addEventListener('load', function() {
  
  //global function that renders question and logs actions and answers
  question = function(Q) {
    
    var regionColors = {E:'#f00',S:'#00f',W:'#0f0',L:'#ff0'};  
    var track = {action:[], answer:[]};
    userLog.question.push(track); //push now in case user never Submits an answer
    
    document.getElementById('graph-container').innerHTML = '';
    var s = new sigma({
      container: 'graph-container',
      settings: {
        defaultNodeColor: '#ec5148',
        edgeColor: '#fff',
        defaultEdgeColor: '#fff',
        maxNodeSize: 5,
        minNodeSize: 2
      }
    });

    sigma.parsers.json(Q.data, s, function() {
      /*s.graph.edges().forEach(function(edge){ 
        edge.type = "arrow";
      });*/
      //TODO: The condition should be randomly set at the start and fixed throughout
      var condition="pseudo-geo"; //Other options are "geo" and "fr"
      s.graph.nodes().forEach (function(nd) {
        nd.x=nd.layouts[condition]["x"];
        nd.y=nd.layouts[condition]["y"];
        //nd.color = regionColors[nd.region]; //TOOD: Didn't see this until now. Add back in later?
      });
      s.refresh();
    });
     
    
    //Let's use single click to make it easier to select a node --SAH
    s.bind('clickNode', function(evt) {
      var thisID = evt.data.node.id;
      if (thisID === track.answer.slice(-1)[0]) return;
      track.answer.push(thisID);
      if (track.answer.length > Q.select) track.answer.shift();
      s.graph.nodes().forEach( function(nd) {
        if (track.answer.indexOf(nd.id) > -1) nd.color = 'cyan';
        else nd.color = regionColors[nd.region];
      });
      s.refresh();
    });
    
    s.bind('clickNode doubleClickNode', function(evt) {
      track.action.push({type: evt.type, id: evt.data.node.id});
      //console.log(evt);
    });
    
    s.cameras[0].bind('coordinatesUpdated',function(evt) {
      //console.log("coordinatesUpdated");
      //console.log(evt);
      var state={
      	x: s.cameras[0].x,
      	y: s.cameras[0].y,
      	ratio: s.cameras[0].ratio,
      	angle: s.cameras[0].angle
      }
      track.action.push({type: "zoom/pan",details: state});
      //console.log(state);
    });

  }
});
