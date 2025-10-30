const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5173', 'http://localhost:5174', 'http://rmantonio-ecommerce.vercel.app', 'https://rmantonio-ecommerce.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING)
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

if(require.main === module) {
    app.listen( process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000 }`);
    })
}

module.exports = { app, mongoose };