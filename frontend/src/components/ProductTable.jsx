import { LOW_STOCK } from "../constants.js";

export default function ProductTable({ products, onEdit, onDelete, onStock }) {
  if (products.length === 0) {
    return <p className="empty">No products found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>SKU</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className={p.quantity <= LOW_STOCK ? "low" : ""}>
            <td>{p.sku}</td>
            <td>{p.name}</td>
            <td>₹{p.price.toLocaleString("en-IN")}</td>
            <td>
              <button className="small" onClick={() => onStock(p.id, "remove")}>−</button>
              <span className="qty">{p.quantity}</span>
              <button className="small" onClick={() => onStock(p.id, "add")}>+</button>
            </td>
            <td>
              <button className="secondary" onClick={() => onEdit(p)}>Edit</button>
              <button className="danger" onClick={() => onDelete(p)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}