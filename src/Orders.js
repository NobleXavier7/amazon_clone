import React, { useEffect, useState } from 'react';
import './Orders.css';
import { db } from './firebase';
import { useStateValue } from './StateProvider';
import Order from './Order';
//  ADDED: Modern Firestore functional imports
import { collection, doc, query, orderBy, onSnapshot } from 'firebase/firestore'; 

function Orders() {
  const [orders, setOrders] = useState([]);
  const [{ basket, user }, dispatch] = useStateValue();
  
  useEffect(() => {
    if (user) {
      // 🔄 CHANGED: Modern Firebase Modular Structure references
      const ordersCollectionRef = collection(db, 'users', user.uid, 'orders');
      const ordersQuery = query(ordersCollectionRef, orderBy('created', 'desc'));

      // 🔄 CHANGED: Functional execution of onSnapshot
      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      }, (error) => {
        console.error("Error listening to user orders:", error);
      });

      // Cleanup listener when component unmounts or user shifts
      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [user]); //  UPDATED: Added 'user' to dependencies to accurately track auth state changes

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      <div className="orders__order">
        {orders?.map((order) => (
          <Order key={order.id} order={order} /> // Added a unique key for list rendering
        ))}
      </div>
    </div>
  );
}

export default Orders;