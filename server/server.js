const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const payment = require('./Controller/payment');
const cors = require('cors');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



const app = express();
const PORT  = process.env.PORT || 5000;
app.use(cors({
    origin: 'http://localhost:3000',  
   credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



// app.use('/payment', payment);

// start the server
const server = app.listen(process.env.PORT || 4000, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT}`
    );
  });
  

//   payment
app.post('/payment', async (req, res) => {
    let status, error;
    const { token, amount } = req.body;
    try {
      await Stripe.charges.create({
        source: token.id,
        amount,
        currency: 'usd',
      });
      status = 'success';
    } catch (error) {
      console.log(error);
      status = 'Failure';
    }
    res.json({ error, status });
    // console.log(token);
  });



   