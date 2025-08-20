// Depencies and Modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

// Environment Setup
require('dotenv').config();

// Server Setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    //to be updated when we connect this to our client
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Database Setup
mongoose.connect(process.env.MONGODB_STRING)
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

// Backend Routes
app.use("/users", userRoutes);
// app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);
// app.use("/cart", cartRoutes);

// Server Gateway Response
if(require.main === module) {
    app.listen( process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000 }`);
    })
}

module.exports = { app, mongoose };



