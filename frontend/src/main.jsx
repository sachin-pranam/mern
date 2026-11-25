import { createRoot } from "react-dom/client";
import Shop from "./Shop";
import Admin from "./Admin";
import Product from "./Product";
import Cart from "./Cart.jsx";
import "./style.css";

// URL dekh ke page choose karo: /admin, /cart, /product/:id, baaki sab Shop
const path = window.location.pathname;
let page = <Shop />;
if (path.startsWith("/admin")) page = <Admin />;
if (path.startsWith("/cart")) page = <Cart />;
if (path.startsWith("/product/")) page = <Product id={path.split("/")[2]} />;

createRoot(document.getElementById("root")).render(page);
