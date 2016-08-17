<?php
include(".config.php");

function dblogger($userid,$section,$payload) {
	$ip=$_SERVER["REMOTE_ADDR"];
	$datetime=new DateTime();
	$datetime=$datetime->getTimestamp();
	try {
		if (_dblogger($userid,$section,$ip,$datetime,$payload)!==true) {
			throw new Exception('{"status":"Unknown error"}');
		}
	} catch (Exception $e) {	
		//Write data to file
		global $fallback_path,$error_path;

		//fopen will only raise an E_WARNING and fail silently
		$fh=fopen($fallback_path,"a");
		fwrite($fh,"$userid\t$section\t$ip\t$datetime\t$payload\n");
		fclose($fh);
			
		$fh2=fopen($error_path,"a");
		fwrite($fh2,$e->getMessage()."\n");
		fclose($fh2);

		throw $e;
	}
	return true;
}

function _dblogger ($userid, $section, $ip, $datetime, $payload) {
	// Create connection
	global $servername,$username,$password,$dbname;
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
		throw new Exception('{"error":"Failed to connect to database: ' . $conn->connect_error . '"}');
	}

	// bind parameters and execute
	$stmt = $conn->prepare("INSERT INTO logging (userid, section, ip, datetime, payload) VALUES (?, ?, ?, ?, ?)");
	$stmt->bind_param("sssis", $userid, $section, $ip, $datetime, $payload);

	if (!$stmt->execute()) {
		throw new Exception('{"error": "Execute failed: (' . $stmt->errno . ') ' . $stmt->error . '"}');
	}

	$stmt->close();
	$conn->close();
	return true;
}
?>
