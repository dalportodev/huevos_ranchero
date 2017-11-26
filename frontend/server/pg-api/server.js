let express = require('express');
let session = require('express-session');
let fileUpload = require('express-fileupload');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
let mkdirp = require('mkdirp');
const PORT = 3001;

let pool = new pg.Pool({
	host: 'localhost',
	user: 'postgres',
	password: 'admin2084',
	database: 'huevos_ranchero',
	port: 5432,
	max: 10,
 	//idleTimeoutMillis: 1000, // close idle clients after 1 second
  	//connectionTimeoutMillis: 1000 // return an error after 1 second if connection could not be established
  });

/*
pool.connect((err, db, done) => {
	if(err){
		return console.log(err);
	} else {
		
		db.query('SELECT * from userdata', (err, table) => {
			done();
			if(err) {
				return console.log(err);
			} else {
				console.log(table.rows)
			}
		});
		

		
		var username = 'test';
		var password = 'test123';
		var first_name = 'tester';
		var last_name = '123';
		db.query('INSERT INTO userdata (username, password, first_name, last_name) VALUES($1, $2, $3, $4)', [username, password, first_name, last_name], (err, table) => {
			done();
			if(err) {
				return console.log(err);
			} else {
				console.log(table.rows);
				db.end();
			}
		});
		
	}
});
*/

let app = express();

function restrict(request, response, next){
	if(request.session.username){
		next();
	} else {
		request.session.error = 'Access denied';
		request.redirect('/index');
	}
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(morgan('dev'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.post('/api/upload', function(req, res) {
	var username = req.body.username;
console.log(req);
	if (!req.files){
		console.log(req.files);
		console.log('No files uploaded.');
		return res.status(400).send('No files were uploaded.');
	}

	let videoFile = req.files.videoFile;

	var filename = req.files.videoFile.name;

	mkdirp(__dirname + '/upload/' + username, function (err) {
		if (err) console.error(err)
			else console.log('Created folder directory for: ' + username)
		});

	videoFile.mv(__dirname + '/upload/' + username + '/' + filename, function(err) {
		if (err){
			return res.status(500).send(err);
		}
		console.log('File uploaded!');
		//res.send('File uploaded!');
		res.sendStatus(200);
	});
});

app.post('/api/login', function(request, response){
	let base64 = require('base-64');
	let dir = require('node-dir');

	var ip = request.headers['x-forwarded-for'] || 
	request.connection.remoteAddress || 
	request.socket.remoteAddress ||
	request.connection.socket.remoteAddress;

	var timestamp = request._startTime;
	var username = base64.decode(request.body.username);
	var password = base64.decode(request.body.password);
	console.log(username);
	console.log(password);
	console.log(ip);
	console.log(timestamp);

	pool.connect(function(err, db, done){
		if(err){
			console.log(err);
			return response.status(404).send(err);
		} else {
			db.query("SELECT * FROM userdata WHERE username='" + username + "'", function(err, table) {
				done();
				if(err){
					console.log(err);
					return response.status(400).send(err);
				} else {
					if(table.rowCount > 0){
						if(password == table.rows[0].password){

							db.query("UPDATE userdata SET last_ip='"+ ip + "' WHERE username='" + username + "'", (err, table) => {
    							//done();
    							if(err) {
    								console.log(err.detail);
    								return;
    							} else {
    								console.log('IP updated with: ' + ip);
    								return;
    							}
    							//db.end();
    						});


							db.query("UPDATE userdata SET last_login='"+ timestamp + "' WHERE username='" + username + "'", (err, table) => {
    							//done();
    							if(err) {
    								console.log(err.detail);
    								return;
    							} else {
    								console.log('Last login updated with: ' + timestamp);
    								return;
    							}
    							//db.end();
    						});


							return response.send({
								'success': true,
								'message': table.rows[0].username
							});
						} else {
							return response.send({
								'success': false,
								'message': 'Invalid username and password combination'
							});
						}
					} else {
						return response.status(400).send(table.rows);
					}

				}
				db.end();
			});
		}
	});


});

app.get('/api/check-username', function(request, response){
	var username = request.query.username;
	console.log(username);
	pool.connect(function(err, db, done){
		if(err){
			console.log(err);
			return response.status(404).send(err);
		} else {
			db.query("SELECT username FROM userdata WHERE username='" + username + "'", function(err, table) {
				done();
				if(err){
					console.log(err);
					return response.status(400).send(err);
				} else {
					if(table.rows.length > 0){
						return response.status(200).send(table.rows);
					} else {
						return response.status(400).send(table.rows);
					}
					
				}
				db.end();
			});
		}
	});
});

app.get('/api/get-userinfo', function(request, response){
	var username = request.query.username;
	console.log(username);
	pool.connect(function(err, db, done){
		if(err){
			console.log(err);
			return response.status(404).send(err);
		} else {
			db.query("SELECT username FROM userdata WHERE username='" + username + "'", function(err, table) {
				done();
				if(err){
					console.log(err);
					return response.status(400).send(err);
				} else {
					if(table.rows.length > 0){
						return response.status(200).send(table.rows);
					} else {
						return response.status(400).send(table.rows);
					}
					
				}
				db.end();
			});
		}
	});
});

app.post('/api/new-user', function(request, response){
	var username = request.body.username;
	var password = request.body.password;
	var first_name = request.body.first_name;
	var last_name = request.body.last_name;
	console.log(request.body);
	pool.connect((err, db, done) => {
		if(err){
			console.log(err.detail);
			return response.status(400).send(err);
		} else {
			db.query('INSERT INTO userdata (username, password, first_name, last_name) VALUES($1, $2, $3, $4)', [username, password, first_name, last_name], (err, table) => {
				done();
				if(err) {
					console.log(err.detail);
					return response.status(400).send(err);
				} else {
					console.log(table.rows);
					console.log("Data inserted");
					return response.status(200).json({
						message: 'User successfully registered'
					});
				//db.end();
			}
			db.end();
		});
		}
	});
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));