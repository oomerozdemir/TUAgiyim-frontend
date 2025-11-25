import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";

export default function AdminProductsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const pageSize = 10;

  async function load() {
    const { data } = await api.get("/api/products", {
      params: { search: q, page, pageSize, sort: "createdAt:desc" }
    });
    setData(data);
  }

async function handleDelete(id) {
  if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;
  try {
    await api.delete(`/api/products/${id}`);
    await load(); // <- listeyi tazele
  } catch (err) {
    alert("Ürün silinemedi: " + (err.response?.data?.message || ""));
  }
}
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Ürünler</h2>
      <div className="flex gap-2 mb-4">
        <input className="border px-3 py-2 rounded" placeholder="Ara..." value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={() => { setPage(1); load(); }} className="border px-3 py-2 rounded">Ara</button>
        <Link to="/admin/products/new" className="border px-3 py-2 rounded">Yeni Ürün</Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Ad</th>
            <th className="p-2">Fiyat</th>
            <th className="p-2">Stok</th>
            <th className="p-2">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {data?.items?.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">
                <Link to={`/admin/products/${p.id}/edit`} className="underline mr-2">Düzenle</Link>
                <Link to={`/admin/products/${p.id}/stock`} className="underline">Stok</Link>
                <button
  onClick={() => handleDelete(p.id)}
  className="text-sm border rounded-lg px-3 py-1 hover:bg-red-100 transition"
>
  Sil
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-4">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="border px-3 py-1 rounded">Önceki</button>
        <span>Sayfa {page}/{totalPages}</span>
        <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="border px-3 py-1 rounded">Sonraki</button>
      </div>
    </div>
  );
}
