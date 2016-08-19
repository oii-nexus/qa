// ----- NOTES -----
//
//CHANGES:
//-switched to js/jQ - faff coordinating between L2 and JS
//-load script and data for each section when required
//
//NOTES:
//-sections in config file: name must be a script in js folder
//-want width and height of graph area 100%? - I think was reduced to stop flickering scrollbars?
//-haven't done anything for different screen sizes or mobile
//-need zoom btns on map or networks - even laptop users may want them
//-prevent text selection if gets annoying - eg if text selected when pan/zoom network
//-fix mask to cover full page - currently if scroll down, mask does not stretch to btm
//-should signal to user that starting new question when timer finishes - include small delay?
//-slow panning and zooming in sigma since added tracking?
//-currently no code to send results to server - shold do this after each section

$(function(){
  
  $.get('config.json', function(cf) {
  
    
    getQueryStringValue = function(key) {  
	return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
    }
    
	// !!variables are globals on purpose!!
    
	//data structures
	config = cf;      //object corresponding to config.json
	section = '';     //current entry from config.section
	currentQ =  {};   //current question - pushed onto questions when done
	questions = [];   //questions for current section - pushed onto track when section done
	track =     {};   //log of all questions, actions and answers
	USER_ID = getQueryStringValue("prolific_pid");
	
	
	TRAIN_DATA="{}"; //Data of the train network used in the main sections
	CONDITION=""; //Experimental condition

	//Randomize condition
	var r=Math.random();
	if (r<0.33) {
		CONDITION="geo";
	} else if (r < 0.66) {
		CONDITION="pseudo-geo";
	} else {
		CONDITION="fr";
	}
	console.log(CONDITION);
	
	//Load main setection data
	$.get(config.mainData, function(data) {
		TRAIN_DATA=data;
		console.log("Train data loaded");
		console.log(TRAIN_DATA);
	});
    
	//useful functions
	recordAnswer = function(ans) {
		if (timeoutId) clearTimeout(timeoutId);
		currentQ.answer = ans;
		currentQ.endTime=Date.now();
		questions.push(currentQ);
		if (currentQ.endTime-currentQ.startTime<config.minTime) {
			mask.timer();
			setTimeout(function() {
				if (timerId) clearInterval(timerId);
				mask.newq();
			 },config.minTime-(Date.now()-currentQ.startTime));
		} else {
			//Bad design - repeat code
			if (timerId) clearInterval(timerId);
			mask.newq();
		}
	};
    
    addButtons = function(answers) {  //append buttons to answer-var elmt
      $('#question-var').append('<br><br>');
      for (var a=0; a<answers.length; a++) {
        $('#question-var').append('<div class="btn answer">' + answers[a] + '</div>');
      }
      $('.answer').click( function() {
        recordAnswer($(this).html());
      });
    };
    mask = {
      nextQ: function(){},
      data: function() {   //show mask - loading data message
        $('#mask').html('Please wait, loading data.').show();
      },
      timer: function() {  //show mask - wait for timer to finish message
        $('#mask').html('Please wait, the survey will continue after the minimum time of ' + (config.minTime/1000) + ' seconds.').show();
      },
      newq: function() {
      	$('#mask').append('<br/><br/><strong>Ready for the next question? Please click anywhere to continue.</strong>').show().click(function() {
	        	$("#mask").off();//Remove the event handler
	        	mask.off(); //Blank and hide the mask
     	   	mask.nextQ();
        	});
      },
      off: function() {    //hide mask
        $('#mask').html("").hide();
      }
    };
    shuffle = {             
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
        return shuffle.index(v.length).map(function(x) {return v[x]}); 
      }
    };
    
    updateTimer=function (timeStarted) {
        $("#elapsed").width((Date.now() - timeStarted)/config.maxTime*100 + '%');
    };
    var timerId,timeoutId;
    //functions for stepping through questions and sections
    startQ = function(nextQ) {  //nextQ is func to get next question, it calls startQ ...
      mask.off();
      mask.nextQ=nextQ;
      var elapsed = $('#elapsed');
      elapsed.width('0');
      timerId = setInterval(updateTimer, 250, Date.now());
      timeoutId=setTimeout( function() {
        recordAnswer("TIMEOUT");
      }, config.maxTime );
      currentQ.startTime=Date.now();
    }
    
    finishSection = function() {
      $('#graph-container').html('');
      //track[section.name] = {section: section, questions: questions}; //log section results
      //Send data for section to server
      dblogger(USER_ID,section.name,questions);
      nextSection();
    };
    
    nextSection = function() { //global
      questions = [];
      $('#question, #mask').hide();     
      if (config.section.length === 0) {
        //$('#instruc-text').html('Finished, thank you, show code.');
        //$('#start').hide();
        window.location.href = "postq.php?prolific_pid="+USER_ID;
      }
      else {
        section = config.section.shift();  //global
        $('#instruc-text').html(section.instruc);
      }
      $('#instruc').show();
    };
    $('#start').click( function() {
      mask.data();
      $('#instruc').hide();
      $('#question').show();
      $.getScript('js/' + section.name + '.js');
    });
    //nextSection();  //start first section 

	//Function to send data to server for storage in database
     dblogger = function(userid,section,payload) {
     	var params={
     		"userid":userid,
     		"section":section,
     		"payload":JSON.stringify(payload)
     	};
     	console.log("Sending data");
     	console.log(params);
     	//jQuery.getJSON("db/log.php", params, function(resp) {
     	//	console.log(resp);
     	//});
     	$.ajax({
                url : 'db/log.php',
                type: 'POST',
                data: params,
                success: function(resp) {
                	console.log(resp);
                }
          });
     };
    
    //Get userid
     $('#intro').show();
	$("#userid").val(USER_ID);
    	$("#introbtn").click(function() {
    		//LOG
    		var uid=$("#userid").val();
		//Log on server
		dblogger(uid,"intro",{"detected_userid":USER_ID,"submitted_userid":uid});
    		if (uid!=USER_ID) {
    			USER_ID=uid;
    		}
    		var btn=$("<div></div>").attr("class","btn").text("Start").click(function() {
			$('#intro').hide();
	    		nextSection();
    		});
    		$('#intro').html("<p>Welcome!</p>Thank you for agreeing to take part. For this study you will be shown a variety of visualizations and asked some questions about them.</p><p>Please try to answer as best you can, but do not worry if you cannot answer every question. For each correct answer, you will be paid a <strong>bonus of £X.XX</strong>.</p><p>For each question, you can <strong>use your mouse to pan and zoom</strong>. Click and drag to move the visualization, and use the scroll wheel on your mouse to zoom.</p><p>Finally, for each question you will have a maximum of " + (config.maxTime/1000) + " seconds in order to ensure you finish the study in a reasonable amount of time. In order to prevent undue rushing, each question requires you to take at least " + (config.minTime/1000) + " seconds.</p><p>Please click the start button below to begin.</p>" ).append(btn);
    		});
    	
      
  });
})


