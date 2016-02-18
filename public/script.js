

$("#createButton").on('click', function (e) {
	$.ajax({
		url: 'createAccount',
		type: 'POST',
		data: $('#userNameInput').text()
	});
});