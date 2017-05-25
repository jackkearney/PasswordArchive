<!DOCTYPE html>
<html>
<head>
    <script src='../assets/jquery-3.2.1.min.js'></script>
    <link rel='stylesheet' href='${resource(dir: 'css', file: 'hello_world.css')}' type='text/css'>
    <script>
        var editLinkGrails = '${createLink(controller: 'Hello', action: 'ajaxEditPassword')}';
        var removeLinkGrails = '${createLink(controller: 'Hello', action: 'ajaxRemovePassword')}';
        var postLinkGrails = '${createLink(controller: 'Hello', action: 'ajaxAddPassword')}';
    </script>
    <script src='../assets/HandlePasswords.js'></script>

</head>

<body >
<b> Password Archive: </b>

<div id='entry'>
    <table frame='border' rules='all' cellpadding='5' align='left' id='pass-table'>
        <div >
        <tr>
            <th> Account Name </th>
            <th> Password </th>
        </tr>
        <div >
            <g:each in='${passList}' var='pass'>

                    <tr id='${pass.id}'>
                            <td> <input id='${pass.id}-name' style='border:0' name='accountName' value='${pass.accountName}' readonly='readonly' /> </td>
                            <td> <input id='${pass.id}-pass' style='border:0' name='password' value='${pass.password}' readonly='readonly' /> </td>

                            <td> <button id='${pass.id}-edit' onclick='enableEditAccount(${pass.id})' > edit </button> </td>
                            <td> <button onclick='removeAccount(${pass.id})'> remove </button> </td>
                    </tr>
            </g:each>
        </div>
        </div>
        <div>
            <tr>
                <td> Account Name: <input id='accountName-input' value='' style='width:130px'/> </td>
                <td> Password: <input id='password-input' value=''/> </td>
                <td> <button type='button' onclick='addAccount()'> add new </button> </td>
            </tr>
        </div>
    </table>
</div>

<div style='clear:both'> </div>
<div id="errmsg" style="color:red"> </div>
<div class='entry after-table' >
    <br>
    <g:link action='logout'>
        <g:field type='button' name='logout button' value='logout'/>
    </g:link>
</div>


</body>
</html>
