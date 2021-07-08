<?php

	$executionStartTime = microtime(true) / 1000;

    $url= $_REQUEST['article'];

	$result = file_get_contents($url);

	$decode = htmlspecialchars($result);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    $output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>