//92c8cc16175542298052d24ae42371b8 -- Sunlight
//AIzaSyCcrLTZgs6Nu3clcC-wJRhd6ADBC9sVRf8 -- Google

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');
var  express =  require('express');
var  path =  require('path');
var  app =  express();
var bodyParser = require('body-parser');  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname,'public')));

var fs = require("fs");
var content = fs.readFileSync("public/page.html", 'utf8');

db.run("PRAGMA foreign_keys = ON;");

app.get('/', function(req, res){
	res.send(content);
});


app.post('/createAccount', function (req, res) {
	var isFalse = false;
	db.all('SELECT name FROM User', function(err, rows){
		if(err){
			console.log(err);
		} else {
			console.log('********USER NAMES**********');
			console.log(rows); 
			var temp = req.body.info;
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].name === temp) {
					isFalse = true;
					res.send(false);
					break;
				}
			}
			if (!isFalse) {
				db.run("INSERT INTO User (name) VALUES (?)",
					temp,
					function(err) {if (err) { throw err;}
					db.all('SELECT id FROM User WHERE name = ?', temp, function(err, rows2){
						if(err){
							console.log(err);
						} else {
							console.log('********USER ID**********');
							console.log(rows2); 
							res.send(rows2);
						}
					});

				});
			}
		}
	});
});

app.post('/login', function (req, res) {
	db.all('SELECT * FROM User WHERE name = ?', req.body.info, function(err, rows){
		if(err){
			console.log(err);
		} else {
			res.send(rows);
		}
	});
});

app.get('/getLegs/:id', function (req, res) {
	var count = 0;
	db.all('SELECT legsID FROM legsForUser WHERE userID = ?', req.params.id, function(err, rows){
		if(err){
			console.log("-->getLegs<--------"+err);
		} else {
			if (JSON.stringify(rows) !== "[]") {
				var temp = [];
				for (var i = 0; i < rows.length; i++) {
					db.all('SELECT * FROM Legislators WHERE id = ?', rows[i].legsID, function(err, rows2){
						if (err){
							console.log("-->getLegs<--------"+err);
						} else {
							temp.push(rows2[0]);
							if (count === rows.length - 1) {
								res.send(temp);
							}
							count++;
						}
					});
				}
			} else {
				res.send("[]");
			}
		}
	});
});

app.get('/getBills/:id', function (req, res) {
	var count = 0;
	db.all('SELECT billsID FROM billsForUser WHERE userID = ?', req.params.id, function(err, rows){
		if(err){
			console.log("-->getBills<--------"+err);
		} else {
			if (JSON.stringify(rows) !== "[]") {
				var temp = [];
				for (var i = 0; i < rows.length; i++) {
					db.all('SELECT * FROM Bills WHERE id = ?', rows[i].billsID, function(err, rows2){
						if (err){
							console.log("-->getBills<--------"+err);
						} else {
							temp.push(rows2[0]);
							if (count === rows.length - 1) {
								res.send(temp);
							}
							count++;
						}
					});
				}
			} else {
				res.send("[]");
			}
		}
	});
});

app.post('/addLegs/:id', function (req, res) {
	db.all('SELECT * FROM Legislators WHERE name = ?', req.body.name, function(err, rows){
		if (err) {
			console.log("-->addLegs<--------"+err);
		} else {
			if (JSON.stringify(rows) !== "[]") {
				console.log("using leg");
				db.run('INSERT INTO legsForUser (userID, legsID) VALUES (?, ?)', req.params.id, rows[0].id, function (err) {
					if(err){
						console.log("-->addLegs<--------"+err);
					} else {
						res.send("added");
					}
				});
			} else {
				console.log("adding leg");
				db.run('INSERT INTO Legislators (name, twitter, party) VALUES (?, ?, ?)', req.body.name, req.body.twitter, req.body.party, function (err) {
					if(err){
						console.log("-->addLegs<--------"+err);
					} else {
						db.all('SELECT * FROM Legislators WHERE name = ?', req.body.name, function(err, rows2){
							if(err){
								console.log("-->addLegs<--------"+err);
							} else {
								db.run('INSERT INTO legsForUser (userID, legsID) VALUES (?, ?)', req.params.id, rows2[0].id, function (err) {
									if(err){
										console.log("-->addLegs<--------"+err);
									} else {
										res.send("added");
									}
								});
							}
						});
					}
				});
			}
		}
	});
});

app.post('/addBills/:id', function (req, res) {
	db.all('SELECT * FROM Bills WHERE name = ?', req.body.name, function(err, rows){
		if (err) {
			console.log("-->addBills<--------"+err);
		} else {
			if (JSON.stringify(rows) !== "[]") {
				console.log("using bill");
				db.run('INSERT INTO billsForUser (userID, billsID) VALUES (?, ?)', req.params.id, rows[0].id, function (err) {
					if(err){
						console.log("-->addBills<--------"+err);
					} else {
						res.send("added");
					}
				});
			} else {
				console.log("adding bill");
				db.run('INSERT INTO Bills (name) VALUES (?)', req.body.name, function (err) {
					if(err){
						console.log("-->addBills<--------"+err);
					} else {
						db.all('SELECT * FROM Bills WHERE name = ?', req.body.name, function(err, rows2){
							if(err){
								console.log("-->addBills<--------"+err);
							} else {
								db.run('INSERT INTO billsForUser (userID, billsID) VALUES (?, ?)', req.params.id, rows2[0].id, function (err) {
									if(err){
										console.log("-->addBills<--------"+err);
									} else {
										res.send("added");
									}
								});
							}
						});
					}
				});
			}
		}
	});
});

app.post('/removeLegs/:id', function (req, res) {
	db.all('SELECT * FROM Legislators WHERE name = ?', req.body.name, function(err, rows2){
		if(err){
			console.log("-->removeLegs<--------"+err);
		} else {
			db.run('DELETE FROM legsForUser WHERE userID = ? AND legsID = ? ', req.params.id, rows2[0].id, function (err) {
				if(err){
					console.log("-->addLegs<--------"+err);
				} else {
					res.send("deleted");
				}
			});
		}
	});
});

app.post('/removeBills/:id', function (req, res) {
	db.all('SELECT * FROM Bills WHERE name = ?', req.body.name, function(err, rows2){
		if(err){
			console.log("-->removeBills<--------"+err);
		} else {
			db.run('DELETE FROM billsForUser WHERE userID = ? AND billsID = ? ', req.params.id, rows2[0].id, function (err) {
				if(err){
					console.log("-->addBills<--------"+err);
				} else {
					res.send("deleted");
				}
			});
		}
	});
});

app.listen(process.env.PORT || 5000);

