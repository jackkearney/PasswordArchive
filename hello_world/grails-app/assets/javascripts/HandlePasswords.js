/**
 * Created by jkearney on 5/19/2017.
 */
var addAccount = function() {
    var accountName = $("#accountName-input").val()
    var password = $("#password-input").val();

    var JSONObject = {password:password,accountName:accountName};
    var str = JSON.stringify(JSONObject);
    console.log(str);
    console.log('sent ajax req');
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: postLinkGrails,
        data: str,
        contentType: "json",
        success: function(data){
            if (data.status === "success") {
                console.log('ok add');
                $("#errmsg").html("")
                var html = getHtml(password,accountName,data.id);
                $('#pass-table tr:last').before(html);
                $('#accountName-input').val('');
                $('#password-input').val('');
            } else {
                $("#errmsg").html(data.status);
                console.log(data.status)
            }
        },
        failure: function(errMsg) {
            console.log('err')
            alert(errMsg);
        }
    });
}

var getHtml = function(password, accountName,id) {
    return  '<tr id="'+id+'">'+
        '<td> <input id="'+id+'-name" style="border:0" name="accountName" value="'+accountName+'" readonly="readonly" /> </td>'+
       ' <td> <input id="'+id+'-pass" style="border:0" name="password" value="'+password+'" readonly="readonly" /> </td>'+
        '<td> <button id="'+id+'-edit" onclick="enableEditAccount('+id+')" > edit </button> </td>' +
        '<td> <button onclick="removeAccount('+id+')"> remove </button> </td>'+
        '</tr>'
};

var enableEditAccount = function(id) {
    var str = '#'+ id;
    $(str +'-name').attr('readOnly', false);
    $(str +'-name').attr('style', "border:1");
    $(str +'-pass').attr('readOnly', false);
    $(str +'-pass').attr('style', "border:1");
    $(str +'-edit').html("save");
    $(str + '-edit').attr('onClick', "disableEditAccount("+id+")");
};

var disableEditAccount = function(id) {
    var str = '#'+ id;
    $(str +'-name').attr('readOnly', true);
    $(str +'-name').attr('style', "border:0");
    $(str +'-pass').attr('readOnly', true);
    $(str +'-pass').attr('style', "border:0");
    $(str +'-edit').html("edit");
    $(str + '-edit').attr('onClick', "enableEditAccount("+id+")");
    saveEdits(id, $(str+'-pass').val(), $(str+'-name').val());
};

var removeAccount = function(id) {
    var JSONObject = {id:id};
    var str = JSON.stringify(JSONObject);
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: removeLinkGrails,
        data: str,
        contentType: "json",
        success: function(data){
            console.log(data.status);
            if (data.status === "success") {
                console.log('ok add');
                $("#errmsg").html("");
                $('#'+id).remove();
            } else {
                $("#errmsg").html(data.status)
            }
        },
        failure: function(errMsg) {
            console.log('err')
            alert(errMsg);
        }
    });
};

var saveEdits = function (id, newPass, newName) {
    var JSONObject = {id:id, password:newPass, accountName:newName};
    var str = JSON.stringify(JSONObject);
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: editLinkGrails,
        data: str,
        contentType: "json",
        success: function(data){
            console.log(data.status);
            if (data.status === "success") {
                $("#errmsg").html("");
            } else {
                $("#errmsg").html(data.status)
            }
        },
        failure: function(errMsg) {
            console.log('err')
            alert(errMsg);
        }
    });
};


