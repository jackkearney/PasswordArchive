<!DOCTYPE html>
<html>
	<head>
		<h1> Welcome to the Hello, World! Password Manager</h1>
        <link rel="stylesheet" href="${resource(dir: 'css', file: 'hello_world.css')}" type="text/css">
    </head>

	<body>
    <g:form url="[controller:'hello',action:'tryLogIn']">
		<p> Please sign in: </p>
        Username: <g:textField class="input-field" name="username" value=""/>
        <br>
        Password: <g:passwordField class="input-field" name="password" value=""/>
        <br>

        <div style="color: #cc0000">
            ${errmsg}
        </div>

        <g:actionSubmit value="Log in" action="tryLogIn"/>

    </g:form>
		<p> Don't have an account? </p>

    <g:link action="register">
        <g:field type="button" name="goto register page" value="register"/>
    </g:link>
	</body>
</html>
