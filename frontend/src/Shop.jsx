import { useEffect, useState } from "react";
import { img, get } from "./api";
import Nav from "./Nav";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState(new URLSearchParams(location.search).get("q") || "");

  useEffect(() => {
    get("products").then(setProducts);
    get("categories").then(setCategories);
  }, []);

  // Naam, category aur description sab me dhundo. Har word match hona chahiye ("red sports")
  const words = search.toLowerCase().split(" ").filter(Boolean);
  const shown = products.filter((p) => {
    const text = [p.name, p.category, p.description].join(" ").toLowerCase();
    return (selected === "All" || p.category === selected) && words.every((w) => text.includes(w));
  });

  return (
    <>
      <Nav search={search} setSearch={setSearch} />

      <section>
        <h2 className="title">Shop by Category</h2>
        <div className="cats">
          <div className={"cat " + (selected === "All" ? "active" : "")} onClick={() => setSelected("All")}>
            <div className="all">All</div>
            <p>All Shoes</p>
          </div>
          {categories.map((c) => (
            <div key={c._id} className={"cat " + (selected === c.name ? "active" : "")} onClick={() => setSelected(c.name)}>
              <img src={img(c.image)} alt={c.name} />
              <p>{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="title">{selected === "All" ? "All Shoes" : selected} ({shown.length})</h2>
        {shown.length === 0 && <p className="empty">No shoes found</p>}
        <div className="grid">
          {shown.map((p) => (
            <a href={"/product/" + p._id} className="card" key={p._id}>
              <div className="img"><img src={img(p.image)} alt={p.name} /></div>
              <div className="info">
                <small>{p.category}</small>
                <h3>{p.name}</h3>
                <div className="row">
                  <b>₹{p.price}</b>
                  <span className="view">View →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer>
        <h3>Sachin <span>Shoe Store</span></h3>
        <p>© 2026 Sachin Shoe Store · Made with MERN</p>
      </footer>
    </>
  );
}
