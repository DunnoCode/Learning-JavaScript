const mongoose = require("mongoose")
const Grid = require('gridfs-stream');
const Music = require('../models/musicModel');


const getAllMusicsData = async (req, res) =>{
    try{
        var musics = await Music.find({})
        musics = musics.map((music) =>{
            var {__v, ...rest} = music._doc
            return rest
        })
        res.status(200).json(musics)
    }catch(err){
        res.status(400).json({message: err})
        return
    }
}

const getMusicData = async (req,res) => {
    try{
        console.log(req.params.objectID)
        var music = await Music.findOne({ _id : req.params.objectID })
        if(music){
            res.status(200).json(music)
        }else{
            res.status(400).json({message: "Music not found"})
            return
        }
    }catch(err){
        console.log(err)
        res.status(400).json({message: err})
        return
    }
}


const getMusicImage = async(req,res) => {
    try{
        if(req.params.imageName){
            if(req.params.imageName.includes("jpg") || req.params.imageName.includes("png")){
                var gfs = Grid(mongoose.connection.db, mongoose.mongo)
                var temp = await gfs.files.find({filename: req.params.imageName}).toArray().catch((err) => {throw err})
                if(temp.length == 0){
                    res.status(404).json({message: 'image does not exist'})
                    return
                }else{
                    const readStream = gfs.createReadStream({
                        filename: req.params.imageName
                    });
                    readStream.pipe(res.status(200))
                }
            }else{
                res.status(415).json({message: 'Unsupported media type'})
                return
            }
        }else{
            res.status(400).json({message: "Missing imageName"})
            return
        }
    }catch(err){
        console.log(err)
        res.status(400).json({message: err})
    }
}

const getMusicAudio = async(req, res) => {
    try{
        if(req.params.audioName){
            if(req.params.audioName.includes("mp3")){
                var gfs = Grid(mongoose.connection.db, mongoose.mongo)
                var temp = await gfs.files.find({filename: req.params.audioName}).toArray().catch((err) => {throw err})
                if(temp.length == 0){
                    res.status(404).json({message: 'Audio does not exist'})
                    return
                }else{
                    const readStream = gfs.createReadStream({
                        filename: req.params.audioName
                    });
                    readStream.pipe(res.status(200))
                }
            }else{
                res.status(415).json({message: 'Unsupported media type'})
                return
            }
        }else{
            res.status(400).json({message: "Missing audioName"})
            return
        }
    }catch(err){
        console.log(err)
        res.status(400).json({message: err})
        return
    }
}



module.exports = {getAllMusicsData, getMusicImage, getMusicAudio, getMusicData}