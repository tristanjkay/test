<?php

	// Weather API - https://www.weatherapi.com/docs/
	// This API is given the selected countries name. The API then returns weather data from the capital of that country.

	$executionStartTime = microtime(true) / 1000;

    $url='http://api.weatherapi.com/v1/forecast.json?key=86e31af8f3084b5b9ed104335211903&q=' . $_REQUEST['country'] . '&days=7';

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
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>