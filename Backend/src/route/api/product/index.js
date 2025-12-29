const express = require("express");
const {
  createProductController,
  allProductController,
  latestProductController,
  deleteProductController,
  singleProductController,
} = require("../../../controller/productController");
const upload = require("../../../utils/uploadMiddleware");

const router = express.Router();

// http://localhost:4000/api/v1/product/createproduct
router.post("/createproduct", upload.array("product"), createProductController);
// http://localhost:4000/api/v1/product/allproduct
router.get("/allproduct", allProductController);
// http://localhost:4000/api/v1/product/latestproduct
router.get("/latestproduct", latestProductController);
// http://localhost:4000/api/v1/product/deleteproduct/:id
router.delete("/deleteproduct/:id", deleteProductController);
// http://localhost:4000/api/v1/product/allproduct/:id
router.get("/allproduct/:slug", singleProductController);

module.exports = router;
