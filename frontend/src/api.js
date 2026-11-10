const BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    let message = body.detail;
    // 422 errors come as a list, so turn it into readable text
    if (Array.isArray(message)) {
      message = message.map((e) => `${e.loc.slice(1).join(".")}: ${e.msg}`).join(", ");
    }
    throw new Error(message || `Request failed (${res.status})`);
  }

  return res.status === 204 ? null : res.json();   // 204 has no body
}

const json = (method, data) => ({ method, body: JSON.stringify(data) });

export const api = {
  list: (search = "") =>
    request(`/products/?limit=100&search=${encodeURIComponent(search)}`),
  create: (data) => request("/products/", json("POST", data)),
  update: (id, data) => request(`/products/${id}`, json("PATCH", data)),
  remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
  addStock: (id, amount) => request(`/products/${id}/stock/add`, json("POST", { amount })),
  removeStock: (id, amount) => request(`/products/${id}/stock/remove`, json("POST", { amount })),
};