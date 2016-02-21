var usrLegs;
var usrBills;


$("#createButton").on('click', function (e) {
	var temp = {
		"info": $('#userNameInput').val()
	};
	$.ajax({
		url: '/createAccount',
		type: 'POST',
		data: JSON.stringify(temp),
		contentType: "application/json",
		complete: function (data) {
			console.log(data.responseText);
		}
	});
});

$("#loginButton").on('click', function (e){
	var temp = {
		"info": $('#userNameInput').val()
	};
	$.ajax({
		url: '/login',
		type: 'GET',
		data: JSON.stringify(temp),
		contentType: "application/json",
		complete: function (data) {
			console.log(data);
		}
	});
});