const express = require('express')
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requirelogin')
const router = express.Router()
const Medical = mongoose.model('Medical')

router.get('/findmeds',requireLogin,(req,res) => {
    const {pincode} = req.body
    Medical.find({pincode: pincode})
    .then(medicals => {
        res.json({medicals})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router