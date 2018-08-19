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

/* Search students based on the user input form */
$sql = "SELECT 
			RN.regno,
			RN.chname,
			RN.enname,
			RN.sex,
			SH.class,
			SH.classno
		FROM reg_no RN
		LEFT JOIN student_hist SH
			ON RN.regno = SH.regno
		WHERE 
			IF (? = '', TRUE, RN.regno = ?)
			AND IF (? = '', TRUE, RN.chname LIKE CONCAT('%', ?, '%'))
			AND IF (? = '', TRUE, RN.enname LIKE CONCAT('%', ?, '%'))
			AND IF (? = '', TRUE, SH.class = ?)
			AND IF (? = '', TRUE, SH.classno = ?)
			AND SH.schyear = ?
		ORDER BY
			SH.class, SH.classno
		";
$stmt = $conn->prepare($sql);
if($stmt === false) {
	trigger_error(' Error: ' . $conn->errno . ' ' . $conn->error, E_USER_ERROR);
}

$stmt->bind_param("iissssssiii", $_POST['regno'], $_POST['regno'], $_POST['chname'], $_POST['chname'], $_POST['enname'], $_POST['enname'], $_POST['class'], $_POST['class'], $_POST['classno'], $_POST['classno'], $_POST['curYear']);
$stmt->execute();
$result = $stmt->get_result();

$data = array();
while ( $row = $result->fetch_assoc() ){
    $data[] = $row;
}

echo json_encode( $data );
$conn->close();

?>