var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// define schema
var packTypeSchema = new Schema({
	title:{type: String, required: "Title is blank"},
	nZones:{type: Number, required: "Number of zones is blank"},
	zoneTypes:{type: String, required: "Zone types is blank"},
	nSessions:{type: Number, required: "Number of sessions is blank"}
});

var PackType = mongoose.model("PackType", packTypeSchema);

module.exports.PackType = PackType;