import { useEffect, useState } from "react";

import { API, img, get } from "./api";

export default function Admin() {
  const [password, setPassword] = useState(localStorage.getItem("pass") || "");
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const load = () => {
    get("products").then(setProducts);
    get("categories").then(setCategories);
    fetch(API + "/api/orders", { headers: { password } }).then((r) => r.json()).then(setOrders);
  };

  const login = async (e) => {
    e?.preventDefault();
    const res = await fetch(API + "/api/login", { headers: { password } });
    if (!res.ok) return e && alert("Wrong password!");
    localStorage.setItem("pass", password);
    setLoggedIn(true);
    load();
  };
  useEffect(() => { if (password) login(); }, []);

  // type = "products" ya "categories"
  const add = async (e, type) => {
    e.preventDefault();
    await fetch(API + "/api/" + type, { method: "POST", headers: { password }, body: new FormData(e.target) });
    e.target.reset();
    load();
  };

  const remove = async (type, id) => {
    if (!confirm("Delete karna hai?")) return;
    await fetch(API + "/api/" + type + "/" + id, { method: "DELETE", headers: { password } });
    load();
  };

  const logout = () => { localStorage.removeItem("pass"); setPassword(""); setLoggedIn(false); };

  if (!loggedIn)
    return (
      <form className="login" onSubmit={login}>
        <h2>Admin Login</h2>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
    );

  return (
    <div className="admin">
      <nav>
        <h1>Admin Panel</h1>
        <div>
          <a href="/" className="btn light">View Shop</a>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="forms">
        <form onSubmit={(e) => add(e, "categories")}>
          <h3>Add Category</h3>
          <input name="name" placeholder="Category Name (Sports, Casual...)" required />
          <input name="image" type="file" accept="image/*" required />
          <button>Add Category</button>
        </form>

        <form onSubmit={(e) => add(e, "products")}>
          <h3>Add Shoe</h3>
          <input name="name" placeholder="Shoe Name" required />
          <input name="price" type="number" placeholder="Price (₹)" required />
          <select name="category" required>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id}>{c.name}</option>)}
          </select>
          <textarea name="description" placeholder="Description" />
          <input name="image" type="file" accept="image/*" required />
          <button>Add Shoe</button>
        </form>
      </div>

      <h2 className="title">Orders ({orders.length})</h2>
      <table>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td><b>{o.name}</b><br />{o.phone}<br /><small>{new Date(o.date).toLocaleString()}</small></td>
              <td>{o.address}, {o.city} - {o.pincode}</td>
              <td>{o.items.map((x, i) => <div key={i}>{x.name} (UK {x.size}) × {x.qty}</div>)}</td>
              <td><b>₹{o.total}</b></td>
              <td><button className="del" onClick={() => remove("orders", o._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="title">Categories ({categories.length})</h2>
      <table>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td><img src={img(c.image)} /></td>
              <td>{c.name}</td>
              <td><button className="del" onClick={() => remove("categories", c._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="title">Shoes ({products.length})</h2>
      <table>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={img(p.image)} /></td>
              <td>{p.name}<br /><small>{p.category}</small></td>
              <td>₹{p.price}</td>
              <td><button className="del" onClick={() => remove("products", p._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
