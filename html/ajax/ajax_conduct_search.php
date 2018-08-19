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

/* construct the sql dynamically based on POST variable submitted */

$wherePart = '';

foreach ($_POST["conductClass"] as $std_hist_id => $timeseq_arr) {
	foreach ($timeseq_arr as $timeseq => $value){
		$std_hist_id = mysqli_real_escape_string($conn, $std_hist_id);
		$timeseq = mysqli_real_escape_string($conn, $timeseq);
		$wherePart .= "(SH.std_hist_id = {$std_hist_id} AND C.timeseq = {$timeseq}) OR ";
	}
	
}

$wherePart = substr($wherePart, 0, -4); // remove the last ' OR '

$sql = "SELECT SH.class, SH.schyear, CT.timeseq, CT.meaning, C.conduct
		FROM student_hist SH
		LEFT JOIN conduct C
		ON SH.std_hist_id = C.std_hist_id
		LEFT JOIN conduct_timeseq CT
		ON C.timeseq = CT.timeseq   
		WHERE " . $wherePart . " ORDER BY schyear, timeseq";

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