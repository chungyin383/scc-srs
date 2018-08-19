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
$sql = '';
foreach($_POST['code'] as $code){
	$codeEscaped = mysqli_real_escape_string($conn, $code);
	if ($codeEscaped === 'avg'){
		$sql .= 'COUNT(S.omf) AS `avg`,';
	} else {
		$sql .= 'COUNT(S.' . $codeEscaped . '_omf) AS `' . $codeEscaped . '`,';
	}
}
$sql = substr($sql, 0, -1); // remove the last comma

$sql = "SELECT " . $sql . "FROM score S
		LEFT JOIN student_hist SH
		ON S.std_hist_id = SH.std_hist_id
		LEFT JOIN reg_no RN
		ON SH.regno = RN.regno
		WHERE RN.regno = ?;
		";
$stmt = $conn->prepare($sql);
if($stmt === false) {
	trigger_error(' Error: ' . $conn->errno . ' ' . $conn->error, E_USER_ERROR);
}

$stmt->bind_param("i", $_POST['regno']);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode( $row );
$conn->close();

?>