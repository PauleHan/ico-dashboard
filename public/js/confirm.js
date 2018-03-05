function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var LOCAL_SITE_NAME = 'localhost:8000';

$(document).ready(function () {

    var action = getParameterByName('action');
    var data = getParameterByName('data');
    if (action && data) {
        var confirm_url = '';
        if (location.host.indexOf(LOCAL_SITE_NAME) !== -1) {
            confirm_url = 'http://localhost:4244/api/main/confirm/' + action + '/' + data;
        } else {
            confirm_url = '/api/main/confirm/' + action + '/' + data;
        }
        $.ajax({
            url: confirm_url
        }).done(function (res) {
            res.user.token = res.token;
            window.localStorage.setItem('user', JSON.stringify(res.user));
            $('#form-loading').hide();
            $('#form-send-finish').show();
        }).fail(function() {
            $('#form-loading').hide();
            $('#form-send-error').show();
        });
    }
    
    var resend = getParameterByName('resend');
    
    if (resend) {
        var resend_url = '';
        if (location.host.indexOf(LOCAL_SITE_NAME) !== -1) {
            resend_url = 'http://localhost:4244/api/main/resend/' + resend;
        } else {
            resend_url = '/api/main/resend/' + resend;
        }        
        $.ajax({
            url: resend_url
        }).done(function (res) {
            $('#form-loading').hide();
            $('#form-send-resend').show();
        }).fail(function() {
            $('#form-loading').hide();
            $('#form-send-error').show();
        });
    }

});