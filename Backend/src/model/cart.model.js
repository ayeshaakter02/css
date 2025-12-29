const { default: mongoose } = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    totalprice: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
