<?php

	$executionStartTime = microtime(true) / 1000;

    $url='https://raw.githubusercontent.com/tristanjkay/gazetteer-files/main/countryBorders.geo.json';

	$result = file_get_contents($url);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    $output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>