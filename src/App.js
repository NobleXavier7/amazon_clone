import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Checkout from "./Checkout";
import Payment from "./Payment";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import  { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js"; 
import Orders from "./Orders";

const promise = loadStripe(
  "pk_test_51TebN9K0BXWknErdo1MhrqzTQjPMhCycBhFDek83iKg775USYf4cLhNWuZierx9MwuSbnDDaSbyky54nWJy1jDsg00O3tbCQbV"
);

function App() {
  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    // will only run once when the app component loads...
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });

    
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route 
            path="/orders" 
            element={
              <>
                <Header />
                <Orders />
                
                
              </>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <>
                <Header />
                <Checkout />
                
                
              </>
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <>
                <Login />
              </>
            }
          />

          <Route 
            path="/payment" 
            element={
              <>
                <Header />
                <Elements stripe={promise}>
                <Payment />
                </Elements>
              </>
            }
          />

          <Route 
            path="/" 
            element={
              <>
                <Header />
                <Home />
              </>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;