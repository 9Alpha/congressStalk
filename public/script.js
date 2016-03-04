var usrLegs;
var usrBills;

var currentID;


$(document).ready(function (e) {
	$('#searchPage').hide();
	$('#homePage').hide();
	$('#billsPage').hide();
	$('#homeText').html("");
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
				document.getElementById("OtherThing").reset();
				fillHome();
			}
		}
	});
});

$(".toSearch").on('click', function (e) {
	$('#homePage').hide();
	$('#loginPage').hide();
	$('#searchPage').show();
	$('#billsPage').hide();
});

$(".goHome").on('click', function (e) {
	$('#homePage').show();
	$('#loginPage').hide();
	$('#searchPage').hide();
	$('#billsPage').hide();
	document.getElementById("OtherThing").reset();
	$('#responseText').html("");
});

$(".logOut").on('click', function (e) {
	$('#homePage').hide();
	$('#loginPage').show();
	$('#searchPage').hide();
	$('#billsPage').hide();
	$('#homeText').html("");
	currentID = -1; 
});

$('#OtherThing').on('submit', function(e) {
	e.preventDefault();
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
						forExp += "<tr><td><a id=\"legName"+i+"\" class=\"legPage\">"+temp.results[i].title+". "+temp.results[i].first_name+" "+temp.results[i].last_name+"</a></td><td>"+temp.results[i].party+"</td><td><a id=\""+color+"\" href=\"https://twitter.com/"+temp.results[i].twitter_id+"\" target=\"_blank\">"+temp.results[i].twitter_id+"</a></td><td><input type=\"button\" value=\"Add Legislator\" class=\"btn btn-sm btn-info\" fore=\"add\" id=\"buttonA"+i+"\"></tr>";
					}
					$('#responseText').html(forExp);
					for (var i = 0; i < temp.results.length; i++) {
						$('#legName'+i).data('key', "{\"name\":\""+temp.results[i].title+". "+temp.results[i].first_name+" "+temp.results[i].last_name+"\",\"twitter\":\""+temp.results[i].twitter_id+"\",\"party\":\""+temp.results[i].party+"\"}");
						$('#buttonA'+i).data('key', "{\"name\":\""+temp.results[i].title+". "+temp.results[i].first_name+" "+temp.results[i].last_name+"\",\"twitter\":\""+temp.results[i].twitter_id+"\",\"party\":\""+temp.results[i].party+"\"}");
					}
				}
			});
} else {
	alert("Empty search box");
}
}
});

$('#homeText').on('click', function(e) {
	if (e.target.localName === "input") {
		var data = JSON.parse($('#'+e.target.id).data('key'));
		var temp = {
			"name": data.name,
			"twitter": data.twitter,
			"party": data.party
		};
		$.ajax({
			url: '/removeLegs/'+currentID,
			type: 'POST',
			data: JSON.stringify(temp),
			contentType: "application/json",
			complete: function(f) {
				fillHome();
			}
		});
	} else if (e.target.className === "legPage") {
		var data = JSON.parse($('#'+e.target.id).data('key'));
		var temp = {
			"name": data.name,
			"twitter": data.twitter,
			"party": data.party
		};
		$('#homePage').hide();
		$('#billsPage').show();
		$('#nameOfLeg').text("The Bills of "+temp.name);
		$.ajax({
			url: 'https://congress.api.sunlightfoundation.com/legislators?twitter_id='+temp.twitter+'&party='+temp.party+'&apikey=92c8cc16175542298052d24ae42371b8',
			type: 'GET',
			complete: function (f) {
				bioID = JSON.parse(f.responseText).results[0].bioguide_id;
				$.ajax({
					url: 'https://congress.api.sunlightfoundation.com/bills?sponsor_id='+bioID+'&apikey=92c8cc16175542298052d24ae42371b8',
					type: 'GET',
					complete: function (data) {
						var temp2 = JSON.parse(data.responseText);
						var forExp = "<tr><th>Official Bill Title</th><th>Co-Sponsor</th></tr>";
						for (var i = 0; i < temp2.results.length; i++) {
							forExp += "<tr><td id=\"billName"+i+"\" class=\"bill\">"+temp2.results[i].official_title+"</td><td>"+temp2.results[i].cosponsors_count+"</td><td><input type=\"button\" value=\"Add Bill\" class=\"btn btn-sm btn-info\" fore=\"add\" id=\"buttonBA"+i+"\"></tr>";
						}
						$('#billsText').html(forExp);
						for (var i = 0; i < temp2.results.length; i++) {
							$('#buttonBA'+i).data('key', "{\"name\":\""+temp2.results[i].official_title+"\",\"cosponsors\":\""+temp2.results[i].cosponsors_count+"\"}");
						}
					}
				});
			}
		});

}
});

$('#homeText1').on('click', function(e) {
	if (e.target.localName === "input") {
		var data = JSON.parse($('#'+e.target.id).data('key'));
		var temp = {
			"name": data.name,
		};
		$.ajax({
			url: '/removeBills/'+currentID,
			type: 'POST',
			data: JSON.stringify(temp),
			contentType: "application/json",
			complete: function(f) {
				fillHome1();
			}
		});
	}
});

