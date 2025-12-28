const slugify = require("slugify");
const productModel = require("../model/product.model");
const fs = require("fs");
const path = require("path");

/* ================= CREATE PRODUCT ================= */
const createProductController = async (req, res) => {
  try {
    const { title, description, price, discountprice, stock } = req.body;

    if (!title || !description || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const slug = slugify(title, { lower: true, trim: true });

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (item) => `${process.env.SERVER_URL}/uploads/${item.filename}`
      );
    }

    const product = await productModel.create({
      title,
      description,
      price,
      discountprice,
      stock,
      slug,
      image: images,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ALL PRODUCTS ================= */
const allProductController = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= LATEST PRODUCT ================= */
const latestProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// /* ================= SINGLE PRODUCT ================= */
const singleProductController = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await productModel.findOne({ slug });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// /* ================= DELETE PRODUCT ================= */
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // delete images safely
    product.image.forEach((url) => {
      const imageName = url.split("/").pop();
      const imagePath = path.join(__dirname, "../../uploads", imageName);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await productModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProductController,
  allProductController,
  latestProductController,
  singleProductController,
  deleteProductController,
};
