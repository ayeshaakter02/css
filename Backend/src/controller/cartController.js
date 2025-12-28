const cartModel = require("../model/cart.model");
const productModel = require("../model/product.model");

// Add product to cart (no user, no variant)
const addtocartController = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product and quantity are required",
      });
    }

    const productinfo = await productModel.findById(product);
    if (!productinfo) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if same product already exists in cart
    const existingCart = await cartModel.findOne({ product });

    if (existingCart) {
      existingCart.quantity += quantity;
      existingCart.totalprice = existingCart.quantity * productinfo.discountprice;
      await existingCart.save();

      return res.status(200).json({
        success: true,
        message: "Cart quantity updated",
        data: existingCart,
      });
    }

    // If not exists, create new cart item
    const totalprice = productinfo.discountprice * quantity;

    const addtocart = new cartModel({
      product,
      quantity,
      totalprice,
    });

    await addtocart.save();

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: addtocart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all cart items
const getAllCartListController = async (req, res) => {
  try {
    const allcartlist = await cartModel.find({})
      .populate("product", "title image discountprice price");

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: allcartlist,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update quantity
const updateQuantityController = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    const cartItem = await cartModel.findById(id).populate("product", "discountprice");
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    cartItem.totalprice = cartItem.product.discountprice * quantity;
    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: cartItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete cart item
const deleteCartController = async (req, res) => {
  try {
    const { id } = req.params;
    await cartModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Cart item deleted",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addtocartController,
  getAllCartListController,
  updateQuantityController,
  deleteCartController,
};
