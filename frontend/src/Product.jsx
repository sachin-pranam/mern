import { useEffect, useState } from "react";
import { img, get } from "./api";
import { addToCart } from "./cartStore";
import Nav from "./Nav";

export default function Product({ id }) {
  const [products, setProducts] = useState([]);
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(0); // kitni baar add kiya

  useEffect(() => {
    get("products").then(setProducts);
  }, []);

  const p = products.find((x) => x._id === id);
  const similar = products.filter((x) => x._id !== id).slice(0, 4);

  const add = (goToCart) => {
    if (!size) return alert("Please select a size");
    addToCart(p, size);
    if (goToCart) location.href = "/cart";
    else setAdded(added + 1); // navbar ka cart count update ho jayega
  };

  return (
    <>
      <Nav />

      {!p ? (
        <p className="empty" style={{ padding: 60 }}>Loading...</p>
      ) : (
        <section className="product">
          <img src={img(p.image)} alt={p.name} />
          <div>
            <small>{p.category}</small>
            <h2>{p.name}</h2>
            <b className="price">₹{p.price}</b>
            <p>{p.description}</p>

            <h4>Select Size (UK)</h4>
            <div className="sizes">
              {[6, 7, 8, 9, 10, 11].map((s) => (
                <button key={s} className={size === s ? "active" : ""} onClick={() => { setSize(s); setAdded(0); }}>{s}</button>
              ))}
            </div>

            <div className="buttons">
              <button className="buy outline" onClick={() => add(false)}>{added ? "Added ✓ (Add more)" : "Add to Cart"}</button>
              <button className="buy" onClick={() => add(true)}>Buy Now</button>
            </div>
            <ul>
              <li>Free delivery on orders above ₹999</li>
              <li>7 days easy return</li>
              <li>100% original product</li>
            </ul>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section>
          <h2 className="title">You May Also Like</h2>
          <div className="grid">
            {similar.map((s) => (
              <a href={"/product/" + s._id} className="card" key={s._id}>
                <div className="img"><img src={img(s.image)} alt={s.name} /></div>
                <div className="info">
                  <h3>{s.name}</h3>
                  <b>₹{s.price}</b>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
