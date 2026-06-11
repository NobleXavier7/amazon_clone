import React from "react";
import "./Subtotal.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from "./reducer";
import { useNavigate } from "react-router-dom"; 

function Subtotal() {
  const navigate = useNavigate(); 
  // 🎯 UPDATED: Extracted 'user' from the global state layer
  const [{ basket, user }, dispatch] = useStateValue();

  // 🎯 ADDED: Conditional authentication shield
  const handleCheckout = () => {
    if (user) {
      navigate('/payment'); // Logged in -> Proceed to payment gateway
    } else {
      navigate('/login');   // Guest -> Bounce to authentication screen
    }
  };

  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({basket?.length || 0} items): <strong>{value}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)} 
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />

      {/* 🎯 UPDATED: Replaced inline navigate with the authentication shield handler */}
      <button onClick={handleCheckout} disabled={basket.length === 0}>
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Subtotal;