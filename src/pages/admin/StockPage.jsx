import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/api";

export default function StockPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [deltas, setDeltas] = useState({});
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await api.get(`/api/products/${id}`);
    setProduct(data);
  }

  useEffect(() => {
    load();
  }, [id]);

  function setDelta(sizeId, val) {
    setDeltas((prev) => ({ ...prev, [sizeId]: val }));
  }

  async function adjust(sizeId) {
    const delta = Number(deltas[sizeId]);
    if (!delta) return alert("Geçerli bir sayı girin.");
    setLoading(true);
    try {
      await api.post(`/api/stock/${id}/sizes/${sizeId}/adjust`, { delta });
      await load();
      setDeltas((prev) => ({ ...prev, [sizeId]: "" }));
    } catch (err) {
      alert("Stok güncellenemedi.");
    } finally {
      setLoading(false);
    }
  }

  if (!product) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Stok: {product.name}</h2>
      <p className="mb-4">Toplam stok: <b>{product.stock}</b></p>

      {(!product.sizes || product.sizes.length === 0) ? (
        <p>Bu üründe tanımlı beden yok.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Beden</th>
              <th className="p-2">Mevcut Stok</th>
              <th className="p-2">Delta</th>
              <th className="p-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {product.sizes.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2">{s.label}</td>
                <td className="p-2">{s.stock}</td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-24"
                    value={deltas[s.id] ?? ""}
                    onChange={(e) => setDelta(s.id, e.target.value)}
                    placeholder="+10 / -3"
                  />
                </td>
                <td className="p-2">
                  <button
                    disabled={loading}
                    onClick={() => adjust(s.id)}
                    className="border rounded px-3 py-1"
                  >
                    Uygula
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
