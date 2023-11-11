import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const publishableKey =
  'pk_test_51OB0zjHBl9Mv1hIGUXOjuJ5Qv62g6N37K7reCPaR7FbUmz3aA0BAVFmJxEZ8JNKCzOUV23CfJhXZRBDWoJwFVRkv00LkDrC7Bi';

const stripePromise = loadStripe(publishableKey);

const CheckoutForm = ({ product }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSuccess = () => {
    MySwal.fire({
      icon: 'success',
      title: 'Payment was successful',
      time: 4000,
    });
  };

  const handleFailure = () => {
    MySwal.fire({
      icon: 'error',
      title: 'Payment was not successful',
      time: 4000,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    try {
      const { token, error } = await stripe.createToken(elements.getElement(CardElement));

      if (error) {
        // Handle payment error
        handleFailure();
        console.error(error);
      } else {
        // Send the token to your server
        await payNow(token);
      }
    } catch (error) {
      // Handle other errors
      handleFailure();
      console.error(error);
    }
  };

  const payNow = async (token) => {
    try {
      const response = await axios.post('http://localhost:8080/payment', {
        amount: product.price * 100,
        token,
      });

      if (response.status === 200) {
        handleSuccess();
      }
    } catch (error) {
      handleFailure();
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Card details</label>
        <CardElement />
      </div>
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

const App = () => {
  const [product] = useState({
    name: 'MAC PC',
    price: 10,
  });

  return (
    <div className="App">
      <h2>Checkout Page</h2>
      <p>
        <span>Product : </span>
        {product.name}
      </p>
      <p>
        <span>Product : </span>
        {product.price}
      </p>
      <Elements stripe={stripePromise}>
        <CheckoutForm product={product} />
      </Elements>
    </div>
  );
};

export default App;
