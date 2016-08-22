<?php
//TODO Добавить работу с базой данных
//Симуляция сложных вычислений и работы =)
$database = file_get_contents('users.json');
$users = json_decode($database);
$json = json_encode($users);
echo $json;