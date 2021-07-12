<?php

	$executionStartTime = microtime(true) / 1000;

	$url ="https://api.opentripmap.com/0.1/en/places/radius?apikey=5ae2e3f221c38a28845f05b6ba3b9f7c5108d831ebd99127fed1acbb&lang=en&radius=400&lon=" . $_REQUEST['lat'] . "&lat=" . $_REQUEST['lat'];
	

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
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?> 