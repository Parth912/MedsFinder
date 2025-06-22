const express = require('express')
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requirelogin')
const requireMedicalLogin = require('../middleware/requiremedicallogin')
const router = express.Router()
const Orders = mongoose.model('Orders')

router.post('/:id/placeorder',requireLogin,(req,res) => {
    const {name,address,photo,status} = req.body
    if(!name || !address ||!photo){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    req.user.password = undefined
    const order = new Orders({
        name,
        address,
        photo,
        status,
        orderedTo: req.params.id,
        orderedBy: req.user
    })
    order.save().then((result) => {
        res.json({order:result})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/user_myorders',requireLogin,(req,res) => {
    Orders.find({orderedBy: req.user._id})
    .populate("orderedBy", "_id name")
    .then(myorders => {
        res.json({myorders})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/medical_myorders',requireMedicalLogin,(req,res) => {
    Orders.find({orderedTo: req.medical._id})
    .then(myorders => {
        res.json({myorders})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router