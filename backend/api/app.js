const express = require('express');
const app = express();
const port = 8080;
const rootRoutes = require('./routes/root.js')
const vehicleRoutes = require('./routes/vehicles.js')
const userRoutes = require('./routes/users.js')
const dispatchRoutes = require('./routes/dispatches.js')

app.use('/', rootRoutes)
app.use('/vehicles', vehicleRoutes)
app.use('/users', userRoutes)
app.use('/dispatches', dispatchRoutes)

app.listen(port, (req, res) => {
    console.log('express server up and running on port ', port);
})