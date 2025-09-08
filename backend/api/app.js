const express = require('express');
const app = express();
const port = 8080;
const rootRoutes = require('./routes/root.js')
const vehicleRoutes = require('./routes/vehicle.js')
const pmcsRoutes = require('./routes/pmcs.js')

app.use("/", rootRoutes)
app.use('/vehicle', somethingElseRoutes)


app.listen(port, (req, res) => {
    console.log('express server up and running on port ', port);
})