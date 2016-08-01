//callback for chooseFavorite button test section
$(function(){
  
  // IN PROPER SECTIONS, LOAD DATA AND PUT EVERYTHING INSIDE CALLBACK: 
  // $.get(section.data, function(data) {
  
    $('#question-text').html(section.question);
    mask.off();
   
    var targets = shuffle.array(['red','blue','green','orange','pink','yellow']).slice(0,section.rep),
        t;
  
    nextQ = function() {
      if (targets.length > 0) { //not finished questions in this section
        t = targets.shift();                    //pop new target answer off front of tagets array
        currentQ = {target: t, action: []};     //set up log for new question
        $('#question-var').html(t);             //show new question
        addButtons(['red','blue','neither']);   //show answer buttons
        startQ(nextQ);  //ask new question - startQ will call nextQ ...
      }
      else  finishSection();
    }
    nextQ(); //ask first question

});