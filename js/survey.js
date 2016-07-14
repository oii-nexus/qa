


















;(function(L2_main){L2.aux.onLoad(L2_main)}(function() {


  userLog = {question:[]}; //global, track user id, actions and answers


  var L2_hide = (function(L2_elmts) { if (L2_elmts instanceof L2.Ar) L2_elmts = L2_elmts.v[0]; return L2_elmts._html_.setGen(['setStyle','display','none'])});
  var L2_block = (function(L2_elmts) { if (L2_elmts instanceof L2.Ar) L2_elmts = L2_elmts.v[0]; return L2_elmts._html_.setGen(['setStyle','display','block'])});
  var L2_inlineBlock = (function(L2_elmts) { if (L2_elmts instanceof L2.Ar) L2_elmts = L2_elmts.v[0]; return L2_elmts._html_.setGen(['setStyle','display','inline-block'])});
  var L2_innerHTML = (function(L2_elmts,L2_content) { if (L2_elmts instanceof L2.Ar) L2_elmts = L2_elmts.v[0]; if (L2_content instanceof L2.Ar) L2_content = L2_content.v[0]; return L2_elmts._html_.setGen(['setProp','innerHTML',L2_content])});

  ;(function(L2_gotConfig){L2.aux.ajaxGet('config.json',L2_gotConfig,"","")}(function(L2_Config) { if (!(L2_Config instanceof L2.Ar)) L2_Config = new L2.ArJSA([L2_Config]);

    L2_Config = L2.aux.fromJSON(L2_Config.v[0]);
    var L2_Question = L2.sc.unwrap(L2_Config._dEnt("question"))["shuf"]("r");
    var L2_timeLimit = L2_Config._dEnt("timeLimit");
    var L2_elapsedElm = L2.html(document.querySelectorAll('#elapsed'));

    var L2_submitID = function() {

  	  userLog.id = document.getElementById('userid').value

      L2.sca(L2_hide(L2.html(document.querySelectorAll('#intro'))));
      L2.sca(L2_innerHTML(L2.html(document.querySelectorAll('#instruc-text')),(L2.sc._dEnt(L2_Config._dEnt("instruc"),"preMap"))));
      L2.sca(L2_block(L2.html(document.querySelectorAll('#instruc')))); };
    L2.html(document.querySelectorAll('#id-submit'))._html_.on('click',L2_submitID);

    ;(function(L2_pressEnter){L2.html(document.querySelectorAll('#user-id'))._html_.on('keydown',L2_pressEnter)}(function(L2_evt) { if (L2_evt instanceof L2.Ar) L2_evt = L2_evt.v[0];
      if ((L2.aux.basicType(L2_evt._event_['code'])==='Enter')) {
        L2.sca(L2_submitID());
        L2_evt._event_.stop();
 } }));
    ;(function(L2_startMapQ){L2.html(document.querySelectorAll('#start'))._html_.on('click',L2_startMapQ)}(function() {
      L2.sca(L2_hide(L2.html(document.querySelectorAll('#instruc'))));
      L2.sca(L2_block(L2.html(document.querySelectorAll('#question'))));
      L2.sca(L2_loadQuestion());
 }));
    var L2_loadQuestion = function() {
      var L2_ThisQ = L2.sc.unwrap(L2_Question._oneDimSc("r",((-(1))),'cut').v[0]);
      L2.sca(L2_innerHTML(L2.html(document.querySelectorAll('#question-text')),(L2_ThisQ._dEnt("text"))));
      L2.sca(L2_inlineBlock(L2.html(document.querySelectorAll('#submit-answer'))));

      question(L2.toJS(L2_ThisQ));  //show queston - see question.js

      L2_elapsedElm._html_.setGen(['setStyle','width','0%']);
      (function() {var cancel = setTimeout(L2.assert.func((function() {var cancel = setInterval(L2.assert.func(L2_updateTimer),(1000),((new Date()).getTime()));return function() {clearInterval(cancel)}}())),L2_timeLimit);return function() {clearTimeout(cancel)}}());
      ;(function(L2_endSurvey){(function() {var cancel = setTimeout(L2.assert.func(((L2_Question.r===(0)) ? L2_endSurvey : L2_loadQuestion)),L2_timeLimit);return function() {clearTimeout(cancel)}}())}(function() {
        L2.sca(L2_innerHTML(L2.html(document.querySelectorAll('#graph-container')),''));
        L2.sca(L2_hide(L2.html(document.querySelectorAll('#question'))));
        L2.sca(L2_block(L2.html(document.querySelectorAll('#finished'))));
 })); };
    ;(function(L2_closeQuestion){L2.html(document.querySelectorAll('#submit-answer'))._html_.on('click',L2_closeQuestion)}(function(L2_evt) { if (L2_evt instanceof L2.Ar) L2_evt = L2_evt.v[0];
      L2.sca(L2_hide(L2.html([L2_evt._event_.currentTarget])._html_.checkElmt()));
      L2.sca(L2_innerHTML(L2.html(document.querySelectorAll('#question-text')),'Please wait until the timer runs out.'));
      L2.sca(L2_innerHTML(L2.html(document.querySelectorAll('#graph-container')),''));
 }));
    var L2_updateTimer = function(L2_timeStarted) { if (L2_timeStarted instanceof L2.Ar) L2_timeStarted = L2_timeStarted.v[0];
      L2_elapsedElm._html_.setGen(['setStyle','width',((((((new Date()).getTime()-L2_timeStarted)/L2_timeLimit)*(100))+'%'))]);





 }; })); }));