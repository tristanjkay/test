<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.travelpayouts.com/v2/prices/latest?currency=usd&page=1&limit=5&show_to_affiliates=true&destination=' . $_REQUEST['destination'],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'X-Access-Token: c45e086415e768417990780a85fa0a13',
    'Cookie: ab-live=false; marker_expires=30'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
$decode = json_decode($response,true);
$output = $decode['data'];

echo json_encode($output);
