<?php
$post_data = json_decode(file_get_contents('php://input'), true);
$file = uniqid("subject-");
// the directory "data" must be writable by the server
$name = "kumidata/sensibility-2023/{$file}.json";
$data = $post_data['filedata'];
// write the file to disk
file_put_contents($name, $data);
?>
