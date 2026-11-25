import { getCart } from "./cartStore";

// Har page ka navbar: logo + search + Cart button
// Shop page search aur setSearch deta hai (turant filter). Baaki pages pe Enter dabane se "/?q=..." pe jaate hain.
export default function Nav({ search, setSearch }) {
  const count = getCart().reduce((sum, x) => sum + x.qty, 0);
  const onShop = setSearch !== undefined;
  return (
    <nav>
      <a href="/"><h1>Sachin <span>Shoe Store</span></h1></a>
      <form action="/" method="get" onSubmit={(e) => onShop && e.preventDefault()}>
        <input
          className="search"
          type="search"
          name="q"
          placeholder="Search shoes..."
          {...(onShop ? { value: search, onChange: (e) => setSearch(e.target.value) } : {})}
        />
      </form>
      <a href="/cart" className="btn">Cart ({count})</a>
    </nav>
  );
}
