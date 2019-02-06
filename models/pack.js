var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// define schema
var packSchema = new Schema({
	packType:{type: Schema.Types.ObjectId, ref: "PackType", required: "Pack type is blank"},
	usuario:{type: Schema.Types.ObjectId, ref: "User", required: "User is blank"},
	dateBought:{type: Date},
	isRemovable:{type: Boolean, default: true}
});

var Pack = mongoose.model("Pack", packSchema);

module.exports.Pack = Pack;