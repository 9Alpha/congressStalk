

var usrLegs;
var usrBills;


$("#createButton").on('click', function (e) {
	$.getJSON('/getNames', function(data) {
		console.log($('#userNameInput').val());
		$.ajax({
			url: '/createAccount',
			type: 'POST',
			data: $('#userNameInput').val(),
			contentType: "application/json",
		});
	});
});

$("loginButton").on('click', function (e){

	$.ajax({
		url: '/login',
		type: 'POST',
		data: $('#userNameInput').text()

	});
});