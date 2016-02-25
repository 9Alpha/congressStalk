//92c8cc16175542298052d24ae42371b8

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

app.listen(process.env.PORT || 5000);

