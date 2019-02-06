var socket = io();

socket.on("new packType", function(data){

	var data = JSON.parse(data);

	var dataRow = document.querySelector("#packType");
	var source = document.querySelector("#packType-template").innerHTML;

	var template = Handlebars.compile(source);
	dataRow.innerHTML = template(data) + dataRow.innerHTML;
});