const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel')


const login = async (req, res) => {
    try{
        console.log(req.body)
        if(!(req.body.email && req.body.password)){
            res.status(400).json({message: "Missing email or password"})
            return
        }
        var user = await User.findOne({ email: req.body.email })
        if(!user){
            console.log("Wrong email")
            res.status(400).json({message: "Wrong email/password"})
            return
        }else{
            if(bcrypt.compareSync(req.body.password, user.password)){
                const {__v, invoice, password, ...rest} = user._doc    
                const token = jwt.sign(rest, process.env.jwt_secret, {expiresIn: '1d'});
                rest['token'] = token
                res.status(200).json(rest);
            }else{
                console.log("Wrong password")
                res.status(400).json({message: "Wrong email/password"})
                return
            }
        }
    }catch(err){
        throw err
    }
}

const register = async (req, res) => {
    try{
        console.log(req.body)
        if(!(req.body.last_name && req.body.first_name && req.body.email && req.body.password)){
            res.status(400).json({message: "Missing information"})
            return
        }
        const user = await User.findOne({email : req.body.email})
        if(user){
            res.status(403).json({message: "User already exist"})
            return
        }else{
            const password = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: password,
                invoice: []
            })
            newUser.save().then((user) => {
                const rest = {
                    _id: user._id,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                }
                const token = jwt.sign(rest, process.env.jwt_secret, {expiresIn: "1d"});
                rest['token'] = token
                res.status(200).json(rest);
            })
        }
    }catch(err){
        throw err
    }
}

module.exports = {login, register}