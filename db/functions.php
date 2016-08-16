<?php
include(".config.php");

function dblogger ($userid, $section, $payload) {
	// Create connection
	global $servername,$username,$password,$dbname;
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
		throw new Exception('{"error":"Failed to connect to database: ' . $conn->connect_error . '"}');
	}

	$ip=$_SERVER["REMOTE_ADDR"];
	$datetime=new DateTime();
	$datetime=$datetime->getTimestamp();

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
