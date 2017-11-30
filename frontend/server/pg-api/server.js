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
  	connectionTimeoutMillis: 10000 // return an error after 1 second if connection could not be established
  });

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

app.get('/api/get-videos', (req, res) => {
	var username = req.query.username;
	console.log(username);
	pool.query("SELECT id FROM userdata WHERE username='" + username + "'", (err, table) => {
		var user_id = table.rows[0].id;
		pool.query("SELECT * FROM uservideos WHERE user_id=" + user_id + ";", (err, table2) => {
			return res.status(200).send(table2.rows);
		});
	});
});

app.post('/api/upload', function(req, res) {
	var username = req.body.username;
	var timestamp = req._startTime;
	//console.log(req);
	if (!req.files){
		console.log(req.files);
		console.log('No files uploaded.');
		return res.status(400).send('No files were uploaded.');
	}

	let videoFile = req.files.videoFile;

	var filename = req.files.videoFile.name;
	console.log(filename);

	mkdirp(__dirname + '/upload/' + username, function (err) {
		if (err) console.error(err)
			else console.log('Created folder directory for: ' + username)
		});

	pool.query("SELECT id FROM userdata WHERE username='" + username + "'", (err, table) => {
		if(table.rows.length > 0){
			pool.query("INSERT INTO uservideos (user_id, date, file_name) VALUES (" + table.rows[0].id + ", '" + timestamp + "', '" + filename + "');", (err, table2) => {
				console.log("Inserted " + table.rows[0].id + " into uservideos table");
			});

			pool.query("SELECT MAX(id) as last_id FROM uservideos WHERE user_id=" + table.rows[0].id + ";", (err, table3) => {
				let newFilename = table3.rows[0].last_id + ".mp4";

				videoFile.mv(__dirname + '/upload/' + username + '/' + newFilename, function(err) {
					if (err){
						return res.status(500).send(err);
					}
					console.log('File uploaded!');
					return res.sendStatus(200);
				});
			});
		} else {
			return res.status(400).send(err);
		}
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

	pool.query("SELECT * FROM userdata WHERE username='" + username + "'", (err, table) => {
		if(table.rows.length > 0){
			if(password == table.rows[0].password){
				pool.query("UPDATE userdata SET last_ip='"+ ip + "' WHERE username='" + username + "'", (err, result) => {
					console.log('IP updated with: ' + ip);
				});

				pool.query("UPDATE userdata SET last_login='"+ timestamp + "' WHERE username='" + username + "'", (err, result) => {
					console.log('Last login updated with: ' + timestamp);
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
		}
	});

});

app.get('/api/check-username', function(request, response){
	var username = request.query.username;
	console.log(username);

	pool.query("SELECT username FROM userdata WHERE username='" + username + "'", (err, table) => {
		if(table.rows.length > 0){
			return response.status(200).send(table.rows);
		} else {
			return response.send({
				'success': false
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

	pool.query('INSERT INTO userdata (username, password, first_name, last_name) VALUES($1, $2, $3, $4)', [username, password, first_name, last_name], (err, table) => {
		console.log(table.rows);
		console.log("Data inserted");
		return response.status(200).json({
			message: 'User successfully registered'
		});
	});

});

app.listen(PORT, () => console.log('Listening on port ' + PORT));