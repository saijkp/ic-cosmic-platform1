const express = require("express");
const cors = require("cors");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "IC Coin Package",
              description: "Unlock your cosmic archetype report and deeper realms!"
            },
            unit_amount: 500
          },
          quantity: 1
        }
      ],
      success_url: "http://localhost:4242/success.html",
      cancel_url: "http://localhost:4242/cancel.html"
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log("🚀 Server running on http://localhost:4242"));
