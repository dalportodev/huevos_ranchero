const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const pg = require('pg');
const mkdirp = require('mkdirp');
const shell = require('shelljs')
const path = require('path');
const fs = require('fs');
const PORT = 3001;

let pool = new pg.Pool({
	host: 'localhost',
	user: 'postgres',
	password: 'student',
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

function startsWith(str, prefix) {
	return str.lastIndexOf(prefix, 0) === 0;
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
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

	pool.query("SELECT id FROM uservideos", (err, table) => {
		let num_videos = table.rows.length;

		pool.query("SELECT id FROM userdata WHERE username='" + username + "'", (err, table) => {
			if(table.rows.length > 0){
				pool.query("INSERT INTO uservideos (user_id, date, file_name) VALUES (" + table.rows[0].id + ", '" + timestamp + "', '" + filename + "');", (err, table2) => {
					console.log("Inserted " + table.rows[0].id + " into uservideos table");
					
					pool.query("SELECT MAX(id) as last_id FROM uservideos WHERE user_id=" + table.rows[0].id + ";", (err, table3) => {
						
						let video_id = table3.rows[0].last_id;
						let newFilename = video_id + ".mp4";

						//let newFilename = video_id + ".mp4";
						mkdirp(__dirname + '/upload/videos/' + video_id, function (err) {
							if (err) {
								console.error(err);
							} else {
								console.log('Created folder directory for: ' + username);

								videoFile.mv(__dirname + '/upload/videos/' + video_id + '/' + newFilename, function(err) {
									if (err){
										return res.status(500).send(err);
									}
									console.log('File uploaded!');

									shell.exec("./upload/runScripts " + video_id, function(code, stdout, stderr){
										console.log('Exit code:', code);
										console.log('Program output:', stdout);
										console.log('Program stderr:', stderr);

										if(code == 0){
											pool.query("UPDATE uservideos SET status='Done' WHERE id=" + video_id + ";", (err, table4) => {
												console.log("Successfully processed video id: " + video_id);
											});
										} else if(code == 1){
											pool.query("UPDATE uservideos SET status='Error' WHERE id=" + video_id + ";", (err, table4) => {
												console.log("Error processing video id: " + video_id);
											});
										}
									});

									/*
									if (shell.exec("./upload/runScripts " + video_id).code == 0){
										pool.query("UPDATE uservideos SET status='Done' WHERE id=" + video_id + ";", (err, table4) => {
											console.log("Successfully processed video id: " + video_id);
										});
										//shell.exit(1);
									}
									*/
									return res.sendStatus(200);
								});
							}
						});
					});
				});
			} else {
				return res.status(400).send(err);
			}
		});
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
			return response.status(200).json({
				success: true
			});
		} else {
			return response.status(200).json({
				success: false
			});
		}
	});
});

app.get('/api/get-userinfo', function(request, response){
	var username = request.query.username;
	pool.query("SELECT last_login, last_ip FROM userdata WHERE username='" + username + "'", (err, table) => {
		if(table.rows.length > 0){
			console.log(table.rows[0].last_login);
			return response.status(200).send(table.rows);
		} else {
			return response.status(400).send(table.rows);
		}
	});
});

app.get('/api/get-video', function(req, res){
	var video_id = req.query.video_id;
	var path_to_video = __dirname + '/upload/videos/' + video_id + "/" + video_id + ".mp4"
	console.log(path_to_video);

	// Get the filename
	var movieFileName = video_id + ".mp4";

	var streamPath = path.resolve(path_to_video);
    //Calculate the size of the file
    var stat = fs.statSync(streamPath);
    var total = stat.size;
    var file;
    var contentType = "video/mp4";

    // Chunks based streaming
    if (req.headers.range) {
    	var range = req.headers.range;
    	var parts = range.replace(/bytes=/, "").split("-");
    	var partialstart = parts[0];
    	var partialend = parts[1];

    	var start = parseInt(partialstart, 10);
    	var end = partialend ? parseInt(partialend, 10) : total - 1;
    	var chunksize = (end - start) + 1;
    	console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

    	file = fs.createReadStream(streamPath, {
    		start: start,
    		end: end
    	});
    	res.writeHead(206, {
    		'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
    		'Accept-Ranges': 'bytes',
    		'Content-Length': chunksize,
    		'Content-Type': contentType
    	});
    	res.openedFile = file;
    	file.pipe(res);
    } else {
    	console.log('ALL: ' + total);
    	file = fs.createReadStream(streamPath);
    	res.writeHead(200, {
    		'Content-Length': total,
    		'Content-Type': contentType
    	});
    	res.openedFile = file;
    	file.pipe(res);
    }

    res.on('close', function() {
    	console.log('response closed');
    	if (res.openedFile) {
    		res.openedFile.unpipe(this);
    		if (this.openedFile.fd) {
    			fs.close(this.openedFile.fd);
    		}
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
		if(err){
			return response.status(400).send(err);
		}
		console.log("Data inserted");
		return response.status(200).json({
			message: 'User successfully registered'
		});
	});

});

app.listen(PORT, () => console.log('Listening on port ' + PORT));