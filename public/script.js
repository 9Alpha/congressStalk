var usrLegs;
var usrBills;

var currentID;


$(document).ready(function (e) {
	//$("#secondElementId").offset({ top: offset.top, left: offset.left})
	$('#searchPage').hide();
	$('#homePage').hide();
});


$("#createButton").on('click', function (e) {
	if ($('#userNameInput').val() === "") {
		console.log("no name");
		return false;
	}
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
			if (data.responseText === "false") {
				alert("Invalid name or name taken");
			} else {
				currentID = JSON.parse(data.responseText)[0].id;
				console.log(currentID);
				$('#HomeHello').text('Hey '+$('#userNameInput').val());
				$('#homePage').show();
				$('#loginPage').hide();
			}
		}
	});
});

$("#loginButton").on('click', function (e){
	var temp = {
		"info": $('#userNameInput').val()
	};
	$.ajax({
		url: '/login',
		type: 'POST',
		data: JSON.stringify(temp),
		contentType: "application/json",
		complete: function (data) {
			console.log(data.responseText);
			if (JSON.parse(data.responseText).length === 0) {
				alert("No such user");
			} else {
				currentID = JSON.parse(data.responseText)[0].id;
				console.log(currentID);
				$('#HomeHello').text('Hey '+$('#userNameInput').val());
				$('#homePage').show();
				$('#loginPage').hide();
				document.getElementById("Thing").reset();
			}
		}
	});
});

$("#toSearch").on('click', function (e) {
	$('#homePage').hide();
	$('#loginPage').hide();
	$('#searchPage').show();
});

$("#goHome").on('click', function (e) {
	$('#homePage').show();
	$('#loginPage').hide();
	$('#searchPage').hide();
});

$("#logOut").on('click', function (e) {
	$('#homePage').hide();
	$('#loginPage').show();
	$('#searchPage').hide();
	currentID = -1; 
});


$("#searchButton").on('click', function (e) {
	if (currentID === undefined) {
		alert("Not logged in");
	} else {
		if ($("#searchInput").val() !== "") {
			console.log("searching for ->"+$("#searchInput").val()+"<- with id ->"+currentID+"<-");
			$.ajax({
				url: 'https://congress.api.sunlightfoundation.com/legislators/locate?zip='+$("#searchInput").val()+'&apikey=92c8cc16175542298052d24ae42371b8',
				type: 'GET',
				complete: function (data) {
					var temp = JSON.parse(data.responseText);
					var forExp = "<tr><th>Name</th><th>Party</th><th>Twitter</th></tr>";
					for (var i = 0; i < temp.results.length; i++) {
						var color = "";
						if (temp.results[i].party === "R") {
							color = "red";
						} else if (temp.results[i].party === "D") {
							color = "blue";
						} else {
							color = "green"
						}
						forExp += "<tr><td><a id=\"legPage\">"+temp.results[i].title+". "+temp.results[i].first_name+" "+temp.results[i].last_name+"</a></td><td>"+temp.results[i].party+"</td><td><a id=\""+color+"\" href=\"https://twitter.com/"+temp.results[i].twitter_id+"\" target=\"_blank\">"+temp.results[i].twitter_id+"</a></td><td><input type=\"button\" value=\"Add Legislator\" class=\"btn btn-sm btn-success\" fore=\"add\" id=\"{name:"+temp.results[i].title+". "+temp.results[i].first_name+" "+temp.results[i].last_name+",twitter:"+temp.results[i].twitter_id+",party:"+temp.results[i].party+"}\"></tr>";
					}
					$('#responseText').html(forExp);
				}
			});
		} else {
			alert("Empty search box");
		}
	}
});

$('#responseText').on('click', function(e) {
	if (e.target.localName === "input") {
		var data = JSON.parse(e.target.id);
		var temp = {
			"name": data.name,
			"twitter": data.twitter,
			"party": data.party
		};
		$.ajax({
			url: '/addLegs/'+currentID,
			type: 'POST', 
			data: JSON.stringify(temp),
			contentType: "application/json",
			complete: function (data) {
				$.ajax({
					url: '/getLegs/'+currentID,
					type: 'GET',
					complete: function (data) {
						console.log(data);
					}
				});
			}
		});
	}
});