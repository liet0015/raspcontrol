var fs = require('fs');

var express = require('express');
var app = express();
var http = require('http');

var databaseUrl = "rasp"; // "username:password@example.com/mydb"
var collections = [ "notifications", "control" ];
var db = require("mongojs").connect(databaseUrl, collections);
var io = require('socket.io');

var server = http.createServer(app); // [{id: '1', message: 'notified'}];

/** -- xpath parser for beinformed xml message processing -- */
var xpath = require('xpath'), dom = require('xmldom').DOMParser;

var Stomp = require('stomp-client');
var destination_input = '/queue/GKL.QUEUE';
var destination_tobi = '/queue/BI.INPUT';
var client = new Stomp('localhost', 61614);

app.use('/', express.static(__dirname));
// app.use(express.bodyParser());

app.get('/notifications', function(req, res) {
	var notifications = db.notifications.find('', function(err, notifications) {
		if (err || !notifications) {
			console.log("No notifications found");
		} else {
			res.json(notifications);
		}
	});

});

app.post('/notifications', function(req, res) {

	var jsonData = JSON.parse(req.body.mydata);

	db.notifications.save({
		message : jsonData.message,
		time : new Date()
	}, function(err, saved) {
		if (err || !saved) {
			res.end("notification not saved");
		}
		else {

			res.end("notification saved");
		}
	});
});

server.listen(3000);
// app.listen(3000);

var ios = io.listen(server);

ios.set('log level', 1);

ios.sockets.on('connection', function(socket) {
	console.log('Client Connected');

	// socket.on('message', function(data){

	var notifications = db.notifications.find().sort({
		time : -1
	}).limit(5, function(err, notifications) {
		if (err || !notifications) {
			console.log("No notifications found");
		}
		else {
			socket.emit('server_message', notifications);
		}
	});

	// });
	// socket.broadcast.emit('server_message',data);

	socket.on('disconnect', function() {
		console.log('Client Disconnected.');
	});

	socket.on('notification-warning', function(message) {
		console.log(message);

		db.notifications.save({
			message : message,
			time : new Date(),
			level : "alert alert-warning"
		}, function(err, saved) {
			if (err || !saved) {
				console.log("notification not saved");
			}
			else {

				console.log("notification saved");
			}
		});

	});

	socket.on('notification-info', function(message) {
		console.log(message);

		db.notifications.save({
			message : message,
			time : new Date(),
			level : "alert alert-info"
		}, function(err, saved) {
			if (err || !saved) {
				console.log("notification not saved");
			}
			else {

				console.log("notification saved");
			}
		});

	});

	socket.on('notification-danger', function(message) {
		console.log(message);

		db.notifications.save({
			message : message,
			time : new Date(),
			level : "alert alert-danger"
		}, function(err, saved) {
			if (err || !saved) {
				console.log("notification not saved");
			}
			else {

				console.log("notification saved");
			}
		});

	});

	socket.on('notification_to_bi', function(message) {
		console.log(message);

		var document = "<root><caseid>1</caseid><message>" + message + "</message></root>";

		// client.connect(function(sessionId) {
		console.log("DITTAN");
		client.publish(destination_tobi, document);

		// });
		// client.disconnect();
	});
});

client
		.connect(function(sessionId) {
			client
					.subscribe(
							destination_input,
							function(body, headers) {

								var doc = new dom().parseFromString(body);
								var message = xpath
										.select(
												"//*[local-name()='property'][*[local-name()='key']='body']/*[local-name()='value']/text()",
												doc).toString();

								var notifications = [];

								db.notifications.save({
									message : message,
									time : new Date(),
									level : "alert alert-warning"
								}, function(err, saved) {
									if (err || !saved) {
										console.log("notification not saved");
									}
									else {

										console.log("notification saved");
									}
								});

								notifications = db.notifications
										.find()
										.sort({
											time : -1
										})
										.limit(
												5,
												function(err, notifications) {
													if (err || !notifications) {
														console
																.log("No notifications found");
													}
													else {
														ios.sockets
																.emit(
																		'server_message',
																		notifications);
													}
												});

							});

			// client.publish(destination, 'Oh herrow');
		});
