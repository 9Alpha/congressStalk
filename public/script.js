

$("#createButton").on('click', function (e) {
	$.ajax({
		url: 'createAccount',
		type: 'POST',
		data: $('#userNameInput').text()
	});
});

$("loginButton").on('click', function (e){
	$.ajax({
		url: 'login',
		type: 'POST',
		data: $('#userNameInput').text()
	});
});