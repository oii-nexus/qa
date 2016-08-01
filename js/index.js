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
    
    // !!variables are globals on purpose!!
    
    //data structures
    config = cf;      //object corresponding to config.json
  	section = '';     //current entry from config.section
  	currentQ =  {};   //current question - pushed onto questions when done
    questions = [];   //questions for current section - pushed onto track when section done
  	track =     {};   //log of all questions, actions and answers
    
    //useful functions 
    addButtons = function(answers) {  //append buttons to answer-var elmt
      $('#question-var').append('<br><br>');
      for (var a=0; a<answers.length; a++) {
        $('#question-var').append('<div class="btn answer">' + answers[a] + '</div>');
      }
      $('.answer').click( function() {
        mask.timer();
        currentQ.answer = $(this).html();
      });
    };
    mask = {
      data: function() {   //show mask - loading data message
        $('#mask').html('Please wait, loading data.').show();
      },
      timer: function() {  //show mask - wait for timer to finish message
        $('#mask').html('Please wait, the survey will continue when the timer runs out.').show();
      },
      off: function() {    //hide mask
        $('#mask').hide();
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
    
    //functions for stepping through questions and sections
    startQ = function(nextQ) {  //nextQ is func to get next question, it calls startQ ...
      mask.off();
      var $elapsed = $('#elapsed');
      function updateTimer(timeStarted) {
        $elapsed.width((Date.now() - timeStarted)/config.timeLimit*100 + '%');
      }  
      $elapsed.width('0%');
      var id = setInterval(updateTimer, 250, Date.now());
      setTimeout( function() {
        questions.push(currentQ);
        clearInterval(id);
        nextQ();
      }, config.timeLimit );
    }
    
    finishSection = function() {
      $('#graph-container').html('');
      track[section.name] = {section: section, questions: questions}; //log section results
      //push data here???
      nextSection();
    };
    
    nextSection = function() { //global
      questions = [];
      $('#question, #mask').hide();     
      if (config.section.length === 0) {
        $('#instruc-text').html('Finished, thank you, show code.');
        $('#start').hide();
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
    nextSection();  //start first section 
      
  });
})


