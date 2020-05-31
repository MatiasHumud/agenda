const express = require("express");
const Contract = require("../../models/contract.model").Contract;
const User = require("../../models/user.model").User;
const router = express.Router();
const fs = require("fs");
const documentFinder = require("../../middlewares/documents/find-document");
const docCollectionFinder = require("../../middlewares/documents/find-contracts");

router.get("/new", function(req, res){
  res.render("session/contract/new",
    {
      users: res.locals.users,
      branches: res.locals.branches,
      resources: res.locals.resources,
      services: res.locals.services,
      packs: res.locals.packs
    });
});

// Assign "documentFinder" middleware to every document/id request 
router.all("/:id*", documentFinder);
// Assign "availableSelection" middleware to every document/id/edit request 
router.all("/:id/edit", availableSelection);
// Despliega el formulario para edición de un documento específico
router.get("/:id/edit", function(req, res){
  if(res.locals.documento.status != "ejecutado"){
    res.render("session/contract/edit", 
    { 
      users: res.locals.users,
      branches: res.locals.branches,
      resources: res.locals.resources,
      services: res.locals.services,
      packs: res.locals.packs
    });
  }
  else{
    res.redirect("/session/contract/");
  }
});

// Assign "docCollectionFinder" middleware to every document collection request
router.all("/", docCollectionFinder);

//CRUD documentos específicos
router.route("/:id")
  .get(function(req, res){//Mostrar documento seleccionado
    res.render("session/contract/show", {documento: res.locals.documento});
  })
  .put(function(req, res){//Editar documento seleccionado
    if(req.body.usr) res.locals.documento.usuario = req.body.usr;
    if(req.body.svc) res.locals.documento.servicio = req.body.svc;
    if(req.body.ress) res.locals.documento.recurso = req.body.ress;
    if(req.body.brch) res.locals.documento.sucursal = req.body.brch;
    if(req.body.dateSelect) res.locals.documento.event = new Event(JSON.parse(req.body.dateSelect));
    res.locals.documento.timestamp.updatedAt = Date.now();

    res.locals.documento.save(function(err){
      if(!err){
        res.redirect("/session/contract/");	
      }
      else{
        console.log(err);
        res.redirect("/session/contract/"+req.params.id+"/edit");
      }				
    });
  })
  .patch(function(req, res){//Actualizar estado del documento seleccionado
    const newStat = undefined;
    switch (req.body.sBtn) {
      case "0":
        newStat = "confirmado";
        res.locals.documento.timestamp.updatedAt = Date.now();
        break;
      case "1":
        newStat = "ejecutado";
        res.locals.documento.timestamp.executedAt = Date.now();
        break;
      case "2":
        newStat = "abandonado";
        res.locals.documento.timestamp.updatedAt = Date.now();
        break;
      default:
    }

    if(res.locals.user.permission && newStat) {
      res.locals.documento.status = newStat;
      res.locals.documento.event.title = newStat;

      res.locals.documento.save(function(err){
        if(!err){
          res.redirect("/session/contract/");	
        }
        else{
          console.log(err);
          res.redirect("/session/contract/"+req.params.id+"/edit");
        }				
      });
    }
  })
  .delete(function(req, res){//Borrar documento seleccionado
    Contract.findOneAndRemove({_id: req.params.id}, function(err){
      if(!err){
        res.redirect("/session/contract");
      }
      else{
        res.redirect("/session/contract/"+req.params.id)
      }
    });
  });
//CRUD colección de documentos propios
router.route("/")
  .get(function(req, res){//Retorna todos los documentos del usuario
    if(res.locals.user.permission == undefined) {
      res.render("session/contract/collection", {
        branches: res.locals.branches,
        resources: res.locals.resources,
        documentos: res.locals.documentos
      });
    }
    else {
      res.render("session/contract/collection-calendar", {
        branches: res.locals.branches,
        resources: res.locals.resources,
        documentos: res.locals.documentos
      });
    }
  })
  .post(function(req, res){
    res.redirect("/session/contract/");
  });

module.exports = router;
