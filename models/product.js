import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  name: { type: String, required: true },
  gender: { type: String, required: true }, // jenis kelamin
  category: { type: String, required: true },
  birthDate: { type: Date, required: true }, // tanggal lahir
  totalVaccine: { type: Number, required: true }, // total vaksin
  image: { type: Array, required: true },
  date: { type: Number, required: true },
});

const Product = mongoose.models.product || mongoose.model('product', productSchema);

export default Product;
