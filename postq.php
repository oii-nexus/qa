<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	include("db/functions.php");
	$userid=$_POST["userid"];
	$section="postq";
	$payload=json_encode($_POST);
	dblogger($userid,$section,$payload);
	header("Location: $completitionURL");
	exit;
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="Pragma" content="no-cache">

<link rel="stylesheet" href="css/vas.css" type="text/css" media="screen" />
<style type="text/css">
dl {
	margin-left: 15px;
}
dt {
	margin-top: 30px;
	margin-bottom: 10px;
}

a.reset {
	display: none;
}

a.selected, :checked+span {
	font-weight: bold;
	color: #009900;
}

input:valid[type=text], input:valid[type=number] {
	outline: #009900 solid thin;
}
</style>

<script src="js/jquery-2.2.2.min.js"></script>
<script language="javascript">
$(function(){
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
	
});
</script>

<title>Post questionnaire</title>
</head>
<body>
<p>Thank you for completing our experiment.</p>
<p>We are really grateful for your time. If you could answer a few more questions about your background it would greatly help this academic study.</p>
<form action="postq.php" method="post">
<input type="hidden" name="userid" value="<?=$_GET["prolific_pid"]?>">
<dl>
	<dt>Gender</dt>
	<dd>
		<label><input type="radio" name="gender" value="male" required><span>Male</span></label><br/>
		<label><input type="radio" name="gender" value="female" required><span>Female</span></label><br/>
		<label><input type="radio" name="gender" value="other" required><span>Other</span></label><br/>
		<label><input type="radio" name="gender" value="pnts" required><span>Prefer not to say</span></label>
	</dd>
	
	<dt>Age</dt>
	<dd>
		<label><input type="radio" name="age" value="0-18" required><span>0-18</span></label><br/>
		<label><input type="radio" name="age" value="19-25" required><span>19-25</span></label><br/>
		<label><input type="radio" name="age" value="26-35" required><span>26-35</span></label><br/>
		<label><input type="radio" name="age" value="36-45" required><span>36-45</span></label><br/>
		<label><input type="radio" name="age" value="45-55" required><span>46-55</span></label><br/>
		<label><input type="radio" name="age" value="56+" required><span>56+</span></label><br/>
		<label><input type="radio" name="age" value="pnts" required><span>Prefer not to say</span></label>
	</dd>
	
	<dt>Where do you live in the UK?</dt>
	<dd>
		Please enter the first three letters/numbers of your postcode (e.g., OX1).<br/>
		<input name="location" size="3" type="text" required><a href="javascript:void(0)" class="reset" data-target="location">(reset)</a><br/>
		<a href="javascript:void(0)" class="autofill" data-target="location" data-value="notuk">I do not live in the UK.</a><br/>
		<a href="javascript:void(0)" class="autofill" data-target="location" data-value="pnts">I prefer not to say.</a>
	</dd>

	<dt>How many years have you lived in the UK?
	<dd>
		<input name="uk" size="3" type="number" min="0" step="any" required> years
			<span class="label">&nbsp;</span> <a href="javascript:void(0)" class="reset" data-target="location">(reset)</a><br/>
		<a href="javascript:void(0)" class="autofill" data-target="uk" data-value="notuk">I do not live in the UK</a><br/>
		<a href="javascript:void(0)" class="autofill" data-target="uk" data-value="pnts">I prefer not to say</a>
	</dd>
	
	<dt>How familiar you feel you are with UK geography?</dt>
	<dd>Please click on the line at the point that best reflects your answer.<br/>
		<div class="vas">
			<div class="vas-label">Not at all familiar</div>
			<div class="vas-scale">
				<div class="vas-line"></div>
				<div class="vas-dot"></div>
				<input type="hidden" name="ukgeo" value="NA">
			</div>
			<div class="vas-label">Extremely familiar</div>
		</div>
	</dd>
	
	<dt>Have you previously seen network visualizations?</dt>
	<dd>
		<label><input type="radio" name="netvis" value="yes" required><span>Yes</span></label><br/>
		<label><input type="radio" name="netvis" value="no" required><span>No</span></label><br/>
		<label><input type="radio" name="netvis" value="unsure" required><span>Unsure</span></label>
	</dd>

	<dt>How good do you feel you are at reading network visualizations?</dt>
	<dd>Please click on the line at the point that best reflects your answer.<br/>
	
		<div class="vas">
			<div class="vas-label">Poor</div>
			<div class="vas-scale">
				<div class="vas-line"></div>
				<div class="vas-dot"></div>
				<input type="hidden" name="netvis2" value="NA">
			</div>
			<div class="vas-label">Excellent</div>
		</div>
	</dd>
	
	<dt>How good you do feel you are at reading maps?</dt>
	<dd>Please click on the line at the point that best reflects your answer.</br>
		<div class="vas">
			<div class="vas-label">Poor</div>
			<div class="vas-scale">
				<div class="vas-line"></div>
				<div class="vas-dot"></div>
				<input type="hidden" name="maps" value="NA">
			</div>
			<div class="vas-label">Excellent</div>
		</div>
	</dd>

	<dt>Is there anything else you would like to share with us? (optional)</dt>
	<dd>
		<textarea name="other" cols=100 rows=25></textarea>
	</dd>
</dl>

<p>Thank you. After clicking "Finish" you will automatically be taken back to Prolific.ac. Your bonus will be paid within one week.</p>
<input type="submit" value="Finish" />
</form>
</body>
</html>

