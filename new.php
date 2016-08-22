<?php
class User
{
    public $id;
    public $username;
    public $role;
    public $email;
    public $active;
}
if (isset($_GET))
{
    if ((isset($_GET['username']) && (isset($_GET['role'])) && (isset($_GET['email'])) && (isset($_GET['active']))))
    {
        $status = "ok";
        $new_user = new User();
        $new_user->id =  time();
        $new_user->username = $_GET['username'];
        $new_user->email = $_GET['email'];
        $new_user->role = $_GET['role'];
        $new_user->active = $_GET['active'];
//        var_dump($new_user);
    }
    else
    {
        $status = "error";
    }
//    echo $status;
}
$database = file_get_contents('users.json');
$users = json_decode($database);
array_push($users->users, $new_user);
//var_dump($users);
//var_dump($users->users[0]);
$json = json_encode($users);
//var_dump($json);
file_put_contents('users.json', $json);
?>
{"status": "<?= $status ?>", "id": "<?= $new_user->id ?>"}