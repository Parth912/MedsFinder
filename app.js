const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')
//FRJU2y6rY3vYdVqH

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo")
})
mongoose.connection.on("error", (err) => {
    console.log("Error while connecting to Mongo", err)
})

require("./models/user")
require("./models/medical")
require("./models/admin")
require("./models/orders")

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/findmeds'))
app.use(require('./routes/orders'))

app.listen(PORT, () => {
    console.log("Serving is running on", PORT)
})