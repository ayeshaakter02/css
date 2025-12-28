const express = require("express");
const { createOrderController, allorderListController, singleorderControllers } = require("../../../controller/orderController");

const router = express.Router()

// http://localhost:4000/api/v1/order/createorder
router.post("/createorder",createOrderController)
// http://localhost:4000/api/v1/order/allorderlist
router.get("/allorderlist",allorderListController)
// http://localhost:4000/api/v1/order/allorderlist
router.get("/singleorder/:id", singleorderControllers );

module.exports = router;