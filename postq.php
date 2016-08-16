<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	include("db/functions.php");
	$userid=$_POST["userid"];
	$section="postq";
	$payload=json_encode($_POST);
	dblogger($userid,$section,$payload);
	//TODO Log to file if error?
	header("Location: $completitionURL");//TODO: UPDATE
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
});
</script>

<title>Post questionnaire</title>
</head>
<body>
<p>Thank you for completing our experiment.</p>
<p>We are really grateful for your time. If you could answer a few more questions about your background it would greatly help this academic study. Your answers to these questions will not affect your payment.</p>
<form action="postq.php" method="post">
<input type="hidden" name="userid" value="<?=$_GET["prolific_pid"]?>">
<dl>
	<dt>Gender</dt>
	<dd>
		<label><input type="radio" name="gender" value="male" required>Male</label><br/>
		<label><input type="radio" name="gender" value="female" required>Female</label><br/>
		<label><input type="radio" name="gender" value="other" required>Other</label><br/>
		<label><input type="radio" name="gender" value="pnts" required>Prefer not to say</label><br/>
	</dd>
	
	<dt>Age</dt>
	<dd>
		<label><input type="radio" name="age" value="0-18" required>0-18</label><br/>
		<label><input type="radio" name="age" value="19-25" required>19-25</label><br/>
		<label><input type="radio" name="age" value="26-35" required>26-35</label><br/>
		<label><input type="radio" name="age" value="36-45" required>36-45</label><br/>
		<label><input type="radio" name="age" value="45-55" required>46-55</label><br/>
		<label><input type="radio" name="age" value="56" required>56+</label><br/>
		<label><input type="radio" name="age" value="pnts" required>Prefer not to say</label><br/>
	</dd>

	<dt>How many years have you lived in the UK?
	<dd>
		Please enter 0 (zero) if you do not currently live in the UK.<br/>
		<input name="uk" size="3" type="number" min="0" step="any" required> years<br/>
		
		<!--<input type="checkbox" name="uk1">If you do not live in the UK...-->
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
		<label><input type="radio" name="netvis" value="yes" required>Yes</label><br/>
		<label><input type="radio" name="netvis" value="no" required>No</label><br/>
		<label><input type="radio" name="netvis" value="unsure" required>Unsure</label><br/>
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

<p>Thank you. After clicking "Finish" you will automatically be taken back to Prolific.ac</p>
<input type="submit" value="Finish" />
</form>
</body>
</html>

