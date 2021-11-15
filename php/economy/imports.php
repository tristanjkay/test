<?php
// This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
require_once 'HTTP/Request2.php';

$request = new Http_Request2('https://api.wto.org/timeseries/v1/data');
$url = $request->getUrl();

$headers = array(
    // Request headers
    'Ocp-Apim-Subscription-Key' => '71e13c8a8030440e814fe17043f74a47',
);

$request->setHeader($headers);

$parameters = array(
    'i' => 'ITS_MTV_AM',
    'r' => '036',
    'fmt' => 'json',
    'mode' => 'full',
    'lang' => '1',
    'meta' => 'true',
);

$url->setQueryVariables($parameters);

$request->setMethod(HTTP_Request2::METHOD_GET);

// Request body
$request->setBody("{body}");

try
{
    $response = $request->send();
    echo $response->getBody();
}
catch (HttpException $ex)
{
    echo $ex;
}

?>