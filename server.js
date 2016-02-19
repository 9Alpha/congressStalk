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

app.get('/getNames', function(req, res) {
	db.all('SELECT name FROM user', function(err, rows){
		if(err){
			console.log(err);
		} else {
			console.log(rows);
			res.send(rows);
		}
	});
});

app.post('/createAccount', function(req, res) {
	console.log(JSON.stringify(req.body));
	db.run("INSERT INTO user (name) VALUES (?)",
		"Max",
		function(err) {if (err) { throw err;}
		db.all('SELECT * FROM user', function(err, rows){
			if(err){
				console.log(err);
			} else {
				console.log('********USER TABLE**********');
				console.log(rows); 
				res.send("done");
			}
		});

	});
});

app.listen(process.env.PORT || 5000);