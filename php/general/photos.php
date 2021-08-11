<?php

	$executionStartTime = microtime(true) / 1000;

	//$url ="https://serpapi.com/search.json?engine=google&q=" . $_REQUEST['place'] . "&google_domain=google.com&hl=en&tbm=isch&api_key=9857bf72198a7758691a19611aebf78912e0f5506068c2cf9afbd837da701b9b";
	$url ="http://api.scraperapi.com?api_key=695b77f5cf2bf40802a3053cb5cc04d6&url=https://en.wikipedia.org/wiki/" . $_REQUEST['place'];


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
	$output['data'] = $decode['suggested_searches'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?> 