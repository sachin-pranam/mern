import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import * as seed from "./seed.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shoestore";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Models
const models = {
  products: mongoose.model("Product", { name: String, price: Number, category: String, description: String, image: String }),
  categories: mongoose.model("Category", { name: String, image: String }),
  orders: mongoose.model("Order", { name: String, phone: String, address: String, city: String, pincode: String, items: Array, total: Number, date: { type: Date, default: Date.now } }),
};

// Image upload (uploads/ folder me save hoga)
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
});

// Admin password check
const admin = (req, res, next) =>
  req.headers.password === ADMIN_PASS ? next() : res.status(401).json({ error: "Wrong password" });

// Login check
app.get("/api/login", admin, (req, res) => res.json({ ok: true }));

// Orders: customer order bhejta hai, sirf admin dekh sakta hai
app.post("/api/orders", express.json(), async (req, res) => {
  res.json(await models.orders.create(req.body));
});
app.get("/api/orders", admin, async (req, res) => {
  res.json(await models.orders.find().sort({ _id: -1 }));
});

// Same routes products aur categories dono ke liye: /api/products, /api/categories
app.get("/api/:type", async (req, res) => {
  res.json(await models[req.params.type].find().sort({ _id: -1 }));
});

app.post("/api/:type", admin, upload.single("image"), async (req, res) => {
  const item = await models[req.params.type].create({ ...req.body, image: req.file ? "/uploads/" + req.file.filename : "" });
  res.json(item);
});

app.delete("/api/:type/:id", admin, async (req, res) => {
  await models[req.params.type].findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

mongoose.connect(MONGO_URI).then(async () => {
  console.log("MongoDB connected");
  // Database khali ho ya "npm run seed" chalaya ho to demo data daalo (purana data hat jayega)
  if (process.argv.includes("--seed") || (await models.categories.countDocuments()) === 0) {
    await models.categories.deleteMany();
    await models.products.deleteMany();
    await models.categories.insertMany(seed.categories);
    await models.products.insertMany(seed.products);
    console.log("Demo shoes added");
  }
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
}).catch((err) => console.log("MongoDB connect nahi hua:", err.message));
