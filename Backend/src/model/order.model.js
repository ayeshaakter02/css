const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    deliverycharge: {
      type: String,
      enum: ["outsidedhaka", "insidedhaka"],
      default: "outsidedhaka",
    },
    paymentmethod: {
      type: String,
      enum: ["cod"], // only COD
      default: "cod",
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    totalprice: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    orderstatus: {
      type: String,
      enum: ["pending", "cancelled", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
