<?php

$curl = curl_init();

curl_setopt_array($curl, [
	//CURLOPT_URL => "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=" . $_REQUEST['country'] . "&pageNumber=1&pageSize=10&autoCorrect=true",
	CURLOPT_URL => "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=Faro%20Las%20Coloradas&pageNumber=1&pageSize=10&autoCorrect=true",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: contextualwebsearch-websearch-v1.p.rapidapi.com",
		"x-rapidapi-key: 459184f5c5mshec4ad720a01f413p1b89c7jsn7258217e5ff6"
	],
]);

$result = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $result;
}
?>