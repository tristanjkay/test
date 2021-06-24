<?php
	$epochTime = time();
	$executionStartTime = microtime(true) / 1000;

    $url='http://airlabs.co/api/v6/airports?api_key=a6e92fe4-2d6b-4456-b2b6-ec9c12e96a66&code=' . $_REQUEST['country'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['geonames'];
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output); 

?>