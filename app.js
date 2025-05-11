const express = require('express');
const mongoose = require('mongoose');

const app = express();

main().then(() => {
    console.log("DB is Connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/AirBnb');
}

app.get("/", (req,res) => {
    res.send("Bhavy Sharma")
})

app.listen(8080, () => {
    console.log("Server is running on Port 8080");
})