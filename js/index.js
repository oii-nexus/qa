"use strict";
// ----- NOTES -----
//-need zoom btns on map or networks? - even laptop users may want them
//-page should not scroll. Need to set CSS attributes?
//-try to resend data if there is a connection error

;(function(){
	var getQueryStringValue = function(key) {  
		return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
	}
	
	window.shuffle = {             
      index: function(s) {  //shuffle integers from 0 to s-1
      	var v = new Array(s);
      	var j;
      	v[0] = 0;
      	for (var i=1; i<s; i++) {
      		j = Math.floor(Math.random()*(i + 1));
      		v[i] = v[j];
      		v[j] = i; }
      	return v;
      },
      array: function(v) {  //shuffle array
        return this.index(v.length).map(function(x) {return v[x]}); 
      }
    };
	
	// oiiNexus is a global variable
	window.oiiNexus={
		config:{
		  "section": shuffle.array([
		  	["adjacency"],
		  	["group_edge"],["group_node"],["group_net"],["group_only"],["cc"]
		  ]),
		  "mainData":"immigration.json",
		  "minTime": 5000,
		  "maxTime": 90000 //max time to 90 seconds
		}
	
	};
	//console.log(oiiNexus.config.section);
	
	$.get(oiiNexus.config.mainData, function(data) {	//Load main section data
			oiiNexus.TRAIN_DATA=data;
			oiiNexus.TRAIN_DATA["nodes"].forEach(function(n) {
				n.x=n.layouts[oiiNexus.CONDITION].x;
				n.y=n.layouts[oiiNexus.CONDITION].y;
				n.lat=-1*n.layouts[oiiNexus.CONDITION].y;
				n.lng=n.layouts[oiiNexus.CONDITION].x;
			});

	});
	
	$.get("map.json", function(data) {	//Load map data
		oiiNexus.MAP=data;		
	});

	
	
	window.mask = {//also a global variable
		data: function() {   //show mask - loading data message
			$('#mask').html('Please wait, loading data.').show();
		},
		timer: function() {  //show mask - wait for timer to finish message
			$('#mask').html('Please wait, the survey will continue after the minimum time of ' + (oiiNexus.config.minTime/1000) + ' seconds.').show();
		},
		newq: function() {
			$('#mask').append('<br/><br/><strong>Ready for the next question? Please click anywhere to continue.</strong>').show().click(function() {
		   	$("#mask").off();//Remove the event handler
		   	mask.off(); //Blank and hide the mask
		   	oiiNexus.nextQ();
		});
		},
		off: function() {    //hide mask
			$('#mask').html("").hide();
		}
    };

		
    
    
	//data structures
	oiiNexus.section = '';     //settings for current section
	oiiNexus.currentQ =  {};   //current question - pushed onto questions when done
	oiiNexus.questions = [];   //questions for current section - pushed onto track when section done
	oiiNexus.track =     {};   //log of all questions, actions and answers
	oiiNexus.USER_ID = getQueryStringValue("prolific_pid");
	
	oiiNexus.CONDITION=(function() {//Experimental condition
		//Randomize condition
		var r=Math.random();
		if (r<0.5) {
			return "geo";
		} else {
			return "fr";
		}
	})();
	
	//useful functions
	oiiNexus.recordAnswer = function(ans) {
		if (oiiNexus.timeoutId) clearTimeout(oiiNexus.timeoutId);
		oiiNexus.currentQ.answer = ans;
		oiiNexus.currentQ.endTime=Date.now();
		oiiNexus.questions.push(oiiNexus.currentQ);
		if (oiiNexus.currentQ.endTime-oiiNexus.currentQ.startTime<oiiNexus.config.minTime) {
			mask.timer();
			setTimeout(function() {
				if (oiiNexus.timerId) clearInterval(oiiNexus.timerId);
				mask.newq();
			 },oiiNexus.config.minTime-(Date.now()-oiiNexus.currentQ.startTime));
		} else {
			//Bad design - repeat code
			if (oiiNexus.timerId) clearInterval(oiiNexus.timerId);
			mask.newq();
		}
	};
    
    oiiNexus.addButtons = function(answers) {  //append buttons to answer-var elmt
      $('#question-var').append('<br><br>');
      for (var a=0; a<answers.length; a++) {
        $('#question-var').append('<div class="btn answer">' + answers[a] + '</div>');
      }
      $('.answer').click( function() {
        oiiNexus.recordAnswer($(this).html());
      });
    };
    
    oiiNexus.addNumberInput = function() {
		$('#question-var').append('<br><br><input name="answer" id="numInput" type="text"><br/>');
        	var btn=$("<div></div>").attr("class","btn").text("Record Answer").click(function() {
        		oiiNexus.recordAnswer($("#numInput").val());
    		}).appendTo('#question-var');
    	}
    
    oiiNexus.updateTimer=function (timeStarted) {
        $("#elapsed").width((Date.now() - timeStarted)/oiiNexus.config.maxTime*100 + '%');
    };
    
    oiiNexus.timerId=null;
    oiiNexus.timeoutId=null;
    //functions for stepping through questions and sections
    oiiNexus.startQ = function() {  //use nextQ to get next question, it calls startQ ...
      mask.off();
      var elapsed = $('#elapsed');
      elapsed.width('0');
      oiiNexus.timerId = setInterval(oiiNexus.updateTimer, 250, Date.now());
      oiiNexus.timeoutId=setTimeout( function() {
        oiiNexus.recordAnswer("TIMEOUT");
      }, oiiNexus.config.maxTime );
      oiiNexus.currentQ.startTime=Date.now();
    }
    
    oiiNexus.finishSection = function() {
      $('#container').html('');
      $('#container').html('<div id="map-container"></div><div id="graph-container"></div>');
      //track[section.name] = {section: section, questions: questions}; //log section results
      //Send data for section to server
      oiiNexus.dblogger(oiiNexus.USER_ID,oiiNexus.section,oiiNexus.questions);
      oiiNexus.nextSection();
    };
    
    oiiNexus.nextSection = function() { //can use oiiNexus. or this.
      oiiNexus.questions = [];
      $('#question, #mask').hide();

      if (oiiNexus.config.section.length === 0) {
        //window.location.href = "postq.php?prolific_pid="+oiiNexus.USER_ID;
        //special case. show postq
        oiiNexus["postq"].execute();
      }
      else {
        oiiNexus.section = oiiNexus.config.section[0].shift();
        if (oiiNexus.config.section[0].length===0) {
        	oiiNexus.config.section.shift(); //Remove empty list
        }
        $('#instruc-text').html(oiiNexus[oiiNexus.section].instruc);
        if (oiiNexus[oiiNexus.section].instruc2!==undefined) {
	        $('#intro2').html(oiiNexus[oiiNexus.section].instruc2).show();
	   }
      }
      $('#instruc').show();
    };

	//Function to send data to server for storage in database
     oiiNexus.dblogger = function(userid,section,payload) {
     	var params={
     		"userid":userid,
     		"section":section,
     		"payload":JSON.stringify(payload)
     	};
     	//console.log("Sending data");
     	//console.log(params);
     	$.ajax({
                url : 'db/log.php',
                type: 'POST',
                data: params
                //TODO: On error try to resend.
          });
     };

})();

