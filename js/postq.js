"use strict";

;(function(){
	if (typeof oiiNexus === 'undefined')
		throw 'oiiNexus is not declared';

	//callback for postq section
	oiiNexus.postq = {
		 "name": "postq",
		 "instruc": "",
		 "instruc2": "",
		 "execute": function(){
		 	$("#postq").show()
		 	$("#postq form").prepend('<input type="hidden" name="userid" value="' + oiiNexus.USER_ID + '">');
		 	
			$(".vas-scale").click(function(e) {
				var posX = $(this).offset().left, posY = $(this).offset().top;
				var val=e.pageX - posX;
				//console.log(x);
				$(this).children("input").val(val);
				$(this).children(".vas-dot").show().css({"margin-left":val});
		
			});
	
			$(".autofill").click(function() {
				var element=$(this);
				var parent=element.parent();
				parent.children("input[type!=hidden]").prop("required",false).prop("disabled",true).val("");
				var hinput=parent.children("input[type=hidden]");
				console.log(hinput);
				if (hinput.length===0) {
					hinput=$('<input type="hidden"></input>').attr("name",element.data("target")).appendTo(parent);
				}
				hinput.val(element.data("value"));
				element.siblings(".autofill").removeClass("selected")
				parent.children(".reset").show();
				element.addClass("selected");
			});
	
			$(".reset").click(function() {
				var element=$(this);
				var parent=element.parent();
				parent.children("input[type=hidden]").remove();
				parent.children(".autofill").removeClass("selected");
				parent.children(".reset").hide();
				parent.children("input").prop("required",true).prop("disabled",false);	
			});
	
		}
  	};
})();
