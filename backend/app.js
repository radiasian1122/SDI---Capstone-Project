const express = require('express');
const app = express();
const port = 8080;


app.get("/", (req, res) => {
    res.status(200).send("Root Route")
})



app.listen(port, (req, res) => {
    console.log('express server up and running on port ', port);
})