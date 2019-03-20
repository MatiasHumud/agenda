var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// define schema
var serviceSchema = new Schema({
	name:{type: String, required: "Name is blank"},
	category:{
		type: String, required: "Service category is blank",
		enum: {values: ["XS", "S", "M", "L"], message: "Incorrect category"}
	},
	brief:{type: String},
	duration:{type: Number, required: "Session duration is blank"},
	gender:{
		type: String, required: "Gender is blank",
		enum: {values: ["H", "M"], message: "Incorrect category"}
	},
	side:{
		type: String, required: "Side is blank",
		enum: {values: ["Front", "Back"], message: "Incorrect side"}
	},
	shapes:[{type: String}],
	isAllDay:{type: Boolean, default: false}
});

var Service = mongoose.model("Service", serviceSchema);

module.exports.Service = Service;
