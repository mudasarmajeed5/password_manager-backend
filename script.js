const express = require('express');
const port = 3000
const dotenv = require("dotenv");
const bodyparser = require("body-parser")
const cors = require("cors")

dotenv.config();
const app = express()
app.use(bodyparser.json())
app.use(cors());
const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const dbName = 'PasswordManager';
client.connect();
// Get all the passwords
app.get('/', async (req, res) => {
    const db= client.db(dbName)
    const collection = db.collection("Passwords")
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})
// Send all the passwords SAVE A PASSWORD
app.post('/', async (req, res) => {
    const password = req.body;
    const db= client.db(dbName)
    const collection = db.collection("Passwords")
    const findResult = await collection.insertOne(password);
    res.send({success:true,passwordStatus:"Saved successfully",result:findResult})
})
// delete  a password by id
app.delete('/', async (req, res) => {
    const password = req.body;
    const db= client.db(dbName)
    const collection = db.collection("Passwords")
    const findResult = await collection.deleteOne(password);
    res.send({success:true,passwordStatus:"Saved successfully",result:findResult})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})