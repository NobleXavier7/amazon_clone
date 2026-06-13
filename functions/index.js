const functions = require("firebase-functions/v1");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
    "sk_test_51TebN9K0BXWknErdOsMer8HLH5ErtFnBnA2sJwBR"+
    "rnJ74vCoOZIjvT9umdDtdeBNxvGf0aakmamCUZvTDfrKv40Q00xmk0XlNx"
);

// API

// - App config
const app = express();

// - Middlewares
app.use(cors({origin: true}));
app.use(express.json());

// - API routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.post("/payments/create", async (req, res) => {
  const total = req.query.total;
  console.log("Payment Request Received for this amount >>> ", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(total), // subunits of the currency
    currency: "usd",
  });

  // OK - Created
  res.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// - Listen command
// ❌ OLD LINE: exports.api = functions.https.onRequest(app);

//  NEW LINE:
exports.paymentApi = functions.https.onRequest(app);
// Add this at the very bottom of functions/index.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));