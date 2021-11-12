<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://google-flights-search.p.rapidapi.com/search?departure_airport_code=SFO&arrival_airport_code=LAX",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: google-flights-search.p.rapidapi.com",
		"x-rapidapi-key: 459184f5c5mshec4ad720a01f413p1b89c7jsn7258217e5ff6"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}