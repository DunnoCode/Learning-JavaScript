const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Music = require('../models/musicModel');
const Invoice = require('../models/invoiceModel')

const checkoutWithLogin = async(req, res) => {
    try{
        if(req.body.full_name != null && req.body.address_1 != null && req.body.city != null && req.body.country != null && req.body.postcode != null){
            if(req.body.order){
                //find the ordered music is exist or not and find the music id
                let orderedMusicsList = []
                for(var i = 0; i < req.body.order.length; i++){
                    console.log(req.body.order)
                    let music = await Music.find({music_name: req.body.order[i].music_name}).catch((err) => {
                        console.log(err)
                        res.status(400).json({message: err})
                        return
                    })
                    console.log(music)
                    if(!music){
                        res.send(404).json({message: "Music is not found"})
                        return
                    }else{
                        orderedMusicsList.push({music_ref: music[0]._id, music_name: music[0].music_name, price: music[0].price, quantity: req.body.order[i].quantity})
                    }
                }
                console.log(req.decoded._id)
                var user = await User.findOne({_id: req.decoded._id}).catch((err) => {
                    console.log(err)
                    res.status(400).json({message: err})
                    return
                })
                if(!user){
                    res.status(404).send({message: "User does not exist"})
                    return
                }
                const newOrder = new Invoice({
                    full_name: req.body.full_name,
                    company_name: req.body.company_name,
                    address_1: req.body.address_1,
                    address_2: req.body.address_2,
                    city: req.body.city,
                    region: req.body.region,
                    country: req.body.country,
                    postcode: req.body.postcode,
                    user_ref: user._id,
                    orderedMusics: orderedMusicsList
                })
                await newOrder.save(async (error) => {
                    if(error){
                        res.status(404).json({message: error})
                        return
                    }
                })
                user.invoice.push(newOrder._id)
                await user.save(async (error) => {
                    if(error){
                        res.status(404).json({message: error})
                        return
                    }else{
                        res.status(200).json({newOrder: newOrder._id})
                    }
                })
            }else{
                res.status(400).json({message: "Missing Delivery Order"})
                return
            }
        }else{
            res.status(400).json({message: "Missing Delivery Information"})
            return
        }
    }catch(err){
        console.log(err)
        res.status(400).json({message: err})
        return
    }
}




const checkoutWithoutLogin = async (req, res) => {
    try{
        if(req.body.order!= null && req.body.first_name != null && req.body.last_name != null && req.body.email != null && req.body.password != null && req.body.full_name != null && req.body.address_1 != null && req.body.city != null && req.body.country != null && req.body.postcode != null){
            //register user first
            var user = await User.findOne({email : req.body.email}).catch((err) => {
                console.log(err)
                res.status(400).json({message: err})
                return
            })
            if(user){
                res.status(403).json({message: "User already exist"})
                return
            }
            const password = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: password,
                invoice: []
            })
            newUser.save().catch((err) => {
                console.log(err)
                res.status(400).json({message: err})
                return
            })
            const rest = {
                _id: newUser._id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
            }
            const token = jwt.sign(rest, process.env.jwt_secret, {expiresIn: "1d"});
            
            //make delivery
            let orderedMusicsList = []
            for(var i = 0; i < req.body.order.length; i++){
                let music = await Music.find({music_name: req.body.order[i].music_name}).catch((err) => {
                    console.log(err)
                    res.status(400).json({message: err})
                    return
                })
                if(!music){
                    res.send(404).json({message: "Music is not found"})
                    return
                }else{
                    orderedMusicsList.push({music_ref: music[0]._id, music_name: music[0].music_name, price: music[0].price, quantity: req.body.order[i].quantity})
                }
            }
            const newOrder = new Invoice({
                full_name: req.body.full_name,
                company_name: req.body.company_name,
                address_1: req.body.address_1,
                address_2: req.body.address_2,
                city: req.body.city,
                region: req.body.region,
                country: req.body.country,
                postcode: req.body.postcode,
                user_ref: newUser._id,
                orderedMusics: orderedMusicsList
            })
            await newOrder.save(async (error) => {
                if(error){
                    console.log("here")
                    res.status(404).json({message: error})
                    return
                }
            })
            // mewUser is array
            var user = await User.findOne({_id: newUser._id}).catch((err) => {
                console.log(err)
                res.status(400).json({message: err})
                return
            })
            if(!user){
                res.status(404).send({message: "User does not exist"})
                return
            }

            user.invoice.push(newOrder._id)
                await user.save(async (error) => {
                    if(error){
                        res.status(404).json({message: error})
                        return
                    }else{
                        res.status(200).json({newOrder: newOrder._id , token: token})
                    }
                })
        }else{
            if(req.body.full_name == null || req.body.address_1 == null || req.body.city == null || req.body.country == null || req.body.postcode == null){
                res.status(400).json({message: "Missing Delivery Information"})
                return
            }else if(req.body.order == null){
                res.status(400).json({message: "Missing Delivery Order"})
                return
            }else{
                res.status(400).json({message: "Missing Register Information"})
                return
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({message: err})
        return
    }
}



const checkInvoice = async (req, res) =>{
    try{
        //check the user have the permission to check the object id or not first
        console.log(req.decoded._id)
        var user = await User.findOne({_id: req.decoded._id}).catch((err) => {
            console.log(err)
            res.status(400).json({message: err})
            return
        })
        let exist = false
        for(var i = 0; i < user.invoice.length; i++){
            if(user.invoice[i] == req.params.objectID){
                exist = true;
                break;
            }
        }
        if(!exist){
            res.status(400).json({message: "No Permission"})
            return
        }
        //return invoice info
        var invoice = await Invoice.findOne({ _id: req.params.objectID}).catch((err) => {
            console.log(err)
            res.status(400).json({message: err})
            return
        })
        const {_id, user_ref, __v, ...rest} = invoice._doc
        res.status(200).json(rest)
    }catch{
        console.log(err)
        res.status(400).json({message: err})
        return
    }
}







module.exports = {checkoutWithLogin, checkoutWithoutLogin, checkInvoice}