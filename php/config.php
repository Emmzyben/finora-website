<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'finora';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';
$APP_NAME = 'Finora API';
$JWT_TTL = 86400;

return [
    'db_host' => $DB_HOST,
    'db_name' => $DB_NAME,
    'db_user' => $DB_USER,
    'db_pass' => $DB_PASS,
    'app_name' => $APP_NAME,
    'jwt_ttl' => $JWT_TTL,
];
