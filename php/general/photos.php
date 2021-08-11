<?php

	$executionStartTime = microtime(true) / 1000;

	//$url ="https://serpapi.com/search.json?engine=google&q=" . $_REQUEST['place'] . "&google_domain=google.com&hl=en&tbm=isch&api_key=9857bf72198a7758691a19611aebf78912e0f5506068c2cf9afbd837da701b9b";
	//$url ="http://api.scraperapi.com?api_key=695b77f5cf2bf40802a3053cb5cc04d6&url=https://en.wikipedia.org/wiki/" . $_REQUEST['place'];
	$url = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=taylor%20swift&pageNumber=1&pageSize=10&autoCorrect=true";


	$ch = curl_init();
	curl_setopt_array($ch, [
		CURLOPT_URL => "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=taylor%20swift&pageNumber=1&pageSize=10&autoCorrect=true",
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "GET",
		CURLOPT_HTTPHEADER => [
			"x-rapidapi-host: contextualwebsearch-websearch-v1.p.rapidapi.com",
			"x-rapidapi-key: {x-rapidapi-key}"
		],
	]);
	

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