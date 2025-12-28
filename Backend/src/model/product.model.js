const { default: mongoose } = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    image: {
      type: Array,
      required: [true, "image is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    slug: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountprice: {
      type: Number,
    },
    reviews: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
