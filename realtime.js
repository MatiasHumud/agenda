module.exports = function(server, sessionMiddleware){
	var io = require("socket.io")(server);
	var redis = require("redis");
	var client = redis.createClient();

	client.subscribe("documentos");
	client.subscribe("staff");
	client.subscribe("service");
	client.subscribe("hourBlock");
	client.subscribe("packs");

	io.use(function(socket, next){
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	client.on("message", function(channel, message){
		if(channel == "documentos"){
			io.emit("new document", message);
		}
		if(channel == "staff"){
			io.emit("new member", message);
		}
		if(channel == "service"){
			io.emit("new service", message);
		}
		if(channel == "hourBlock"){
			io.emit("new hrBlock", message);
		}
		if(channel == "packs"){
			io.emit("new pack", message);
		}
	});
}