$(function(){
   $('#start').click( function() {
      mask.data();
      $('#instruc').hide();
      $('#intro2').hide();
      $('#question').show();
      //$.getScript('js/' + oiiNexus.section.name + '.js');
      //console.log(oiiNexus.section);
      oiiNexus[oiiNexus.section].execute();
    });
    
    //Get userid
     $('#intro').show();
	$("#userid").val(oiiNexus.USER_ID);
    	$("#introbtn").click(function() {
    		//LOG
    		var uid=$("#userid").val();
    		if (uid=="") {
    			$("#intro-text").css("color","red");
    			return false;
    		}
    		var ua="";
    		try {
    			ua=navigator.userAgent;
    		} catch(err) {
    			console.log("Could not get user-agent");
    		}
		//Log on server
		oiiNexus.dblogger(uid,"intro",{"detected_userid":oiiNexus.USER_ID,"submitted_userid":uid,"condition":oiiNexus.CONDITION,"user_agent":ua});
    		if (uid!=oiiNexus.USER_ID) {
    			oiiNexus.USER_ID=uid;
    		}
    		var btn=$("<div></div>").attr("class","btn").text("Start").click(function() {
			$('#intro').hide();
			$("#intro2").hide();
	    		oiiNexus.nextSection();
    		});
    		$('#intro').html("<p><strong>Welcome!</strong></p>Thank you for agreeing to take part. For this study you will be shown a variety of visualizations and asked some questions about them.</p><p>Please read the instructions to the right and then click the start button below to begin.</p>").append(btn);
		//$("#minTime").text(oiiNexus.config.minTime/1000);
		//$("#maxTime").text(oiiNexus.config.maxTime/1000);
		
		$('#intro2').html("<p>Please try to answer as best you can, but do not worry if you cannot answer every question. For each correct answer, you will be paid a <strong>bonus of £0.05</strong>.</p><p>For each question, you can <strong>use your mouse to pan and zoom the visualization</strong>. Click and drag to move the visualization, and use the scroll wheel on your mouse to zoom.</p><p>For each question you will have a maximum of " + (oiiNexus.config.maxTime/1000) + " seconds in order to ensure you finish the study in a reasonable amount of time. In order to prevent undue rushing, each question requires you to take at least " + (oiiNexus.config.minTime/1000) + " seconds.</p></div><h1>Network diagrams</h1><div class=\"col1\"><p>The diagram on the right shows a migration network. In the example&mdash;and throughout the entire task&mdash;each <strong>node (circle)</strong> represents a country, and an <strong>edge (connection/line)</strong> between two countries indicates that a large number of people have moved between the two countries in the past.</p><p>In the example, there are five countries/nodes (A, B, C, D, and E). By looking at the diagram, we can see that people have moved between, for example, A & B, A & C, and A & E. However, not many people have moved between countries A & D (there is no edge).</p></div><div class=\"col2\"><img src=\"images/network_intro.svg\"></div>");
    		$("#intro2").show();
    		});
});


