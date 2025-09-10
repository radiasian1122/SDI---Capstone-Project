const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();
const port = 8080;
const cors = require('cors')
const rootRoutes = require('./routes/root.js')
const vehicleRoutes = require('./routes/vehicles.js')
const userRoutes = require('./routes/users.js')
const dispatchRoutes = require('./routes/dispatches.js')
const driverRoutes = require('./routes/drivers.js')

// Swagger documentation setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Convoy Connect',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

app.use(cors())
app.use(express.json());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/', rootRoutes)
app.use('/vehicles', vehicleRoutes)
app.use('/users', userRoutes)
app.use('/dispatches', dispatchRoutes)
app.use('/drivers', driverRoutes);

app.listen(port, (req, res) => {
    console.log('express server up and running on port ', port);
})