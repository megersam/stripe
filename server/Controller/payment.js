const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


router.post('/payment', async (req, res) => {
    let status, error;
    const { token, amount } = req.body;
    console.log(token);
    // try {
    // //   await stripe.charges.create({
    // //     source: token.id,
    // //     amount,
    // //     currency: 'usd',
    // //   });
    // console.log(token);
    //   status = 'success';
    // } catch (error) {
    //   console.log(error);
    //   status = 'Failure';
    // }
    // res.json({ error, status });
  });
  module.exports = router;