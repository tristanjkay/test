<?php

	$executionStartTime = microtime(true) / 1000;

	$url ="https://api.tomtom.com/search/2/categorySearch/tourist+attraction.json?key=HgoXvjsElSIjqwNjk4tGjAU2tDD7cVZv&lat=" . $_REQUEST['lat'] . "&lon=" . $_REQUEST['long'];
	

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