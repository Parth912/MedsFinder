const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Medical = mongoose.model("Medical")
const Admin = mongoose.model("Admin")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')

// UserAuthentication
router.post('/usersignup',(req,res) => {
    const {name,email,password} = req.body
    if(!name || !email || !password){
        return res.status(422).json({error: "Please add all the fields"})
    }
    else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error: "Invalid Email"})
    } 
    else{
        User.findOne({email:email})
        .then((savedUser) => {
            if(savedUser){
                return res.status(422).json({error: "User already exists"})
            }
            else{
                bcrypt.hash(password,15)
                .then((hashedpassword) => {
                    const user = new User({
                        email,
                        name,
                        password:hashedpassword
                    })
                    user.save()
                    .then((user) => {
                        res.json({message: "User saved Successfully"})
                    })
                    .catch(err => {
                        console.log(err)
                    })
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
})

router.post('/usersignin',(req,res) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please fill email or password field"})
    }
    else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error: "Invalid Email"})
    }
    else{
        User.findOne({email:email})
        .then((savedUser) => {
            if(!savedUser){
                return res.status(422).json({error: "Invalid Email or Password !!!"})
            }
            bcrypt.compare(password,savedUser.password)
            .then((doMatch) => {
                if(doMatch){
                    // res.json({message: "User signedIn Successfully"})
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id,name,email} = savedUser
                    res.json({token,user:{_id,name,email}})
                }
                else{
                    return res.status(422).json({error: "Invalid Email or Password !!!"})
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
})

// MedicalStoreAuthentication
router.post('/medicalsignup',(req,res) => {
    const {name,email,password,state,city,pincode,phone,address,photo} = req.body
    if(!name || !email || !password || !state ||!city ||!pincode ||!phone ||!photo ||!address){
        return res.status(422).json({error: "Please add all the fields"})
    }
    else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error: "Invalid Email"})
    } 
    else{
        Medical.findOne({email:email})
        .then((savedMedical) => {
            if(savedMedical){
                return res.status(422).json({error: "Your Medical Store is already exists with this Email"})
            }
            else{
                bcrypt.hash(password,15)
                .then((hashedpassword) => {
                    const medical = new Medical({
                        email,
                        name,
                        password:hashedpassword,
                        state,
                        city,
                        pincode,
                        phone,
                        photo,
                        address,
                    })
                    medical.save()
                    .then((medical) => {
                        res.json({message: "Medical Store saved Successfully"})
                    })
                    .catch(err => {
                        console.log(err)
                    })
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
})

router.post('/medicalsignin',(req,res) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please fill email or password field"})
    }
    else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error: "Invalid Email"})
    }
    else{
        Medical.findOne({email:email})
        .then((savedMedical) => {
            if(!savedMedical){
                return res.status(422).json({error: "Invalid Email or Password !!!"})
            }
            bcrypt.compare(password,savedMedical.password)
            .then((doMatch) => {
                if(doMatch){
                    // res.json({message: "User signedIn Successfully"})
                    const token = jwt.sign({_id:savedMedical._id},JWT_SECRET)
                    const {_id,name,email} = savedMedical
                    res.json({token,medical:{_id,name,email}})
                }
                else{
                    return res.status(422).json({error: "Invalid Email or Password !!!"})
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
})

//AdminAuthentication

router.post('/adminsignin',(req,res) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please fill email or password field"})
    }
    else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error: "Invalid Email"})
    }
    else{
        Admin.findOne({email:email})
        .then((savedUser) => {
            if(!savedUser){
                return res.status(422).json({error: "Invalid Email or Password !!!"})
            }
            bcrypt.compare(password,savedUser.password)
            .then((doMatch) => {
                if(doMatch){
                    // res.json({message: "User signedIn Successfully"})
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id,name,email} = savedUser
                    res.json({token,user:{_id,name,email}})
                }
                else{
                    return res.status(422).json({error: "Invalid Email or Password !!!"})
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
})

module.exports = router