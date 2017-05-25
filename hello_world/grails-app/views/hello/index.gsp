<%--
  Created by IntelliJ IDEA.
  User: jkearney
  Date: 5/22/2017
  Time: 12:57 PM
--%>

<html>
<head>
    <script src='../assets/angular.js'></script>
    <script src="../assets/main.js"></script>
    <script src="//unpkg.com/angular-ui-router/release/angular-ui-router.min.js"> </script>
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'table.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'hello_world.css')}" type="text/css">
</head>

<body data-ng-app="myApp" data-ng-controller="myCtrl">
<ui-view>
    {{data}}
    <h1> Sign in to your account </h1>
    <form>
        Username : <input class="input-field" data-ng-model="username" maxlength="10"/>
        <br>
        Password : <input type="password" class="input-field" data-ng-model="password_1" maxlength="10"/>
        <br>
        <button ng-disabled="password.length < 4 || username.length < 4" data-ng-click="trySignIn()" > Sign In </button>
    </form>
    <div style="color: #cc0000">
        {{error_message}}
    </div>
    <p> don't have an account? </p>
    <button ui-sref="reg">Register </button>

</ui-view>
</body>
</html>