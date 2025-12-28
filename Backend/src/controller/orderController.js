const cartModel = require("../model/cart.model");
const orderModel = require("../model/order.model");

// Create COD order
const createOrderController = async (req, res) => {
  try {
    const { orderstatus, discount, city, address, phone, name } = req.body;

    // Get all cart items
    const cartlist = await cartModel.find({});
    if (cartlist.length === 0) {
      return res.status(404).json({ success: false, message: "Cart is empty" });
    }

    // Calculate total price
    const totalprice = cartlist.reduce((prev, cur) => prev + Number(cur.totalprice || 0), 0);

    // Create order
    const order = new orderModel({
      orderstatus,
      discount,
      paymentmethod: "cod",
      city,
      address,
      name,
      phone,
      items: cartlist,
      totalprice,
    });

    await order.save();

    // Clear cart
    await cartModel.deleteMany({});

    return res.status(201).json({
      success: true,
      message: "COD order placed successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Get all orders
const allorderListController = async (req, res) => {
  try {
    const orderlist = await orderModel.find({})
      .populate({ path: "items.product", select: "title image price discountprice quantity" });

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orderlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Get single order by id
const singleorderControllers = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id)
      .populate({ path: "items.product", select: "title image price discountprice quantity" });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Delete an order
const deleteOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    await orderModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createOrderController,
  allorderListController,
  singleorderControllers,
  deleteOrderController,
};
