<%--
  Created by IntelliJ IDEA.
  User: jkearney
  Date: 5/22/2017
  Time: 12:57 PM
--%>

<html>
<head>
    <script type="text/javascript">
        <g:i18n_setup/>
    </script>

    <script src='../js/angular.js'></script>
    <script src='../js/main.js'></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <script src="//unpkg.com/angular-ui-router/release/angular-ui-router.min.js"> </script>
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'hello_world.css')}" type="text/css">

</head>



<body data-ng-app="myApp" data-ng-controller="myCtrl">
<div class="center-block">
        <ui-view>
            <p> Oh no... Where's that page?</p>
        </ui-view>
</div>
</body>
</html>