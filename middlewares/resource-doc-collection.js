var Documento = require("../models/contract.model").Documento;
var mongoose = require("mongoose");

module.exports = function(req, res, next){
	var ressToFetch = req.query.resourceId;
	res.locals.eventos = {};
	if(ressToFetch != "") {
		Documento.aggregate([
			{ "$match": { recurso: mongoose.Types.ObjectId(ressToFetch)	} },
			{ "$unwind": "$event" },
			{ "$match": { 
					"event.start": { $gte : new Date(req.query.start) },
					"event.end": { $lte : new Date(req.query.end) },
				} 
			},
			{ "$addFields": { "event.title" : "$status" } },
			{ "$replaceRoot": { "newRoot": "$event" } }
		]).exec(function(err, events){
			if(!err){
				res.locals.eventos = events;
				next();
			}
			else{
				console.log("Error on resource event fetching middleware")
			}
		});
	}
}
