import React, { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from './axios';
import { db } from './firebase';
import { collection, doc, setDoc } from "firebase/firestore";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true); 
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false); // FIXED: Should be boolean false, not string ""
  const [clientSecret, setClientSecret] = useState(""); // FIXED: Must be an empty string, NOT true

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        // Prevent sending API calls if the basket is empty
        if (basket.length === 0) return;

        const response = await axios({
          method: 'post',
          url: `/payments/create?total=${Math.round(getBasketTotal(basket) * 100)}`
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Failed to fetch client secret from backend:", err);
        setError(`Backend Error: ${err.message}`);
      }
    };

    getClientSecret();
  }, [basket]);

  console.log('THE SECRET IS >>> ', clientSecret);

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!stripe || !elements || !clientSecret) {
    return;
  }

  setProcessing(true);

  // CHANGED: Use clean async/await destructuring to get paymentIntent directly
  const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement)
    }
  });

  if (stripeError) {
    setError(`Payment Failed: ${stripeError.message}`);
    setProcessing(false);
    setSucceeded(false);
 } else if (paymentIntent) {

    // 🔄 CHANGED: Modern Firebase v9/v10 Modular Firestore syntax
    const orderDocRef = doc(
      collection(doc(collection(db, 'users'), user?.uid), 'orders'), 
      paymentIntent.id
    );

    await setDoc(orderDocRef, {
      basket: basket,
      amount: paymentIntent.amount,
      created: paymentIntent.created
    });

    setSucceeded(true);
    setError(null);
    setProcessing(false);

    dispatch({
      type: 'EMPTY_BASKET'
    });
    
    navigate('/orders', { replace: true });
  }
};

  const handleChange = e => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className='payment'> 
      <div className='payment__container'>
        <h1>
          Checkout (<Link to='/checkout'>{basket?.length} items</Link>)  
        </h1>
        
        <div className='payment__section'> 
          <div className='payment__title'>
            <h3>Delivery Address</h3>
          </div>
          <div className='payment__address'>
            <p>{user?.email}</p>
            <p>123 React Lane</p>   
            <p>Kochi, KL</p>
          </div>
        </div>

        <div className='payment__section'> 
          <div className='payment__title'>
            <h3>Review items and delivery</h3> 
          </div>
          <div className='payment__items'>
            {basket.map((item, index) => (
              <CheckoutProduct
                key={index} // Added unique key mapping requirement
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        <div className='payment__section'> 
          <div className='payment__title'>
            <h3>Payment Method</h3>
          </div>
          <div className='payment__details'>
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className='payment__priceContainer'>
                <CurrencyFormat
                  renderText={(value) => (
                    <h3>Order Total: {value}</h3>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)} 
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={disabled || processing || succeeded || !clientSecret}>
                  <span>{processing ? "Processing..." : "Buy Now"}</span>
                </button>
              </div>
              
              {error && <div className="payment__error">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;