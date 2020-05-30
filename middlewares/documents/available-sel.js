var User = require("../../models/user.model").User;
var Service = require("../../models/service").Service;
var Pack = require("../../models/pack").Pack;
//var isEditable = require("./is-editable");

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			User.find({permission: undefined}).then(function(usrs){
				if(usrs){
					User.find({permission: "Branch"}).then(function(brnchs){
						if(brnchs){
							User.find({permission: "Resource"}).then(function(resrcs){
								if(resrcs){
									Service.find({}).then(function(svcs){
										if(svcs){
											Pack.find({sessRemaining: true})
												.populate("treatment")
												.populate("packType")
												.exec(function(err, pcks){
													if(!err){
														if(pcks){
															res.locals.users = usrs;
															res.locals.branches = brnchs;
															res.locals.resources = resrcs;
															res.locals.services = svcs;
															res.locals.packs = pcks;
															next();
														}
														else{
															console.log("No se encontraron packs");
															res.redirect("/session");
														}
													}
													else{
														console.log(String(err));
														console.log("Error al buscar packs en base de datos");
														res.redirect("/session");
													}
												});
										}
										else{
											console.log("No se encontraron sevicios");
											res.redirect("/session");
										}
									},function(err){
										console.log(String(err));
										console.log("Error al buscar servicios en base de datos");
										res.redirect("/session");
									});
								}
								else{
									console.log("No se encontraron kinesiólogos");
									res.redirect("/session");
								}
							},function(err){
								console.log(String(err));
								console.log("Error al buscar kinesiólogos en base de datos");
								res.redirect("/session");
							});
						}
						else{
							console.log("No se encontraron sucursales");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar sucursales en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case "Branch":
			User.find({permission: undefined}).then(function(usrs){
				if(usrs){
					User.find({permission: "Resource", parentBranch: res.locals.user._id}).then(function(resrcs){
						if(resrcs){
							Service.find({}).then(function(svcs){
								if(svcs){
									Pack.find({sessRemaining: true})
										.populate("treatment")
										.populate("packType")
										.exec(function(err, pcks){
											if(!err){
												if(pcks){
													res.locals.users = usrs;
													res.locals.branches = [res.locals.user];
													res.locals.resources = resrcs;
													res.locals.services = svcs;
													res.locals.packs = pcks;
													next();
												}
												else{
													console.log("No se encontraron packs");
													res.redirect("/session");
												}
											}
											else{
												console.log(String(err));
												console.log("Error al buscar packs en base de datos");
												res.redirect("/session");
											}
										});
								}
								else{
									console.log("No se encontraron sevicios");
									res.redirect("/session");
								}
							},function(err){
								console.log(String(err));
								console.log("Error al buscar servicios en base de datos");
								res.redirect("/session");
							});
						}
						else{
							console.log("No se encontraron kinesiólogos");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar kinesiólogos en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case "Resource":
			User.find({permission: undefined}).then(function(usrs){
				if(usrs){
					User.find({permission: "Branch", _id: res.locals.user.parentBranch}).then(function(brnchs){
						if(brnchs){
							Service.find({}).then(function(svcs){
								if(svcs){
									Pack.find({sessRemaining: true})
										.populate("treatment")
										.populate("packType")
										.exec(function(err, pcks){
											if(!err){
												if(pcks){
													res.locals.users = usrs;
													res.locals.branches = brnchs;
													res.locals.resources = [res.locals.user.depopulate("parentBranch")];
													res.locals.services = svcs;
													res.locals.packs = pcks;
													next();
												}
												else{
													console.log("No se encontraron packs");
													res.redirect("/session");
												}
											}
											else{
												console.log(String(err));
												console.log("Error al buscar packs en base de datos");
												res.redirect("/session");
											}
										});
								}
								else{
									console.log("No se encontraron sevicios");
									res.redirect("/session");
								}
							},function(err){
								console.log(String(err));
								console.log("Error al buscar servicios en base de datos");
								res.redirect("/session");
							});
						}
						else{
							console.log("No se encontraron sucursales");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar sucursales en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		default:
			User.find({permission: "Branch"}).then(function(brnchs){
				if(brnchs){
					User.find({permission: "Resource"}).then(function(resrcs){
						if(resrcs){
							Service.find({}).then(function(svcs){
								if(svcs){
									Pack.find({usuario: res.locals.user, sessRemaining: true})
										.populate("treatment")
										.populate("packType")
										.exec(function(err, pcks){
											if(!err){
												if(pcks){
													res.locals.users = [res.locals.user];
													res.locals.branches = brnchs;
													res.locals.resources = resrcs;
													res.locals.services = svcs;
													res.locals.packs = pcks;
													next();
												}
												else{
													console.log("No se encontraron packs");
													res.redirect("/session");
												}
											}
											else{
												console.log(String(err));
												console.log("Error al buscar packs en base de datos");
												res.redirect("/session");
											}
										});
								}
								else{
									console.log("No se encontraron sevicios");
									res.redirect("/session");
								}
							},function(err){
								console.log(String(err));
								console.log("Error al buscar servicios en base de datos");
								res.redirect("/session");
							});
						}
						else{
							console.log("No se encontraron kinesiólogos");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar kinesiólogos en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron sucursales");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar sucursales en base de datos");
				res.redirect("/session");
			});
	}
}