$('#billsText').on('click', function(e) {
	if (e.target.localName === "input") {
		var data = JSON.parse($('#'+e.target.id).data('key'));
		var temp = {
			"name": data.name,
		};
		$.ajax({
			url: '/getBills/'+currentID,
			type: 'GET',
			complete: function (data1) {
				var gotData = JSON.parse(data1.responseText);
				var toAdd = true;
				console.log(data1.responseText);
				for (var i = 0; i < gotData.length; i++) {
					if (gotData[i].name === temp.name) {
						toAdd = false;
						alert("Bill already linked to user");
						return false;
					}
				}
				if (toAdd) {
					$.ajax({
						url: '/addBills/'+currentID,
						type: 'POST', 
						data: JSON.stringify(temp),
						contentType: "application/json",
						complete: function (data2) {
							fillHome1();
						}
					});
				}
			}
		});

	}
});


$('#responseText').on('click', function(e) {
	if (e.target.localName === "input") {
		var data = JSON.parse($('#'+e.target.id).data('key'));
		var temp = {
			"name": data.name,
			"twitter": data.twitter,
			"party": data.party
		};
		$.ajax({
			url: '/getLegs/'+currentID,
			type: 'GET',
			complete: function (data1) {
				var gotData = JSON.parse(data1.responseText);
				var toAdd = true;
				for (var i = 0; i < gotData.length; i++) {
					if (gotData[i].name === temp.name) {
						toAdd = false;
						alert("Legislator already linked to user");
						return false;
					}
				}
				if (toAdd) {
					$.ajax({
						url: '/addLegs/'+currentID,
						type: 'POST', 
						data: JSON.stringify(temp),
						contentType: "application/json",
						complete: function (data2) {
							fillHome();
						}
					});
				}
			}
		});

	} else if (e.target.className === "legPage") {
		var data = JSON.parse($('#'+e.target.id).data('key'));
		var temp = {
			"name": data.name,
			"twitter": data.twitter,
			"party": data.party
		};
		$('#searchPage').hide();
		$('#billsPage').show();
		$('#nameOfLeg').text("The Bills of "+temp.name);
		$.ajax({
			url: 'https://congress.api.sunlightfoundation.com/legislators?twitter_id='+temp.twitter+'&party='+temp.party+'&apikey=92c8cc16175542298052d24ae42371b8',
			type: 'GET',
			complete: function (f) {
				bioID = JSON.parse(f.responseText).results[0].bioguide_id;
				$.ajax({
					url: 'https://congress.api.sunlightfoundation.com/bills?sponsor_id='+bioID+'&apikey=92c8cc16175542298052d24ae42371b8',
					type: 'GET',
					complete: function (data) {
						var temp2 = JSON.parse(data.responseText);
						var forExp = "<tr><th>Official Bill Title</th><th>Co-Sponsor</th></tr>";
						for (var i = 0; i < temp2.results.length; i++) {
							forExp += "<tr><td id=\"billName"+i+"\" class=\"bill\">"+temp2.results[i].official_title+"</td><td>"+temp2.results[i].cosponsors_count+"</td><td><input type=\"button\" value=\"Add Bill\" class=\"btn btn-sm btn-info\" fore=\"add\" id=\"buttonBA"+i+"\"></tr>";
						}
						$('#billsText').html(forExp);
						for (var i = 0; i < temp2.results.length; i++) {
							$('#buttonBA'+i).data('key', "{\"name\":\""+temp2.results[i].official_title+"\",\"cosponsors\":\""+temp2.results[i].cosponsors_count+"\"}");
						}
					}
				});
			}
		});

}
});



fillHome = function() {
	$.ajax({
		url: '/getLegs/'+currentID,
		type: 'GET',
		complete: function (e) {
			var data = JSON.parse(e.responseText);
			var forExp = "<tr><th>Name</th><th>Party</th><th>Twitter</th></tr>";
			for (var i = 0; i < data.length; i++) {
				var color = "";
				if (data[i].party === "R") {
					color = "red";
				} else if (data[i].party === "D") {
					color = "blue";
				} else {
					color = "green"
				}
				forExp += "<tr><td><a id=\"legName"+i+"\" class=\"legPage\">"+data[i].name+"</a></td><td>"+data[i].party+"</td><td><a id=\""+color+"\" href=\"https://twitter.com/"+data[i].twitter+"\" target=\"_blank\">"+data[i].twitter+"</a></td><td><input type=\"button\" value=\"Remove Legislator\" class=\"btn btn-sm btn-info\" fore=\"add\" id=\"buttonD"+i+"\"></tr>";
			}
			$('#homeText').html(forExp);
			for (var i = 0; i < data.length; i++) {
				$('#buttonD'+i).data('key', "{\"name\":\""+data[i].name+"\",\"twitter\":\""+data[i].twitter+"\",\"party\":\""+data[i].party+"\"}");
				$('#legName'+i).data('key', "{\"name\":\""+data[i].name+"\",\"twitter\":\""+data[i].twitter+"\",\"party\":\""+data[i].party+"\"}");
			}
		}
	});
}

fillHome1 = function() {
	$.ajax({
		url: '/getBills/'+currentID,
		type: 'GET',
		complete: function (data) {
			var temp2 = JSON.parse(data.responseText);
			var forExp = "<tr><th>Official Bill Title</th></tr>";
			for (var i = 0; i < temp2.length; i++) {
				forExp += "<tr><td id=\"billName"+i+"\" class=\"bill\">"+temp2[i].name+"</td><td><input type=\"button\" value=\"Delete Bill\" class=\"btn btn-sm btn-info\" fore=\"add\" id=\"buttonBD"+i+"\"></tr>";
			}
			$('#billsText').html(forExp);
			for (var i = 0; i < temp2.length; i++) {
				$('#buttonBD'+i).data('key', "{\"name\":\""+temp2[i].name+"\"}");
			}
		}
	});
}