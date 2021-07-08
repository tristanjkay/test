<?php
	//TODO: Get Latest Date Dynamically
	$executionStartTime = microtime(true) / 1000;

    $url='http://newsapi.org/v2/everything?q=' . $_REQUEST['country'] . '&from=' . $_REQUEST['date'] . &sortBy=publishedAt&apiKey=f6c3d2f0f0bd4b27860fb2d9fc938d75';

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