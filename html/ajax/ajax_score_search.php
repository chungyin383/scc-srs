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

$selectPart = 'SH.class, SH.schyear, ST.timeseq, ST.meaning,';

foreach ($_POST['subject'] as $subject){
	$subject = mysqli_real_escape_string($conn, $subject);
	if ($subject === 'avg'){
		$selectPart .= ($_POST['metric'] === 'score') ? 'S.avg AS avg,' : 'S.omf AS avg,';
	} else {										// other subjects
		$selectPart .= ($_POST['metric'] === 'score') ? "S.{$subject}_score AS `{$subject}`," : "S.{$subject}_omf AS `{$subject}`," ; 
	}
}

$wherePart = '';

foreach ($_POST["assessmentClass"] as $std_hist_id => $timeseq_arr) {
	foreach ($timeseq_arr as $timeseq => $value){
		$std_hist_id = mysqli_real_escape_string($conn, $std_hist_id);
		$timeseq = mysqli_real_escape_string($conn, $timeseq);
		$wherePart .= "(SH.std_hist_id = {$std_hist_id} AND S.timeseq = {$timeseq}) OR ";
	}
	
}

$selectPart = substr($selectPart, 0, -1); // remove the last comma
$wherePart = substr($wherePart, 0, -4); // remove the last ' OR '

$sql = "SELECT " . $selectPart . " FROM student_hist SH
			LEFT JOIN score S
			ON SH.std_hist_id = S.std_hist_id
			LEFT JOIN score_timeseq ST
			ON S.timeseq = ST.timeseq   
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