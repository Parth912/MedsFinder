const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const Medical = mongoose.model('Medical')

module.exports = (req,res,next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "You must be loggedIn"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload) => {
        if(err){
            return res.status(401).json({error: "You must be loggedIn"})
        }

        const {_id} = payload
        Medical.findById(_id).then((medicalData) => {
            req.medical = medicalData
            next()
        })
    })
}