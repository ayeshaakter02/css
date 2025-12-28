const express = require("express");
const router = express.Router();
const product = require("./product");
const cart = require("./cart");
const order = require("./order");

// http://localhost:4000/api/v1/product
router.use("/product", product);
// http://localhost:4000/api/v1/cart
router.use("/cart", cart);
// http://localhost:4000/api/v1/order
router.use("/order", order);

module.exports = router;