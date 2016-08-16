<?php
header('Content-Typ‌​e: application/json');

include("functions.php");

//$ip=$_SERVER["REMOTE_ADDR"];
$userid = $_POST["userid"];
$section = $_POST["section"];
$payload = $_POST["payload"];

try {
	if (dblogger($userid,$section,$payload)!==true) {
		throw new Exception('{"status":"Unknown error"}');
	}
} catch (Exception $e) {
	//TODO: Log exception / data to file?
	print($e->getMessage());
	die();
}
print('{"status":"OK"}');
?>
