<?php
header('Content-Typ‌​e: application/json');

include(".config.php");

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
	//JSON error message here
	print('{"error":"Failed to connect to database: ' . $conn->connect_error . '"}');
	die();
	//TODO: Log error / data to file?
}

//TODO: Add these variables to database
$ip=$_SERVER["REMOTE_ADDR"];
$datetime=new DateTime();
$datetime=$datetime->getTimestamp();

$user = $_POST["userid"];
$section = $_POST["section"];
$payload = $_POST["payload"];

// bind parameters and execute
$stmt = $conn->prepare("INSERT INTO logging (userid, section, payload) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $user, $section, $payload);

if (!$stmt->execute()) {
    print('{"error": "Execute failed: (' . $stmt->errno . ') ' . $stmt->error . '"}');
    die();
    //TODO: Log error / data to file?
}

$stmt->close();
$conn->close();

print('{"status":"OK"}');
#print(json_encode($_POST));
?>
