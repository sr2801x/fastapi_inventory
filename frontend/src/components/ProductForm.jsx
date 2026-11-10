import { useState, useEffect } from "react";

const EMPTY = { sku: "", name: "", description: "", price: "", quantity: 0 };

export default function ProductForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);

  // When "Edit" is clicked, fill the form. When cleared, reset it.
  useEffect(() => {
    setForm(editing ? { ...editing, description: editing.description ?? "" } : EMPTY);
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();                       // stop the browser's page reload
    const data = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),              // inputs give strings, API wants numbers
      quantity: Number(form.quantity),
    };
    if (!editing) data.sku = form.sku;        // SKU can only be set on create
    const ok = await onSubmit(data);
    if (ok && !editing) setForm(EMPTY);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{editing ? `Edit ${editing.sku}` : "Add product"}</h2>

      <input name="sku" placeholder="SKU (e.g. LAP-001)" value={form.sku}
             onChange={handleChange} disabled={!!editing} required minLength={3} />
      <input name="name" placeholder="Name" value={form.name}
             onChange={handleChange} required />
      <input name="description" placeholder="Description (optional)" value={form.description}
             onChange={handleChange} />
      <input name="price" type="number" step="0.01" min="0.01" placeholder="Price"
             value={form.price} onChange={handleChange} required />
      <input name="quantity" type="number" min="0" placeholder="Quantity"
             value={form.quantity} onChange={handleChange} required />

      <div className="row">
        <button type="submit">{editing ? "Save changes" : "Add product"}</button>
        {editing && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}