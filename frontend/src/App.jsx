import { useState, useEffect, useCallback } from "react";
import { api } from "./api";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import "./App.css";
import { LOW_STOCK } from "./constants";

export default function App() {
  const [products, setProducts] = useState([]);
  const [amount,setAmount] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setProducts(await api.list(search));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Load on start, and again when search changes (with a small delay while typing)
  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  // Runs an API action, shows any error, refreshes the list. Returns true if it worked.
  const run = async (action) => {
    try {
      await action();
      setError("");
      await loadProducts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleSubmit = (data) =>
    run(async () => {
      if (editing) {
        await api.update(editing.id, data);
        setEditing(null);
      } else {
        await api.create(data);
      }
    });

  const handleDelete = (p) => {
    if (window.confirm(`Delete ${p.name}?`)) run(() => api.remove(p.id));
  };

  const handleStock = (id, type) =>
    run(() => (type === "add" ? api.addStock(id, 1) : api.removeStock(id, 1)));



   const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity <= 5).length;

  return (
    <div className="container">
      <h1>Inventory</h1>

      {error && <div className="error">{error}</div>}

      <ProductForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />

      <div className="card">
        <input className="search" placeholder="Search by name..."
               value={search} onChange={(e) => setSearch(e.target.value)} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ProductTable products={products} onEdit={setEditing}
                        onDelete={handleDelete} onStock={handleStock} />
        )}
      </div>
            <div className="card summary">
        <div><strong>{products.length}</strong> products</div>
        <div><strong>{totalUnits}</strong> units</div>
        <div><strong>₹{totalValue.toLocaleString("en-IN")}</strong> stock value</div>
        <div><strong>{lowStockCount}</strong> low stock</div>
      </div>
    </div>

  );
}