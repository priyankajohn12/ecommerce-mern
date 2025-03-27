const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET); // Use the secret key from environment variable
require('./config/dbConfig');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Adjust if needed
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

// Log the loaded STRIPE_SECRET (for debugging)
console.log('Stripe secret key:', process.env.STRIPE_SECRET);

const User = require('./models/User');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');
const orderRoutes = require('./routes/orderRoute');
const imageRoutes = require('./routes/imageRoute');

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('Welcome to the E-Commerce API!');
});

// Use routes for /users, /products, and /orders
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imageRoutes);

// Stripe payment route
app.post('/create-payment', async(req, res)=> {
  const {amount} = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card']
    });
    res.status(200).json(paymentIntent)
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
   }
})


server.listen(8080, ()=> {
  console.log('server running at port', 8080)
})

app.set('socketio', io);