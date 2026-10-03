require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const Product = require("./Models/Product");
const Cart = require("./Models/Cart");
const Order = require("./Models/Order");
const OrderItem = require("./Models/OrderItem");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Mini E-Commerce API is running");
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json(products);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const {
            name,
            price,
            category,
            stock,
            image
        } = req.body;

        if (!name || !price || !category || stock === undefined || !image) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const product = await Product.create({
            name,
            price,
            category,
            stock,
            image
        });

        return res.status(201).json(product);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.put("/api/products/:id", async (req, res) => {
    try {
        const {
            name,
            price,
            category,
            stock,
            image
        } = req.body;

        if (!name || !price || !category || stock === undefined || !image) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                price,
                category,
                stock,
                image
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});