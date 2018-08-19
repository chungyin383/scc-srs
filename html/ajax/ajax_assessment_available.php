<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
include('../../inc/dbinfo.inc');

/* Connect to MySQL and select the database. */
$conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD);
if (mysqli_connect_errno()) echo "Failed to connect to MySQL: " . mysqli_connect_error();
$database = mysqli_select_db($conn, DB_DATABASE);
mysqli_set_charset($conn, "utf8");

header('Content-Type: application/json; charset=UTF-8');

/* get assessment list from database */
$sql = "SELECT * FROM score_timeseq";

$stmt = $conn->prepare($sql);
if($stmt === false) {
	trigger_error(' Error: ' . $conn->errno . ' ' . $conn->error, E_USER_ERROR);
}

$stmt->execute();
$result = $stmt->get_result();

$data = array();
while ( $row = $result->fetch_assoc() ){
    $data[] = $row;
}

echo json_encode( $data );
$conn->close();

?>