<!DOCTYPE html>
<html>
<head>
    <title>Registration Page</title>
    <h1> Register for a new account </h1>
    <script src='../assets/angular.js'></script>
    <script src="../assets/RegisterPage.js"></script>
    <script src="//unpkg.com/angular-ui-router/release/angular-ui-router.min.js"> </script>
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'hello_world.css')}" type="text/css">
</head>

<body data-ng-app="registerApp" data-ng-controller="registerCtrl">

Username : <input class="input-field" data-ng-model="username" />
<br>
Password : <input class="input-field" data-ng-model="password_1"/>
<br>
Please re-enter your password.
<br>
Password : <input class="input-field" data-ng-model="password_2"/>
<br>

<div style="color: #cc0000">
    {{error_message}}
</div>

<br>
<button  data-ng-click="tryRegister()" > Register </button>

<p> already have an account? </p>

<button data-ng-click="toSignIn()"> sign in </button>
</body>
</html>