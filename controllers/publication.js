'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

//var geodist = require('geodist');

var Publication = require('../models/publication');
var User = require('../models/user');

function savePublication(req, res){
    var params = req.body;
    
    if(!params.description){
        return res.status(200).send({
            message: "The publication need description param"
        })
    }

    var publication = new Publication();

    publication.user = req.user.sub;
    publication.latitude = params.latitude;
    publication.longitude = params.longitude;
    publication.title = params.title;
    publication.description = params.description;
    publication.photo = 'null';
    publication.created_at = moment().unix();
    publication.range = params.range;
    publication.time_to_expire = params.time_to_expire;
    

    publication.save((err, publicationStored)=>{
        if(err){
            return res.status(500).send({
                message: "Error when saving Publication"
            });
        }

        if(!publicationStored){
            return res.status(500).send({
                message: "The publication is not saved"
            });
        }

        res.status(200).send({
            publication: publicationStored
        });
    });
}

function getPublicationsUser(req, res){
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var user = req.user.sub;

    if(req.params.user){
        user = req.params.user;
    }

    var itemsPerPage = 4;

    //con la propiedad in podemos buscar dentro de una variable
    Publication.find({
        user: user
    }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
        if(err){
            return res.status(500).send({
                message:"error when getting publications"
            });
        } 

        if(!publications){
            return res.status(404).send({
                message:"no publications for this params"
            });
        }

        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications:publications
        });
    });
}

function deletePublication(req,res){
    var publication_id = req.params.id;

    Publication.find({'user':req.user.sub, '_id':publication_id}).remove((err)=>{
        if(err){
            return res.status(500).send({
                message:"error when deleting publication"
            });
        }

        return res.status(200).send({
            message: "The publication is now deleted"
        });
    });
}

function uploadImage(req, res){
    var publication_id = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        var fil_split = file_path.split('\\');
        var file_name = fil_split[2];
        var ext_split = file_name.split('\.');
        var file_extension = ext_split[1];

        if(file_extension == "png" ||
           file_extension == "jpg" ||
           file_extension == "jpeg" ||
           file_extension == "gif"){

            Publication.findOne({'user':req.user.sub, '_id':publication_id}).exec((err,publication)=>{
                if (publication){
                    Publication.findByIdAndUpdate(publication_id, {photo: file_name}, {new:true}, (err, publicationUpdated)=>{
                        //error
                        if(err){
                            return res.status(500).send({
                                message: "Error when updating publication"
                            });
                        }
        
                        if(!publicationUpdated){
                            //En caso de que no devuelva nada
                           return res.status(404).send({
                                message: "The publication doesn't exist"
                            });
                        }
        
                        return res.status(200).send({
                                publication: publicationUpdated
                            });
        
                    });
                }else{
                    return removeFilesOfUpload(res, file_path, "You don't have permmision to edit this publication");
                }
            });
        }else{
            return removeFilesOfUpload(res, file_path, "There is no valid format");
        }
    }else{
        return res.status(200).send({
            message: "No files in the request"
        });
    }

}

//private
function removeFilesOfUpload(res, file_path, message){
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({
            message: message
        });
    });
}

function getImageFile(req, res){
    var image_file = req.params.imageFile;

    var path_file = './uploads/publications/'+image_file;

    fs.exists(path_file, (exist)=>{
        if(exist){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({
                message: "The image doesn't exists"
            });
        }
    });
}

/*

function getPublications(req, res){}


function getPublicationByPosition(req, res){
    var mobileLocation = req.params.mobilePosition // {lat: 41.85, lon: -87.65}
    var visiblepublications = [];
    var publications = getAllPublications();//for city¿?

    for(publication in publications){
        var publicationLocation = {lat:99.7489, lon: -84.3881}//getpublications().getLatitude + getLongitude
        if(isInRange(mobileLocation,publicationLocation)){
            visiblepublications.push(publication);
        }
    }

    res.status(200).send({
        message: visiblepublications
    });

}

function isInRange(mobileLocation, publicationLocation){
    if (geodist(mobileLocation, publicationLocation, {exact: true, unit: 'km'}) < publication.range){
        visualicepublication();
    }
}*/

module.exports ={
    savePublication,
    getPublicationsUser,
    deletePublication,
    uploadImage,
    getImageFile
}