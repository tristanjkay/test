<?php

	$executionStartTime = microtime(true) / 1000;

	$url ='https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=' . $_REQUEST['ref'] . '&key=AIzaSyBueIu23lPtas0qJpu5hjdpe4nkYE_nnoo';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?> 